// --- Client-Side Authentication Module (auth.js) ---

// Note: js-sha256.js must be included in any HTML file that uses this script.
// <script src="https://cdnjs.cloudflare.com/ajax/libs/js-sha256/0.9.0/sha256.min.js"></script>

const SESSION_KEY = 'loggedIn';

/**
 * Checks if the provided password matches the stored hash.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} - True if the password is correct, false otherwise.
 */
function login(password) {
    // config.js will contain ADMIN_PASSWORD_HASH
    const storedHash = window.config.ADMIN_PASSWORD_HASH;
    const inputHash = sha256(password); // Hash the input password

    if (inputHash === storedHash) {
        sessionStorage.setItem(SESSION_KEY, 'true');
        return true;
    }
    return false;
}

/**
 * Logs the user out by clearing the session storage.
 */
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html'; // Redirect to login page
}

/**
 * Checks if the user is currently authenticated.
 * @returns {boolean} - True if the user is logged in, false otherwise.
 */
function isAuthenticated() {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
}

/**
 * If the user is not authenticated, redirects them to the login page.
 * This function should be called at the top of any protected page.
 */
function protectPage() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
    }
}
