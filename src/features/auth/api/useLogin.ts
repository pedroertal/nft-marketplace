import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/app/providers/AuthProvider';
import { LoginPayload, AuthResponse } from '@/types/api';
import { toast } from 'sonner';

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (credentials: LoginPayload) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success(`Bem-vindo de volta, ${data.user.name}!`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || 'Falha ao realizar login.';
      toast.error(msg);
    },
  });
}
