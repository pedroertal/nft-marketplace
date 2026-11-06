import { initialUsers, StoredUser } from './fixtures/users';
import { initialNfts } from './fixtures/nfts';
import { initialWallets } from './fixtures/wallets';
import { NFT, Cart, Order, Wallet, Quote } from '@/types/entities';

export interface DbState {
  users: StoredUser[];
  nfts: NFT[];
  cart: Cart;
  orders: Record<string, Order>;
  wallets: Wallet[];
  favorites: Record<string, string[]>; // userId -> nftId[]
  userNfts: Record<string, string[]>; // userId -> nftId[] (NFTs sob custódia/colecionados)
  quotes: Record<string, Quote>;
  idempotencyMap: Record<
    string,
    {
      payloadHash: string;
      response: any;
      statusCode: number;
      timestamp: number;
    }
  >;
}

export function createInitialSeed(): DbState {
  return {
    users: JSON.parse(JSON.stringify(initialUsers)),
    nfts: JSON.parse(JSON.stringify(initialNfts)),
    cart: {
      items: [
        {
          nftId: 'nft-1',
          edition: 1,
          quantity: 1,
          unitPrice: '1.4500',
          title: 'Cyber Samurai #01',
          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
          creatorName: 'Ana Cyber',
          availableEditions: 3,
        },
      ],
      updatedAt: new Date().toISOString(),
    },
    orders: {
      'ord-init-1': {
        orderId: 'ord-init-1',
        quoteId: 'q-demo',
        idempotencyKey: 'init-seed-key',
        status: 'CONFIRMED',
        total: '1.4500',
        walletAddress: '0x71C83649646b97fC9aD91B9d40b99215A4Ec5a72',
        network: 'Ethereum',
        txHash: '0x3a4b9c1d2e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b',
        createdAt: '2026-04-20T10:00:00Z',
        snapshot: {
          items: [
            {
              nftId: 'nft-2',
              edition: 1,
              quantity: 1,
              unitPrice: '0.8500',
              title: 'Neon Odyssey: Genesis',
              image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
              creatorName: 'Studio Pulse',
              availableEditions: 5,
            },
          ],
          quote: {
            quoteId: 'q-demo',
            subtotal: '0.8500',
            discount: '0.0000',
            networkFee: '0.0120',
            total: '0.8620',
            validUntil: '2026-04-20T10:15:00Z',
            expiresIn: 900,
            itemsSnapshot: [],
          },
        },
      },
    },
    wallets: JSON.parse(JSON.stringify(initialWallets)),
    favorites: {
      u1: ['nft-1', 'nft-4'],
    },
    userNfts: {
      u1: ['nft-2'],
      u2: ['nft-1'],
      u3: [],
    },
    quotes: {},
    idempotencyMap: {},
  };
}
