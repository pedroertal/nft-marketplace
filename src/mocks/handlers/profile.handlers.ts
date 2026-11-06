import { http, HttpResponse } from 'msw';
import { db } from '../db/state';
import { UpdateProfilePayload, CreateWalletPayload } from '@/types/api';

export const profileHandlers = [
  // Dados cadastrais do perfil do usuário autenticado
  http.get('/api/profile', ({ request }) => {
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    const user = db.findUserById(userId) || db.getUsers()[0];
    const { passwordHash: _, ...safeUser } = user;
    const ownedNftIds = db.getUserNftIds(userId);

    return HttpResponse.json({
      ...safeUser,
      ownedNftIds,
    });
  }),

  // Listagem de colecionáveis / NFTs sob custódia do usuário autenticado
  http.get('/api/profile/nfts', ({ request }) => {
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    const nfts = db.getUserNfts(userId);
    return HttpResponse.json(nfts);
  }),

  // Atualização cadastral
  http.patch('/api/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    const body = (await request.json()) as UpdateProfilePayload;
    const updated = db.updateUser(userId, body);

    if (!updated) {
      return HttpResponse.json(
        { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' },
        { status: 404 }
      );
    }

    return HttpResponse.json(updated);
  }),

  // Listagem de carteiras associadas
  http.get('/api/wallets', () => {
    const wallets = db.getWallets();
    return HttpResponse.json(wallets);
  }),

  // Registro de nova carteira
  http.post('/api/wallets', async ({ request }) => {
    const body = (await request.json()) as CreateWalletPayload;
    const { address, type, network } = body;

    // Validação básica de formato hexadecimal de carteira (0x...)
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return HttpResponse.json(
        {
          code: 'INVALID_WALLET_ADDRESS',
          message: 'Endereço de carteira inválido. Deve ser um hash hexadecimal iniciando em 0x.',
        },
        { status: 400 }
      );
    }

    const newWallet = db.addWallet({
      address,
      type: type || 'SECONDARY',
      network: network || 'Ethereum',
    });

    return HttpResponse.json(newWallet, { status: 201 });
  }),
];
