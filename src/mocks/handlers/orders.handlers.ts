import { http, HttpResponse } from 'msw';
import { db } from '../db/state';
import { CreateOrderPayload } from '@/types/api';

export const ordersHandlers = [
  // Criar pedido com verificação estrita de Idempotency-Key
  http.post('/api/orders', async ({ request }) => {
    const idempotencyKey =
      request.headers.get('Idempotency-Key') ||
      request.headers.get('idempotency-key');

    const body = (await request.json()) as CreateOrderPayload;
    const { quoteId, walletAddress, network } = body;

    // Se houver Idempotency-Key, valida no repositório de idempotência
    if (idempotencyKey) {
      const check = db.checkIdempotency(idempotencyKey, body);

      if (check.conflict) {
        return HttpResponse.json(
          {
            code: 'IDEMPOTENCY_CONFLICT',
            message:
              'A requisição com esta Idempotency-Key já foi processada com um payload diferente.',
          },
          { status: 409 }
        );
      }

      if (check.cached && check.response) {
        // Retorna a resposta original em cache (sem duplicar débito ou pedido)
        return HttpResponse.json(check.response, {
          status: check.statusCode || 200,
        });
      }
    }

    // Identifica o usuário comprador via token Bearer (ou fallback para u1)
    const authHeader = request.headers.get('Authorization') || '';
    const userId = authHeader.includes('u2') ? 'u2' : 'u1';

    // Criação do novo pedido
    const finalKey = idempotencyKey || `auto-${Date.now()}`;
    const order = db.createOrder({
      quoteId,
      walletAddress: walletAddress || '0x71C83649646b97fC9aD91B9d40b99215A4Ec5a72',
      network: network || 'Ethereum',
      idempotencyKey: finalKey,
      userId,
    });

    const responsePayload = {
      orderId: order.orderId,
      status: order.status,
      idempotencyKey: order.idempotencyKey,
      total: order.total,
      txHash: order.txHash,
      createdAt: order.createdAt,
    };

    if (idempotencyKey) {
      db.recordIdempotency(idempotencyKey, body, responsePayload, 201);
    }

    return HttpResponse.json(responsePayload, { status: 201 });
  }),

  // Consulta de recibo imutável do pedido
  http.get('/api/orders/:id', ({ params }) => {
    const { id } = params;
    const order = db.getOrder(id as string);

    if (!order) {
      return HttpResponse.json(
        {
          code: 'ORDER_NOT_FOUND',
          message: `Pedido com id ${id} não foi encontrado.`,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json(order);
  }),

  // Listagem de histórico de pedidos
  http.get('/api/orders', () => {
    const orders = db.getOrders();
    return HttpResponse.json(orders);
  }),
];
