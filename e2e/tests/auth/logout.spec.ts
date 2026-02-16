import { test, expect } from '../../fixtures/base.fixture';
import { TestData } from '../../helpers/test-data-factory';
import { loginAs, logout, isAuthenticated } from '../../helpers/auth-helpers';
import { localizedUrl } from '../../helpers/locale-helpers';

test.describe('Logout', () => {
  test('Logged in user can logout', async ({ page, locale }) => {
    const { email, password } = TestData.users.buyer;
    await loginAs(page, email, password, locale);

    const authenticated = await isAuthenticated(page);
    expect(authenticated).toBe(true);

    await logout(page);
    await page.waitForLoadState('domcontentloaded');

    const stillAuthenticated = await isAuthenticated(page);
    expect(stillAuthenticated).toBe(false);
  });

  test('After logout, protected routes redirect to login', async ({ page, locale }) => {
    const { email, password } = TestData.users.buyer;
    await loginAs(page, email, password, locale);
    await logout(page);
    await page.waitForLoadState('domcontentloaded');

    const accountUrl = localizedUrl(locale, '/account');
    await page.goto(accountUrl, { waitUntil: 'domcontentloaded' });

    await page.waitForLoadState('networkidle');
    // Either redirected to login or page handles auth client-side
    const url = page.url();
    const hasLoginRedirect = /login|connexion|iniciar-sesion/.test(url);
    const hasLoginForm = await page.locator('#email, input[type="email"]').first().isVisible().catch(() => false);
    expect(hasLoginRedirect || hasLoginForm).toBeTruthy();
  });
});
