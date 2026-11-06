import { http, HttpResponse } from 'msw';
import { db } from '../db/state';
import { NftCategory } from '@/types/entities';
import { NftSortOption } from '@/types/api';

export const nftsHandlers = [
  // Listagem do catálogo com filtros e paginação
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || undefined;
    const category = (url.searchParams.get('category') as NftCategory) || undefined;
    const sort = (url.searchParams.get('sort') as NftSortOption) || 'newest';
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '8', 10);
    const minPrice = url.searchParams.get('minPrice') || undefined;
    const maxPrice = url.searchParams.get('maxPrice') || undefined;

    const result = db.getNfts({
      search,
      category,
      sort,
      page,
      limit,
      minPrice,
      maxPrice,
    });

    return HttpResponse.json(result);
  }),

  // Detalhe de um NFT específico por ID
  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params;
    const nft = db.getNftById(id as string);

    if (!nft) {
      return HttpResponse.json(
        {
          code: 'NFT_NOT_FOUND',
          message: `NFT com id ${id} não foi encontrado no catálogo.`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(nft);
  }),

  // Obter favoritos do usuário
  http.get('/api/favorites', ({ request }) => {
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';
    const nftIds = db.getFavorites(userId);

    return HttpResponse.json({ nftIds });
  }),

  // Alternar/adicionar aos favoritos
  http.post('/api/favorites/:id', ({ params, request }) => {
    const { id } = params;
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    const favorited = db.toggleFavorite(userId, id as string);
    return HttpResponse.json({ favorited, nftId: id });
  }),

  // Remover dos favoritos
  http.delete('/api/favorites/:id', ({ params, request }) => {
    const { id } = params;
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    // Se estiver favoritado, remove
    const current = db.getFavorites(userId);
    if (current.includes(id as string)) {
      db.toggleFavorite(userId, id as string);
    }

    return HttpResponse.json({ favorited: false, nftId: id });
  }),
];
