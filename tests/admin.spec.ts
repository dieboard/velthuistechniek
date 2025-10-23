import { test, expect } from '@playwright/test';

// const ADMIN_PASSWORD = "Martijn1"; // <-- Reverted temporary debug
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Check if the environment variable exists
    if (!ADMIN_PASSWORD) {
      // This fails the test immediately with a clear error
      // instead of a 30-second timeout.
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }
    // -----------------------

    await page.goto('/login');

    // 2. Explicitly find and fill password
    // (Using the <input id="password"> from your login.html)
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(ADMIN_PASSWORD);

    // 3. Explicitly find and click button
    // (Using the <button type="submit">Login</button> from your login.html)
    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
    await loginButton.click();

    // 4. Wait for *either* the admin page title OR the login error to appear.
    // This is the "fork in the road" and prevents any timeout.
    const adminTitle = page.getByTestId('admin-page-title'); // From your admin.html
    const errorMessage = page.locator('#error-message'); // From your login.html

    // This is the key: Wait for one of these to be visible
    await expect(adminTitle.or(errorMessage)).toBeVisible();

    // 5. Now, check *which* one became visible.
    // If the error is visible, fail the test with a clear message.
    const isErrorVisible = await errorMessage.isVisible();
    if (isErrorVisible) {
      // This will fail the test with a crystal-clear message
      throw new Error(`Login failed: ${await errorMessage.textContent()}`);
    }

    // 6. If we're here, the error was *not* visible, so the admin title *must* be.
    // We can add a final confirmation.
    await expect(adminTitle).toBeVisible();
    await expect(page).toHaveURL('/admin');
  });

  test('should log in successfully', async ({ page }) => {
    // We are already logged in thanks to beforeEach
    // Just verify we are on the right page
    await expect(page).toHaveURL('/admin');
  });

  test('should create, verify, and delete a new project', async ({ page }) => {
    // --- Setup ---
    // Use unique data for this specific test run
    const projectTitle = `My Unique Test Project ${Date.now()}`;
    const tileSummary = 'This is a test summary for the tile.';
    const modalDescription = 'This is the rich text modal description.';

    // Set up a handler to automatically accept the delete confirmation dialog
    page.on('dialog', dialog => dialog.accept());

    // --- 1. Create a new project ---

    // Fill out the create form
    await page.fill('#new-project-title', projectTitle);
    await page.fill('#new-tile-summary', tileSummary);

    // Fill the TinyMCE editor by targeting its iframe
    await page.frameLocator('#new-modal-description_ifr')
      .locator('body')
      .fill(modalDescription);

    // Submit the create form
    await page.click('#create-project-form button[type="submit"]');

    // --- 2. Verify the project was created correctly ---

    // Create a locator for our *specific* project card.
    const newProjectCard = page.locator('.project', {
      has: page.locator(`input.project-title-input[value="${projectTitle}"]`)
    });

    // Wait for our specific card to appear (API call + re-render)
    await expect(newProjectCard).toBeVisible({ timeout: 10000 });

    // Verify the other fields on our new card are correct
    await expect(newProjectCard.locator('.tile-summary-input')).toHaveValue(tileSummary);

    // **FIXED LINE:** Use toHaveText() to check the rendered text content.
    // The <div> will contain <p>This is the rich text modal description.</p>
    // toHaveText() correctly extracts and checks the visible text.
    await expect(newProjectCard.locator('.modal-description-div')).toHaveText(modalDescription);

    // --- 3. Delete the correct project ---

    // Click the delete button *inside* our specific project card
    await newProjectCard.locator('.delete-btn').click();

    // --- 4. Verify the project was deleted ---

    // Wait for the delete API call and the subsequent page reload to finish
    await page.waitForLoadState('networkidle');

    // Assert that our specific project card is no longer visible
    await expect(newProjectCard).toBeHidden();
  });

});
