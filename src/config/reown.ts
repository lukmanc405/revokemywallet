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

// Create WagmiAdapter (this creates internal wagmi config with WalletConnect + Injected connectors)
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

// Get the config from adapter
export const wagmiConfig = wagmiAdapter.wagmiConfig;

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'RevokeMyWallet',
    description: 'Revoke token approvals across EVM chains',
    url: 'https://lukmanc405.github.io/revokemywallet/',
    icons: ['https://lukmanc405.github.io/revokemywallet/favicon.svg'],
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#7C3AED',
    '--w3m-border-radius-master': '8px',
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
});
