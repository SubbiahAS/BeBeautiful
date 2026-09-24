// pages/HeaderPage.js
// Page Object Model for the site Header — nav, search trigger, profile, cart.

const BasePage = require('./BasePage');

class HeaderPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Locators ──────────────────────────────────────────────

    // Header Container
    this.container = page.locator('.header-container');
    this.content = page.locator('.header-content');
    this.logo = page.locator('.logo-container');

    // Navigation
    this.desktopNav = page.locator('.desktop-nav');
    this.navItems = page.locator('li.nav-item');
    this.navButtons = page.locator('button.nav-link');
    this.navLinks = page.locator('nav.desktop-nav .nav-link');
    this.aboutUs = page.locator('a.nav-link-item');

    // Submenu
    this.submenuContainer = page.locator('.submenu-container');
    this.submenuGrid = page.locator('.submenu-grid');
    this.submenuItems = page.locator('.submenu-item');
    this.submenuItemHeadings = page.locator('.submenu-item h3');
    this.closeSubmenu = page.locator('.close-submenu');

    // Icons
    this.searchBtn = page.locator('button.search-btn');
    this.cartBtn = page.locator('.header-container .cart-btn');

    // Profile icon uses an ordered list of fallback selectors
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
  }

  // ── Methods ───────────────────────────────────────────────────

  /**
   * Return the first visible profile/login button using fallback selectors.
   * @returns {Promise<import('@playwright/test').Locator|null>}
   */
  async getProfileIcon() {
    for (const sel of this.profileIconSelectors) {
      const el = this.page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) return el;
    }
    return null;
  }

  /**
   * Click the profile icon to open the login/account flow.
   */
  async clickProfileIcon() {
    const icon = await this.getProfileIcon();
    if (icon) {
      await icon.scrollIntoViewIfNeeded().catch(() => {});
      await icon.click({ force: true });
    } else {
      throw new Error('Profile icon not found in header');
    }
  }

  /**
   * Hover over a nav item by index to open its submenu.
   * @param {number} index
   */
  async hoverNavItem(index) {
    const item = this.navItems.nth(index);
    await item.hover();
    await this.page.waitForTimeout(500);
  }

  /**
   * Click the header search button.
   */
  async clickSearch() {
    await this.searchBtn.click();
  }

  /**
   * Wait for the header container to be visible.
   */
  async waitForHeader() {
    await this.container.waitFor({ state: 'visible', timeout: 15000 });
  }
}

module.exports = HeaderPage;
