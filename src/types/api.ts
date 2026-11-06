import { User, NftCategory } from './entities';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Catálogo / NFTs Query Params
export type NftSortOption =
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'editions_desc'
  | 'title_asc';

export interface NftQueryParams {
  search?: string;
  category?: NftCategory | 'All';
  sort?: NftSortOption;
  page?: number;
  limit?: number;
  minPrice?: string;
  maxPrice?: string;
}

// Autenticação
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'collector' | 'creator';
}

// Favoritos
export interface FavoritesResponse {
  nftIds: string[];
}

export interface ToggleFavoriteResponse {
  favorited: boolean;
  nftId: string;
}

// Carrinho
export interface AddToCartPayload {
  nftId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface QuotePayload {
  items?: Array<{ nftId: string; quantity: number }>;
  couponCode?: string;
}

// Pedidos e Checkout
export interface CreateOrderPayload {
  quoteId: string;
  walletAddress: string;
  network: string;
}

// Perfil e Carteiras
export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  avatar?: string;
}

export interface CreateWalletPayload {
  address: string;
  type: 'PRIMARY' | 'SECONDARY';
  network: string;
}
