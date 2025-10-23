// --- Client-Side Authentication Module (auth.js) ---

// Note: bcrypt.js must be included in any HTML file that uses this script.
// <script src="https://cdn.jsdelivr.net/npm/bcryptjs@2.4.3/dist/bcrypt.min.js"></script>

const SESSION_KEY = 'loggedIn';

/**
 * Checks if the provided password matches the stored hash.
 * @param {string} password - The password entered by the user.
 * @returns {boolean} - True if the password is correct, false otherwise.
 */
async function login(password) {
    if (typeof dcodeIO === 'undefined' || typeof dcodeIO.bcrypt === 'undefined') {
        console.error("bcrypt.js is not loaded. Make sure the script tag is included in your HTML.");
        return false;
    }
    // config.js will be created in the next step and will contain ADMIN_PASSWORD_HASH
    const storedHash = window.config.ADMIN_PASSWORD_HASH;
    const isMatch = await dcodeIO.bcrypt.compareSync(password, storedHash);
    if (isMatch) {
        sessionStorage.setItem(SESSION_KEY, 'true');
    }
    return isMatch;
}

/**
 * Logs the user out by clearing the session storage.
 */
function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = '/login.html'; // Redirect to login page
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
        window.location.href = '/login.html';
    }
}
