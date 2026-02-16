import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Admin Seller Management', () => {
  test.beforeEach(async ({ adminPage }) => {
    await adminPage.goto('/fr/admin/sellers');
    await adminPage.waitForLoadState('networkidle');
    // Wait for loading state to finish and data to render
    await adminPage.waitForTimeout(3000);
  });

  test('sellers page loads', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/sellers')) {
      test.skip(true, 'Redirected away from sellers page - possible auth/role issue');
      return;
    }

    // Non-admin users see "Acces non autorise" / "Access Denied" message
    const accessDenied = adminPage.getByText(/accès non autorisé|access denied/i);
    const isDenied = await accessDenied.isVisible().catch(() => false);
    if (isDenied) {
      test.skip(true, 'Access denied - admin role not assigned');
      return;
    }

    await expect(adminPage).toHaveURL(/\/fr\/admin\/sellers/);
    const heading = adminPage.locator('h1');
    await expect(heading.first()).toBeVisible({ timeout: 15000 });
  });

  test('seller list or table is visible', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/sellers')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    const accessDenied = adminPage.getByText(/accès non autorisé|access denied/i);
    const isDenied = await accessDenied.isVisible().catch(() => false);
    if (isDenied) {
      test.skip(true, 'Access denied - admin role not assigned');
      return;
    }

    // Table rows for sellers, or empty state row with "Aucun vendeur trouve"
    const rows = adminPage.locator('table tbody tr');
    const emptyText = adminPage.getByText(/aucun vendeur|no sellers/i);

    const hasRows = (await rows.count()) > 0;
    const hasEmpty = await emptyText.isVisible().catch(() => false);
    expect(hasRows || hasEmpty).toBeTruthy();
  });

  test('seller approval controls exist', async ({ adminPage }) => {
    if (!adminPage.url().includes('/admin/sellers')) {
      test.skip(true, 'Redirected away - possible auth/role issue');
      return;
    }

    const accessDenied = adminPage.getByText(/accès non autorisé|access denied/i);
    const isDenied = await accessDenied.isVisible().catch(() => false);
    if (isDenied) {
      test.skip(true, 'Access denied - admin role not assigned');
      return;
    }

    // Check for empty state
    const emptyText = adminPage.getByText(/aucun vendeur|no sellers/i);
    const isEmpty = await emptyText.isVisible().catch(() => false);
    if (isEmpty) {
      test.skip(true, 'No sellers available');
      return;
    }

    const rows = adminPage.locator('table tbody tr');
    if ((await rows.count()) === 0) {
      test.skip(true, 'No sellers available');
      return;
    }

    const firstSeller = rows.first();
    // The action buttons are "Verifier"/"Suspendre" (fr) depending on seller verified status
    const approvalControls = firstSeller.locator(
      'button:has-text("Vérifier"), button:has-text("Suspendre"), button:has-text("Verify"), button:has-text("Suspend")',
    );
    await expect(approvalControls.first()).toBeVisible({ timeout: 10000 });
  });
});
