import { ShieldCheck } from 'lucide-react';
import { useScanStore, getApprovalKey } from '../stores/scanStore';
import { SUPPORTED_CHAINS } from '../types';
import ApprovalCard from './ApprovalCard';

interface ApprovalListProps {
  onRevoke?: (approval: import('../types').Approval) => void;
  revokingKeys?: Set<string>;
}

export default function ApprovalList({ onRevoke, revokingKeys }: ApprovalListProps) {
  const approvals = useScanStore((s) => s.approvals);
  const selectedApprovals = useScanStore((s) => s.selectedApprovals);
  const selectedChains = useScanStore((s) => s.selectedChains);
  const selectAll = useScanStore((s) => s.selectAll);

  const allChainIds = SUPPORTED_CHAINS.map((c) => c.id);
  const isAll = selectedChains.length === 0 || selectedChains.length === allChainIds.length;

  const chainIds = Object.keys(approvals ?? {})
    .map(Number)
    .filter((id) => {
      const hasApprovals = (approvals ?? {})[id]?.length > 0;
      if (!hasApprovals) return false;
      if (isAll) return true;
      return selectedChains.includes(id);
    });

  if (chainIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="p-5 rounded-2xl bg-brand-surface border border-white/[0.04] mb-5">
          <ShieldCheck className="w-12 h-12 text-gray-700" />
        </div>
        <p className="text-gray-400 text-sm font-bold tracking-tight">No approvals found</p>
        <p className="text-gray-700 text-xs mt-1.5 font-medium">Connect wallet and scan to find token approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {chainIds.map((chainId) => {
        const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
        const items = approvals[chainId] ?? [];
        const allSelected = items.every((a) =>
          selectedApprovals.has(getApprovalKey(a.chainId, a.tokenAddress, a.spender))
        );

        return (
          <div key={chainId} className="animate-slide-up">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2.5">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: chain?.color ?? '#666' }}
                />
                <span className="text-white font-extrabold text-sm tracking-tight">
                  {chain?.emoji} {chain?.name ?? `Chain ${chainId}`}
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/5 text-gray-400 font-bold">
                  {items.length}
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => selectAll(chainId)}
                />
                <span className="font-bold">All</span>
              </label>
            </div>
            <div className="space-y-2">
              {items.map((approval) => {
                const key = getApprovalKey(approval.chainId, approval.tokenAddress, approval.spender);
                return (
                  <ApprovalCard
                    key={key}
                    approval={approval}
                    onRevoke={onRevoke}
                    isRevoking={revokingKeys?.has(key)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
