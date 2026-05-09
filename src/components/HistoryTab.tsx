import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useHistoryStore } from '../stores/historyStore';
import { truncateAddress, SUPPORTED_CHAINS } from '../types';

export default function HistoryTab() {
  const { history, clearHistory } = useHistoryStore();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="p-4 rounded-2xl bg-brand-surface border border-white/5 mb-4">
          <Clock className="w-10 h-10 text-gray-700" />
        </div>
        <p className="text-gray-500 text-sm font-medium">No history yet</p>
        <p className="text-gray-700 text-xs mt-1">Revoked approvals will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-white text-sm font-semibold tracking-tight">History</h3>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-xs text-gray-600 hover:text-brand-red transition-colors"
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
            className="bg-brand-surface rounded-xl border border-white/5 p-3.5 animate-fade-in"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{item.tokenSymbol}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
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
                  <span className="text-gray-600 text-xs font-mono">
                    {truncateAddress(item.spender)}
                  </span>
                </div>
              </div>
              {item.explorerUrl && (
                <a
                  href={item.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-blue hover:text-brand-blue/80 p-1 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-gray-700 text-[11px] mt-2 font-mono">
              {new Date(item.timestamp).toLocaleString()}
            </p>
            {item.status === 'failed' && item.errorMessage && (
              <p className="text-brand-red/80 text-[11px] mt-1.5 leading-relaxed truncate">
                {item.errorMessage}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
