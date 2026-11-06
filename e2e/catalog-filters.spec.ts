import { test, expect } from '@playwright/test';

test.describe('Catálogo: Filtros na URL, Busca e Paginação', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    await page.evaluate(async () => {
      await fetch('/api/__test/reset', { method: 'POST' });
    });
  });

  test('deve atualizar parâmetros na URL ao pesquisar e persistir após recarregamento (F5)', async ({
    page,
  }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);
    await expect(page.getByRole('heading', { name: /Colecione e negocie/i })).toBeVisible();

    // 1. Busca por "Neon"
    const searchInput = page.getByLabel('Campo de busca de NFTs');
    await searchInput.fill('Neon');
    await page.waitForTimeout(400); // Aguarda debounce de 300ms

    // URL deve conter ?search=Neon
    await expect(page).toHaveURL(/.*search=Neon/);
    await expect(page.getByText('Neon Odyssey: Genesis')).toBeVisible();

    // 2. Recarrega a página (F5)
    await page.reload();

    // Estado e filtros na URL devem sobreviver ao reload
    await expect(page).toHaveURL(/.*search=Neon/);
    await expect(page.getByText('Neon Odyssey: Genesis')).toBeVisible();
  });

  test('deve filtrar por categoria e atualizar a URL', async ({ page }) => {
    await page.goto('/');
    await page.waitForFunction(() => (window as any).__MSW_READY__ === true);

    // Clica na categoria "Digital Art"
    const categoryButton = page.getByRole('button', { name: 'Digital Art' }).first();
    await categoryButton.click();

    // URL deve conter ?category=Digital%20Art
    await expect(page).toHaveURL(/.*category=Digital/);
    await expect(page.getByText('Neon Odyssey: Genesis')).toBeVisible();
  });
});
