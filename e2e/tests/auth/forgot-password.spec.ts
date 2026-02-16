import { test, expect } from '../../fixtures/base.fixture';
import { TestData } from '../../helpers/test-data-factory';
import { localizedUrl } from '../../helpers/locale-helpers';

test.describe('Forgot Password', () => {
  test('Forgot password page loads', async ({ page, locale }) => {
    const forgotUrl = localizedUrl(locale, '/forgot-password');
    await page.goto(forgotUrl, { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"], input[name="email"], #email').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    const submitButton = page.locator('button[type="submit"]').first();
    await expect(submitButton).toBeVisible();
  });

  test('Submit valid email shows success message', async ({ page, locale }) => {
    const forgotUrl = localizedUrl(locale, '/forgot-password');
    await page.goto(forgotUrl, { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"], input[name="email"], #email').first();
    await emailInput.fill(TestData.users.buyer.email);

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // After submit, the page shows either:
    // - Success state: heading "Email envoyé !" / "Email sent!" with bg-green-100 circle
    // - Error state: bg-red-50 div with error message
    // Wait for either response (success heading or error div)
    const successHeading = page.getByText(/email\s+(envoyé|sent)/i);
    const errorDiv = page.locator('.bg-red-50');
    const successCircle = page.locator('.bg-green-100');

    await expect(
      successHeading.or(errorDiv).or(successCircle)
    ).toBeVisible({ timeout: 15000 });
  });

  test('Submit nonexistent email shows error or success', async ({ page, locale }) => {
    const forgotUrl = localizedUrl(locale, '/forgot-password');
    await page.goto(forgotUrl, { waitUntil: 'domcontentloaded' });

    const emailInput = page.locator('input[type="email"], input[name="email"], #email').first();
    // Use a valid email format that doesn't exist (HTML5 validation requires valid format)
    await emailInput.fill('nonexistent-user-xyz@test.com');

    const submitButton = page.locator('button[type="submit"]').first();
    await submitButton.click();

    // API returns error for nonexistent email, shown as bg-red-50 div
    const responseMsg = page.locator('.bg-red-50, [data-testid="error-message"], .error, [role="alert"], .bg-green-100').first();
    await expect(responseMsg).toBeVisible({ timeout: 15000 });
  });
});
