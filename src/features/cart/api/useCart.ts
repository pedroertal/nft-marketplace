import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Cart } from '@/types/entities';

export function useCart() {
  return useQuery<Cart>({
    queryKey: queryKeys.cart.root,
    queryFn: async () => {
      const { data } = await apiClient.get<Cart>('/cart');
      return data;
    },
    staleTime: 1000 * 30, // 30 segundos
  });
}
