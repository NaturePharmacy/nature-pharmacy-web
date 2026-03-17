import { Page } from '@playwright/test';

/**
 * Login helper for tests that need fresh authentication
 */
export async function loginAs(
  page: Page,
  email: string,
  password: string,
  locale: string = 'fr'
): Promise<void> {
  await page.goto(`/${locale}/login`);
  await page.waitForLoadState('networkidle');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /connecter|sign in|iniciar/i }).click();
  // Wait for either redirect away from login or a short timeout
  await page.waitForURL(`**/${locale}`, { timeout: 10000 }).catch(() => {});
  await page.waitForLoadState('networkidle');
}

/**
 * Logout helper - properly fetches CSRF token before signing out
 */
export async function logout(page: Page): Promise<void> {
  // Ensure we are on a real page (not about:blank) before fetching
  const currentUrl = page.url();
  if (!currentUrl.startsWith('http')) {
    await page.goto('/fr', { waitUntil: 'domcontentloaded' });
  }

  // NextAuth signout: get CSRF token then POST to signout endpoint
  const csrfRes = await page.request.get('/api/auth/csrf');
  const csrfData = await csrfRes.json();
  const csrfToken = csrfData.csrfToken || '';

  // Use maxRedirects: 0 to avoid following the 302 redirect to NEXTAUTH_URL (port 3001)
  await page.request.post('/api/auth/signout', {
    form: { csrfToken },
    maxRedirects: 0,
  }).catch(() => {}); // 302 is expected - ignore redirect errors

  await page.reload();
  await page.waitForLoadState('networkidle');
}

/**
 * Check if user is authenticated by checking session
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const response = await page.evaluate(async () => {
    const res = await fetch('/api/auth/session');
    const data = await res.json();
    return !!data?.user;
  });
  return response;
}
