// pages/FooterPage.js
// Page Object Model for the Site Footer.

const BasePage = require('./BasePage');

class FooterPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Locators ──────────────────────────────────────────────
    this.footer = page.locator('#footer');
    this.emailInput = page.locator("input[placeholder='Enter Your Email Address']");
    this.signupBtn = page.locator('text=SIGN ME UP');
    this.checkbox = page.locator("input[type='checkbox']");
    this.joinClubText = page.locator('text=Join the club');
    this.thankYouText = page.locator('text=Thank You');
    this.footerDropdown = page.locator('[aria-label="Toggle Important Links"]');
    this.footerLinks = page.locator('.linksWrapper a.linkSeparator');
    this.socialLinks = page.locator('.socialLinks a');
    this.copyright = page.locator('text=©2026 BeBeautiful');
    this.cautionNotice = page.locator('text=Please Be Aware: Cyber crime');
    this.chakshuLink = page.locator("a[href='https://sancharsaathi.gov.in/sfc/']");
  }

  // ── Methods ───────────────────────────────────────────────────

  /**
   * Scroll the footer into view.
   */
  async scrollToFooter() {
    await this.footer.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Enter an email address and click Sign Me Up.
   * @param {string} email
   */
  async subscribeWithEmail(email) {
    await this.emailInput.fill(email);
    await this.signupBtn.click();
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get the text of all footer links.
   * @returns {Promise<string[]>}
   */
  async getFooterLinkTexts() {
    const count = await this.footerLinks.count();
    const texts = [];
    for (let i = 0; i < count; i++) {
      const text = await this.footerLinks.nth(i).textContent();
      texts.push(text?.trim() || '');
    }
    return texts;
  }

  /**
   * Get the href attributes of all social links.
   * @returns {Promise<string[]>}
   */
  async getSocialLinkHrefs() {
    const count = await this.socialLinks.count();
    const hrefs = [];
    for (let i = 0; i < count; i++) {
      const href = await this.socialLinks.nth(i).getAttribute('href');
      hrefs.push(href || '');
    }
    return hrefs;
  }
}

module.exports = FooterPage;
