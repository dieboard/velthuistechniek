import { test, expect } from '@playwright/test';

test.describe('Homepage: Static Content (Above the Fold)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/');
  });

  test('should display the main page title', async ({ page }) => {
    // We can use getByRole for the main h1, it's very readable
    await expect(
      page.getByRole('heading', { 
        name: 'Velthuis Techniek',
        exact: true }),
    ).toBeVisible();
  });

  test('should display the "Welkom" section title', async ({ page }) => {
    // This section is probably always visible, so no scroll is needed
    await expect(
      page.getByRole('heading', { name: 'Welkom bij Velthuis Techniek' }),
    ).toBeVisible();
  });
});

test.describe('Homepage: Lazy-Loaded Sections', () => {
  // Define all the sections you want to test in one place
  const sectionsToTest = [
    { id: '#why-security', title: 'Waarom Beveiliging Belangrijk Is' },
    { id: '#how-it-works', title: 'Hoe Wij Installeren' },
    { id: '#projects', title: 'Onze Projecten' },
    { id: '#software', title: 'Onze Software' },
    { id: '#contact', title: 'Neem Contact Op' },
  ];

  // Loop over the array and create a test for each section
  for (const sectionInfo of sectionsToTest) {
    test(`should display the "${sectionInfo.title}" section after scrolling`, async ({
      page,
    }) => {
      await page.goto('http://localhost:3000/');

      // 1. Get a locator for the section *container*
      const sectionContainer = page.locator(sectionInfo.id);

      // 2. Scroll that container into view
      await sectionContainer.scrollIntoViewIfNeeded();

      // 3. Find the heading *within* that specific section container.
      // This is crucial. It's scoped and avoids finding titles in modals.
      const sectionHeading = sectionContainer.getByRole('heading', {
        name: sectionInfo.title,
      });

      // 4. Assert that the heading is now visible
      await expect(sectionHeading).toBeVisible();
    });
  }
});