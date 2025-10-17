import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Corrected file path
        await page.goto("file:///app/index.html")

        # Open the image grid modal
        await page.click('[data-modal-target="#image-grid-modal"]')
        await page.wait_for_selector("#image-grid-modal.active")

        # Click on the first image in the grid
        first_image = page.locator(".image-grid img").first
        await first_image.click()

        # Wait for the lightbox to be visible
        await page.wait_for_selector("#image-lightbox", state="visible")

        # Take a screenshot of the lightbox
        await page.screenshot(path="jules-scratch/verification/gallery-lightbox.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())