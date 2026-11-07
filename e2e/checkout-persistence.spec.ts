import { test, expect } from '@playwright/test';

test.describe('Persistência Pós-Checkout (Débito da Carteira e Adição a Meus NFTs)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    await page.evaluate(async () => {
      await fetch('/api/__test/reset', { method: 'POST' });
    });
  });

  test('deve debitar o saldo da carteira e adicionar NFT adquirido a Meus NFTs', async ({
    page,
  }) => {
    // 1. Login com Pedro Ramos
    await page.goto('/auth/login');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);
    await page.getByPlaceholder('pedro@nexus.io').fill('pedro@nexus.io');
    await page.getByPlaceholder('••••••••••••').fill('password123');
    await page.getByRole('button', { name: 'Entrar na Conta' }).click();

    // Redireciona para o perfil
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.getByRole('heading', { name: 'Pedro Ramos' })).toBeVisible();

    // Saldo inicial consolidado: 4.8500 + 12.4000 = 17.2500 ETH (formatado em pt-BR como "17,25 ETH")
    await expect(page.getByText(/17,25/)).toBeVisible();
    await expect(page.getByRole('tab', { name: /Meus NFTs \(1\)/i })).toBeVisible();

    // 2. Navega para o catálogo e adquire Imperial Ape #042
    await page.goto('/nfts/nft-1');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);
    await expect(page.getByRole('heading', { name: /Imperial Ape #042/i })).toBeVisible();

    // Clica em Comprar Agora -> navega para /cart
    await page.getByRole('button', { name: 'Comprar Agora' }).click();
    await expect(page).toHaveURL(/.*\/cart/);

    // 3. Aplica cupom NEXUS10 (10% de desconto)
    const couponInput = page.getByPlaceholder('Ex: NEXUS10');
    await couponInput.fill('NEXUS10');
    await page.getByRole('button', { name: 'Aplicar' }).click();
    await expect(page.getByText('10% de desconto')).toBeVisible();

    // 4. Avança para o checkout e liquida o pedido
    await page.getByRole('button', { name: 'Avançar para o Checkout' }).click();
    await expect(page).toHaveURL(/.*\/checkout/);

    // Confirma e liquida
    await page.getByRole('button', { name: 'Confirmar e Liquidar Pedido' }).click();
    await expect(page).toHaveURL(/.*\/checkout\/success/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Pedido Confirmado com Sucesso!' })).toBeVisible();

    // 5. Retorna para o perfil
    await page.getByText('Ver no Meu Perfil (Meus NFTs)').click();
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.getByRole('heading', { name: 'Pedro Ramos' })).toBeVisible();

    // Valida que o saldo consolidado foi dinamicamente debitado (menor que os 17,25 ETH iniciais)
    await expect(page.getByText('17,25 ETH')).not.toBeVisible();
    await expect(page.getByText(/14,\d+|15,\d+/)).toBeVisible();

    // Valida que a aba agora tem 2 colecionáveis e "Imperial Ape #042" aparece na lista
    await expect(page.getByRole('tab', { name: /Meus NFTs \(2\)/i })).toBeVisible();
    await expect(page.getByText('Imperial Ape #042', { exact: true }).first()).toBeVisible();
  });
});
