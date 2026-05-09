import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createAppKit } from '@reown/appkit/react';
import type { AppKitNetwork } from '@reown/appkit-common';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  mainnet,
  optimism,
  polygon,
  zkSync,
} from 'viem/chains';
import { cookieStorage, createStorage } from 'wagmi';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID as string;

if (!projectId) {
  console.warn('[Reown] VITE_REOWN_PROJECT_ID is not set');
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet,
  base,
  arbitrum,
  optimism,
  polygon,
  bsc,
  avalanche,
  zkSync,
];

// Use cookie + localStorage for better persistence in Telegram WebView
const storage = createStorage({
  storage: typeof window !== 'undefined' ? localStorage : cookieStorage,
  key: 'revokemywallet-wagmi',
});

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
  storage,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'RevokeMyWallet',
    description: 'Revoke token approvals across EVM chains',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://revokemywallet.app',
    icons: ['https://revokemywallet.app/icon.png'],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7C3AED',
    '--w3m-border-radius-master': '8px',
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  // Important for Telegram Mini Apps — reconnect on page visibility change
  featuredWalletIds: [],
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
