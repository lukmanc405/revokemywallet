import { Loader2, Zap } from 'lucide-react';
import { useScanStore } from '../stores/scanStore';

interface RevokeButtonProps {
  onRevokeSelected: () => void;
  isRevoking: boolean;
}

export default function RevokeButton({ onRevokeSelected, isRevoking }: RevokeButtonProps) {
  const { selectedApprovals } = useScanStore();
  const count = selectedApprovals.size;

  if (count === 0) return null;

  return (
    <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-brand-dark/95 backdrop-blur-md border-t border-white/5 p-4 safe-area-bottom animate-slide-up">
      <button
        onClick={onRevokeSelected}
        disabled={isRevoking}
        className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-brand-red hover:bg-brand-red/90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-semibold rounded-pill transition-all duration-200"
      >
        {isRevoking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Revoking…</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Revoke {count} Selected</span>
          </>
        )}
      </button>
    </div>
  );
}
