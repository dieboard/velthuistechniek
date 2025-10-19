const { test, expect } = require('@playwright/test');

test('lightbox appears on top of the gallery modal and closes correctly', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000');

  // Open the gallery modal
  await page.click('[data-modal-target="#image-grid-modal"]');
  await page.waitForSelector('#image-grid-modal.active');

  // Click the first image in the gallery to open the lightbox
  await page.click('#image-grid-modal .image-grid img:first-child');
  await page.waitForSelector('#image-lightbox.active');

  // Verify the lightbox is on top and take a screenshot
  await expect(page.locator('#image-lightbox')).toHaveCSS('z-index', '2001');
  await page.screenshot({ path: 'tests/screenshots/z-index-fix/lightbox-on-top.png' });

  // Close the lightbox
  await page.click('#image-lightbox .lightbox-close');
  await page.waitForSelector('#image-lightbox:not(.active)');

  // Verify the lightbox is closed and the gallery is still open
  await page.screenshot({ path: 'tests/screenshots/z-index-fix/lightbox-closed.png' });

  // Close the gallery modal
  await page.click('#image-grid-modal .modal-close');
  await page.waitForSelector('#image-grid-modal:not(.active)');

  // Verify the gallery modal is closed
  await page.screenshot({ path: 'tests/screenshots/z-index-fix/gallery-closed.png' });
});
