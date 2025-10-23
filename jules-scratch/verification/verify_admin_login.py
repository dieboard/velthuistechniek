from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    page.goto("http://localhost:8080/login.html")

    password_input = page.locator('#password')
    expect(password_input).to_be_visible()
    password_input.fill("Martijn1")

    login_button = page.get_by_role('button', name='Login')
    expect(login_button).to_be_visible()
    login_button.click()

    expect(page).to_have_url("http://localhost:8080/admin.html")

    page.screenshot(path="jules-scratch/verification/admin_panel.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
