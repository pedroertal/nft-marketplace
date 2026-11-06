import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Quote, CartItem } from '@/types/entities';

export function useQuote(items: CartItem[] = [], couponCode?: string) {
  // Hash estável dos itens e quantidades para chave de cache
  const itemsHash = React.useMemo(() => {
    return items
      .map((i) => `${i.nftId}:${i.quantity}:${i.unitPrice}`)
      .sort()
      .join('|');
  }, [items]);

  return useQuery<Quote>({
    queryKey: queryKeys.cart.quote(itemsHash, couponCode),
    queryFn: async () => {
      const payload = {
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        couponCode: couponCode || undefined,
      };
      const { data } = await apiClient.post<Quote>('/cart/quote', payload);
      return data;
    },
    enabled: items.length > 0,
    staleTime: 1000 * 60, // 1 minuto
  });
}
