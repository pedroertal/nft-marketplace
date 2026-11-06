import { http, HttpResponse } from 'msw';
import { db } from '../db/state';
import { AddToCartPayload, UpdateCartItemPayload, QuotePayload } from '@/types/api';

export const cartHandlers = [
  // Obter itens no carrinho
  http.get('/api/cart', () => {
    const cart = db.getCart();
    return HttpResponse.json(cart);
  }),

  // Adicionar item ao carrinho
  http.post('/api/cart/items', async ({ request }) => {
    const body = (await request.json()) as AddToCartPayload;
    const { nftId, quantity = 1 } = body;

    try {
      const cart = db.addToCart(nftId, quantity);
      return HttpResponse.json(cart, { status: 201 });
    } catch (e: any) {
      return HttpResponse.json(
        { code: 'ADD_TO_CART_FAILED', message: e.message || 'Falha ao adicionar item.' },
        { status: 400 }
      );
    }
  }),

  // Atualizar quantidade de um item
  http.patch('/api/cart/items/:nftId', async ({ params, request }) => {
    const { nftId } = params;
    const body = (await request.json()) as UpdateCartItemPayload;
    const { quantity } = body;

    const cart = db.updateCartItem(nftId as string, quantity);
    return HttpResponse.json(cart);
  }),

  // Remover item do carrinho
  http.delete('/api/cart/items/:nftId', ({ params }) => {
    const { nftId } = params;
    const cart = db.removeFromCart(nftId as string);
    return HttpResponse.json(cart);
  }),

  // Cotação estrita com cupons e taxa de rede
  http.post('/api/cart/quote', async ({ request }) => {
    const body = ((await request.json().catch(() => ({}))) || {}) as QuotePayload;
    const { items, couponCode } = body;

    const quote = db.createQuote(items, couponCode);
    return HttpResponse.json(quote);
  }),
];
