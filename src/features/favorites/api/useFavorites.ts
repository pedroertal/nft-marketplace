import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { useAuth } from '@/app/providers/AuthProvider';

export function useFavorites() {
  const { isAuthenticated } = useAuth();

  return useQuery<{ nftIds: string[] }>({
    queryKey: queryKeys.favorites.list,
    queryFn: async () => {
      const { data } = await apiClient.get<{ nftIds: string[] }>('/favorites');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}
