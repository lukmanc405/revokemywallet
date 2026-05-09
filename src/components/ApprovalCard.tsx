import { AlertTriangle, Siren } from 'lucide-react';
import { type Approval, getApprovalKey, truncateAddress, SUPPORTED_CHAINS } from '../types';
import { useScanStore } from '../stores/scanStore';

interface ApprovalCardProps {
  approval: Approval;
  onRevoke?: (approval: Approval) => void;
  isRevoking?: boolean;
}

export default function ApprovalCard({ approval, onRevoke, isRevoking }: ApprovalCardProps) {
  const { selectedApprovals, toggleSelection } = useScanStore();
  const key = getApprovalKey(approval.chainId, approval.tokenAddress, approval.spender);
  const isSelected = selectedApprovals.has(key);
  const chain = SUPPORTED_CHAINS.find((c) => c.id === approval.chainId);

  const typeBadge =
    approval.tokenType === 'ERC20'
      ? { bg: 'bg-brand-blue/10', text: 'text-brand-blue', border: 'border-brand-blue/20' }
      : approval.tokenType === 'ERC721'
        ? { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
        : { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow', border: 'border-brand-yellow/20' };

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 animate-fade-in ${
        isSelected
          ? 'bg-brand-blue/5 border-brand-blue/25'
          : 'bg-brand-surface border-white/5 hover:border-white/10'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelection(key)}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-semibold text-sm truncate">
            {approval.tokenName}
          </span>
          <span className="text-gray-600 text-xs font-mono">{approval.tokenSymbol}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
            {approval.tokenType}
          </span>
          {approval.possibleSpam && (
            <Siren className="w-3.5 h-3.5 text-brand-yellow" />
          )}
          {approval.isUnlimited && (
            <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gray-600 text-xs">
            → <span className="font-mono text-gray-500">{truncateAddress(approval.spender)}</span>
          </span>
          {chain && (
            <span
              className="text-[10px] px-1.5 py-0.5 rounded-md font-medium border"
              style={{
                backgroundColor: chain.color + '10',
                borderColor: chain.color + '25',
                color: chain.color,
              }}
            >
              {chain.emoji} {chain.name}
            </span>
          )}
        </div>
        {approval.isUnlimited && (
          <p className="text-brand-red/70 text-[11px] mt-1.5 font-medium">Unlimited approval</p>
        )}
      </div>
      {onRevoke && (
        <button
          onClick={() => onRevoke(approval)}
          disabled={isRevoking}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isRevoking ? '…' : 'Revoke'}
        </button>
      )}
    </div>
  );
}
