export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'collector' | 'creator' | 'admin';
  createdAt?: string;
}

export interface NftAttribute {
  trait_type: string;
  value: string | number;
}

export type NftCategory =
  | 'Cyberpunk'
  | 'Collectibles'
  | 'Digital Art'
  | 'Virtual Worlds'
  | 'Photography'
  | 'Music';

export type NftStatus = 'ACTIVE' | 'SOLD_OUT' | 'PAUSED';

export interface NFT {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string; // Preço canônico em ETH como string decimal ex: "1.450"
  category: NftCategory;
  creator: {
    name: string;
    address: string;
    avatar: string;
  };
  owner?: {
    name: string;
    address: string;
  };
  availableEditions: number;
  totalEditions: number;
  version: number; // Versão incremental para controle de concorrência e Socket.IO
  status: NftStatus;
  attributes: NftAttribute[];
  contractAddress: string;
  tokenId: string;
  network: 'Ethereum' | 'Polygon' | 'Arbitrum';
  createdAt: string;
}

export interface CartItem {
  nftId: string;
  edition: number;
  quantity: number;
  unitPrice: string; // Valor em ETH no momento da inserção
  title: string;
  image: string;
  creatorName: string;
  availableEditions: number;
  hasPriceChanged?: boolean; // Flag de reconciliação via Socket.IO
  newPrice?: string; // Preço atualizado caso tenha ocorrido surge/queda
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}

export interface Quote {
  quoteId: string;
  subtotal: string; // Soma dos unitPrice * quantity
  discount: string; // Valor deduzido por cupom
  couponCode?: string;
  networkFee: string; // Taxa de Gas calculada
  total: string; // subtotal - discount + networkFee
  validUntil: string;
  expiresIn: number; // Segundos restantes de validade
  itemsSnapshot: CartItem[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

export interface Order {
  orderId: string;
  quoteId: string;
  idempotencyKey: string;
  status: OrderStatus;
  total: string;
  walletAddress: string;
  network: string;
  txHash?: string;
  failureReason?: string;
  createdAt: string;
  snapshot: {
    items: CartItem[];
    quote: Quote;
  };
}

export type WalletType = 'PRIMARY' | 'SECONDARY';

export interface Wallet {
  id: string;
  address: string;
  type: WalletType;
  network: string;
  balance?: string; // Saldo simulado em ETH
  isDefault?: boolean;
  createdAt: string;
}

export interface Transaction {
  txHash: string;
  orderId: string;
  from: string;
  to: string;
  amount: string;
  network: string;
  status: 'SUCCESS' | 'FAILED';
  blockNumber: number;
  timestamp: string;
}
