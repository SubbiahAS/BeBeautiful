// pages/SignupPage.js
// Page Object Model for the Signup / Register page.

const BasePage = require('./BasePage');
const {
  isVisible,
  handleCookieBanner,
  stabilizePage
} = require('../utils/helpers');

const NOISE_LABELS = new Set([
  'sign up',
  'sign-up',
  'signup',
  'sign me up',
  'google',
  'facebook',
  'login',
  'resend',
  'otp',
  'verify',
  'continue',
  'next'
]);

class SignupPage extends BasePage {

  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Signup Panel ──────────────────────────────────────────
    this.signupImage = page.locator(
      '.signupLeftPanel, .content-beautiful'
    );

    // ── Headings & Text ───────────────────────────────────────
    this.letsGetStarted = page.locator(
      '.register h2.heading'
    );

    this.welcomeText = page.locator(
      '.register h3.welcome'
    );

    this.letsMakeOfficial = page.locator(
      '.register h4.welcomeSignUp'
    );

    // ── Input & Buttons ───────────────────────────────────────
    // this.mobileInput = page.locator(
    //   'input[type="tel"], ' +
    //   'input[placeholder*="Mobile"], ' +
    //   'input[placeholder*="mobile"], ' +
    //   'input[name="mobile"]'
    // );

    this.mobileInput = page.locator(
      'input[type="tel"], ' +
      'input[placeholder*="Mobile"], ' +
      'input[placeholder*="mobile"], ' +
      'input[name="mobile"]'
    );

    // this.signupBtn = page.locator(
    //   'button:has-text("Sign-up"), ' +
    //   'button:has-text("Sign Up"), ' +
    //   'button:has-text("Signup"), ' +
    //   'button:has-text("SIGN UP")'
    // );

    // ── Signup button ─────────────────────────────────────────────
    // this.signupBtn = page.locator(
    //   [
    //     'button:has-text("Sign Up")',
    //     'button:has-text("Sign-up")',
    //     'button:has-text("Signup")',
    //     'button:has-text("SIGN UP")',
    //     'button[type="submit"]',
    //     'input[type="submit"]',
    //     'a:has-text("Sign Up")',
    //     'a:has-text("Sign-up")',
    //     'a:has-text("Signup")'
    //   ].join(', ')
    // );

    this.signupBtn = page.locator(
      [
        'button:has-text("Sign Up")',
        'button:has-text("Sign-up")',
        'button:has-text("Signup")',
        'button:has-text("SIGN UP")',
        'button[type="submit"]',
        'input[type="submit"]',
        'a:has-text("Sign Up")',
        'a:has-text("Sign-up")',
        'a:has-text("Signup")'
      ].join(', ')
    );

    this.googleLoginBtn = page.locator(
      'button:has-text("Google"), [aria-label="Google"]'
    );

    this.facebookLoginBtn = page.locator(
      'button:has-text("Facebook"), [aria-label="Facebook"]'
    );

    this.loginLink = page.locator('text=Login');

    // ── Create account link ───────────────────────────────────
    this.createAccountLink = page.locator(`
      a:has-text("Create a new account"),
      a:has-text("Create Account"),
      a:has-text("Sign Up"),
      button:has-text("Sign Up"),
      button:has-text("Signup"),
      [href*="signup"],
      [href*="register"]
    `);

    // ── Profile / account menu ─────────────────────────────────
    this.profileBtn = page.locator('button.profile');

    // ── OTP / next-step indicators ─────────────────────────────
    this.otpInput = page.locator(
      'input[name="otp"], ' +
      'input[placeholder*="OTP"], ' +
      'input[placeholder*="otp"], ' +
      'input[autocomplete="one-time-code"], ' +
      'input.otp-input, ' +
      '[class*="otp"] input, ' +
      'input[maxlength="6"], ' +
      'input[maxlength="4"]'
    );

    this.otpStepHeading = page.locator(
      'text=/verify/i, ' +
      'text=/OTP/i, ' +
      'text=/enter.*code/i, ' +
      'text=/otp sent/i, ' +
      'text=/we.*sent/i, ' +
      'text=/code sent/i'
    );

    this.resendOtpBtn = page.locator(
      'button:has-text("Resend"), a:has-text("Resend")'
    );

    // ── Registered account message ─────────────────────────────
    this.accountExistsText = page.locator(
      'text=/already\\s+(signed\\s*up|registered|exists?)/i'
    );

    // ── Generic message selectors ─────────────────────────────
    const rawSelectors = [
      '.errorContainer .error',
      '.mobile-error',
      '.phone-validation-message',
      '.login-error-text',
      '.error-message',
      '.validation-error',
      '.field-error',
      'p.error',
      '[role="alert"]',
      '.toast',
      '.Toastify__toast',
      '.Toastify__toast-body',
      '.notification',
      '.notification-message',
      '.snackbar',
      '.alert',
      '.alert-danger',
      '.MuiAlert-message',
      '.MuiFormHelperText-root',
      'span.error',
      'div.error',
      '[class*="error"]',
      '[class*="Error"]',
      '[class*="invalid"]',
      '[class*="Invalid"]'
    ];

    this.genericMessageSelectors = rawSelectors.map(
      sel => `${sel}:not(button):not(a):not(input)`
    );

    this.validationErrorSelectors =
      this.genericMessageSelectors;

    this.accountExistsSelectors =
      this.genericMessageSelectors;

    this.mandatoryFieldErrorSelectors =
      this.genericMessageSelectors;
  }

  // ────────────────────────────────────────────────────────────
  // Navigation
  // ────────────────────────────────────────────────────────────

  async navigateTo() {
    try {
      await this.goto('/');
      await stabilizePage(this.page);
      await handleCookieBanner(this.page);

      const profileBtn = this.profileBtn.first();

      await profileBtn.waitFor({
        state: 'visible',
        timeout: 10000
      });

      await profileBtn.scrollIntoViewIfNeeded().catch(() => { });
      await profileBtn.click({ timeout: 10000 });

      await this.page.waitForTimeout(1000);

      const createAccountLink =
        this.createAccountLink.first();

      await createAccountLink.waitFor({
        state: 'visible',
        timeout: 8000
      });

      await createAccountLink
        .scrollIntoViewIfNeeded()
        .catch(() => { });

      await Promise.all([
        this.page
          .waitForURL(/register|signup/, {
            timeout: 10000
          })
          .catch(() => { }),

        createAccountLink.click({
          timeout: 10000
        })
      ]);

      await this.page.waitForTimeout(800);

      const signupVisible =
        await Promise.race([
          isVisible(
            this.page,
            'input[type="tel"]',
            3000
          ),

          isVisible(
            this.page,
            'input[name="mobile"]',
            3000
          ),

          isVisible(
            this.page,
            'input[placeholder*="Mobile"]',
            3000
          ),

          isVisible(
            this.page,
            'input[placeholder*="mobile"]',
            3000
          )
        ]);

      if (signupVisible) {
        return true;
      }

    } catch (err) {
      console.log(
        `⚠️ Primary signup navigation failed: ${err.message}`
      );
    }

    return this.navigateDirect();
  }

  async navigateDirect() {
    try {
      await this.goto('/register');

      await this.page.waitForTimeout(1000);

      const found =
        await isVisible(
          this.page,
          'input[type="tel"]',
          8000
        );

      if (found) {
        return true;
      }

    } catch (err) {
      console.log(
        `❌ navigateDirect failed: ${err.message}`
      );
    }

    return false;
  }

  async ensureOnSignupForm() {
    if (this.page.isClosed()) {
      return false;
    }

    const alreadyVisible =
      await this.mobileInput
        .first()
        .isVisible()
        .catch(() => false);

    if (alreadyVisible) {
      return true;
    }

    if (await this.navigateDirect()) {
      return true;
    }

    if (await this.navigateTo()) {
      return true;
    }

    try {
      await this.page.reload({
        waitUntil: 'domcontentloaded'
      });

      await this.page.waitForTimeout(1000);

      return await isVisible(
        this.page,
        'input[type="tel"]',
        6000
      );

    } catch (err) {
      console.log(
        `❌ ensureOnSignupForm reload failed: ${err.message}`
      );

      return false;
    }
  }

  // ────────────────────────────────────────────────────────────
  // Signup Actions
  // ────────────────────────────────────────────────────────────

  async enterMobileNumber(number) {

    const input = this.mobileInput.first();

    await input.waitFor({
      state: 'visible',
      timeout: 10000
    });

    await input.scrollIntoViewIfNeeded().catch(() => { });

    await input.fill(String(number));

    await this.page.waitForTimeout(300);
  }

  async clearMobileNumber() {

    const input = this.mobileInput.first();

    await input.fill('');

    await this.page.waitForTimeout(200);
  }

  async getMobileInputValue() {

    return this.mobileInput
      .first()
      .inputValue()
      .catch(() => '');
  }

  async clickSignup() {
    const candidates = [
      this.signupBtn,
      this.page.locator('button[type="submit"]'),
      this.page.locator('input[type="submit"]'),
      this.page.getByRole('button', { name: /sign[\s-]*up/i }),
      this.page.getByRole('button', { name: /continue/i })
    ];

    for (const locator of candidates) {
      try {
        const count = await locator.count();

        if (count === 0) {
          continue;
        }

        for (let i = 0; i < count; i++) {
          const btn = locator.nth(i);

          if (!(await btn.isVisible().catch(() => false))) {
            continue;
          }

          await btn.scrollIntoViewIfNeeded().catch(() => { });
          await this.page.waitForTimeout(300);

          const disabled = await btn.isDisabled().catch(() => false);

          if (disabled) {
            console.log('⚠️ Signup button is disabled');
            continue;
          }

          try {
            await btn.click({ timeout: 10000 });
          } catch (normalError) {
            console.log(
              `⚠️ Normal Signup click failed: ${normalError.message}`
            );

            await btn.click({
              timeout: 5000,
              force: true
            });
          }

          await this.page.waitForTimeout(700);

          console.log('✓ Signup button clicked successfully');

          return true;
        }
      } catch (error) {
        console.log(
          `⚠️ Signup locator attempt failed: ${error.message}`
        );
      }
    }

    console.log('❌ Could not find a visible Signup button');

    // Diagnostic information
    try {
      const buttons = await this.page.locator('button').allTextContents();

      console.log(
        '🔎 Buttons currently available:',
        JSON.stringify(buttons)
      );
    } catch (error) {
      console.log(
        `⚠️ Could not collect button diagnostics: ${error.message}`
      );
    }

    return false;
  }

  async blurMobileInput() {

    await this.mobileInput
      .first()
      .press('Tab')
      .catch(() => { });

    await this.page.waitForTimeout(300);
  }

  // ────────────────────────────────────────────────────────────
  // Text Helpers
  // ────────────────────────────────────────────────────────────

  async captureBodyText() {

    try {
      return (
        await this.page
          .locator('body')
          .innerText()
      ) || '';

    } catch {
      return '';
    }
  }

  static isNoiseLabel(text) {

    return NOISE_LABELS.has(
      text.trim().toLowerCase()
    );
  }

  async waitForNewText(
    beforeText,
    timeout = 5000
  ) {

    const start = Date.now();

    const beforeLines =
      new Set(
        beforeText
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean)
      );

    while (Date.now() - start < timeout) {

      if (this.page.isClosed()) {
        return {
          found: false,
          text: ''
        };
      }

      const currentText =
        await this.captureBodyText();

      const currentLines =
        currentText
          .split('\n')
          .map(l => l.trim())
          .filter(Boolean);

      const meaningfulNew =
        currentLines.filter(
          l =>
            !beforeLines.has(l) &&
            l.length > 4 &&
            l.length < 200 &&
            !SignupPage.isNoiseLabel(l)
        );

      if (meaningfulNew.length > 0) {

        return {
          found: true,
          text: meaningfulNew.join(' | ')
        };
      }

      await this.page.waitForTimeout(300);
    }

    return {
      found: false,
      text: ''
    };
  }

  async findMessage(
    selectors,
    beforeText = '',
    timeout = 5000
  ) {

    for (const sel of selectors) {

      try {

        const locator =
          this.page.locator(sel);

        const count =
          await locator.count();

        for (let i = 0; i < count; i++) {

          const el = locator.nth(i);

          if (
            !(await el.isVisible().catch(() => false))
          ) {
            continue;
          }

          const text =
            (
              await el.textContent()
            )?.trim() || '';

          if (
            text &&
            !SignupPage.isNoiseLabel(text)
          ) {

            return {
              found: true,
              text
            };
          }
        }

      } catch {
        // Continue with next selector
      }
    }

    if (beforeText) {

      const diffResult =
        await this.waitForNewText(
          beforeText,
          timeout
        );

      if (diffResult.found) {
        return diffResult;
      }
    }

    return {
      found: false,
      text: ''
    };
  }

  async getValidationError(beforeText = '') {

    return this.findMessage(
      this.validationErrorSelectors,
      beforeText,
      4000
    );
  }

  async getMandatoryFieldError(beforeText = '') {

    return this.findMessage(
      this.mandatoryFieldErrorSelectors,
      beforeText,
      4000
    );
  }

  // ────────────────────────────────────────────────────────────
  // Registered Account Detection
  // ────────────────────────────────────────────────────────────

  async getAccountExistsError(
    beforeText = '',
    timeout = 10000
  ) {

    const accountPattern =
      /already\s+(signed\s*up|registered|exists?)|account\s+(already\s+)?exists|mobile\s+(number\s+)?already\s+(registered|exists)|phone\s+(number\s+)?already\s+(registered|exists)/i;

    const start = Date.now();

    while (
      Date.now() - start < timeout
    ) {

      if (this.page.isClosed()) {
        return {
          found: false,
          text: ''
        };
      }

      // 1. Exact account-exists selectors
      try {

        const exactMatches =
          this.page.locator(
            'text=/already\\s+(signed\\s*up|registered|exists?)/i'
          );

        const count =
          await exactMatches.count();

        for (let i = 0; i < count; i++) {

          const el =
            exactMatches.nth(i);

          if (
            await el.isVisible().catch(() => false)
          ) {

            const text =
              (
                await el.innerText().catch(() => '')
              ).trim();

            if (
              text &&
              !SignupPage.isNoiseLabel(text)
            ) {

              return {
                found: true,
                text
              };
            }
          }
        }

      } catch {
        // Continue with body-text fallback
      }

      // 2. Scan complete visible body text
      const bodyText =
        await this.captureBodyText();

      const match =
        bodyText.match(accountPattern);

      if (match) {

        const matchingLine =
          bodyText
            .split('\n')
            .map(line => line.trim())
            .find(line =>
              accountPattern.test(line)
            );

        return {
          found: true,
          text:
            matchingLine ||
            match[0]
        };
      }

      // 3. Check generic selectors
      const genericResult =
        await this.findMessage(
          this.accountExistsSelectors,
          beforeText,
          1000
        );

      if (genericResult.found) {

        const text =
          genericResult.text.trim();

        if (accountPattern.test(text)) {

          return {
            found: true,
            text
          };
        }
      }

      await this.page.waitForTimeout(300);
    }

    return {
      found: false,
      text: ''
    };
  }

  async captureAnyVisibleMessage() {

    for (
      const sel of this.genericMessageSelectors
    ) {

      try {

        const locator =
          this.page.locator(sel);

        const count =
          await locator.count();

        for (let i = 0; i < count; i++) {

          const el =
            locator.nth(i);

          if (
            !(await el.isVisible().catch(() => false))
          ) {
            continue;
          }

          const text =
            (
              await el.textContent()
            )?.trim() || '';

          if (
            text &&
            !SignupPage.isNoiseLabel(text)
          ) {

            return {
              found: true,
              text
            };
          }
        }

      } catch {
        // Continue
      }
    }

    return {
      found: false,
      text: ''
    };
  }

  // ────────────────────────────────────────────────────────────
  // Signup / OTP State Detection
  // ────────────────────────────────────────────────────────────

  async isSignupFormVisible() {

    if (this.page.isClosed()) {
      return false;
    }

    return await this.mobileInput
      .first()
      .isVisible()
      .catch(() => false);
  }

  async isOtpStepVisible() {
    if (this.page.isClosed()) {
      return false;
    }

    // 1. Actual visible OTP input
    const otpInputVisible = await this.otpInput
      .filter({ visible: true })
      .first()
      .isVisible()
      .catch(() => false);

    if (otpInputVisible) {
      return true;
    }

    // 2. Strong OTP heading indicators
    const otpHeading = this.page.locator(
      [
        'h1:has-text("Enter OTP")',
        'h2:has-text("Enter OTP")',
        'h3:has-text("Enter OTP")',
        'h1:has-text("OTP Verification")',
        'h2:has-text("OTP Verification")',
        'h3:has-text("OTP Verification")',
        'h1:has-text("Verify OTP")',
        'h2:has-text("Verify OTP")',
        'h3:has-text("Verify OTP")',
        '[data-testid*="otp"]',
        '[data-testid*="OTP"]'
      ].join(', ')
    );

    if (
      await otpHeading
        .filter({ visible: true })
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      return true;
    }

    // 3. URL-based detection
    const url = this.page.url();

    if (/\/otp(?:\/|$)|\/verify(?:\/|$)|\/verification(?:\/|$)/i.test(url)) {
      return true;
    }

    // IMPORTANT:
    // Do NOT scan the complete body for generic words such as
    // "verify", "code", or "verification".
    //
    // Those words can exist on the signup page itself and create
    // false OTP detection.

    return false;
  }

  async isOnNextStep(timeout = 8000) {

    const start = Date.now();

    while (
      Date.now() - start < timeout
    ) {

      if (this.page.isClosed()) {
        return false;
      }

      if (
        await this.isOtpStepVisible()
      ) {
        return true;
      }

      await this.page.waitForTimeout(400);
    }

    return false;
  }

  async waitForSignupResponse(timeout = 12000) {

    const start = Date.now();

    while (
      Date.now() - start < timeout
    ) {

      if (this.page.isClosed()) {
        return {
          state: 'unknown',
          message: ''
        };
      }

      const accountExists =
        await this.getAccountExistsError(
          '',
          500
        );

      if (accountExists.found) {

        return {
          state: 'registered',
          message: accountExists.text
        };
      }

      if (
        await this.isOtpStepVisible()
      ) {

        return {
          state: 'otp',
          message: ''
        };
      }

      const generic =
        await this.captureAnyVisibleMessage();

      if (generic.found) {

        return {
          state: 'message',
          message: generic.text
        };
      }

      await this.page.waitForTimeout(300);
    }

    return {
      state: 'unknown',
      message: ''
    };
  }
}

module.exports = SignupPage;