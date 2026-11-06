import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { Cart } from '@/types/entities';
import { toast } from 'sonner';

export function useAcceptPriceChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nftId, newPrice }: { nftId: string; newPrice: string }) => {
      const currentCart = queryClient.getQueryData<Cart>(queryKeys.cart.root);
      if (!currentCart) return null;

      const updatedItems = currentCart.items.map((item) => {
        if (item.nftId === nftId) {
          return {
            ...item,
            unitPrice: newPrice,
            hasPriceChanged: false,
            newPrice: undefined,
          };
        }
        return item;
      });

      const updatedCart: Cart = {
        ...currentCart,
        items: updatedItems,
        updatedAt: new Date().toISOString(),
      };

      return updatedCart;
    },
    onSuccess: (updatedCart) => {
      if (updatedCart) {
        queryClient.setQueryData(queryKeys.cart.root, updatedCart);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === 'cart' && query.queryKey[1] === 'quote',
        });
        toast.success('Novo preço aceito com sucesso!');
      }
    },
  });
}
