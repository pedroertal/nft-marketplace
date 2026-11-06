import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Order } from '@/types/entities';

export function useOrderReceipt(orderId: string) {
  return useQuery<Order>({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: async () => {
      const { data } = await apiClient.get<Order>(`/orders/${orderId}`);
      return data;
    },
    enabled: Boolean(orderId),
    staleTime: Infinity, // Snapshot imutável, nunca fica stale!
  });
}
