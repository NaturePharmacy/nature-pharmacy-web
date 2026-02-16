import { test as base, Page } from '@playwright/test';
import { HomePage } from '../page-objects/home.page';
import { LoginPage } from '../page-objects/login.page';
import { ProductsListPage } from '../page-objects/products-list.page';
import { ProductDetailPage } from '../page-objects/product-detail.page';
import { CartPage } from '../page-objects/cart.page';

type Fixtures = {
  locale: 'fr' | 'en' | 'es';
  homePage: HomePage;
  loginPage: LoginPage;
  productsPage: ProductsListPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
};

export const test = base.extend<Fixtures>({
  locale: ['fr', { option: true }],

  homePage: async ({ page, locale }, use) => {
    await use(new HomePage(page, locale));
  },

  loginPage: async ({ page, locale }, use) => {
    await use(new LoginPage(page, locale));
  },

  productsPage: async ({ page, locale }, use) => {
    await use(new ProductsListPage(page, locale));
  },

  productDetailPage: async ({ page, locale }, use) => {
    await use(new ProductDetailPage(page, locale));
  },

  cartPage: async ({ page, locale }, use) => {
    await use(new CartPage(page, locale));
  },
});

export { expect } from '@playwright/test';
