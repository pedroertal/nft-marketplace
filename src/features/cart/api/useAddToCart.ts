import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Cart } from '@/types/entities';
import { toast } from 'sonner';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nftId,
      quantity = 1,
      title,
    }: {
      nftId: string;
      quantity?: number;
      title?: string;
    }) => {
      const { data } = await apiClient.post<Cart>('/cart/items', {
        nftId,
        quantity,
      });
      return { cart: data, title };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.cart.root, data.cart);
      toast.success(
        data.title
          ? `"${data.title}" adicionado ao carrinho!`
          : 'Item adicionado ao carrinho!'
      );
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Falha ao adicionar ao carrinho.';
      toast.error(msg);
    },
  });
}
