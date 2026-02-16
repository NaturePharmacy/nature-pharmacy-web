import { test, expect } from '../../fixtures/base.fixture';
import { localizedUrl } from '../../helpers/locale-helpers';

const STATIC_PAGES = [
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Blog', path: '/blog' },
];

test.describe('Static Pages - Guest', () => {
  for (const { name, path } of STATIC_PAGES) {
    test(`${name} page loads (${path})`, async ({ page, locale }) => {
      const url = localizedUrl(locale, path);
      const response = await page.goto(url, { waitUntil: 'domcontentloaded' });

      expect(response).not.toBeNull();
      expect(response!.status()).toBeLessThan(500);

      const title = await page.title();
      expect(title).toBeTruthy();
    });
  }

  for (const { name, path } of STATIC_PAGES) {
    test(`${name} page has header and footer`, async ({ page, locale }) => {
      const url = localizedUrl(locale, path);
      await page.goto(url, { waitUntil: 'networkidle' });

      const header = page.locator('header').first();
      await expect(header).toBeVisible({ timeout: 15000 });

      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible({ timeout: 15000 });
    });
  }
});
