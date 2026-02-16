import { test, expect } from '../../fixtures/base.fixture';
import { TestData } from '../../helpers/test-data-factory';
import { loginAs } from '../../helpers/auth-helpers';
import { localizedUrl, ROUTES } from '../../helpers/locale-helpers';

test.describe('Login', () => {
  test('Login page loads with form elements', async ({ loginPage, locale }) => {
    await loginPage.navigate();
    await expect(loginPage.emailInput).toBeVisible({ timeout: 10000 });
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Login as buyer redirects to home', async ({ loginPage, page, locale }) => {
    const { email, password } = TestData.users.buyer;
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForLoadState('networkidle');

    // After login, user is redirected to /<locale> (e.g., /fr)
    expect(page.url()).toContain(`/${locale}`);
    expect(page.url()).not.toContain('/login');
  });

  test('Login as seller redirects to home', async ({ loginPage, page, locale }) => {
    const { email, password } = TestData.users.seller;
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain(`/${locale}`);
    expect(page.url()).not.toContain('/login');
  });

  test('Login as admin redirects to home', async ({ loginPage, page, locale }) => {
    const { email, password } = TestData.users.admin;
    await loginPage.navigate();
    await loginPage.login(email, password);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain(`/${locale}`);
    expect(page.url()).not.toContain('/login');
  });

  test('Invalid email shows error', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('nonexistent@test.com', 'password123');
    await loginPage.expectError();
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('Invalid password shows error', async ({ loginPage }) => {
    const { email } = TestData.users.buyer;
    await loginPage.navigate();
    await loginPage.login(email, 'wrongpassword');
    await loginPage.expectError();
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('Empty form submission is prevented by validation', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.submitButton.click();
    // HTML5 required attribute prevents form submission on empty fields
    // Verify we're still on the login page (form was not submitted)
    expect(page.url()).toContain('/login');
    // The email input should have the :invalid pseudo-class
    const emailInvalid = await page.evaluate(() => {
      const el = document.querySelector('#email') as HTMLInputElement;
      return el ? !el.validity.valid : false;
    });
    expect(emailInvalid).toBe(true);
  });
});
