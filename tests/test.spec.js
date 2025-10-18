const { test, expect } = require('@playwright/test');

test('lightbox UI is correct', async ({ page }) => {
  await page.goto('http://localhost:8081');

  // Click the "Bekijk Galerij" button to open the modal
  await page.click('button[data-modal-target="#image-grid-modal"]');

  // Wait for the modal to be visible
  await page.waitForSelector('#image-grid-modal', { state: 'visible' });

  // Click the first gallery image to open the lightbox
  await page.click('.image-grid img');

  // Wait for the lightbox to be visible
  await page.waitForSelector('#image-lightbox', { state: 'visible' });

  // Take a screenshot of the lightbox
  await page.screenshot({ path: 'lightbox-screenshot.png' });

  // Assert that the lightbox is visible
  const lightbox = await page.locator('#image-lightbox');
  await expect(lightbox).toBeVisible();

  // Optional: Add more specific assertions here if needed
  // For example, check the position of the close button or the visibility of the caption
});