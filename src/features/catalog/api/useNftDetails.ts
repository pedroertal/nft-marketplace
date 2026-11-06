import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { NFT } from '@/types/entities';

export function useNftDetails(nftId: string) {
  return useQuery<NFT>({
    queryKey: queryKeys.nfts.detail(nftId),
    queryFn: async () => {
      const { data } = await apiClient.get<NFT>(`/nfts/${nftId}`);
      return data;
    },
    enabled: Boolean(nftId),
    retry: 1,
  });
}
