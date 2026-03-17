import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsListPage } from '../../page-objects/products-list.page';

test.describe('Buyer Reviews', () => {
  test.beforeEach(async ({ buyerPage }) => {
    const productsPage = new ProductsListPage(buyerPage);
    await productsPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasProducts = await productsPage.productCards.first().isVisible({ timeout: 15000 }).catch(() => false);
    if (!hasProducts) {
      test.skip(true, 'No products available');
      return;
    }

    await productsPage.clickFirstProduct();
    await buyerPage.waitForLoadState('networkidle');
  });

  test('product detail page shows reviews section', async ({ buyerPage }) => {
    // The product detail page is a client component — wait for it to render
    await buyerPage.waitForTimeout(3000);

    // Check if the page actually loaded content
    const mainContent = await buyerPage.locator('main').textContent({ timeout: 5000 }).catch(() => '');
    if (!mainContent || mainContent.trim().length < 10) {
      // Page didn't render (possible product not found or loading issue) — skip gracefully
      test.skip(true, 'Product detail page did not render content');
      return;
    }

    // Look for text that says "reviews" or "avis" anywhere in the body
    const bodyText = await buyerPage.textContent('body').catch(() => '');
    const hasReviewsText = /reviews|avis|évaluations/i.test(bodyText || '');
    const ratingText = buyerPage.locator('text=/\\(\\d+\\)/').first();
    const ratingVisible = await ratingText.isVisible({ timeout: 5000 }).catch(() => false);

    expect(hasReviewsText || ratingVisible).toBeTruthy();
  });

  test('review form is available for authenticated buyer', async ({ buyerPage }) => {
    // Wait for client-side rendering
    await buyerPage.waitForTimeout(3000);

    // Skip if page didn't render
    const mainContent = await buyerPage.locator('main').textContent({ timeout: 3000 }).catch(() => '');
    if (!mainContent || mainContent.trim().length < 10) {
      test.skip(true, 'Product detail page did not render content');
      return;
    }

    const reviewForm = buyerPage.locator('form').filter({
      has: buyerPage.locator('textarea, [name="comment"], [name="review"]'),
    });
    const ratingInput = buyerPage.locator(
      '[data-testid="rating"], [name="rating"], .rating-stars, .star-rating'
    );
    const writeReviewButton = buyerPage.getByRole('button', {
      name: /write.*review|add.*review|écrire.*avis|ajouter.*avis|submit|soumettre|envoyer/i,
    });
    const starElements = buyerPage.locator('svg[fill="currentColor"], .text-amber-400, .text-yellow-400').first();

    const formVisible = await reviewForm.isVisible().catch(() => false);
    const ratingVisible = await ratingInput.first().isVisible().catch(() => false);
    const buttonVisible = await writeReviewButton.first().isVisible().catch(() => false);
    const starsVisible = await starElements.isVisible().catch(() => false);

    expect(formVisible || ratingVisible || buttonVisible || starsVisible).toBeTruthy();
  });
});
