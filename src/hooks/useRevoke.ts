import { useCallback, useState } from 'react';
import { getWalletClient, switchChain } from 'wagmi/actions';
import { parseAbi, encodeFunctionData, isAddress } from 'viem';
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

// Multicall3 — deployed at same address on all major EVM chains
const MULTICALL3_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11' as const;
const MULTICALL3_ABI = [
  {
    type: 'function',
    name: 'aggregate3',
    inputs: [
      {
        name: 'calls',
        type: 'tuple[]',
        components: [
          { name: 'target', type: 'address' },
          { name: 'allowFailure', type: 'bool' },
          { name: 'callData', type: 'bytes' },
        ],
      },
    ],
    outputs: [
      {
        name: 'results',
        type: 'tuple[]',
        components: [
          { name: 'success', type: 'bool' },
          { name: 'returnData', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const;

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

// Encode a single revoke call to calldata
function encodeRevokeCall(approval: ApprovalEntry): { target: `0x${string}`; allowFailure: boolean; callData: `0x${string}` } {
  if (approval.token_type === 'ERC20') {
    return {
      target: validateAddress(approval.token_address, 'token'),
      allowFailure: true,
      callData: encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [approval.approved_address as `0x${string}`, 0n],
      }),
    };
  }
  // ERC721 / ERC1155
  return {
    target: validateAddress(approval.token_address, 'token'),
    allowFailure: true,
    callData: encodeFunctionData({
      abi: SET_APPROVAL_FOR_ALL_ABI,
      functionName: 'setApprovalForAll',
      args: [approval.approved_address as `0x${string}`, false],
    }),
  };
}

// Switch wallet chain and get a fresh wallet client
async function getClientForChain(chainId: number) {
  // Explicitly switch the wallet to the target chain first
  await switchChain(wagmiConfig, { chainId });
  // Now get the wallet client for the correct chain
  const client = await getWalletClient(wagmiConfig, { chainId });
  // Verify we're on the right chain
  if (client.chain?.id !== chainId) {
    throw new Error(
      `Chain mismatch after switch: wallet is on chain ${client.chain?.id} but expected ${chainId}. Please switch your wallet to the correct network manually.`
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
      return err.message; // Use the detailed message
    }
    if (msg.includes('internal rpc error') || msg.includes('execution reverted')) {
      return 'Transaction would revert — token may not support this operation';
    }
    // Truncate long messages
    return err.message.length > 120 ? err.message.slice(0, 120) + '…' : err.message;
  }
  return String(err);
}

// Revoke a single approval via direct contract call
async function revokeSingleDirect(
  approval: ApprovalEntry,
  client: Awaited<ReturnType<typeof getClientForChain>>
): Promise<`0x${string}`> {
  if (approval.token_type === 'ERC20') {
    return client.writeContract({
      address: approval.token_address as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [approval.approved_address as `0x${string}`, 0n],
    });
  }
  return client.writeContract({
    address: approval.token_address as `0x${string}`,
    abi: SET_APPROVAL_FOR_ALL_ABI,
    functionName: 'setApprovalForAll',
    args: [approval.approved_address as `0x${string}`, false],
  });
}

export function useRevoke() {
  const queryClient = useQueryClient();

  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [revokeError, setRevokeError] = useState<Error | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; currentChain: string }>({ current: 0, total: 0, currentChain: '' });
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
      setBatchProgress({ current: 0, total: 0, currentChain: '' });

      // Group by chainId
      const byChain = new Map<number, ApprovalEntry[]>();
      for (const approval of approvals) {
        const existing = byChain.get(approval.chainId) ?? [];
        existing.push(approval);
        byChain.set(approval.chainId, existing);
      }

      const chainEntries = [...byChain.entries()];
      setBatchProgress({ current: 0, total: chainEntries.length, currentChain: '' });

      const results: {
        approval: ApprovalEntry;
        txHash?: `0x${string}`;
        error?: Error;
      }[] = [];

      // Process each chain — one Multicall3 tx per chain
      for (let i = 0; i < chainEntries.length; i++) {
        const [chainId, chainApprovals] = chainEntries[i];
        const chainName = getChainName(chainId);
        setBatchProgress({ current: i + 1, total: chainEntries.length, currentChain: chainName });

        try {
          const client = await getClientForChain(chainId);

          if (chainApprovals.length === 1) {
            // Single approval — use direct call
            const approval = chainApprovals[0];
            try {
              const txHash = await revokeSingleDirect(approval, client);
              setCurrentTxHash(txHash);
              results.push({ approval, txHash });
            } catch (err) {
              const error = new Error(parseErrorMessage(err));
              results.push({ approval, error });
            }
          } else {
            // Multiple approvals on same chain — try Multicall3 first, fallback to individual
            const calls = chainApprovals.map(encodeRevokeCall);

            try {
              const txHash = await client.writeContract({
                address: MULTICALL3_ADDRESS,
                abi: MULTICALL3_ABI,
                functionName: 'aggregate3',
                args: [calls],
              });
              setCurrentTxHash(txHash);
              for (const approval of chainApprovals) {
                results.push({ approval, txHash });
              }
            } catch (multicallErr) {
              // Multicall3 failed — fallback to individual calls
              for (let j = 0; j < chainApprovals.length; j++) {
                const approval = chainApprovals[j];
                try {
                  // Need fresh client for each call in case chain state changed
                  const freshClient = j === 0 ? client : await getClientForChain(chainId);
                  const txHash = await revokeSingleDirect(approval, freshClient);
                  setCurrentTxHash(txHash);
                  results.push({ approval, txHash });
                } catch (individualErr) {
                  const error = new Error(parseErrorMessage(individualErr));
                  results.push({ approval, error });
                }
              }
            }
          }
        } catch (err) {
          // Chain-level error (e.g., chain switch failed)
          const errorMsg = parseErrorMessage(err);
          for (const approval of chainApprovals) {
            results.push({ approval, error: new Error(errorMsg) });
          }
        }

        // Update results progressively
        setBatchResults([...results]);
      }

      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0, currentChain: '' });

      // Final query invalidation
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
