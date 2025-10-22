import { test, expect } from '@playwright/test';

test.describe('Admin Panel', () => {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin');
  });

  test('should log in successfully', async ({ page }) => {
    await expect(page).toHaveURL('/admin');
  });

  test('should create and delete a new project', async ({ page }) => {
    // Create a new project
    await page.click('#add-project-btn');
    await page.waitForSelector('.project-card');
    const projectTitle = await page.locator('.project-card:first-child h3').textContent();
    expect(projectTitle).toBe('Nieuw Project');

    // Delete the project
    page.on('dialog', dialog => dialog.accept());
    await page.click('.project-card:first-child .delete-project-btn');
    await page.waitForLoadState('networkidle');
    const projects = await page.locator('.project-card').count();
    expect(projects).toBe(0);
  });
});
