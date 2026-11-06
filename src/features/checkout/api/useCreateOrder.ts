import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { clearIdempotencyKey } from '../utils/idempotency';
import { toast } from 'sonner';

interface CreateOrderParams {
  quoteId: string;
  walletAddress: string;
  network: string;
  idempotencyKey: string;
}

interface OrderResponse {
  orderId: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  idempotencyKey: string;
  total: string;
  txHash: string;
  createdAt: string;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quoteId,
      walletAddress,
      network,
      idempotencyKey,
    }: CreateOrderParams): Promise<OrderResponse> => {
      const { data } = await apiClient.post<OrderResponse>(
        '/orders',
        {
          quoteId,
          walletAddress,
          network,
        },
        {
          headers: {
            'Idempotency-Key': idempotencyKey,
          },
        }
      );
      return data;
    },
    onSuccess: (order) => {
      clearIdempotencyKey();
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.myNfts });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.list });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(order.orderId) });
      toast.success('Pedido finalizado com sucesso!');
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        'Não foi possível concluir seu pedido na blockchain. Tente novamente.';
      toast.error(msg);
    },
  });
}
