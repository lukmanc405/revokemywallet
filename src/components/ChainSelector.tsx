import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';
import { useScanStore } from '../stores/scanStore';
import { SUPPORTED_CHAINS } from '../types';

export default function ChainSelector() {
  const { selectedChains, setSelectedChains } = useScanStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allChainIds = SUPPORTED_CHAINS.map((c) => c.id);
  const isAll = selectedChains.length === 0 || selectedChains.length === allChainIds.length;

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = SUPPORTED_CHAINS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleChain = (id: number) => {
    if (selectedChains.includes(id)) {
      const next = selectedChains.filter((c) => c !== id);
      setSelectedChains(next);
    } else {
      setSelectedChains([...selectedChains, id]);
    }
  };

  const toggleAll = () => {
    setSelectedChains(isAll ? [] : [...allChainIds]);
  };

  // Display label
  const displayLabel = isAll
    ? 'All Chains'
    : selectedChains.length === 1
      ? SUPPORTED_CHAINS.find((c) => c.id === selectedChains[0])?.name ?? '1 Chain'
      : `${selectedChains.length} Chains`;

  // Display emojis (max 4)
  const displayEmojis = isAll
    ? SUPPORTED_CHAINS.slice(0, 4).map((c) => c.emoji)
    : selectedChains
        .map((id) => SUPPORTED_CHAINS.find((c) => c.id === id)?.emoji)
        .filter(Boolean)
        .slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-surface border border-white/5 rounded-xl hover:border-white/10 transition-all duration-200 active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            {displayEmojis.map((emoji, i) => (
              <span key={i} className="text-sm">{emoji}</span>
            ))}
          </div>
          <span className="text-white text-sm font-medium">{displayLabel}</span>
          {!isAll && (
            <span className="text-xs text-gray-500 font-medium">
              / {SUPPORTED_CHAINS.length}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

          <div
            className="relative w-full max-w-md bg-brand-dark border-t border-white/10 rounded-t-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3">
              <h3 className="text-white font-semibold text-sm">Select Chains</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 text-gray-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chain..."
                  className="w-full pl-9 pr-4 py-2.5 bg-brand-surface border border-white/5 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 transition-colors"
                />
              </div>
            </div>

            {/* Select All */}
            <div className="px-4 pb-2">
              <button
                onClick={toggleAll}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-medium text-brand-blue">
                  {isAll ? 'Deselect All' : 'Select All'}
                </span>
                {isAll && <Check className="w-4 h-4 text-brand-blue" />}
              </button>
            </div>

            {/* Chain list */}
            <div className="px-2 pb-6 max-h-[50vh] overflow-y-auto space-y-0.5">
              {filtered.map((c) => {
                const selected = isAll || selectedChains.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChain(c.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 ${
                      selected
                        ? 'bg-brand-blue/10 border border-brand-blue/20'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{c.emoji}</span>
                    <div className="flex-1 text-left">
                      <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-400'}`}>
                        {c.name}
                      </span>
                    </div>
                    {selected && (
                      <Check className="w-4 h-4 text-brand-blue" />
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-gray-600 text-sm py-6">No chains found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
