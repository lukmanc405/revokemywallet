import { useCallback, useState } from 'react';
import { useSwitchChain } from 'wagmi';
import { getWalletClient } from 'wagmi/actions';
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
// https://github.com/mds1/multicall
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

// Get a fresh wallet client for a specific chain (handles chain switching)
async function getClientForChain(chainId: number) {
  // getWalletClient with chainId switches chain if needed and returns fresh client
  const client = await getWalletClient(wagmiConfig, { chainId });
  return client;
}

export function useRevoke() {
  const { switchChainAsync } = useSwitchChain();
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
        // Get fresh client for this chain (handles switching)
        const client = await getClientForChain(approval.chainId);

        let txHash: `0x${string}`;

        if (approval.token_type === 'ERC20') {
          txHash = await client.writeContract({
            address: approval.token_address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [approval.approved_address as `0x${string}`, 0n],
          });
        } else {
          txHash = await client.writeContract({
            address: approval.token_address as `0x${string}`,
            abi: SET_APPROVAL_FOR_ALL_ABI,
            functionName: 'setApprovalForAll',
            args: [approval.approved_address as `0x${string}`, false],
          });
        }

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

      console.log(`[Multicall3] Starting batch revoke: ${approvals.length} approvals across ${chainEntries.length} chains`);

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

        console.log(`[Multicall3] Processing chain ${chainId} (${chainName}): ${chainApprovals.length} approvals`);

        try {
          // Get fresh wallet client for this chain (switches if needed)
          const client = await getClientForChain(chainId);
          console.log(`[Multicall3] Got client for chain ${client.chain?.id} (wanted ${chainId})`);

          if (chainApprovals.length === 1) {
            // Single approval — use direct call
            const approval = chainApprovals[0];
            try {
              const txHash = await client.writeContract({
                address: approval.token_address as `0x${string}`,
                abi: approval.token_type === 'ERC20' ? ERC20_ABI : SET_APPROVAL_FOR_ALL_ABI,
                functionName: approval.token_type === 'ERC20' ? 'approve' : 'setApprovalForAll',
                args: approval.token_type === 'ERC20'
                  ? [approval.approved_address as `0x${string}`, 0n]
                  : [approval.approved_address as `0x${string}`, false],
              });
              console.log(`[Multicall3] Single revoke tx: ${txHash}`);
              setCurrentTxHash(txHash);
              results.push({ approval, txHash });
            } catch (err) {
              const error = err instanceof Error ? err : new Error(String(err));
              results.push({ approval, error });
            }
          } else {
            // Multiple approvals on same chain — batch via Multicall3
            const calls = chainApprovals.map(encodeRevokeCall);

            console.log(`[Multicall3] Batching ${calls.length} calls via aggregate3 on chain ${chainId}`);
            console.log(`[Multicall3] Target: ${MULTICALL3_ADDRESS}`);

            const txHash = await client.writeContract({
              address: MULTICALL3_ADDRESS,
              abi: MULTICALL3_ABI,
              functionName: 'aggregate3',
              args: [calls],
            });

            console.log(`[Multicall3] ✅ Batch tx sent: ${txHash}`);
            setCurrentTxHash(txHash);

            for (const approval of chainApprovals) {
              results.push({ approval, txHash });
            }
          }
        } catch (err) {
          console.error(`[Multicall3] ❌ Error on chain ${chainId}:`, err);
          const error = err instanceof Error ? err : new Error(String(err));
          for (const approval of chainApprovals) {
            results.push({ approval, error });
          }
        }

        // Update results progressively
        setBatchResults([...results]);
      }

      setIsBatchProcessing(false);
      setBatchProgress({ current: 0, total: 0, currentChain: '' });

      // Final query invalidation
      queryClient.invalidateQueries({ queryKey: ['multichain-scan'] });

      console.log(`[Multicall3] Batch complete: ${results.filter(r => r.txHash).length}/${results.length} succeeded`);
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
