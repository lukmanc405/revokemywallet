import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useHistoryStore } from '../stores/historyStore';
import { truncateAddress, SUPPORTED_CHAINS } from '../types';

export default function HistoryTab() {
  const { history, clearHistory } = useHistoryStore();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="p-5 rounded-2xl bg-brand-surface border border-white/[0.04] mb-5">
          <Clock className="w-12 h-12 text-gray-700" />
        </div>
        <p className="text-gray-400 text-sm font-bold tracking-tight">No history yet</p>
        <p className="text-gray-700 text-xs mt-1.5 font-medium">Revoked approvals will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-1 mb-3">
        <h3 className="text-white text-sm font-extrabold tracking-tight">History</h3>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-brand-red transition-colors font-bold"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {history.map((item, index) => {
        const chain = SUPPORTED_CHAINS.find((c) => c.id === item.chainId);
        const statusBadge =
          item.status === 'success'
            ? { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' }
            : item.status === 'failed'
              ? { bg: 'bg-brand-red/10', text: 'text-brand-red', border: 'border-brand-red/20' }
              : { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow', border: 'border-brand-yellow/20' };

        return (
          <div
            key={`${item.txHash}-${index}`}
            className="bg-brand-surface rounded-2xl border border-white/[0.04] p-4 animate-fade-in hover:border-white/8 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-bold tracking-tight">{item.tokenSymbol}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
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
                  <span className="text-gray-500 text-xs font-mono font-bold">
                    {truncateAddress(item.spender)}
                  </span>
                </div>
              </div>
              {item.explorerUrl && (
                <a
                  href={item.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:text-brand-blue-light p-1.5 transition-colors rounded-lg hover:bg-brand-blue/10"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-gray-700 text-[11px] mt-2.5 font-mono font-medium">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            {item.status === 'failed' && item.errorMessage && (
              <p className="text-brand-red/80 text-[11px] mt-2 font-medium leading-relaxed truncate">
                {item.errorMessage}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
