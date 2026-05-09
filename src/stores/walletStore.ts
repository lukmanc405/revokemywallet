import { create } from 'zustand';

interface WalletState {
  connectedAddress: `0x${string}` | null;
  connectedChainId: number | null;
  isConnecting: boolean;
  setWallet: (address: `0x${string}`, chainId: number) => void;
  setConnecting: (connecting: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  connectedAddress: null,
  connectedChainId: null,
  isConnecting: false,
  setWallet: (address, chainId) =>
    set({ connectedAddress: address, connectedChainId: chainId, isConnecting: false }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  disconnect: () =>
    set({ connectedAddress: null, connectedChainId: null, isConnecting: false }),
}));
