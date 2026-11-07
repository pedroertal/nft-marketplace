import { test, expect } from '@playwright/test';

test.describe('Fluxo Crítico de Compra de NFT', () => {
  test.beforeEach(async ({ page }) => {
    // Acessa a aplicação e aguarda o Service Worker do MSW estar ativo
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    await page.evaluate(async () => {
      await fetch('/api/__test/reset', { method: 'POST' });
    });
  });

  test('deve autenticar, selecionar NFT, aplicar cupom, liquidar pedido e exibir recibo imutável', async ({
    page,
  }) => {
    // 1. Acesso à página de login e autenticação
    await page.goto('/auth/login');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);
    await expect(page.getByRole('heading', { name: 'Acessar Plataforma' })).toBeVisible();

    await page.getByPlaceholder('pedro@nexus.io').fill('pedro@nexus.io');
    await page.getByPlaceholder('••••••••••••').fill('password123');
    await page.getByRole('button', { name: 'Entrar na Conta' }).click();

    // Redirecionamento para o perfil após login bem-sucedido
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.getByRole('heading', { name: 'Pedro Ramos' })).toBeVisible();

    // 2. Navegação para o catálogo / mercado
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    // 3. Busca e seleção do NFT "Imperial Ape #042"
    const searchInput = page.getByLabel('Campo de busca de NFTs');
    await searchInput.fill('Imperial Ape');
    await page.waitForTimeout(400); // Aguarda debounce da busca

    const nftTitleLink = page.getByRole('link', { name: /Imperial Ape #042/i }).first();
    await expect(nftTitleLink).toBeVisible();
    await nftTitleLink.click();

    // 4. Página de detalhes do NFT
    await expect(page).toHaveURL(/.*\/nfts\/nft-1/);
    await expect(page.getByRole('heading', { name: /Imperial Ape #042/i })).toBeVisible();

    // Adiciona ao carrinho e navega para /cart
    const buyNowButton = page.getByRole('button', { name: 'Comprar Agora' });
    await expect(buyNowButton).toBeVisible();
    await buyNowButton.click();

    // 5. Página do Carrinho
    await expect(page).toHaveURL(/.*\/cart/);
    await expect(page.getByRole('heading', { name: /Carrinho/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Imperial Ape #042/i }).first()).toBeVisible();

    // 6. Aplicação de Cupom de Desconto "NEXUS10"
    const couponInput = page.getByPlaceholder('Ex: NEXUS10');
    await couponInput.fill('NEXUS10');
    await page.getByRole('button', { name: 'Aplicar' }).click();

    // Valida aplicação do cupom
    await expect(page.getByText('10% de desconto')).toBeVisible();
    await expect(page.getByText('Desconto do Cupom')).toBeVisible();

    // 7. Avançar para o Checkout
    const checkoutButton = page.getByRole('button', { name: 'Avançar para o Checkout' });
    await expect(checkoutButton).toBeEnabled();
    await checkoutButton.click();

    // 8. Tela de Checkout
    await expect(page).toHaveURL(/.*\/checkout/);
    await expect(page.getByRole('heading', { name: /Pagamento|Checkout/i })).toBeVisible();
    await expect(page.getByText('Idempotency-Key Ativa')).toBeVisible();

    // Confirma e liquida pedido na blockchain
    const confirmButton = page.getByRole('button', { name: 'Confirmar e Liquidar Pedido' });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    // 9. Página de Recibo / Sucesso
    await expect(page).toHaveURL(/.*\/checkout\/success/, { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'Pedido Confirmado com Sucesso!' })).toBeVisible();
    await expect(page.getByText('Hash da Transação (TxHash)')).toBeVisible();
    await expect(page.getByText('Imperial Ape #042', { exact: true }).first()).toBeVisible();

    // 10. Navega para o Perfil e verifica Meus NFTs
    await page.getByText('Ver no Meu Perfil (Meus NFTs)').click();
    await expect(page).toHaveURL(/.*\/profile/);
    await expect(page.getByRole('heading', { name: 'Pedro Ramos' })).toBeVisible();

    // Valida que o NFT recém-adquirido aparece instantaneamente em "Meus NFTs"
    await expect(page.getByRole('tab', { name: /Meus NFTs/i })).toBeVisible();
    await expect(page.getByText('Imperial Ape #042', { exact: true }).first()).toBeVisible();
  });
});
