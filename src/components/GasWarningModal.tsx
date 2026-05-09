import { Fuel, Zap } from 'lucide-react';

interface GasWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTopUp: () => void;
  currentBalance: string;
  estimatedFee: string;
  deficit: string;
  nativeCurrency: string;
}

export default function GasWarningModal({
  isOpen,
  onClose,
  onTopUp,
  currentBalance,
  estimatedFee,
  deficit,
  nativeCurrency,
}: GasWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-brand-surface rounded-t-3xl sm:rounded-2xl border border-white/[0.04] w-full max-w-sm animate-slide-in-bottom">
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex flex-col items-center text-center px-6 pb-6">
          <div className="p-4 rounded-2xl bg-brand-red/10 border border-brand-red/15 mb-5">
            <Fuel className="w-8 h-8 text-brand-red" />
          </div>
          <h3 className="text-white text-lg font-extrabold mb-2 tracking-tight">Insufficient Gas</h3>
          <p className="text-gray-500 text-sm mb-6 font-medium">
            Not enough {nativeCurrency} to cover transaction fees.
          </p>

          <div className="w-full space-y-2 mb-6 bg-brand-dark rounded-2xl p-4 border border-white/[0.04]">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Balance</span>
              <span className="text-white font-bold">{currentBalance} {nativeCurrency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Fee</span>
              <span className="text-white font-bold">{estimatedFee} {nativeCurrency}</span>
            </div>
            <div className="border-t border-white/[0.04] pt-2 flex justify-between text-sm">
              <span className="text-brand-red font-bold">Deficit</span>
              <span className="text-brand-red font-extrabold">{deficit} {nativeCurrency}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-4 bg-brand-dark text-gray-400 rounded-xl border border-white/[0.04] font-bold text-sm hover:border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onTopUp}
              className="flex-1 py-3.5 px-4 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex items-center justify-center gap-2"
              style={{ boxShadow: '0 0 20px rgba(255, 59, 48, 0.2)' }}
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Top Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
