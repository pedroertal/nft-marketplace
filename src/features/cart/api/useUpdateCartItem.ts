import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Cart } from '@/types/entities';
import { toast } from 'sonner';

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nftId,
      quantity,
    }: {
      nftId: string;
      quantity: number;
    }) => {
      const { data } = await apiClient.patch<Cart>(`/cart/items/${nftId}`, {
        quantity,
      });
      return data;
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart.root, updatedCart);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Falha ao atualizar quantidade.';
      toast.error(msg);
    },
  });
}
