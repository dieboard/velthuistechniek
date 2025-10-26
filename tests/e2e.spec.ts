import { test, expect } from '@playwright/test';

test.describe('E2E Tests for Core Website Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto('/');
  });

  test('should load the homepage and render project cards', async ({ page }) => {
    // Verify the main heading is visible
    await expect(page.getByRole('heading', { name: 'Velthuis Techniek' })).toBeVisible();

    // Verify the project grid is present
    const projectGrid = page.getByTestId('project-grid');
    await expect(projectGrid).toBeVisible();

    // Verify that at least one project card is rendered
    const projectCards = projectGrid.locator('.project-card');
    await expect(projectCards.first()).toBeVisible();
  });

  test('should open, validate, and close the project modal with carousel', async ({ page }) => {
    // Find the first project card and click its "Lees Meer" button
    const firstProjectCard = page.locator('.project-card').first();
    await firstProjectCard.getByRole('button', { name: 'Lees Meer' }).click();

    // Verify the modal is visible
    const modal = page.locator('#project-detail-modal');
    await expect(modal).toBeVisible();

    // Verify the modal title, description, and carousel are present
    await expect(modal.locator('#project-modal-title')).not.toBeEmpty();
    await expect(modal.locator('#project-modal-description')).not.toBeEmpty();
    await expect(modal.locator('.project-modal-carousel')).toBeVisible();

    // Test the carousel functionality
    const carouselImages = modal.locator('.carousel-images img');
    const nextButton = modal.getByTestId('carousel-next');
    const prevButton = modal.getByTestId('carousel-prev');

    // Assuming there's more than one image for the test to be meaningful
    const imageCount = await carouselImages.count();
    if (imageCount > 1) {
      // Check initial state
      await expect(carouselImages.nth(0)).toBeVisible();
      await expect(carouselImages.nth(1)).toBeHidden();

      // Click next and verify the second image is shown
      await nextButton.click();
      await expect(carouselImages.nth(0)).toBeHidden();
      await expect(carouselImages.nth(1)).toBeVisible();

      // Click prev and verify the first image is shown again
      await prevButton.click();
      await expect(carouselImages.nth(0)).toBeVisible();
      await expect(carouselImages.nth(1)).toBeHidden();
    }

    // Close the modal and verify it's hidden
    await modal.locator('.modal-close').click();
    await expect(modal).toBeHidden();
  });

  test('should open and close the video lightbox', async ({ page }) => {
    // Scroll to the software section and find the "Bekijk Demo" button
    const softwareSection = page.locator('#software');
    await softwareSection.scrollIntoViewIfNeeded();
    await softwareSection.getByTestId('software-demo-video').click();

    // Verify the lightbox is visible and the video is playing
    const lightbox = page.getByTestId('video-lightbox');
    await expect(lightbox).toBeVisible();
    const video = lightbox.locator('video');
    await expect(video).toHaveAttribute('src', 'videos/dummy102.mp4');

    // Close the lightbox and verify it's hidden
    await lightbox.getByTestId('lightbox-close').click();
    await expect(lightbox).toBeHidden();
  });
});
