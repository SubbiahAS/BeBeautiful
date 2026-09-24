// pages/BasePage.js
// Base class shared by all Page Object Model classes.
// Provides common navigation, wait, and utility methods.

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────

  async goto(url, waitUntil = 'domcontentloaded') {
    await this.page.goto(url, { waitUntil });
  }

  async gotoNetworkIdle(url) {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  // ── Waits ─────────────────────────────────────────────────────

  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  async waitForVisible(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  async waitForHidden(selector, timeout = 10000) {
    await this.page.waitForSelector(selector, { state: 'hidden', timeout });
  }

  // ── Login Popup ───────────────────────────────────────────────

  async closeLoginPopupIfPresent(targetPage = this.page) {
    const popup = targetPage.locator('.modalPoplogin');
    if (await popup.isVisible().catch(() => false)) {
      const closeBtn = targetPage.locator('.modalPoplogin .closeIcon');
      await closeBtn.click({ force: true }).catch(() => {});
      await targetPage.waitForTimeout(2000);
    }
  }

  // ── Scroll ────────────────────────────────────────────────────

  async scrollIntoView(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToSelector(selector) {
    await this.page.locator(selector).first().scrollIntoViewIfNeeded();
  }

  // ── URL helpers ───────────────────────────────────────────────

  currentUrl() {
    return this.page.url();
  }

  async title() {
    return this.page.title();
  }
}

module.exports = BasePage;
