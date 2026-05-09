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
      className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-brand-blue to-brand-blue-light hover:from-brand-blue-light hover:to-brand-blue active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 text-white font-bold text-sm rounded-pill transition-all duration-300 animate-fade-in btn-bold"
      style={{ boxShadow: isScanning ? 'none' : '0 0 28px rgba(0, 122, 255, 0.2)' }}
    >
      {isScanning ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="tracking-wide">
            Scanning {scanProgress.current}/{scanProgress.total}…
          </span>
        </>
      ) : (
        <>
          <Search className="w-5 h-5" strokeWidth={2.5} />
          <span className="tracking-wide">Scan Approvals</span>
        </>
      )}
    </button>
  );
}
