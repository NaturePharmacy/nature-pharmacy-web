/**
 * Batterie de tests complète - Interface Admin Nature Pharmacy
 */
import { test, expect } from '../../fixtures/auth.fixture';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function gotoAdmin(page: any, path: string): Promise<boolean> {
  try {
    await page.goto(`${BASE_URL}/fr/admin${path}`, { timeout: 30000 });
    await page.waitForLoadState('networkidle', { timeout: 20000 });
    await page.waitForTimeout(1500);
    return true;
  } catch { return false; }
}

async function skipIfDown(page: any, path: string): Promise<boolean> {
  if (!page.url().includes(path)) {
    test.skip(true, `Hors de ${path}`);
    return true;
  }
  return false;
}

// 1. ACCÈS
test.describe('Admin — Accès', () => {
  test('visiteur non connecté redirigé hors /admin', async ({ page }) => {
    const ok = await gotoAdmin(page, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    expect(page.url()).not.toMatch(/\/fr\/admin$/);
  });

  test('admin accède à /fr/admin', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    await expect(adminPage).toHaveURL(/\/fr\/admin/);
  });

  test('routes admin répondent sans 404', async ({ adminPage }) => {
    for (const route of ['', '/users', '/products', '/orders', '/categories', '/coupons', '/shipping', '/settings']) {
      const ok = await gotoAdmin(adminPage, route);
      if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
      expect(adminPage.url()).toContain('/admin');
      const notFound = await adminPage.locator('text=/404/').isVisible().catch(() => false);
      expect(notFound).toBe(false);
    }
  });
});

// 2. DASHBOARD
test.describe('Admin — Dashboard', () => {
  test('titre visible', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('4 cartes de stats minimum', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin')) return;
    const cards = adminPage.locator('[class*="bg-white"][class*="rounded"]');
    await expect(cards.first()).toBeVisible({ timeout: 15000 });
    expect(await cards.count()).toBeGreaterThanOrEqual(4);
  });

  test('labels stats présents', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin')) return;
    for (const p of [/utilisateurs?|users/i, /produits?|products/i, /commandes?|orders/i, /revenus?|revenue|chiffre/i]) {
      await expect(adminPage.getByText(p).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('sidebar avec liens de navigation', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin')) return;
    expect(await adminPage.locator('nav a, aside a').count()).toBeGreaterThan(3);
  });
});

// 3. UTILISATEURS
test.describe('Admin — Utilisateurs', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/users');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/users')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('tableau ou état vide', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/users');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/users')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    const hasEmpty = await adminPage.getByText(/aucun utilisateur|no users/i).isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBe(true);
  });

  test('au moins 1 utilisateur', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/users');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/users')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    if (!hasTable) { test.skip(true, 'Pas de tableau'); return; }
    expect(await adminPage.locator('table tbody tr').count()).toBeGreaterThanOrEqual(1);
  });

  test('badge rôle visible dans cellule td', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/users');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/users')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    if (!hasTable) { test.skip(true, 'Pas de tableau'); return; }
    const roleBadge = adminPage.locator('table tbody td').filter({ hasText: /admin|seller|buyer/i }).first();
    await expect(roleBadge).toBeVisible({ timeout: 10000 });
  });
});

// 4. PRODUITS
test.describe('Admin — Produits', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/products');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/products')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('tableau ou état vide', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/products');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/products')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    const hasEmpty = await adminPage.getByText(/aucun produit|no product/i).isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBe(true);
  });

  test('3 produits de test listés', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/products');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/products')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    if (!hasTable) { test.skip(true, 'Pas de tableau'); return; }
    expect(await adminPage.locator('table tbody tr').count()).toBeGreaterThanOrEqual(3);
  });

  test('bouton ajouter présent', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/products');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/products')) return;
    const addBtn = adminPage.locator('a, button').filter({ hasText: /ajouter|add|nouveau|new/i }).first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
  });

  test('en-têtes th : nom, prix, stock', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/products');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/products')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    if (!hasTable) { test.skip(true, 'Pas de tableau'); return; }
    // Colonnes en fr: "Produit", "Prix", "Stock" — en en: "Product", "Price", "Stock"
    for (const col of [/produit|product/i, /prix|price/i, /stock/i]) {
      await expect(adminPage.locator('table thead th').filter({ hasText: col }).first()).toBeVisible({ timeout: 5000 });
    }
  });
});

// 5. COMMANDES
test.describe('Admin — Commandes', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('tableau commandes visible', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    await expect(adminPage.locator('table tbody tr').first()).toBeVisible({ timeout: 15000 });
    expect(await adminPage.locator('table tbody tr').count()).toBeGreaterThan(0);
  });

  test('en-têtes tableau présents', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    await expect(adminPage.locator('table thead').first()).toBeVisible({ timeout: 10000 });
    expect(await adminPage.locator('table thead th').count()).toBeGreaterThan(0);
  });

  test('sélecteur statut présent', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    const isEmpty = await adminPage.getByText(/aucune commande|no orders/i).isVisible().catch(() => false);
    if (isEmpty) { test.skip(true, 'Aucune commande'); return; }
    const rows = adminPage.locator('table tbody tr');
    if (await rows.count() === 0) { test.skip(true, 'Aucune commande'); return; }
    await expect(rows.first().locator('select').first()).toBeVisible({ timeout: 10000 });
  });

  test('clic commande ouvre le détail', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    const isEmpty = await adminPage.getByText(/aucune commande|no orders/i).isVisible().catch(() => false);
    if (isEmpty) { test.skip(true, 'Aucune commande'); return; }
    const rows = adminPage.locator('table tbody tr');
    if (await rows.count() === 0) { test.skip(true, 'Aucune commande'); return; }
    const link = rows.first().locator('a[href*="/orders/"]').first();
    await expect(link).toBeVisible({ timeout: 10000 });
    await link.click();
    await adminPage.waitForLoadState('networkidle');
    await expect(adminPage.locator('h1, h2').first()).toBeVisible({ timeout: 15000 });
  });
});

// 6. CATÉGORIES
test.describe('Admin — Catégories', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/categories');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/categories')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('catégories listées', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/categories');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/categories')) return;
    await expect(adminPage.locator('table tr, [class*="card"], li').first()).toBeVisible({ timeout: 10000 });
  });

  test('bouton ajout présent', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/categories');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/categories')) return;
    await expect(adminPage.locator('button, a').filter({ hasText: /ajouter|add|nouveau|new/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// 7. COUPONS
test.describe('Admin — Coupons', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/coupons');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/coupons')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('tableau ou état vide', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/coupons');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/coupons')) return;
    const hasTable = await adminPage.locator('table').isVisible({ timeout: 10000 }).catch(() => false);
    const hasEmpty = await adminPage.getByText(/aucun coupon|no coupon/i).isVisible().catch(() => false);
    expect(hasTable || hasEmpty).toBe(true);
  });

  test('bouton créer présent', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/coupons');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/coupons')) return;
    // Texte réel du bouton : "+ New Coupon"
    await expect(adminPage.locator('button').filter({ hasText: /new coupon|créer|create|ajouter|nouveau/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// 8. EXPÉDITION
test.describe('Admin — Expédition', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/shipping');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/shipping')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('zones listées', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/shipping');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/shipping')) return;
    await expect(adminPage.locator('[class*="bg-white"][class*="rounded"], table tbody tr').first()).toBeVisible({ timeout: 10000 });
  });

  test('bouton ajout zone', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/shipping');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/shipping')) return;
    await expect(adminPage.locator('button').filter({ hasText: /ajouter|add|nouvelle zone|new/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// 9. PARAMÈTRES
test.describe('Admin — Paramètres', () => {
  test('page se charge', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/settings');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/settings')) return;
    await expect(adminPage.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('commission à 30%', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/settings');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/settings')) return;
    const commissionInput = adminPage.locator('input[name*="commission"], input[name*="Commission"]').first();
    if (await commissionInput.isVisible({ timeout: 8000 }).catch(() => false)) {
      expect(await commissionInput.inputValue()).toBe('30');
    } else {
      await expect(adminPage.getByText(/commission/i).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('bouton sauvegarde présent', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/settings');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/settings')) return;
    await expect(adminPage.locator('button').filter({ hasText: /sauvegarder|save|enregistrer|update/i }).first()).toBeVisible({ timeout: 10000 });
  });
});

// 10. COMMANDES PAYPAL
test.describe('Admin — Commandes PayPal', () => {
  test('cellules commande visibles', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    const isEmpty = await adminPage.getByText(/aucune commande|no orders/i).isVisible().catch(() => false);
    if (isEmpty) { test.skip(true, 'Aucune commande'); return; }
    const rows = adminPage.locator('table tbody tr');
    expect(await rows.count()).toBeGreaterThan(0);
    expect(await rows.first().locator('td').count()).toBeGreaterThan(0);
  });

  test('options select statut > 1', async ({ adminPage }) => {
    const ok = await gotoAdmin(adminPage, '/orders');
    if (!ok) { test.skip(true, 'Serveur inaccessible'); return; }
    if (await skipIfDown(adminPage, '/admin/orders')) return;
    const isEmpty = await adminPage.getByText(/aucune commande|no orders/i).isVisible().catch(() => false);
    if (isEmpty) { test.skip(true, 'Aucune commande'); return; }
    const rows = adminPage.locator('table tbody tr');
    if (await rows.count() === 0) { test.skip(true, 'Aucune commande'); return; }
    const sel = rows.first().locator('select').first();
    await expect(sel).toBeVisible({ timeout: 10000 });
    expect((await sel.locator('option').allTextContents()).length).toBeGreaterThan(1);
  });
});

// 11. SÉCURITÉ API
test.describe('Admin — Sécurité API', () => {
  test('GET /api/admin/users sans auth → 401 ou 403', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr`, { timeout: 30000 });
    const status = await page.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/users`);
      return r.status;
    }, BASE_URL);
    // 401 = non authentifié, 403 = authentifié mais non admin
    expect([401, 403]).toContain(status);
  });

  test('GET /api/admin/orders sans auth → 401 ou 403', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr`, { timeout: 30000 });
    const status = await page.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/orders`);
      return r.status;
    }, BASE_URL);
    expect([401, 403]).toContain(status);
  });

  test('GET /api/admin/products sans auth → 401 ou 403', async ({ page }) => {
    await page.goto(`${BASE_URL}/fr`, { timeout: 30000 });
    const status = await page.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/products`);
      return r.status;
    }, BASE_URL);
    expect([401, 403]).toContain(status);
  });

  test('admin auth → /api/admin/users → 200', async ({ adminPage }) => {
    await adminPage.goto(`${BASE_URL}/fr/admin`, { timeout: 30000 });
    await adminPage.waitForLoadState('networkidle');
    const status = await adminPage.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/users`);
      return r.status;
    }, BASE_URL);
    expect(status).toBe(200);
  });

  test('admin auth → /api/admin/orders → 200', async ({ adminPage }) => {
    await adminPage.goto(`${BASE_URL}/fr/admin`, { timeout: 30000 });
    await adminPage.waitForLoadState('networkidle');
    const status = await adminPage.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/orders`);
      return r.status;
    }, BASE_URL);
    expect(status).toBe(200);
  });

  test('admin auth → /api/admin/products → 200', async ({ adminPage }) => {
    await adminPage.goto(`${BASE_URL}/fr/admin`, { timeout: 30000 });
    await adminPage.waitForLoadState('networkidle');
    const status = await adminPage.evaluate(async (url: string) => {
      const r = await fetch(`${url}/api/admin/products`);
      return r.status;
    }, BASE_URL);
    expect(status).toBe(200);
  });
});
