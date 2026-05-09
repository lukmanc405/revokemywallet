import { X, AlertTriangle, Loader2 } from 'lucide-react';
import type { Approval } from '../types';
import { SUPPORTED_CHAINS, truncateAddress } from '../types';

interface BatchProgress {
  current: number;
  total: number;
  currentChain: string;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  approvals: Approval[];
  estimatedGas?: string;
  nativeCurrency?: string;
  isRevoking?: boolean;
  batchProgress?: BatchProgress;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  approvals,
  estimatedGas,
  nativeCurrency = 'ETH',
  isRevoking,
  batchProgress,
}: ConfirmModalProps) {
  if (!isOpen || approvals.length === 0) return null;

  // Group by chain
  const grouped: Record<number, Approval[]> = {};
  for (const a of approvals) {
    (grouped[a.chainId] ??= []).push(a);
  }
  const chainCount = Object.keys(grouped).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={isRevoking ? undefined : onClose} />
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-gray-800 w-full max-w-sm max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-white text-lg font-bold">
            {isRevoking ? 'Revoking...' : 'Are you sure?'}
          </h3>
          {!isRevoking && (
            <button onClick={onClose} className="text-gray-500 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Batch progress bar */}
          {isRevoking && batchProgress && batchProgress.total > 0 && (
            <div className="bg-purple-600/10 border border-purple-600/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-purple-300 text-sm font-medium">
                  Chain {batchProgress.current}/{batchProgress.total}
                  {batchProgress.currentChain && ` — ${batchProgress.currentChain}`}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-2">
                {chainCount > 1
                  ? `${approvals.length} approvals across ${chainCount} chains — 1 tx per chain via Multicall3`
                  : `${approvals.length} approvals — batched into 1 transaction`}
              </p>
            </div>
          )}

          {Object.entries(grouped).map(([chainIdStr, items]) => {
            const chainId = Number(chainIdStr);
            const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
            return (
              <div key={chainId}>
                <p className="text-gray-400 text-xs font-medium mb-2">
                  {chain?.emoji} {chain?.name} ({items.length})
                </p>
                <div className="space-y-1.5">
                  {items.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#0F0F0F] rounded-lg px-3 py-2"
                    >
                      <div>
                        <span className="text-white text-sm">{a.tokenSymbol}</span>
                        {a.isUnlimited && (
                          <AlertTriangle className="w-3 h-3 text-orange-500 inline ml-1" />
                        )}
                      </div>
                      <span className="text-gray-500 text-xs font-mono">
                        {truncateAddress(a.spender)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {!isRevoking && (
            <div className="bg-purple-600/10 border border-purple-600/20 rounded-xl p-3">
              <p className="text-purple-300 text-xs">
                ⚡ {chainCount > 1
                  ? `Will batch into ${chainCount} transactions (1 per chain) via Multicall3`
                  : `Will batch ${approvals.length} approvals into 1 transaction via Multicall3`}
              </p>
            </div>
          )}

          {estimatedGas && (
            <div className="bg-[#0F0F0F] rounded-xl p-3 border border-gray-800">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Gas</span>
                <span className="text-white">~{estimatedGas} {nativeCurrency}</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            disabled={isRevoking}
            className="flex-1 py-2.5 px-4 bg-[#0F0F0F] text-gray-300 rounded-xl border border-gray-700 font-medium text-sm disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRevoking}
            className="flex-1 py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isRevoking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Revoking...</span>
              </>
            ) : (
              <span>⚡ Batch Revoke</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
