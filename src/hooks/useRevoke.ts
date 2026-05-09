import { useCallback, useState } from 'react';
import { getWalletClient, switchChain, waitForTransactionReceipt } from 'wagmi/actions';
import { parseAbi, isAddress } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import type { ApprovalEntry } from '@/hooks/useMultichainScan';
import { wagmiConfig } from '@/config/reown';

// ERC20 approve(address spender, uint256 amount)
const ERC20_ABI = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
]);

// ERC721/1155 setApprovalForAll(address operator, bool approved)
const SET_APPROVAL_FOR_ALL_ABI = parseAbi([
  'function setApprovalForAll(address operator, bool approved)',
]);

export interface RevokeState {
  txHash: `0x${string}` | undefined;
  isLoading: boolean;
  isConfirming: boolean;
  isSuccess: boolean;
  error: Error | null;
}

export interface RevokeSingleParams {
  approval: ApprovalEntry;
}

export interface BatchRevokeParams {
  approvals: ApprovalEntry[];
}

// Validate and return a checksummed address
function validateAddress(address: string, label: string): `0x${string}` {
  if (!isAddress(address)) {
    throw new Error(`Invalid ${label} address: ${address}`);
  }
  return address as `0x${string}`;
}

// Switch wallet chain and get a fresh wallet client
async function getClientForChain(chainId: number) {
  await switchChain(wagmiConfig, { chainId });
  const client = await getWalletClient(wagmiConfig, { chainId });
  if (client.chain?.id !== chainId) {
    throw new Error(
      `Chain mismatch: wallet on chain ${client.chain?.id}, expected ${chainId}. Switch manually.`
    );
  }
  return client;
}

// Parse error into human-readable message
function parseErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes('user rejected') || msg.includes('user denied') || msg.includes('rejected')) {
      return 'Transaction rejected by user';
    }
    if (msg.includes('insufficient funds') || msg.includes('insufficient balance')) {
      return 'Insufficient funds for gas';
    }
    if (msg.includes('nonce')) {
      return 'Nonce error — try again';
    }
    if (msg.includes('chain mismatch') || msg.includes('wrong network')) {
      return err.message;
    }
    if (msg.includes('internal rpc error') || msg.includes('execution reverted')) {
      return 'Transaction would revert';
    }
    return err.message.length > 120 ? err.message.slice(0, 120) + '…' : err.message;
  }
  return String(err);
}

// Revoke a single approval via direct contract call
async function revokeSingleDirect(
  approval: ApprovalEntry,
  client: Awaited<ReturnType<typeof getClientForChain>>
): Promise<`0x${string}`> {
  const tokenAddr = validateAddress(approval.token_address, 'token');
  const spenderAddr = approval.approved_address as `0x${string}`;

  if (approval.token_type === 'ERC20') {
    return client.writeContract({
      address: tokenAddr,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddr, 0n],
    });
  }
  return client.writeContract({
    address: tokenAddr,
    abi: SET_APPROVAL_FOR_ALL_ABI,
    functionName: 'setApprovalForAll',
    args: [spenderAddr, false],
  });
}

export function useRevoke() {
  const queryClient = useQueryClient();

  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [revokeError, setRevokeError] = useState<Error | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{
    current: number;
    total: number;
    currentToken: string;
  }>({ current: 0, total: 0, currentToken: '' });
  const [batchResults, setBatchResults] = useState<
    { approval: ApprovalEntry; txHash?: `0x${string}`; error?: Error }[]
  >([]);

  const revokeSingle = useCallback(
    async (params: RevokeSingleParams): Promise<`0x${string}` | undefined> => {
      const { approval } = params;
      setRevokeError(null);
      setCurrentTxHash(undefined);
      setIsProcessing(true);

      try {
        const client = await getClientForChain(approval.chainId);
        const txHash = await revokeSingleDirect(approval, client);
        setCurrentTxHash(txHash);
        setIsProcessing(false);
        queryClient.invalidateQueries({ queryKey: ['multichain-scan'] });
        return txHash;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setRevokeError(error);
        setIsProcessing(false);
        throw error;
      }
    },
    [queryClient]
  );

  const revokeBatch = useCallback(
    async (params: BatchRevokeParams) => {
      const { approvals } = params;
      setIsBatchProcessing(true);
      setBatchResults([]);
      setBatchProgress({ current: 0, total: approvals.length, currentToken: '' });

      // Group by chainId to minimize chain switches
      const byChain = new Map<number, ApprovalEntry[]>();
      for (const approval of approvals) {
        const existing = byChain.get(approval.chainId) ?? [];
        existing.push(approval);
        byChain.set(approval.chainId, existing);
      }

      const results: {
        approval: ApprovalEntry;
        txHash?: `0x${string}`;
        error?: Error;
      }[] = [];

      let processed = 0;

      // Process each chain — switch once, then revoke all on that chain
      for (const [chainId, chainApprovals] of byChain) {
        setBatchProgress({
          current: processed,
          total: approvals.length,
          currentToken: `Switching to ${getChainName(chainId)}…`,
        });

        let client;
        try {
          client = await getClientForChain(chainId);
        } catch (err) {
          // Chain switch failed — mark all on this chain as failed
          const errorMsg = parseErrorMessage(err);
          for (const approval of chainApprovals) {
            processed++;
            results.push({ approval, error: new Error(errorMsg) });
            setBatchResults([...results]);
            setBatchProgress({ current: processed, total: approvals.length, currentToken: '' });
          }
          continue;
        }

        // Revoke each approval individually — wallet shows clear popup per tx
        for (const approval of chainApprovals) {
          processed++;
          const tokenLabel = approval.token_symbol || approval.token_name || 'Unknown';
          setBatchProgress({
            current: processed - 1,
            total: approvals.length,
            currentToken: `${tokenLabel} on ${getChainName(chainId)}`,
          });

          try {
            const txHash = await revokeSingleDirect(approval, client);
            setCurrentTxHash(txHash);
            setBatchProgress({
              current: processed - 1,
              total: approvals.length,
              currentToken: `Confirming ${tokenLabel}…`,
            });

            // Wait for receipt to confirm nonce is consumed before next tx
            const receipt = await waitForTransactionReceipt(wagmiConfig, {
              hash: txHash,
              chainId,
              timeout: 60_000,
            });

            if (receipt.status === 'success') {
              results.push({ approval, txHash });
            } else {
              results.push({ approval, error: new Error('Transaction reverted on-chain') });
            }
          } catch (err) {
            results.push({ approval, error: new Error(parseErrorMessage(err)) });
          }

          // Update results after each individual revoke
          setBatchResults([...results]);
        }
      }

      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0, currentToken: '' });
      queryClient.invalidateQueries({ queryKey: ['multichain-scan'] });

      return results;
    },
    [queryClient]
  );

  return {
    revokeSingle,
    revokeBatch,
    state: {
      txHash: currentTxHash,
      isLoading: isProcessing,
      isConfirming: false,
      isSuccess: false,
      error: revokeError,
    } as RevokeState,
    isBatchProcessing,
    batchProgress,
    batchResults,
  };
}

function getChainName(chainId: number): string {
  const names: Record<number, string> = {
    1: 'Ethereum',
    8453: 'Base',
    42161: 'Arbitrum',
    10: 'Optimism',
    137: 'Polygon',
    56: 'BSC',
    43114: 'Avalanche',
    324: 'zkSync',
  };
  return names[chainId] ?? `Chain ${chainId}`;
}
