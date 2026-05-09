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
  const selectAll = useScanStore((s) => s.selectAll);

  const chainIds = Object.keys(approvals ?? {})
    .map(Number)
    .filter((id) => (approvals ?? {})[id]?.length > 0);

  if (chainIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldCheck className="w-12 h-12 text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm">No approvals found</p>
        <p className="text-gray-600 text-xs mt-1">Connect your wallet and scan to find token approvals</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {chainIds.map((chainId) => {
        const chain = SUPPORTED_CHAINS.find((c) => c.id === chainId);
        const items = approvals[chainId] ?? [];
        const allSelected = items.every((a) =>
          selectedApprovals.has(getApprovalKey(a.chainId, a.tokenAddress, a.spender))
        );

        return (
          <div key={chainId}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm">
                  {chain?.emoji} {chain?.name ?? `Chain ${chainId}`}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-600/20 text-purple-400">
                  {items.length}
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => selectAll(chainId)}
                  className="w-3.5 h-3.5 accent-purple-600 rounded"
                />
                Select All
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
