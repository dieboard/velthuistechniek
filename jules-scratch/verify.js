const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });

  // Test "Waarom Beveiliging" modal
  await page.click('button[data-modal-target="#why-security-modal"]');
  await page.waitForSelector('#why-security-modal', { state: 'visible' });
  await page.screenshot({ path: 'why-security-modal.png' });
  await page.click('#why-security-modal .modal-close');
  await page.waitForSelector('#why-security-modal', { state: 'hidden' });

  // Test "Hoe Wij Installeren" modal
  await page.click('button[data-modal-target="#how-we-install-modal"]');
  await page.waitForSelector('#how-we-install-modal', { state: 'visible' });
  await page.screenshot({ path: 'how-we-install-modal.png' });
  await page.click('#how-we-install-modal .modal-close');
  await page.waitForSelector('#how-we-install-modal', { state: 'hidden' });

  // Test "Onze Software" modal
  await page.click('button[data-modal-target="#our-software-modal"]');
  await page.waitForSelector('#our-software-modal', { state: 'visible' });
  await page.screenshot({ path: 'our-software-modal.png' });
  await page.click('#our-software-modal .modal-close');
  await page.waitForSelector('#our-software-modal', { state: 'hidden' });

  await browser.close();
})();