import { test, expect } from '@playwright/test';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    if (!ADMIN_PASSWORD) {
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }
    await page.goto('/login.html');

    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(ADMIN_PASSWORD);

    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    await expect(page).toHaveURL('/admin.html');
  });

  test('should log in successfully', async ({ page }) => {
    await expect(page).toHaveURL('/admin.html');
  });

  test('should create, verify, and delete a new project', async ({ page }) => {
    const projectTitle = `My Unique Test Project ${Date.now()}`;
    const tileSummary = 'This is a test summary for the tile.';
    const modalDescription = 'This is the rich text modal description.';

    page.on('dialog', dialog => dialog.accept());

    await page.fill('#new-project-title', projectTitle);
    await page.fill('#new-tile-summary', tileSummary);

    await page.frameLocator('iframe[id^="description-"]').locator('body').fill(modalDescription);


    await page.click('#create-project-form button[type="submit"]');

    const newProjectCard = page.locator('.project', {
      has: page.locator(`input.project-title-input[value="${projectTitle}"]`)
    });

    await expect(newProjectCard).toBeVisible({ timeout: 10000 });

    await expect(newProjectCard.locator('.tile-summary-input')).toHaveValue(tileSummary);

    await expect(newProjectCard.locator('.modal-description-input')).toHaveText(modalDescription);

    await newProjectCard.locator('.delete-btn').click();

    await expect(newProjectCard).toBeHidden();
  });

});
