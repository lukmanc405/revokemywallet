import { X, Fuel } from 'lucide-react';

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-brand-surface rounded-t-2xl sm:rounded-2xl border border-white/5 w-full max-w-sm p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-2xl bg-brand-red/10 border border-brand-red/15 mb-4">
            <Fuel className="w-8 h-8 text-brand-red" />
          </div>
          <h3 className="text-white text-lg font-bold mb-2">Insufficient Gas</h3>
          <p className="text-gray-500 text-sm mb-6">
            Not enough {nativeCurrency} to cover transaction fees.
          </p>

          <div className="w-full space-y-2 mb-6 bg-brand-dark rounded-xl p-4 border border-white/5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Balance</span>
              <span className="text-white font-medium">{currentBalance} {nativeCurrency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Fee</span>
              <span className="text-white font-medium">{estimatedFee} {nativeCurrency}</span>
            </div>
            <div className="border-t border-white/5 pt-2 flex justify-between text-sm">
              <span className="text-brand-red font-medium">Deficit</span>
              <span className="text-brand-red font-bold">{deficit} {nativeCurrency}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-brand-dark text-gray-400 rounded-xl border border-white/5 font-semibold text-sm hover:border-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onTopUp}
              className="flex-1 py-3 px-4 bg-brand-red hover:bg-brand-red/90 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
            >
              Top Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
