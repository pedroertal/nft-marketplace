import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { queryKeys } from '@/lib/query-keys';
import { User } from '@/types/entities';
import { useAuth } from '@/app/providers/AuthProvider';

export function useMe() {
  const { isAuthenticated } = useAuth();

  return useQuery<{ user: User }>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const { data } = await apiClient.get<{ user: User }>('/auth/me');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });
}
