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

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
});

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata: {
    name: 'RevokeMyWallet',
    description: 'Revoke token approvals across EVM chains',
    url: 'https://revokemywallet.app',
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
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
