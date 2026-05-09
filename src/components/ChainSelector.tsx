import { useScanStore } from '../stores/scanStore';
import { SUPPORTED_CHAINS } from '../types';

export default function ChainSelector() {
  const { selectedChains, setSelectedChains } = useScanStore();

  const allChainIds = SUPPORTED_CHAINS.map((c) => c.id);
  const isAll = selectedChains.length === 0 || selectedChains.length === allChainIds.length;

  const toggleAll = () => {
    setSelectedChains(isAll ? [] : [...allChainIds]);
  };

  const toggleChain = (id: number) => {
    if (selectedChains.includes(id)) {
      setSelectedChains(selectedChains.filter((c) => c !== id));
    } else {
      setSelectedChains([...selectedChains, id]);
    }
  };

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-white text-sm font-semibold tracking-tight">Chains</h3>
        <button
          onClick={toggleAll}
          className={`text-xs px-3 py-1.5 rounded-pill font-medium transition-all duration-200 ${
            isAll
              ? 'bg-brand-blue text-white'
              : 'bg-brand-surface text-gray-500 border border-white/5 hover:border-white/10'
          }`}
        >
          {isAll ? 'All Selected' : 'Select All'}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SUPPORTED_CHAINS.map((chain) => {
          const selected = isAll || selectedChains.includes(chain.id);
          return (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-pill text-xs font-semibold transition-all duration-200 active:scale-95 ${
                selected
                  ? 'text-white shadow-lg'
                  : 'bg-brand-surface text-gray-500 border border-white/5 hover:border-white/10'
              }`}
              style={selected ? { backgroundColor: chain.color + '30', border: `1px solid ${chain.color}50`, color: chain.color } : undefined}
            >
              <span className="text-sm">{chain.emoji}</span>
              <span>{chain.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
