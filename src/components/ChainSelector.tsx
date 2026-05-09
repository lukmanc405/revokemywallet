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

  const displayLabel = isAll
    ? 'All Chains'
    : selectedChains.length === 1
      ? SUPPORTED_CHAINS.find((c) => c.id === selectedChains[0])?.name ?? '1 Chain'
      : `${selectedChains.length} Chains`;

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
        className="w-full flex items-center justify-between px-4 py-3.5 bg-brand-surface border border-white/[0.04] rounded-2xl hover:border-white/10 hover:bg-brand-elevated/50 transition-all duration-200 active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5">
            {displayEmojis.map((emoji, i) => (
              <span key={i} className="text-base">{emoji}</span>
            ))}
          </div>
          <span className="text-white text-sm font-bold tracking-tight">{displayLabel}</span>
          {!isAll && (
            <span className="text-xs text-gray-500 font-bold">
              / {SUPPORTED_CHAINS.length}
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" />

          <div
            className="relative w-full max-w-md bg-brand-dark border-t border-white/[0.06] rounded-t-3xl animate-slide-in-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent line */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4">
              <h3 className="text-white font-extrabold text-base tracking-tight">Select Chains</h3>
              <button onClick={() => setIsOpen(false)} className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pb-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chain..."
                  className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/[0.04] rounded-xl text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 transition-colors"
                />
              </div>
            </div>

            {/* Select All */}
            <div className="px-5 pb-2">
              <button
                onClick={toggleAll}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-bold text-brand-blue tracking-tight">
                  {isAll ? 'Deselect All' : 'Select All'}
                </span>
                {isAll && <Check className="w-4 h-4 text-brand-blue" />}
              </button>
            </div>

            {/* Chain list */}
            <div className="px-3 pb-8 max-h-[50vh] overflow-y-auto space-y-1 scrollbar-hide">
              {filtered.map((c) => {
                const selected = isAll || selectedChains.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => toggleChain(c.id)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 ${
                      selected
                        ? 'bg-brand-blue/10 border border-brand-blue/25'
                        : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <span className="text-xl">{c.emoji}</span>
                    <div className="flex-1 text-left">
                      <span className={`text-sm font-bold tracking-tight ${selected ? 'text-white' : 'text-gray-400'}`}>
                        {c.name}
                      </span>
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-gray-600 text-sm py-8 font-medium">No chains found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
