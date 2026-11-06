import { Wallet } from '@/types/entities';

export const initialWallets: Wallet[] = [
  {
    id: 'w1',
    address: '0x71C83649646b97fC9aD91B9d40b99215A4Ec5a72',
    type: 'PRIMARY',
    network: 'Ethereum',
    balance: '4.8500',
    isDefault: true,
    createdAt: '2026-01-15T10:05:00Z',
  },
  {
    id: 'w2',
    address: '0x324D62C4E9C0A9B0Bfcf5E32a3fA7cDFcfE77431',
    type: 'SECONDARY',
    network: 'Polygon',
    balance: '12.4000',
    isDefault: false,
    createdAt: '2026-02-10T15:20:00Z',
  },
];
