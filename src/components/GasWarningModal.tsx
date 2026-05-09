import { AlertTriangle, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#1A1A1A] rounded-2xl border border-gray-800 w-full max-w-sm p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-red-500/10 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-white text-lg font-bold mb-2">Gas Insufficient</h3>
          <p className="text-gray-400 text-sm mb-6">
            You don&apos;t have enough {nativeCurrency} to cover transaction fees.
          </p>

          <div className="w-full space-y-2 mb-6 bg-[#0F0F0F] rounded-xl p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Current Balance</span>
              <span className="text-white">{currentBalance} {nativeCurrency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Estimated Fee</span>
              <span className="text-white">{estimatedFee} {nativeCurrency}</span>
            </div>
            <div className="border-t border-gray-800 pt-2 flex justify-between text-sm">
              <span className="text-red-400">Deficit</span>
              <span className="text-red-400 font-medium">{deficit} {nativeCurrency}</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-[#0F0F0F] text-gray-300 rounded-xl border border-gray-700 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onTopUp}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm"
            >
              Top Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
