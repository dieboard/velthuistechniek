
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("http://localhost:3000/login")

        # Fill in the password and click the login button
        await page.fill("input[type=password]", "password")
        await page.click("button[type=submit]")

        # Wait for the redirect to the admin page
        await page.wait_for_url("**/admin")

        # Take a screenshot of the admin page
        await page.screenshot(path="jules-scratch/verification/admin_verification.png")

        await browser.close()

asyncio.run(main())
