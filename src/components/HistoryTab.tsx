import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import { useHistoryStore } from '../stores/historyStore';
import { truncateAddress } from '../types';

export default function HistoryTab() {
  const { history, clearHistory } = useHistoryStore();

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock className="w-12 h-12 text-gray-600 mb-3" />
        <p className="text-gray-500 text-sm">No revocation history</p>
        <p className="text-gray-600 text-xs mt-1">Your revoked approvals will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1 mb-2">
        <h3 className="text-white text-sm font-medium">History</h3>
        <button
          onClick={clearHistory}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      {history.map((item, index) => {
        const statusColor =
          item.status === 'success'
            ? 'bg-green-500/20 text-green-400'
            : item.status === 'failed'
              ? 'bg-red-500/20 text-red-400'
              : 'bg-yellow-500/20 text-yellow-400';

        return (
          <div
            key={`${item.txHash}-${index}`}
            className="bg-[#1A1A1A] rounded-xl border border-gray-800 p-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium">
                    {item.tokenSymbol}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{item.chainName}</p>
                <p className="text-gray-600 text-xs font-mono mt-0.5">
                  {truncateAddress(item.spender)}
                </p>
              </div>
              <a
                href={item.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 p-1"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-gray-600 text-[11px] mt-2">
              {new Date(item.timestamp).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
