import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin');
    await adminPage.waitForLoadState('networkidle');
  });

  test('admin dashboard loads successfully', async ({ adminPage }) => {
    await expect(adminPage).toHaveURL(/\/fr\/admin/);
    await expect(adminPage.locator('h1, [data-testid="dashboard-title"]')).toBeVisible();
  });

  test('dashboard shows stats cards for users, products, orders, and revenue', async ({ adminPage }) => {
    // Stats cards are bg-white rounded-lg elements showing stats
    const statsCards = adminPage.locator('[class*="bg-white"][class*="rounded"]');
    await expect(statsCards.first()).toBeVisible({ timeout: 15000 });
    const cardCount = await statsCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(4);

    // Check that stat labels exist (French: Utilisateurs, Produits, Commandes, Chiffre d'affaires)
    const statLabels = [
      /users|utilisateurs/i,
      /products|produits/i,
      /orders|commandes/i,
      /revenue|chiffre/i,
    ];
    for (const labelRegex of statLabels) {
      const card = adminPage.getByText(labelRegex);
      await expect(card.first()).toBeVisible();
    }
  });

  test('admin links are visible on dashboard', async ({ adminPage }) => {
    // Admin links are in the Quick Actions section or header navigation
    const adminLinks = ['/fr/admin/users', '/fr/admin/products', '/fr/admin/orders'];
    for (const href of adminLinks) {
      const link = adminPage.locator(`a[href*="${href}"]`);
      await expect(link.first()).toBeVisible({ timeout: 15000 });
    }
  });

  test('quick access links navigate to correct pages', async ({ adminPage }) => {
    const targets = [
      { href: '/fr/admin/users', pattern: /\/fr\/admin\/users/ },
      { href: '/fr/admin/products', pattern: /\/fr\/admin\/products/ },
      { href: '/fr/admin/orders', pattern: /\/fr\/admin\/orders/ },
    ];

    for (const { href, pattern } of targets) {
      await adminPage.goto('/fr/admin');
      await adminPage.waitForLoadState('networkidle');
      await adminPage.locator(`a[href*="${href}"]`).first().click();
      await adminPage.waitForLoadState('networkidle');
      await expect(adminPage).toHaveURL(pattern);
      await expect(adminPage.locator('h1, [data-testid="page-title"]').first()).toBeVisible();
    }
  });
});
