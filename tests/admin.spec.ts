import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  test('should load Decap CMS admin panel and see collections', async ({ page }) => {
    await page.goto('/admin/');

    // In local_backend mode, there's a login button.
    // We need to click it to proceed to the main CMS interface.
    await page.getByRole('button', { name: 'Login' }).click();

    // Now that we're "logged in", we should see our "Projects" collection.
    await expect(page.getByRole('heading', { name: 'Projects' })).toBeVisible();
  });
});
