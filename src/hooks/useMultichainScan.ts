import { useQuery } from '@tanstack/react-query';
import { MORALIS_CHAIN_MAP } from '@/config/chains';

const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY as string;

// Actual Moralis API response format (nested objects)
interface MoralisToken {
  address: string;
  address_label: string | null;
  name: string;
  symbol: string;
  logo: string | null;
  possible_spam: boolean;
  verified_contract: boolean;
  current_balance: string | null;
  current_balance_formatted: string | null;
  usd_price: string | null;
  usd_at_risk: string | null;
}

interface MoralisSpender {
  address: string;
  address_label?: string | null;
}

interface MoralisApproval {
  block_number: string;
  block_timestamp: string;
  transaction_hash: string;
  value: string;
  value_formatted: string;
  token: MoralisToken;
  spender: MoralisSpender;
  token_id?: string | null;
  token_type?: string;
}

interface MoralisResponse {
  limit: number;
  page_size: number;
  cursor: string | null;
  result: MoralisApproval[];
}

export interface ApprovalEntry {
  chainId: number;
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo: string | null;
  token_type: 'ERC20' | 'ERC721' | 'ERC1155';
  possible_spam: boolean;
  approved_address: string;
  approved_amount: string;
  token_id: string | null;
  block_number: string;
  block_timestamp: string;
  transaction_hash: string;
}

interface ChainScanResult {
  status: 'fulfilled' | 'rejected';
  chainId: number;
  approvals: ApprovalEntry[];
  error?: string;
}

export interface MultichainScanResult {
  approvalsByChain: Record<number, ApprovalEntry[]>;
  allApprovals: ApprovalEntry[];
  chainResults: ChainScanResult[];
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => Promise<{ data?: ChainScanResult[] }>;
}

// Detect token type from the approval value pattern
function detectTokenType(approval: MoralisApproval): 'ERC20' | 'ERC721' | 'ERC1155' {
  // If token_id is present, it's likely ERC721 or ERC1155
  if (approval.token_id) {
    return 'ERC1155'; // Most NFT approvals with token_id are ERC1155
  }
  // Large numeric value = ERC20 approval amount
  return 'ERC20';
}

// Convert Moralis response to our flat format
function moralisToApprovalEntry(approval: MoralisApproval, chainId: number): ApprovalEntry {
  return {
    chainId,
    token_address: approval.token.address,
    token_name: approval.token.name,
    token_symbol: approval.token.symbol,
    token_logo: approval.token.logo,
    token_type: approval.token_type as 'ERC20' | 'ERC721' | 'ERC1155' || detectTokenType(approval),
    possible_spam: approval.token.possible_spam,
    approved_address: approval.spender.address,
    approved_amount: approval.value,
    token_id: approval.token_id ?? null,
    block_number: approval.block_number,
    block_timestamp: approval.block_timestamp,
    transaction_hash: approval.transaction_hash,
  };
}

async function fetchApprovalsForChain(
  address: string,
  chainId: number,
  apiKey: string
): Promise<ApprovalEntry[]> {
  const moralisChain = MORALIS_CHAIN_MAP[chainId];
  if (!moralisChain) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }

  const url = `https://deep-index.moralis.io/api/v2.2/wallets/${address}/approvals?chain=${moralisChain}`;

  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Moralis API error (${response.status}) for chain ${moralisChain}: ${errorBody}`
    );
  }

  const data: MoralisResponse = await response.json();
  return (data.result ?? []).map((a) => moralisToApprovalEntry(a, chainId));
}

export function useMultichainScan(
  address: string | undefined,
  chainIds: number[],
  moralisApiKey?: string
): MultichainScanResult {
  const apiKey = moralisApiKey ?? MORALIS_API_KEY;

  const {
    data: chainResults = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['multichain-scan', address, chainIds.sort().join(',')],
    queryFn: async (): Promise<ChainScanResult[]> => {
      if (!address || !apiKey) return [];

      const settled = await Promise.allSettled(
        chainIds.map(async (chainId): Promise<ChainScanResult> => {
          const approvals = await fetchApprovalsForChain(
            address,
            chainId,
            apiKey
          );
          return {
            status: 'fulfilled',
            chainId,
            approvals,
          };
        })
      );

      return settled.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return {
          status: 'rejected' as const,
          chainId: chainIds[index],
          approvals: [],
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        };
      });
    },
    enabled: !!address && chainIds.length > 0 && !!apiKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  // Group approvals by chain
  const approvalsByChain: Record<number, ApprovalEntry[]> = {};
  const allApprovals: ApprovalEntry[] = [];

  for (const result of chainResults) {
    approvalsByChain[result.chainId] = result.approvals;
    allApprovals.push(...result.approvals);
  }

  return {
    approvalsByChain,
    allApprovals,
    chainResults,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch,
  };
}
