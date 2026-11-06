import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Cart } from '@/types/entities';
import { toast } from 'sonner';

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nftId: string) => {
      const { data } = await apiClient.delete<Cart>(`/cart/items/${nftId}`);
      return data;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart.root, updatedCart);
      toast.info('Item removido do carrinho.');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Falha ao remover item do carrinho.';
      toast.error(msg);
    },
  });
}
