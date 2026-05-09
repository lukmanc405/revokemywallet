import { Loader2, Search } from 'lucide-react';
import { useScanStore } from '../stores/scanStore';

interface ScanButtonProps {
  onClick?: () => void;
}

export default function ScanButton({ onClick }: ScanButtonProps) {
  const { isScanning, scanProgress } = useScanStore();

  return (
    <button
      onClick={onClick}
      disabled={isScanning}
      className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>
            Scanning {scanProgress.current}/{scanProgress.total} chains...
          </span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" />
          <span>🔍 Scan All Chains</span>
        </>
      )}
    </button>
  );
}
