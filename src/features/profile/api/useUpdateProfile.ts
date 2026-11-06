import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { queryKeys } from '@/lib/query-keys';
import { UpdateProfilePayload } from '@/types/api';
import { toast } from 'sonner';

export function useUpdateProfile() {
  const { updateProfile } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return await updateProfile(payload);
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      toast.success('Perfil atualizado com sucesso!');
      return updatedUser;
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Falha ao atualizar dados cadastrais.';
      toast.error(msg);
    },
  });
}
