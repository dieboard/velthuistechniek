import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/');
  });

  test('should load Decap CMS admin panel', async ({ page }) => {
    // Check for a heading that says "Projects", which is the name of our collection.
    // This is a good indicator that the CMS has loaded the config correctly.
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });
});
