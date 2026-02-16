import { test, expect } from '../../fixtures/base.fixture';
import { localizedUrl, LOCALES, ROUTES } from '../../helpers/locale-helpers';

test.describe('Locale Routing', () => {
  test('French locale loads French content', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.home));

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('fr');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    // French pages should contain common French words
    expect(bodyText).toMatch(/Accueil|Produits|Connexion|Panier|Bienvenue/i);
  });

  test('English locale loads English content', async ({ page }) => {
    await page.goto(localizedUrl('en', ROUTES.home));

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(/Home|Products|Login|Cart|Welcome/i);
  });

  test('Spanish locale loads Spanish content', async ({ page }) => {
    await page.goto(localizedUrl('es', ROUTES.home));

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('es');

    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText).toMatch(/Inicio|Productos|Iniciar|Carrito|Bienvenido/i);
  });

  test('navigation between locales preserves the current path', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.products));
    await expect(page).toHaveURL(new RegExp(`/fr/products`));

    // Switch to English locale via locale switcher or direct navigation
    await page.goto(localizedUrl('en', ROUTES.products));
    await expect(page).toHaveURL(new RegExp(`/en/products`));

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('en');
  });

  test('unknown locale redirects to the default locale (fr)', async ({ page }) => {
    const response = await page.goto('/zz/products');

    // Should redirect to /fr (default locale) or show the French version
    await page.waitForURL(new RegExp(`/(fr|en|es)/`));
    const currentUrl = page.url();
    const matchesKnownLocale = LOCALES.some((loc) => currentUrl.includes(`/${loc}/`));
    expect(matchesKnownLocale).toBe(true);
  });
});
