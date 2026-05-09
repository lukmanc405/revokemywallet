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
      ? { bg: 'bg-brand-blue/10', text: 'text-brand-blue', border: 'border-brand-blue/20', glow: 'shadow-glow-blue' }
      : approval.tokenType === 'ERC721'
        ? { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', glow: '' }
        : { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow', border: 'border-brand-yellow/20', glow: 'shadow-glow-yellow' };

  return (
    <div
      onClick={() => toggleSelection(key)}
      className={`group relative flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200 animate-fade-in ${
        isSelected
          ? `bg-brand-blue/8 border-brand-blue/30 ${typeBadge.glow}`
          : 'bg-brand-surface border-white/[0.04] hover:border-white/10 hover:bg-brand-elevated/50'
      }`}
    >
      {/* Selection indicator — bold colored bar */}
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-brand-blue" />
      )}

      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelection(key)}
        className="mt-0.5"
        onClick={(e) => e.stopPropagation()}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-bold text-[13px] truncate tracking-tight">
            {approval.tokenName}
          </span>
          <span className="text-gray-500 text-xs font-mono font-bold">{approval.tokenSymbol}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}>
            {approval.tokenType}
          </span>
          {approval.possibleSpam && (
            <Siren className="w-3.5 h-3.5 text-brand-yellow" />
          )}
          {approval.isUnlimited && (
            <AlertTriangle className="w-3.5 h-3.5 text-brand-red" />
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-gray-600 text-xs font-medium">
            → <span className="font-mono text-gray-400 font-bold">{truncateAddress(approval.spender)}</span>
          </span>
          {chain && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-lg font-bold border"
              style={{
                backgroundColor: chain.color + '12',
                borderColor: chain.color + '30',
                color: chain.color,
              }}
            >
              {chain.emoji} {chain.name}
            </span>
          )}
        </div>

        {approval.isUnlimited && (
          <p className="text-brand-red text-[11px] mt-2 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse-dot" />
            Unlimited approval
          </p>
        )}
      </div>

      {onRevoke && (
        <button
          onClick={(e) => { e.stopPropagation(); onRevoke(approval); }}
          disabled={isRevoking}
          className="flex-shrink-0 px-3.5 py-2 text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20 hover-glow-red rounded-xl transition-all duration-200 disabled:opacity-50 tracking-wide"
        >
          {isRevoking ? '…' : 'Revoke'}
        </button>
      )}
    </div>
  );
}
