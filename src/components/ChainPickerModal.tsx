import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
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
          <h3 className="text-white font-semibold text-sm">Switch Network</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white transition-colors">
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
              placeholder="Search network..."
              className="w-full pl-9 pr-4 py-2.5 bg-brand-surface border border-white/5 rounded-xl text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-brand-blue/50 transition-colors"
            />
          </div>
        </div>

        {/* Chain list */}
        <div className="px-2 pb-6 max-h-[50vh] overflow-y-auto space-y-0.5">
          {filtered.map((c) => {
            const isActive = chain?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-blue/10 border border-brand-blue/20'
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className="text-lg">{c.emoji}</span>
                <div className="flex-1 text-left">
                  <span className={`text-sm font-medium ${isActive ? 'text-brand-blue' : 'text-white'}`}>
                    {c.name}
                  </span>
                </div>
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse-dot" />
                )}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-600 text-sm py-6">No networks found</p>
          )}
        </div>
      </div>
    </div>
  );
}
