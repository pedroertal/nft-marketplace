import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor de requisição: injeta o JWT persistido no localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("nft_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Fallback inteligente para ambiente estático (Vercel) caso o MSW falhe ao interceptar
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string; message?: string }>) => {
    const config = error.config;

    // Se o erro for 404, 405 ou falha de rede e estivermos a chamar rotas locais (/api/...)
    if (
      config &&
      config.url &&
      (error.response?.status === 405 ||
        error.response?.status === 404 ||
        !error.response) &&
      config.url.startsWith("/api")
    ) {
      console.warn(
        "[API Fallback] Interceptando rota local devido a falha no servidor/MSW:",
        config.url,
      );

      // --- MOCK DE LOGIN (/api/auth/login ou similar) ---
      if (
        config.url.includes("/auth/login") &&
        config.method?.toLowerCase() === "post"
      ) {
        const body = config.data ? JSON.parse(config.data) : {};
        const email = body.email || "pedro@nexus.io";

        const mockUser = {
          id: "user-1",
          name: "Pedro (Demo)",
          email: email,
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          balance: 15.5,
        };
        const mockToken = "mock-jwt-token-production-vercel";

        if (typeof window !== "undefined") {
          localStorage.setItem("nft_token", mockToken);
          localStorage.setItem("nft_user", JSON.stringify(mockUser));
        }

        return {
          data: {
            user: mockUser,
            token: mockToken,
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        } as AxiosResponse;
      }

      // --- MOCK DE CATÁLOGO / NFTS (/api/nfts) ---
      if (
        config.url.includes("/nfts") &&
        config.method?.toLowerCase() === "get"
      ) {
        const storedNfts =
          typeof window !== "undefined"
            ? localStorage.getItem("nft_catalog")
            : null;
        const defaultNfts = [
          {
            id: "nft-1",
            title: "Cyber Samurai #01",
            price: 2.5,
            image:
              "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            creator: {
              name: "Nexus Art",
              avatar:
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            },
            category: "Cyberpunk",
            likes: 142,
          },
          {
            id: "nft-2",
            title: "Cyber Geisha #88",
            price: 3.1,
            image:
              "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80",
            creator: {
              name: "Neo Tokyo",
              avatar:
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
            },
            category: "Cyberpunk",
            likes: 89,
          },
        ];

        const nfts = storedNfts ? JSON.parse(storedNfts) : defaultNfts;

        return {
          data: { nfts },
          status: 200,
          statusText: "OK",
          headers: {},
          config,
        } as AxiosResponse;
      }
    }

    // Tratamento padrão de 401
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("nft_token");
        localStorage.removeItem("nft_user");
      }
    }

    return Promise.reject(error);
  },
);
