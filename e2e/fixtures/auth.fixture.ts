import { test as base, Page } from '@playwright/test';
import path from 'path';

const AUTH_DIR = path.resolve(__dirname, '../auth-states');

type AuthFixtures = {
  buyerPage: Page;
  sellerPage: Page;
  adminPage: Page;
};

export const test = base.extend<AuthFixtures>({
  buyerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(AUTH_DIR, 'buyer.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  sellerPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(AUTH_DIR, 'seller.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(AUTH_DIR, 'admin.json'),
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
