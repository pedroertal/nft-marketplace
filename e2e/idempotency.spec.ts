import { test, expect } from '@playwright/test';

test.describe('Garantia de Idempotência em Pedidos (POST /api/orders)', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a aplicação e aguarda o Service Worker do MSW estar ativo
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    await page.evaluate(async () => {
      await fetch('/api/__test/reset', { method: 'POST' });
    });
  });

  test('deve retornar a resposta original em cache para a mesma Idempotency-Key e mesmo payload', async ({
    page,
  }) => {
    const testIdempotencyKey = 'test-idemp-uuid-4242-9999';
    const payload = {
      quoteId: 'q-demo',
      walletAddress: '0x71C83649646b97fC9aD91B9d40b99215A4Ec5a72',
      network: 'Ethereum',
    };

    // Primeira requisição: cria o pedido através do fetch interceptado pelo MSW
    const order1 = await page.evaluate(
      async ({ key, data }) => {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key,
          },
          body: JSON.stringify(data),
        });
        return { status: res.status, json: await res.json() };
      },
      { key: testIdempotencyKey, data: payload }
    );

    expect(order1.status).toBe(201);
    expect(order1.json.orderId).toBeDefined();
    expect(order1.json.idempotencyKey).toBe(testIdempotencyKey);

    // Segunda requisição (idêntica com a mesma Idempotency-Key)
    const order2 = await page.evaluate(
      async ({ key, data }) => {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key,
          },
          body: JSON.stringify(data),
        });
        return { status: res.status, json: await res.json() };
      },
      { key: testIdempotencyKey, data: payload }
    );

    // Deve retornar 200/201 com exatamente a mesma ordem gravada
    expect([200, 201]).toContain(order2.status);
    expect(order2.json.orderId).toBe(order1.json.orderId);
    expect(order2.json.txHash).toBe(order1.json.txHash);
  });

  test('deve retornar 409 Conflict se a mesma Idempotency-Key for reutilizada com payload divergente', async ({
    page,
  }) => {
    const testIdempotencyKey = 'conflict-key-uuid-1111';

    // Primeira requisição com carteira A
    const res1 = await page.evaluate(
      async ({ key }) => {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key,
          },
          body: JSON.stringify({
            quoteId: 'q-demo',
            walletAddress: '0x71C83649646b97fC9aD91B9d40b99215A4Ec5a72',
            network: 'Ethereum',
          }),
        });
        return res.status;
      },
      { key: testIdempotencyKey }
    );
    expect(res1).toBe(201);

    // Segunda requisição com carteira B divergente
    const res2 = await page.evaluate(
      async ({ key }) => {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Idempotency-Key': key,
          },
          body: JSON.stringify({
            quoteId: 'q-demo',
            walletAddress: '0x324D62C4E9C0A9B0Bfcf5E32a3fA7cDFcfE77431',
            network: 'Polygon',
          }),
        });
        return { status: res.status, json: await res.json() };
      },
      { key: testIdempotencyKey }
    );

    expect(res2.status).toBe(409);
    expect(res2.json.code).toBe('IDEMPOTENCY_CONFLICT');
  });
});
