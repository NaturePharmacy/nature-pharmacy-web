import { test, expect } from '../../fixtures/auth.fixture';
import { SellerProductsPage } from '../../page-objects/seller/seller-products.page';

test.describe('Seller Product Management', () => {
  test('seller products page loads', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/products/);
  });

  test('products table shows seller products', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    const hasProducts = await sellerProductsPage.productRows.count() > 0;

    if (hasProducts) {
      await expect(sellerProductsPage.productRows.first()).toBeVisible();
    } else {
      const emptyState = sellerPage.getByText(
        /no products|aucun produit|empty|vide|start selling/i
      );
      await expect(emptyState).toBeVisible();
    }
  });

  test('add product button navigates to new product page', async ({ sellerPage }) => {
    const sellerProductsPage = new SellerProductsPage(sellerPage);
    await sellerProductsPage.navigate();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerProductsPage.addProductButton).toBeVisible();
    await sellerProductsPage.clickAddProduct();
    await sellerPage.waitForLoadState('networkidle');

    await expect(sellerPage).toHaveURL(/\/fr\/seller\/products\/new/);
  });
});
