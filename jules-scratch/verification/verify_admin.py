from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Capture console logs
    page.on("console", lambda msg: print(f"Browser console: {msg.text()}"))

    page.goto("http://localhost:3000/admin/")
    page.screenshot(path="jules-scratch/verification/admin_error.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
