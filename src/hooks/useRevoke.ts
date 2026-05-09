import { useCallback, useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import type { ApprovalEntry } from '@/hooks/useMultichainScan';

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

export function useRevoke() {
  const { writeContractAsync, isPending, error: writeError } = useWriteContract();
  const queryClient = useQueryClient();

  const [currentTxHash, setCurrentTxHash] = useState<`0x${string}` | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [revokeError, setRevokeError] = useState<Error | null>(null);
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<
    { approval: ApprovalEntry; txHash?: `0x${string}`; error?: Error }[]
  >([]);

  const {
    isLoading: isConfirming,
    isSuccess,
  } = useWaitForTransactionReceipt({
    hash: currentTxHash,
    query: { enabled: !!currentTxHash },
  });

  const revokeSingle = useCallback(
    async (params: RevokeSingleParams): Promise<`0x${string}` | undefined> => {
      const { approval } = params;
      setRevokeError(null);
      setCurrentTxHash(undefined);
      setIsProcessing(true);

      try {
        let txHash: `0x${string}`;

        if (approval.token_type === 'ERC20') {
          // ERC20: call approve(spender, 0) to revoke
          txHash = await writeContractAsync({
            address: approval.token_address as `0x${string}`,
            abi: ERC20_ABI,
            functionName: 'approve',
            args: [approval.approved_address as `0x${string}`, 0n],
            chainId: approval.chainId,
          });
        } else {
          // ERC721 / ERC1155: call setApprovalForAll(operator, false)
          txHash = await writeContractAsync({
            address: approval.token_address as `0x${string}`,
            abi: SET_APPROVAL_FOR_ALL_ABI,
            functionName: 'setApprovalForAll',
            args: [approval.approved_address as `0x${string}`, false],
            chainId: approval.chainId,
          });
        }

        setCurrentTxHash(txHash);
        setIsProcessing(false);

        // Invalidate scan query to refresh data
        queryClient.invalidateQueries({ queryKey: ['multichain-scan'] });

        return txHash;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setRevokeError(error);
        setIsProcessing(false);
        throw error;
      }
    },
    [writeContractAsync, queryClient]
  );

  const revokeBatch = useCallback(
    async (params: BatchRevokeParams) => {
      const { approvals } = params;
      setIsBatchProcessing(true);
      setBatchResults([]);

      // Group by chainId first for sequential processing within each chain
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

      // Process each chain's approvals sequentially
      for (const [, chainApprovals] of byChain) {
        for (const approval of chainApprovals) {
          try {
            const txHash = await revokeSingle({ approval });
            results.push({ approval, txHash });
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            results.push({ approval, error });
          }
          // Update results progressively
          setBatchResults([...results]);
        }
      }

      setIsBatchProcessing(false);

      // Final query invalidation
      queryClient.invalidateQueries({ queryKey: ['multichain-scan'] });

      return results;
    },
    [revokeSingle, queryClient]
  );

  return {
    revokeSingle,
    revokeBatch,
    state: {
      txHash: currentTxHash,
      isLoading: isPending || isProcessing,
      isConfirming,
      isSuccess,
      error: writeError || revokeError,
    } as RevokeState,
    isBatchProcessing,
    batchResults,
  };
}
