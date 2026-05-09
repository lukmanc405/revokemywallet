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

  const typeColor =
    approval.tokenType === 'ERC20'
      ? 'bg-blue-500/20 text-blue-400'
      : approval.tokenType === 'ERC721'
        ? 'bg-green-500/20 text-green-400'
        : 'bg-orange-500/20 text-orange-400';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
        isSelected
          ? 'bg-purple-600/10 border-purple-500/30'
          : 'bg-[#1A1A1A] border-gray-800'
      }`}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelection(key)}
        className="mt-1 w-4 h-4 accent-purple-600 rounded"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-white font-medium text-sm truncate">
            {approval.tokenName}
          </span>
          <span className="text-gray-500 text-xs">({approval.tokenSymbol})</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${typeColor}`}>
            {approval.tokenType}
          </span>
          {approval.possibleSpam && (
            <Siren className="w-3.5 h-3.5 text-yellow-500" />
          )}
          {approval.isUnlimited && (
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gray-500 text-xs">
            Spender: <span className="font-mono text-gray-400">{truncateAddress(approval.spender)}</span>
          </span>
          {chain && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0F0F0F] text-gray-400 border border-gray-700">
              {chain.emoji} {chain.name}
            </span>
          )}
        </div>
        {approval.isUnlimited && (
          <p className="text-orange-400/80 text-[11px] mt-1">⚠️ Unlimited approval</p>
        )}
      </div>
      {onRevoke && (
        <button
          onClick={() => onRevoke(approval)}
          disabled={isRevoking}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors disabled:opacity-50"
        >
          {isRevoking ? '...' : 'Revoke'}
        </button>
      )}
    </div>
  );
}
