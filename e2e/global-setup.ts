import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_DIR = path.resolve(__dirname, 'auth-states');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const TEST_USERS = {
  buyer: { email: 'buyer@test.com', password: 'password123' },
  seller: { email: 'seller@test.com', password: 'password123' },
  admin: { email: 'admin@test.com', password: 'password123' },
};

async function waitForServer(_url: string, maxRetries = 30): Promise<void> {
  const healthUrl = `${BASE_URL}/api/products`;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(healthUrl, { signal: AbortSignal.timeout(10000) });
      if (res.ok || res.status < 500) return;
    } catch {}
    console.log(`[global-setup] Waiting for server... (${i + 1}/${maxRetries})`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error(`Server not available at ${healthUrl} after ${maxRetries} retries`);
}

async function warmupRoutes(): Promise<void> {
  // Pre-compile lazy Next.js routes that would otherwise timeout during tests
  const routes = [
    '/api/products/000000000000000000000000',
    '/api/admin/users',
    '/api/admin/stats',
    '/api/auth/session',
  ];
  console.log('[global-setup] Warming up lazy routes (this may take a few minutes)...');
  for (const route of routes) {
    try {
      await fetch(`${BASE_URL}${route}`, { signal: AbortSignal.timeout(150000) });
      console.log(`[global-setup] Warmed up ${route}`);
    } catch {
      console.log(`[global-setup] Warmup ${route} timed out`);
    }
  }
}

async function globalSetup(_config: FullConfig) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }

  await waitForServer(`${BASE_URL}/api/products`);
  await warmupRoutes();

  const browser = await chromium.launch();

  for (const [role, creds] of Object.entries(TEST_USERS)) {
    console.log(`[global-setup] Creating auth state for ${role}...`);

    const context = await browser.newContext();
    const page = await context.newPage();

    // Log auth-related API calls for debugging
    page.on('response', response => {
      if (response.url().includes('/api/auth/')) {
        console.log(`[global-setup] [${role}] ${response.status()} ${response.url().replace(BASE_URL, '')}`);
      }
    });

    await page.goto(`${BASE_URL}/fr/login`, { timeout: 30000 });
    await page.waitForLoadState('networkidle');

    // Dismiss cookie consent
    await page.evaluate(() => {
      localStorage.setItem('cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, preferences: false }));
      localStorage.setItem('cookie_consent_date', new Date().toISOString());
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Fill and submit login form
    await page.locator('#email').fill(creds.email);
    await page.locator('#password').fill(creds.password);
    await page.getByRole('button', { name: /connecter|sign in|iniciar/i }).click();

    // Wait for redirect or error
    try {
      await page.waitForFunction(
        () => !window.location.pathname.includes('/login'),
        { timeout: 15000 }
      );
      console.log(`[global-setup] Redirected for ${role}: ${page.url()}`);
    } catch {
      const errorEl = page.locator('.bg-red-50');
      const hasError = await errorEl.isVisible().catch(() => false);
      console.error(`[global-setup] Login STUCK for ${role}. Error visible: ${hasError}, URL: ${page.url()}`);
      await page.screenshot({ path: path.join(AUTH_DIR, `${role}-failed.png`) });
    }

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name.includes('session-token'));
    console.log(`[global-setup] Cookies for ${role}: ${cookies.map(c => c.name).join(', ')}`);
    if (!sessionCookie) {
      console.error(`[global-setup] NO session-token for ${role}!`);
    }

    const statePath = path.join(AUTH_DIR, `${role}.json`);
    await context.storageState({ path: statePath });
    console.log(`[global-setup] Auth state saved for ${role}`);

    await context.close();
  }

  await browser.close();
  console.log('[global-setup] Complete.');
}

export default globalSetup;
