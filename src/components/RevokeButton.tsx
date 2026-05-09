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
    <div className="fixed bottom-[60px] left-0 right-0 z-30 glass border-t border-white/[0.04] p-4 safe-area-bottom animate-slide-up">
      <button
        onClick={onRevokeSelected}
        disabled={isRevoking}
        className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-brand-red to-brand-red-light hover:brightness-110 active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 text-white font-bold text-sm rounded-pill transition-all duration-300 btn-bold animate-pulse-glow"
      >
        {isRevoking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="tracking-wide">Revoking…</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" fill="currentColor" />
            <span className="tracking-wide">Revoke {count} Selected</span>
          </>
        )}
      </button>
    </div>
  );
}
