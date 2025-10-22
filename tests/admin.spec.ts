import { test, expect } from '@playwright/test';

test.describe('Admin Panel Verification', () => {
  test('should log in and display the admin panel', async ({ page }) => {
    // Navigate to the login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });

    // Fill in the password and submit
    await page.fill('#password', 'Martijn1');
    await page.click('button[type="submit"]');

    // Wait for the admin page to load
    await page.waitForURL('http://localhost:3000/admin', { waitUntil: 'networkidle' });

    // Use a specific selector for the heading
    const heading = page.locator('h1:has-text("Project Management")');
    await expect(heading).toBeVisible();

    // Take a screenshot
    await page.screenshot({ path: 'tests/screenshots/admin_page_verification.png' });
  });
});
