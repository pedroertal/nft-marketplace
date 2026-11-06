import * as React from 'react';
import { User } from '@/types/entities';
import { RegisterPayload, AuthResponse } from '@/types/api';
import { apiClient } from '@/lib/api-client';
import { queryClient } from './QueryProvider';
import { queryKeys } from '@/lib/query-keys';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  register: (payload: RegisterPayload) => Promise<AuthResponse>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<User>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('nft_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = React.useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('nft_token');
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  // Inicialização e hidratação da sessão via GET /api/auth/me
  React.useEffect(() => {
    async function hydrateSession() {
      const storedToken = localStorage.getItem('nft_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.get<{ user: User }>('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        if (data?.user) {
          setUser(data.user);
          setToken(storedToken);
          localStorage.setItem('nft_user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.warn('[AuthProvider] Sessão inválida ou expirada, limpando token:', err);
        localStorage.removeItem('nft_token');
        localStorage.removeItem('nft_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateSession();
  }, []);

  const login = React.useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('nft_token', newToken);
    localStorage.setItem('nft_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
    queryClient.setQueryData(queryKeys.auth.me, { user: newUser });
  }, []);

  const logout = React.useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nft_token');
    localStorage.removeItem('nft_user');
    // Limpa o cache para evitar vazamento de dados entre sessões
    queryClient.clear();
  }, []);

  const register = React.useCallback(
    async (payload: RegisterPayload): Promise<AuthResponse> => {
      const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
      login(data.token, data.user);
      return data;
    },
    [login]
  );

  const updateProfile = React.useCallback(
    async (updates: Partial<User>): Promise<User> => {
      const { data } = await apiClient.patch<User>('/profile', updates);
      setUser(data);
      localStorage.setItem('nft_user', JSON.stringify(data));
      queryClient.setQueryData(queryKeys.auth.me, { user: data });
      return data;
    },
    []
  );

  const value = React.useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, token, isLoading, login, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
