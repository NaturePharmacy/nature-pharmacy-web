import { test, expect } from '../../fixtures/auth.fixture';
import { WishlistPage } from '../../page-objects/wishlist.page';

test.describe('Buyer Wishlist', () => {
  test('wishlist page loads', async ({ buyerPage }) => {
    const wishlistPage = new WishlistPage(buyerPage);
    await wishlistPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    await expect(buyerPage).toHaveURL(/\/fr\/wishlist/);
  });

  test('wishlist shows items or empty state', async ({ buyerPage }) => {
    const wishlistPage = new WishlistPage(buyerPage);
    await wishlistPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasItems = await wishlistPage.wishlistItems.count() > 0;

    if (hasItems) {
      await expect(wishlistPage.wishlistItems.first()).toBeVisible();
    } else {
      const emptyState = buyerPage.getByText(/no items|empty|aucun article|vide/i);
      await expect(emptyState).toBeVisible();
    }
  });

  test('buyer can navigate to product from wishlist', async ({ buyerPage }) => {
    const wishlistPage = new WishlistPage(buyerPage);
    await wishlistPage.navigate();
    await buyerPage.waitForLoadState('networkidle');

    const hasItems = await wishlistPage.wishlistItems.count() > 0;

    if (hasItems) {
      await wishlistPage.wishlistItems.first().click();
      await buyerPage.waitForLoadState('networkidle');

      await expect(buyerPage).toHaveURL(/\/fr\/products?\/.+/);
    } else {
      const emptyState = buyerPage.getByText(/no items|empty|aucun article|vide/i);
      await expect(emptyState).toBeVisible();
    }
  });
});
