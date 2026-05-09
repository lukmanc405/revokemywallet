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
      className="w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-brand-blue hover:bg-brand-blue/90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 text-white font-semibold rounded-pill transition-all duration-200 animate-fade-in"
    >
      {isScanning ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>
            Scanning {scanProgress.current}/{scanProgress.total}…
          </span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" />
          <span>Scan Approvals</span>
        </>
      )}
    </button>
  );
}
