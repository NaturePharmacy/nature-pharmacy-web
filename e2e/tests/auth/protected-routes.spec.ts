import { test, expect } from '../../fixtures/auth.fixture';
import { localizedUrl } from '../../helpers/locale-helpers';

const LOCALE = 'fr';

test.describe('Protected Routes - Unauthenticated Access', () => {
  test('/account redirects unauthenticated to login', async ({ page }) => {
    const accountUrl = localizedUrl(LOCALE, '/account');
    await page.goto(accountUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    // Either redirected to login or page handles auth client-side
    const url = page.url();
    const hasLoginRedirect = /login|connexion|iniciar-sesion/.test(url);
    const hasLoginForm = await page.locator('#email, input[type="email"]').first().isVisible().catch(() => false);
    expect(hasLoginRedirect || hasLoginForm).toBeTruthy();
  });

  test('/orders redirects unauthenticated to login', async ({ page }) => {
    const ordersUrl = localizedUrl(LOCALE, '/orders');
    await page.goto(ordersUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const url = page.url();
    const hasLoginRedirect = /login|connexion|iniciar-sesion/.test(url);
    const hasLoginForm = await page.locator('#email, input[type="email"]').first().isVisible().catch(() => false);
    expect(hasLoginRedirect || hasLoginForm).toBeTruthy();
  });

  test('/wishlist redirects unauthenticated to login', async ({ page }) => {
    const wishlistUrl = localizedUrl(LOCALE, '/wishlist');
    await page.goto(wishlistUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const url = page.url();
    const hasLoginRedirect = /login|connexion|iniciar-sesion/.test(url);
    const hasLoginForm = await page.locator('#email, input[type="email"]').first().isVisible().catch(() => false);
    expect(hasLoginRedirect || hasLoginForm).toBeTruthy();
  });

  test('/checkout redirects unauthenticated to login', async ({ page }) => {
    const checkoutUrl = localizedUrl(LOCALE, '/checkout');
    await page.goto(checkoutUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    const url = page.url();
    const hasLoginRedirect = /login|connexion|iniciar-sesion/.test(url);
    const hasLoginForm = await page.locator('#email, input[type="email"]').first().isVisible().catch(() => false);
    expect(hasLoginRedirect || hasLoginForm).toBeTruthy();
  });
});

test.describe('Protected Routes - Role-Based Access', () => {
  test('/seller redirects non-seller to home', async ({ buyerPage }) => {
    const sellerUrl = localizedUrl(LOCALE, '/seller');
    await buyerPage.goto(sellerUrl, { waitUntil: 'domcontentloaded' });
    await buyerPage.waitForLoadState('networkidle');
    // Wait for client-side redirect (React useEffect + router.push)
    await buyerPage.waitForTimeout(2000);

    // Buyer should not remain on the seller dashboard
    expect(buyerPage.url()).not.toMatch(/\/seller$/);
  });

  test('/admin redirects non-admin to home', async ({ buyerPage }) => {
    const adminUrl = localizedUrl(LOCALE, '/admin');
    await buyerPage.goto(adminUrl, { waitUntil: 'domcontentloaded' });
    await buyerPage.waitForLoadState('networkidle');
    // Wait for client-side redirect (React useEffect + router.push)
    await buyerPage.waitForTimeout(3000);

    // The admin page does NOT redirect non-admins - it shows an "Access Denied" / "Accès non autorisé" message.
    // So we verify that either:
    // 1. The URL changed (redirected away from /admin)
    // 2. An "access denied" message is visible (the page handles it client-side)
    const url = buyerPage.url();
    const wasRedirected = !url.match(/\/admin$/);
    const accessDeniedVisible = await buyerPage
      .getByText(/accès non autorisé|access denied|no access/i)
      .isVisible()
      .catch(() => false);

    expect(wasRedirected || accessDeniedVisible).toBeTruthy();
  });
});
