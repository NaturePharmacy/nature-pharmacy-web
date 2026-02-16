import { Page, Route } from '@playwright/test';

/**
 * Mock Vercel Blob Storage upload
 */
export async function mockBlobUpload(page: Page): Promise<void> {
  await page.route('**/api/upload', async (route: Route, request) => {
    if (request.method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          url: `https://mock-blob.vercel-storage.com/test-image-${Date.now()}.webp`,
          success: true,
        }),
      });
      return;
    }
    if (request.method() === 'DELETE') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }
    await route.continue();
  });
}
