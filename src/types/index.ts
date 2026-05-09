export interface Approval {
  chainId: number;
  chainName: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenType: 'ERC20' | 'ERC721' | 'ERC1155';
  spender: string;
  spenderLabel?: string;
  amount: string;
  isUnlimited: boolean;
  possibleSpam: boolean;
  tokenId?: string;
  blockNumber?: number;
}

export interface RevokeHistoryItem {
  txHash: string;
  chainId: number;
  chainName: string;
  tokenSymbol: string;
  tokenAddress: string;
  spender: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  explorerUrl: string;
}

export interface ChainInfo {
  id: number;
  name: string;
  emoji: string;
  explorerUrl: string;
  explorerApiUrl?: string;
  nativeCurrency: string;
}

export const SUPPORTED_CHAINS: ChainInfo[] = [
  { id: 1, name: 'Ethereum', emoji: '⟠', explorerUrl: 'https://etherscan.io', nativeCurrency: 'ETH' },
  { id: 56, name: 'BSC', emoji: '⬢', explorerUrl: 'https://bscscan.com', nativeCurrency: 'BNB' },
  { id: 137, name: 'Polygon', emoji: '🟣', explorerUrl: 'https://polygonscan.com', nativeCurrency: 'MATIC' },
  { id: 42161, name: 'Arbitrum', emoji: '🔵', explorerUrl: 'https://arbiscan.io', nativeCurrency: 'ETH' },
  { id: 10, name: 'Optimism', emoji: '🔴', explorerUrl: 'https://optimistic.etherscan.io', nativeCurrency: 'ETH' },
  { id: 8453, name: 'Base', emoji: '🔷', explorerUrl: 'https://basescan.org', nativeCurrency: 'ETH' },
  { id: 43114, name: 'Avalanche', emoji: '🔺', explorerUrl: 'https://snowtrace.io', nativeCurrency: 'AVAX' },
  { id: 250, name: 'Fantom', emoji: '👻', explorerUrl: 'https://ftmscan.com', nativeCurrency: 'FTM' },
];

export function getApprovalKey(chainId: number, tokenAddress: string, spender: string): string {
  return `${chainId}-${tokenAddress.toLowerCase()}-${spender.toLowerCase()}`;
}

export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getExplorerTxUrl(explorerUrl: string, txHash: string): string {
  return `${explorerUrl}/tx/${txHash}`;
}
