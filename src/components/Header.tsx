import { ShieldCheck, LogOut } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { truncateAddress } from '../types';

export default function Header() {
  const { connectedAddress, disconnect } = useWalletStore();

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-500" />
          <span className="text-white font-bold text-lg tracking-tight">
            revokemywallet
          </span>
        </div>

        {connectedAddress && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm font-mono">
              {truncateAddress(connectedAddress)}
            </span>
            <button
              onClick={disconnect}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Disconnect"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
