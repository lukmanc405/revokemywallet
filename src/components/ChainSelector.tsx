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
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-white text-sm font-medium">Select Chains</h3>
        <button
          onClick={toggleAll}
          className={`text-xs px-3 py-1 rounded-full transition-colors ${
            isAll
              ? 'bg-purple-600 text-white'
              : 'bg-[#1A1A1A] text-gray-400 border border-gray-700'
          }`}
        >
          All Chains
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {SUPPORTED_CHAINS.map((chain) => {
          const selected = isAll || selectedChains.includes(chain.id);
          return (
            <button
              key={chain.id}
              onClick={() => toggleChain(chain.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selected
                  ? 'bg-purple-600 text-white'
                  : 'bg-[#1A1A1A] text-gray-400 border border-gray-700'
              }`}
            >
              <span>{chain.emoji}</span>
              <span>{chain.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
