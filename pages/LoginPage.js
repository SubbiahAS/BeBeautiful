// pages/LoginPage.js
// Page Object Model for the Login page — UI elements, navigation and actions.

const BasePage = require('./BasePage');
const { isVisible, findFirst, handleCookieBanner, stabilizePage } = require('../utils/helpers');

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Login Panel ───────────────────────────────────────────
    this.loginBanner = page.locator('.loginLeftPanel');
    this.leftPanel = page.locator('.loginLeftPanel');
    this.rightPanel = page.locator('.loginRightPanel');

    // ── Headings & Text ───────────────────────────────────────
    this.heading = page.locator('h2.heading');
    this.subHeading = page.locator('h3.authWelcome');
    this.feelsGoodText = page.locator('.login h2.heading');
    this.letsDiveText = page.locator('.login h3.authWelcome');

    // ── Input & Buttons ───────────────────────────────────────
    this.mobileInput = page.locator('input[type="tel"], input[placeholder*="Mobile"], input[placeholder*="mobile"], input[name="mobile"]');
    this.loginBtn = page.locator('button:has-text("Login"), button:has-text("LOG IN"), button:has-text("Sign In")');
    this.googleLoginBtn = page.locator('button:has-text("Google"), [aria-label="Google"]');
    this.facebookLoginBtn = page.locator('button:has-text("Facebook"), [aria-label="Facebook"]');
    this.createAccountLink = page.locator('a:has-text("Create a new account"), a:has-text("Create Account"), a:has-text("Sign Up")');
    //     this.createAccountLink = page.locator(`
    //   a:has-text("Create a new account"),
    //   a:has-text("Create Account"),
    //   a:has-text("Sign Up"),
    //   button:has-text("Sign Up"),
    //   button:has-text("Signup"),
    //   [href*="register"],
    //   [href*="signup"]
    // `);
    this.otpInput = page.locator('input[placeholder*="OTP"], input[name="otp"]');

    // ── Profile icon fallback selectors ───────────────────────
    this.profileIconSelectors = [
      'button.profile',
      'a[href="/login"] button.profile',
      'a[href="/login"]',
      '.profile-btn',
      '.user-icon',
      '[aria-label="Profile"]',
      'a[href*="login"]',
      'a[href*="account"]',
      '.login-btn',
    ];

    // ── Validation error selectors (fallback list) ────────────
    this.validationErrorSelectors = [
      '.errorContainer .error',
      '.mobile-error',
      '.phone-validation-message',
      '.login-error-text',
      '.error-message',
      '.validation-error',
      '.field-error',
      'p.error',
    ];
  }

  // ── Navigation ────────────────────────────────────────────────

  /**
   * Navigate to the login page via the homepage profile icon.
   * Falls back to direct /login URL if the homepage flow fails.
   * @returns {Promise<boolean>}
   */
  async navigateTo() {
    try {
      await this.goto('/');
      await stabilizePage(this.page);
      await handleCookieBanner(this.page);

      // await this.page.locator('button.profile').waitFor({ state: 'visible', timeout: 10000 });

      const profileBtn = await findFirst(this.page, this.profileIconSelectors);
      if (profileBtn) {
        await profileBtn.scrollIntoViewIfNeeded().catch(() => { });
        await profileBtn.click({ force: true, timeout: 10000 });

        await Promise.race([
          this.page.waitForURL('**/login', { timeout: 10000 }),
          this.mobileInput.waitFor({ state: 'visible', timeout: 10000 }),
        ]).catch(() => { });

        // const loginVisible = await isVisible(this.page, 'input[type="tel"]', 8000);
        // if (loginVisible) return true;
        const loginVisible =
          await Promise.race([
            isVisible(this.page, 'input[type="tel"]', 8000),
            isVisible(this.page, 'input[name="mobile"]', 8000),
            isVisible(this.page, 'input[placeholder*="Mobile"]', 8000),
            isVisible(this.page, '.login h2.heading', 8000),
            isVisible(this.page, '.auth-page', 8000),
            isVisible(this.page, '.login-page', 8000),
          ]);

        if (loginVisible) {
          console.log('✅ Login page detected');
          return true;
        }
      }

      // if (!profileBtn) {
      //   console.log('❌ Profile/Login button not found');
      //   return false;
      // }

      console.log('⚠️ Homepage login flow failed, trying /login directly');
    } catch (err) {
      console.log(`⚠️ navigateTo via homepage failed: ${err.message}`);
    }

    try {
      await this.goto('/login');
      await stabilizePage(this.page);
      await handleCookieBanner(this.page);
      return await isVisible(this.page, 'input[type="tel"]', 8000);
    } catch (err) {
      console.log(`❌ Direct /login navigation failed: ${err.message}`);
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────

  async enterMobileNumber(number) {
    await this.mobileInput.first().fill(number);
  }

  async clickLogin() {
    const btn = await findFirst(this.page, ['button:has-text("Login")', 'button:has-text("LOG IN")', 'button:has-text("Sign In")']);
    if (btn) await btn.click();
  }

  async enterOtp(otp) {
    await this.otpInput.fill(otp);
  }

  /**
   * Check if any validation error is displayed.
   * @returns {Promise<{found: boolean, text: string}>}
   */
  async getValidationError() {
    for (const sel of this.validationErrorSelectors) {
      try {
        const el = this.page.locator(sel).first();
        await el.waitFor({ state: 'visible', timeout: 2000 });
        const text = (await el.textContent()) || '';
        if (text.trim()) return { found: true, text };
      } catch {
        // Try next selector
      }
    }
    return { found: false, text: '' };
  }

  async clearMobileInput() {
    await this.mobileInput.first().fill('');
  }

  async blurMobileInput() {
    await this.mobileInput.first().blur();
    await this.page.keyboard.press('Tab');
  }
}

module.exports = LoginPage;
