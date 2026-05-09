import { useQuery } from '@tanstack/react-query';
import { MORALIS_CHAIN_MAP } from '@/config/chains';

const MORALIS_API_KEY = import.meta.env.VITE_MORALIS_API_KEY as string;

interface MoralisApproval {
  chain: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  token_logo: string | null;
  token_decimals: number;
  balance: string;
  approved_address: string;
  approved_spender: string;
  approved_amount: string;
  token_id: string | null;
  token_type: 'ERC20' | 'ERC721' | 'ERC1155';
  block_number: string;
  block_timestamp: string;
}

interface MoralisResponse {
  page: number;
  page_size: number;
  cursor: string | null;
  result: MoralisApproval[];
}

export interface ApprovalEntry extends MoralisApproval {
  chainId: number;
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

async function fetchApprovalsForChain(
  address: string,
  chainId: number,
  apiKey: string
): Promise<MoralisApproval[]> {
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
  return data.result ?? [];
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
            approvals: approvals.map((a) => ({ ...a, chainId })),
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
