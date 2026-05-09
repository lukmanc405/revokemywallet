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
import type { Chain } from 'viem';

export interface SupportedChain extends Chain {
  icon: string;
}

export const ethereum: SupportedChain = {
  ...mainnet,
  icon: '⟠',
};

export const baseChain: SupportedChain = {
  ...base,
  icon: '🔵',
};

export const arbitrumChain: SupportedChain = {
  ...arbitrum,
  icon: '🔷',
};

export const optimismChain: SupportedChain = {
  ...optimism,
  icon: '🔴',
};

export const polygonChain: SupportedChain = {
  ...polygon,
  icon: '🟣',
};

export const bscChain: SupportedChain = {
  ...bsc,
  icon: '🟡',
};

export const avalancheChain: SupportedChain = {
  ...avalanche,
  icon: '🔺',
};

export const zkSyncChain: SupportedChain = {
  ...zkSync,
  icon: '⚡',
};

export const SUPPORTED_CHAINS: SupportedChain[] = [
  ethereum,
  baseChain,
  arbitrumChain,
  optimismChain,
  polygonChain,
  bscChain,
  avalancheChain,
  zkSyncChain,
];

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((c) => c.id);

export const getChainById = (id: number): SupportedChain | undefined =>
  SUPPORTED_CHAINS.find((c) => c.id === id);

export const MORALIS_CHAIN_MAP: Record<number, string> = {
  1: 'eth',
  8453: 'base',
  42161: 'arbitrum',
  10: 'optimism',
  137: 'polygon',
  56: 'bsc',
  43114: 'avalanche',
  324: 'zksync',
};
