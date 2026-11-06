import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { Wallet } from '@/types/entities';
import { CreateWalletPayload } from '@/types/api';
import { toast } from 'sonner';

export function useAddWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWalletPayload) => {
      // Validação estrita de formato hexadecimal 0x (40 caracteres hex após 0x)
      if (!/^0x[a-fA-F0-9]{40}$/.test(payload.address)) {
        throw new Error('Endereço inválido. Deve ser um hash hexadecimal iniciando em 0x.');
      }

      const { data } = await apiClient.post<Wallet>('/wallets', payload);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallets.list });
      toast.success(
        `Carteira ${data.type === 'PRIMARY' ? 'Principal' : 'Secundária'} conectada com sucesso!`
      );
    },
    onError: (error: any) => {
      const msg = error.message || error.response?.data?.message || 'Falha ao vincular carteira.';
      toast.error(msg);
    },
  });
}
