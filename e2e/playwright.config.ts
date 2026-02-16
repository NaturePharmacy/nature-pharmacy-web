import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,

  reporter: process.env.CI
    ? [['html', { open: 'never', outputFolder: './playwright-report' }], ['json', { outputFile: './test-results/results.json' }], ['github'], ['list']]
    : [['html', { open: 'on-failure', outputFolder: './playwright-report' }], ['list']],

  globalSetup: path.resolve(__dirname, 'global-setup.ts'),
  globalTeardown: path.resolve(__dirname, 'global-teardown.ts'),

  use: {
    baseURL,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'off',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: 'smoke',
      testDir: './tests/smoke',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chrome',
      testDir: './tests',
      testIgnore: ['**/smoke/**', '**/api/**'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests',
      testIgnore: ['**/smoke/**', '**/api/**'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      testDir: './tests',
      testMatch: ['**/guest/**', '**/buyer/**', '**/auth/**'],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      testDir: './tests',
      testMatch: ['**/guest/**', '**/buyer/**'],
      use: { ...devices['iPhone 14'] },
    },
  ],

  webServer: {
    command: process.env.CI
      ? 'npm run build && npm run start'
      : 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
