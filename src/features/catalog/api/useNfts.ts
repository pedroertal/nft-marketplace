import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { NFT } from '@/types/entities';
import { NftQueryParams, PaginatedResponse } from '@/types/api';

export function useNfts(params: NftQueryParams = {}) {
  return useQuery<PaginatedResponse<NFT>>({
    queryKey: queryKeys.nfts.list(params as Record<string, unknown>),
    queryFn: async () => {
      const { data } = await apiClient.get<PaginatedResponse<NFT>>('/nfts', {
        params,
      });
      return data;
    },
    staleTime: 1000 * 60, // 1 minuto
  });
}
