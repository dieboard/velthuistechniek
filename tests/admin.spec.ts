import { test, expect } from '@playwright/test';

// Read the variable once at the top
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

test.describe('Admin Panel', () => {

  test.beforeEach(async ({ page }) => {
    // --- THIS IS THE FIX ---
    // 1. Check if the environment variable exists
    if (!ADMIN_PASSWORD) {
      // This fails the test immediately with a clear error
      // instead of a 30-second timeout.
      throw new Error('ADMIN_PASSWORD environment variable is not set.');
    }
    // -----------------------

    await page.goto('/login');

    // 2. No more red line!
    // TypeScript now knows ADMIN_PASSWORD is a string
    // because of the check above.
    await page.fill('input[name="password"]', ADMIN_PASSWORD);
    
    await page.click('button[type="submit"]');

    // Wait for the URL to change to /admin, confirming login
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

