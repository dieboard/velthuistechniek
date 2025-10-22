import { test, expect } from '@playwright/test';

test.describe('Main Page Modal Verification', () => {
  test('should open and close the project modal', async ({ page }) => {
    // 1. Navigate and wait for a stable element (not networkidle)
    await page.goto('http://localhost:3000/');
    await expect(
      page.getByRole('heading', { name: 'Velthuis Techniek', exact: true }),
    ).toBeVisible();

    // 2. Locate the projects section container
    const projectsSection = page.locator('#projects');

    // 3. Scroll to the section and wait for its title to appear
    await projectsSection.scrollIntoViewIfNeeded();
    await expect(
      projectsSection.getByRole('heading', { name: 'Onze Projecten' }),
    ).toBeVisible();

    // 4. Find the first project card (using the data-testid we added)
    const firstProjectCard = projectsSection.locator('[data-testid="project-card"]').first();

    // 5. Find the button by its role (the best practice)
    const readMoreButton = firstProjectCard.getByRole('button', {
      name: 'Lees Meer',
    });
    await expect(readMoreButton).toBeVisible();
    await readMoreButton.click();

    // 6. Expect the project detail modal to appear
    const projectModal = page.locator('#project-detail-modal');
    await expect(projectModal).toBeVisible({ timeout: 5000 });

    // Take a screenshot (this part is fine)
    await page.screenshot({
      path: 'tests/screenshots/main_page_modal_verification.png',
      fullPage: false, // Optional: just screenshot the modal area
      clip: await projectModal.boundingBox() ?? undefined
    });

    // 7. Close the modal using a stable test-id
    await projectModal.locator('[data-testid="modal-close"]').click();
    await expect(projectModal).not.toBeVisible();
  });
});