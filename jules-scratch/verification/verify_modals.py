from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath('index.html')

        page.goto(f'file://{file_path}')

        # Verify the "Why Security" modal
        page.click('[data-modal-target="#why-security-modal"]')
        page.wait_for_selector('#why-security-modal.active')
        page.screenshot(path='jules-scratch/verification/why-security-modal.png')
        page.click('#why-security-modal .modal-close')

        # Verify the "How We Install" modal
        page.click('[data-modal-target="#how-we-install-modal"]')
        page.wait_for_selector('#how-we-install-modal.active')
        page.screenshot(path='jules-scratch/verification/how-we-install-modal.png')
        page.click('#how-we-install-modal .modal-close')

        # Verify the "Our Software" modal
        page.click('[data-modal-target="#our-software-modal"]')
        page.wait_for_selector('#our-software-modal.active')
        page.screenshot(path='jules-scratch/verification/our-software-modal.png')
        page.click('#our-software-modal .modal-close')

        # Verify the "Image Grid" modal
        page.click('[data-modal-target="#image-grid-modal"]')
        page.wait_for_selector('#image-grid-modal.active')
        page.screenshot(path='jules-scratch/verification/image-grid-modal.png')
        page.click('#image-grid-modal .modal-close')

        browser.close()

if __name__ == '__main__':
    run()