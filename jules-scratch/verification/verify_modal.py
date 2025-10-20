
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000")

        # Click the first project card
        await page.click(".project-card")

        # Wait for the modal to appear
        await page.wait_for_selector("#project-detail-modal.active")

        # Take a screenshot of the modal
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

asyncio.run(main())
