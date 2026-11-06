export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  nfts: {
    all: ['nfts'] as const,
    list: (filters: Record<string, unknown>) => ['nfts', 'list', filters] as const,
    detail: (id: string) => ['nfts', 'detail', id] as const,
  },
  cart: {
    root: ['cart'] as const,
    quote: (itemsHash: string, coupon?: string) => ['cart', 'quote', itemsHash, coupon] as const,
  },
  orders: {
    list: ['orders', 'list'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  favorites: {
    list: ['favorites'] as const,
  },
  wallets: {
    list: ['wallets'] as const,
  },
  profile: {
    root: ['profile'] as const,
    myNfts: ['profile', 'nfts'] as const,
  },
};
