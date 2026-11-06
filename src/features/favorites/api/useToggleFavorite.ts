import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { ToggleFavoriteResponse } from '@/types/api';
import { toast } from 'sonner';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      nftId,
      isCurrentlyFavorited,
    }: {
      nftId: string;
      isCurrentlyFavorited: boolean;
    }) => {
      if (isCurrentlyFavorited) {
        const { data } = await apiClient.delete<ToggleFavoriteResponse>(
          `/favorites/${nftId}`
        );
        return data;
      } else {
        const { data } = await apiClient.post<ToggleFavoriteResponse>(
          `/favorites/${nftId}`
        );
        return data;
      }
    },

    // Mutação Otimista: atualiza imediatamente a interface antes da resposta do servidor
    onMutate: async ({ nftId, isCurrentlyFavorited }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.favorites.list });

      const previousFavorites = queryClient.getQueryData<{ nftIds: string[] }>(
        queryKeys.favorites.list
      );

      const currentIds = previousFavorites?.nftIds || [];
      const updatedIds = isCurrentlyFavorited
        ? currentIds.filter((id) => id !== nftId)
        : [...currentIds, nftId];

      queryClient.setQueryData(queryKeys.favorites.list, {
        nftIds: updatedIds,
      });

      return { previousFavorites };
    },

    // Em caso de falha de rede ou 500, desfaz a alteração restaurando o snapshot anterior
    onError: (_err, _variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(
          queryKeys.favorites.list,
          context.previousFavorites
        );
      }
      toast.error('Erro ao atualizar favoritos. Estado restaurado.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.list });
    },
  });
}
