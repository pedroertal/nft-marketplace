import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Order } from '@/types/entities';
import { useAuth } from '@/app/providers/AuthProvider';

export function useOrders() {
  const { isAuthenticated } = useAuth();

  return useQuery<Order[]>({
    queryKey: queryKeys.orders.list,
    queryFn: async () => {
      const { data } = await apiClient.get<Order[]>('/orders');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });
}
