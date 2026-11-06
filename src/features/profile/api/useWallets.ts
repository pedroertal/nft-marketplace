import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Wallet } from '@/types/entities';
import { useAuth } from '@/app/providers/AuthProvider';

export function useWallets() {
  const { isAuthenticated } = useAuth();

  return useQuery<Wallet[]>({
    queryKey: queryKeys.wallets.list,
    queryFn: async () => {
      const { data } = await apiClient.get<Wallet[]>('/wallets');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
}
