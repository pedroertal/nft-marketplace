import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { NFT } from '@/types/entities';
import { useAuth } from '@/app/providers/AuthProvider';

export function useMyNfts() {
  const { isAuthenticated } = useAuth();

  return useQuery<NFT[]>({
    queryKey: queryKeys.profile.myNfts,
    queryFn: async () => {
      const { data } = await apiClient.get<NFT[]>('/profile/nfts');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30, // 30 segundos de frescor
  });
}
