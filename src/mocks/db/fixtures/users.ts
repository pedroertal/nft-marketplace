import { User } from '@/types/entities';

export interface StoredUser extends User {
  passwordHash: string; // Senha padrão para testes: 'password123'
}

export const initialUsers: StoredUser[] = [
  {
    id: 'u1',
    name: 'Pedro Ramos',
    email: 'pedro@nexus.io',
    passwordHash: 'password123',
    role: 'collector',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Colecionador de arte digital futurista e entusiasta de smart contracts no Ethereum.',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'u2',
    name: 'Ana Cyber',
    email: 'ana@nexus.io',
    passwordHash: 'password123',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'Artista 3D pioneira em estética neo-Tokyo e realidade sintetizada.',
    createdAt: '2026-02-20T14:30:00Z',
  },
  {
    id: 'u3',
    name: 'Lucas Satoshi',
    email: 'lucas@nexus.io',
    passwordHash: 'password123',
    role: 'collector',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&h=200&q=80',
    bio: 'HODLer desde 2017 e curador da coleção NeoGenesis.',
    createdAt: '2026-03-05T09:15:00Z',
  },
];
