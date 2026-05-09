import { useState, useRef, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { SUPPORTED_CHAINS } from '../types';
import { switchChain } from 'wagmi/actions';
import { useAccount } from 'wagmi';
import { wagmiConfig } from '../config/reown';

interface ChainPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChainSelect?: (chainId: number) => void;
}

export default function ChainPickerModal({ isOpen, onClose, onChainSelect }: ChainPickerModalProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { chain } = useAccount();

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filtered = SUPPORTED_CHAINS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = async (chainId: number) => {
    try {
      await switchChain(wagmiConfig, { chainId });
    } catch {
      // User may reject or wallet doesn't support the chain
    }
    onChainSelect?.(chainId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" />

      <div
        className="relative w-full max-w-md bg-brand-dark border-t border-white/[0.06] rounded-t-3xl animate-slide-in-bottom"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between px-5 pb-4">
          <h3 className="text-white font-extrabold text-base tracking-tight">Switch Network</h3>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search network..."
              className="w-full pl-10 pr-4 py-3 bg-brand-surface border border-white/[0.04] rounded-xl text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>
        </div>

        <div className="px-3 pb-8 max-h-[50vh] overflow-y-auto space-y-1 scrollbar-hide">
          {filtered.map((c) => {
            const isActive = chain?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-blue/10 border border-brand-blue/25'
                    : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <span className="text-xl">{c.emoji}</span>
                <div className="flex-1 text-left">
                  <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-gray-400'}`}>
                    {c.name}
                  </span>
                </div>
                {isActive && (
                  <div className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-8 font-medium">No networks found</p>
          )}
        </div>
      </div>
    </div>
  );
}
