import { test, expect } from '../../fixtures/base.fixture';
import { localizedUrl, LOCALES, ROUTES } from '../../helpers/locale-helpers';

/** Matches untranslated next-intl keys like "common.nav.home" or "products.title" */
const UNTRANSLATED_KEY_PATTERN = /\b[a-z]+(\.[a-z_]+){2,}\b/i;

test.describe('Translation Coverage', () => {
  test('homepage has no untranslated keys', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.home));
    await page.waitForLoadState('networkidle');

    const visibleTexts = await page.locator('body *:visible').allTextContents();
    const joinedText = visibleTexts.join(' ');

    // Untranslated keys appear as dotted paths like "home.hero.title"
    const untranslatedMatches = joinedText.match(/\b\w+\.\w+\.\w+\b/g) || [];
    // Filter out known non-key patterns (URLs, versions, file extensions)
    const suspiciousKeys = untranslatedMatches.filter(
      (match) => !match.match(/\d/) && !match.includes('www') && !match.includes('com')
    );

    expect(suspiciousKeys).toHaveLength(0);
  });

  test('products page has no untranslated keys', async ({ page }) => {
    await page.goto(localizedUrl('fr', ROUTES.products));
    await page.waitForLoadState('networkidle');

    const visibleTexts = await page.locator('body *:visible').allTextContents();
    const joinedText = visibleTexts.join(' ');

    const untranslatedMatches = joinedText.match(/\b\w+\.\w+\.\w+\b/g) || [];
    const suspiciousKeys = untranslatedMatches.filter(
      (match) => !match.match(/\d/) && !match.includes('www') && !match.includes('com')
    );

    expect(suspiciousKeys).toHaveLength(0);
  });

  test('login page has localized text in each locale', async ({ page }) => {
    const loginTexts: Record<string, RegExp> = {
      fr: /Connexion|Se connecter|Email|Mot de passe/i,
      en: /Login|Sign in|Email|Password/i,
      es: /Iniciar sesi[oó]n|Correo|Contrase[nñ]a/i,
    };

    for (const locale of LOCALES) {
      await page.goto(localizedUrl(locale, ROUTES.login));
      await page.waitForLoadState('networkidle');

      const bodyText = await page.textContent('body');
      expect(bodyText).toMatch(loginTexts[locale]);
    }
  });

  test('footer has translated content across locales', async ({ page }) => {
    for (const locale of LOCALES) {
      await page.goto(localizedUrl(locale, ROUTES.home));
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      const footerText = await footer.textContent();
      expect(footerText).toBeTruthy();
      // Footer should not contain raw translation keys
      expect(footerText).not.toMatch(UNTRANSLATED_KEY_PATTERN);
    }
  });
});
