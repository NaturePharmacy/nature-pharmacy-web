import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('[global-teardown] Cleanup complete.');
}

export default globalTeardown;
