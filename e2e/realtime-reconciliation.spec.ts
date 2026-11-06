import { test, expect } from '@playwright/test';

test.describe('Reconciliação e Tempo Real via Socket.IO Mock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    await page.evaluate(async () => {
      await fetch('/api/__test/reset', { method: 'POST' });
    });
  });

  test('deve detectar alteração de preço de item no carrinho via Socket.IO, exibir alerta e bloquear checkout até aceite', async ({
    page,
  }) => {
    // 1. Acessa o carrinho onde o item inicial já está pré-carregado no seed
    await page.goto('/cart');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);
    await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible();

    // Verifica item no carrinho
    await expect(page.getByText('Cyber Samurai #01')).toBeVisible();

    // 2. Dispara evento de tempo real no contexto da janela do browser
    await page.evaluate(() => {
      if ((window as any).__SIMULATE_NFT_PRICE_CHANGE__) {
        (window as any).__SIMULATE_NFT_PRICE_CHANGE__('nft-1', '2.8000');
      }
    });

    // 3. Verifica exibição do alerta de mudança de preço no card do item
    const priceAlert = page.getByText(/O preço desta obra foi alterado pelo criador/i);
    await expect(priceAlert).toBeVisible();

    // 4. Verifica bloqueio do botão de checkout
    const checkoutButton = page.getByRole('button', { name: /Avançar para o Checkout|Entrar para Finalizar Compra/i });
    await expect(checkoutButton).toBeDisabled();

    // 5. Clica no botão para aceitar o novo preço
    const acceptButton = page.getByRole('button', { name: 'Aceitar Novo Preço' });
    await expect(acceptButton).toBeVisible();
    await acceptButton.click();

    // 6. Alerta de alteração deve desaparecer e botão de checkout deve ser liberado
    await expect(priceAlert).not.toBeVisible();
    await expect(checkoutButton).toBeEnabled();
  });
});
