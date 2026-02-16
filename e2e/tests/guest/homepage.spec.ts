import { test, expect } from '../../fixtures/base.fixture';

test.describe('Homepage - Guest User', () => {
  test('Homepage loads with hero section', async ({ homePage }) => {
    await homePage.navigate();

    await expect(homePage.heroSection).toBeVisible({ timeout: 15000 });
  });

  test('Homepage displays products or product links', async ({ homePage }) => {
    await homePage.navigate();

    const productLinks = homePage.productLinks;
    const count = await productLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Homepage has navigation links', async ({ homePage, page }) => {
    await homePage.navigate();

    const header = page.locator('header').first();
    await expect(header).toBeVisible({ timeout: 10000 });

    const navLinks = header.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('Homepage is responsive (meta viewport)', async ({ homePage, page }) => {
    await homePage.navigate();

    const viewport = page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');
    expect(content).toBeDefined();
    expect(content).toContain('width=device-width');
  });
});
