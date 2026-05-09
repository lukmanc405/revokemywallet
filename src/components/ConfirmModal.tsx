import { X, AlertTriangle, Loader2, Zap } from 'lucide-react';
import type { Approval } from '../types';
import { SUPPORTED_CHAINS, truncateAddress } from '../types';

interface BatchProgress {
  current: number;
  total: number;
  currentToken: string;
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={isRevoking ? undefined : onClose} />
      <div className="relative bg-brand-surface rounded-t-2xl sm:rounded-2xl border border-white/5 w-full max-w-sm max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <h3 className="text-white text-lg font-bold tracking-tight">
            {isRevoking ? 'Revoking…' : 'Confirm Revoke'}
          </h3>
          {!isRevoking && (
            <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Batch progress — per approval */}
          {isRevoking && batchProgress && batchProgress.total > 0 && (
            <div className="bg-brand-blue/5 border border-brand-blue/15 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Loader2 className="w-4 h-4 text-brand-blue animate-spin" />
                <span className="text-brand-blue text-sm font-semibold">
                  {batchProgress.current}/{batchProgress.total} approvals
                </span>
              </div>
              {batchProgress.currentToken && (
                <p className="text-brand-blue/70 text-xs mb-3 truncate">
                  Revoking {batchProgress.currentToken}…
                </p>
              )}
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-blue h-1.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Chain groups */}
          {Object.entries(grouped).map(([chainIdStr, items]) => {
            const chainId = Number(chainIdStr);
            const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
            return (
              <div key={chainId}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: chain?.color ?? '#666' }}
                  />
                  <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    {chain?.emoji} {chain?.name} ({items.length})
                  </p>
                </div>
                <div className="space-y-1.5">
                  {items.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-brand-dark rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-medium">{a.tokenSymbol}</span>
                        {a.isUnlimited && (
                          <AlertTriangle className="w-3 h-3 text-brand-red" />
                        )}
                      </div>
                      <span className="text-gray-600 text-xs font-mono">
                        {truncateAddress(a.spender)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Info box */}
          {!isRevoking && (
            <div className="bg-brand-yellow/5 border border-brand-yellow/15 rounded-xl p-3">
              <p className="text-brand-yellow/80 text-xs font-medium">
                ⚡ {approvals.length} individual transaction{approvals.length > 1 ? 's' : ''} — each one shows exactly what you're revoking
              </p>
            </div>
          )}

          {estimatedGas && (
            <div className="bg-brand-dark rounded-xl p-3 border border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estimated Gas</span>
                <span className="text-white font-medium">~{estimatedGas} {nativeCurrency}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/5 flex gap-3">
          <button
            onClick={onClose}
            disabled={isRevoking}
            className="flex-1 py-3 px-4 bg-brand-dark text-gray-400 rounded-xl border border-white/5 font-semibold text-sm disabled:opacity-40 hover:border-white/10 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isRevoking}
            className="flex-1 py-3 px-4 bg-brand-red hover:bg-brand-red/90 text-white rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            {isRevoking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Revoking…</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Revoke</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
