import { test as base, APIRequestContext } from '@playwright/test';
import path from 'path';

const AUTH_DIR = path.resolve(__dirname, '../auth-states');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

type ApiFixtures = {
  publicApi: APIRequestContext;
  buyerApi: APIRequestContext;
  sellerApi: APIRequestContext;
  adminApi: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
  publicApi: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({ baseURL: BASE_URL });
    await use(api);
    await api.dispose();
  },

  buyerApi: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: BASE_URL,
      storageState: path.join(AUTH_DIR, 'buyer.json'),
    });
    await use(api);
    await api.dispose();
  },

  sellerApi: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: BASE_URL,
      storageState: path.join(AUTH_DIR, 'seller.json'),
    });
    await use(api);
    await api.dispose();
  },

  adminApi: async ({ playwright }, use) => {
    const api = await playwright.request.newContext({
      baseURL: BASE_URL,
      storageState: path.join(AUTH_DIR, 'admin.json'),
    });
    await use(api);
    await api.dispose();
  },
});

export { expect } from '@playwright/test';
