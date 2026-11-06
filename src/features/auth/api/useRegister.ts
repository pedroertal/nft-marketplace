import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/app/providers/AuthProvider';
import { RegisterPayload } from '@/types/api';
import { toast } from 'sonner';

export function useRegister() {
  const { register } = useAuth();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      return await register(payload);
    },
    onSuccess: (data) => {
      toast.success(`Conta criada com sucesso! Bem-vindo, ${data.user.name}.`);
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message ||
        'Não foi possível criar sua conta. Tente novamente.';
      toast.error(msg);
    },
  });
}
