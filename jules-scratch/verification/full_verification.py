from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            # --- Step 1: Verify Main Page Project Modals ---
            print("Verifying main page project modals...")
            page.goto('http://localhost:3000/', wait_until='networkidle')

            # Expect the "Onze Projecten" section to be visible
            projects_section = page.locator('h2:has-text("Onze Projecten")')
            expect(projects_section).to_be_visible()

            # Find the first project card and click its "Lees Meer" button
            first_project_card = page.locator('.project-card').first
            read_more_button = first_project_card.locator('.read-more-btn')
            expect(read_more_button).to_be_visible()
            read_more_button.click()

            # Expect the project detail modal to appear
            project_modal = page.locator('#project-detail-modal')
            expect(project_modal).to_be_visible(timeout=5000)

            # Take a screenshot of the opened modal
            page.screenshot(path='jules-scratch/verification/main_page_modal_verification.png')
            print("Main page verification successful.")

            # Close the modal
            project_modal.locator('.modal-close').click()
            expect(project_modal).not_to_be_visible()


            # --- Step 2: Verify Admin Panel ---
            print("Verifying admin panel...")
            # Navigate to the login page
            page.goto('http://localhost:3000/login', wait_until='networkidle')

            # Fill in the password and submit
            page.fill('#password', 'Martijn1')
            page.click('button[type="submit"]')

            # Wait for the admin page to load
            page.wait_for_url('http://localhost:3000/admin', wait_until='networkidle')

            # Use a specific selector for the heading
            heading = page.locator('h1:has-text("Project Management")')
            expect(heading).to_be_visible()

            # Take a screenshot
            page.screenshot(path='jules-scratch/verification/admin_page_verification.png')
            print('Admin panel verification successful.')

        except Exception as e:
            print(f'An error occurred: {e}')
            page.screenshot(path='jules-scratch/verification/verification_error.png')
        finally:
            browser.close()

if __name__ == '__main__':
    run_verification()
