import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socketClient } from '@/lib/socket-client';
import { queryKeys } from '@/lib/query-keys';
import { SocketEventEnvelope, NftUpdatedData } from '@/types/events';
import { NFT, Cart } from '@/types/entities';
import { formatEth } from '@/lib/utils';
import { toast } from 'sonner';

export function useCartReconciliation() {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    // Handler para eventos 'nft.updated'
    const handleNftUpdated = (envelope: SocketEventEnvelope<NftUpdatedData>) => {
      const { entityId, version, data } = envelope;

      // 1. Validação de versão estrita (ignora eventos out-of-order)
      const cachedNft = queryClient.getQueryData<NFT>(queryKeys.nfts.detail(entityId));
      if (cachedNft && version <= cachedNft.version) {
        console.warn(`[Socket Reconciliation] Evento obsoleto descartado para NFT ${entityId} (v${version} <= v${cachedNft.version})`);
        return;
      }

      // 2. Atualiza detalhe do NFT no cache do TanStack Query
      if (cachedNft) {
        queryClient.setQueryData<NFT>(queryKeys.nfts.detail(entityId), {
          ...cachedNft,
          price: data.price,
          availableEditions: data.availableEditions,
          status: data.status,
          version,
        });
      }

      // Invalida a listagem do catálogo para sincronizar preços e estoques em tela
      queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all });

      // 3. Verifica se o NFT está no carrinho atual do usuário
      const currentCart = queryClient.getQueryData<Cart>(queryKeys.cart.root);
      if (currentCart && currentCart.items.some((i) => i.nftId === entityId)) {
        const targetItem = currentCart.items.find((i) => i.nftId === entityId)!;

        // Se o preço for diferente do unitPrice gravado no carrinho
        if (targetItem.unitPrice !== data.price) {
          const updatedCart: Cart = {
            ...currentCart,
            items: currentCart.items.map((item) => {
              if (item.nftId === entityId) {
                return {
                  ...item,
                  hasPriceChanged: true,
                  newPrice: data.price,
                };
              }
              return item;
            }),
            updatedAt: new Date().toISOString(),
          };

          // Grava o carrinho reconciliado com a flag hasPriceChanged
          queryClient.setQueryData(queryKeys.cart.root, updatedCart);

          // Invalida a cotação existente forçando recálculo sem sobrescrever o carrinho reconciliado
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === 'cart' && query.queryKey[1] === 'quote',
          });

          // Emite Toast Sonner de alerta ao colecionador
          toast.warning(
            `Alteração de preço em "${targetItem.title}": de ${formatEth(targetItem.unitPrice)} para ${formatEth(data.price)} ETH.`,
            {
              duration: 8000,
            }
          );
        }

        // Se o item esgotou em tempo real
        if (data.status === 'SOLD_OUT' || data.availableEditions === 0) {
          toast.error(
            `Atenção: "${targetItem.title}" acabou de esgotar na blockchain!`,
            { duration: 8000 }
          );
        }
      }
    };

    // Handler de Reconexão Resiliente: invalida caches para buscar o estado canônico do backend
    const handleReconnect = () => {
      console.info('[Socket Reconciliation] Socket reconectado. Sincronizando caches com REST...');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
      queryClient.invalidateQueries({ queryKey: queryKeys.nfts.all });
    };

    socketClient.on('nft.updated', handleNftUpdated);
    socketClient.on('reconnect', handleReconnect);

    return () => {
      socketClient.off('nft.updated', handleNftUpdated);
      socketClient.off('reconnect', handleReconnect);
    };
  }, [queryClient]);
}
