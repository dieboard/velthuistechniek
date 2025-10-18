from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Navigate to the local HTML file
    page.goto("file:///app/index.html")

    # Click the "Bekijk Galerij" button to open the gallery modal
    page.click('[data-modal-target="#image-grid-modal"]')

    # Wait for the modal to appear
    page.wait_for_selector("#image-grid-modal.active")

    # Click the first image in the grid to open the lightbox
    page.click('.image-grid img:first-child')

    # Wait for the lightbox to appear
    page.wait_for_selector("#image-lightbox.active")

    # Take a screenshot of the lightbox
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)