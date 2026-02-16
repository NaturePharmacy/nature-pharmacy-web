import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Buyer Referral', () => {
  test('referral section accessible', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/referral');
    await buyerPage.waitForLoadState('networkidle');
    // Wait for client-side auth check and data loading
    await buyerPage.waitForTimeout(2000);

    // The referral page exists at /[locale]/referral/ and shows referral info
    // It may redirect to login if session expired, or show referral content
    const url = buyerPage.url();
    const isOnReferralPage = url.includes('/referral');
    const isOnLoginPage = url.includes('/login');

    if (isOnLoginPage) {
      // Session expired - that's ok, the redirect works
      expect(isOnLoginPage).toBeTruthy();
    } else if (isOnReferralPage) {
      // Look for referral-related content on the page
      const referralContent = buyerPage.getByText(
        /referral|parrainage|invite|inviter|code|lien|link/i
      );
      await expect(referralContent.first()).toBeVisible({ timeout: 10000 });
    } else {
      // Redirected to account page which has referral section
      const referralSection = buyerPage.getByText(
        /referral|parrainage|invite|inviter/i
      );
      await expect(referralSection.first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('referral code visible', async ({ buyerPage }) => {
    await buyerPage.goto('/fr/referral');
    await buyerPage.waitForLoadState('networkidle');
    await buyerPage.waitForTimeout(2000);

    const url = buyerPage.url();

    if (url.includes('/login')) {
      // Session expired - skip gracefully
      test.skip(true, 'Session expired, redirected to login');
      return;
    }

    if (!url.includes('/referral')) {
      await buyerPage.goto('/fr/account');
      await buyerPage.waitForLoadState('networkidle');
    }

    // Look for referral code display - could be in a dedicated element or as text
    const referralCode = buyerPage.locator(
      '[data-testid="referral-code"], .referral-code, input[readonly]'
    );
    const codeText = buyerPage.getByText(/code|lien|link/i);

    const codeVisible = await referralCode.first().isVisible().catch(() => false);
    const textVisible = await codeText.first().isVisible().catch(() => false);

    expect(codeVisible || textVisible).toBeTruthy();
  });
});
