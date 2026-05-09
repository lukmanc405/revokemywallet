import { Loader2 } from 'lucide-react';
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
    <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-sm border-t border-gray-800 p-4 safe-area-bottom">
      <button
        onClick={onRevokeSelected}
        disabled={isRevoking}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
      >
        {isRevoking ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Revoking...</span>
          </>
        ) : (
          <span>Revoke {count} Selected</span>
        )}
      </button>
    </div>
  );
}
