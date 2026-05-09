import { Wallet } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { truncateAddress } from '../types';

export default function WalletConnect() {
  const { connectedAddress, isConnecting } = useWalletStore();

  if (connectedAddress) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-[#1A1A1A] rounded-xl border border-gray-800">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <div>
          <p className="text-white text-sm font-medium">Connected</p>
          <p className="text-gray-400 text-xs font-mono">
            {truncateAddress(connectedAddress)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <Wallet className="w-12 h-12 text-purple-500 mb-2" />
      <p className="text-gray-400 text-sm">Connect your wallet to scan token approvals</p>
      {/* Reown AppKit button mounts here */}
      <appkit-button />
      {isConnecting && (
        <p className="text-gray-500 text-sm animate-pulse">Connecting...</p>
      )}
    </div>
  );
}
