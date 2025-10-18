import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        try:
            # Construct the full path to the HTML file
            file_path = os.path.abspath("index.html")
            await page.goto(f"file://{file_path}", wait_until="load")

            # 1. Click the button to open the gallery modal
            gallery_button = page.locator('button[data-modal-target="#image-grid-modal"]')
            await gallery_button.click()

            # 2. Wait for the gallery modal to be visible
            await page.wait_for_selector("#image-grid-modal", state="visible")

            # 3. Click the first image in the grid
            gallery_image = page.locator(".image-grid img:first-child")
            await gallery_image.click()

            # 4. Wait for the image lightbox to be visible
            await page.wait_for_selector("#image-lightbox", state="visible")

            # 5. Take a screenshot of the lightbox
            await page.screenshot(path="jules-scratch/verification/lightbox_verification.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())