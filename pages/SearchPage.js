// pages/SearchPage.js
// Page Object Model for the Search modal overlay.

const BasePage = require('./BasePage');

class SearchPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── Locators ──────────────────────────────────────────────

    // Trigger
    this.searchBtn = page.locator('.search-btn');

    // Modal
    this.modalOverlay = page.locator('.modalOverlaySearchPhase');
    this.modalContent = page.locator('.modalContentRequest.deleteModalSearchPhase');
    this.closeIconDesktop = page.locator('.modalOverlaySearchPhase .closeIcon');
    this.closeIconMobile = page.locator('.modalOverlaySearchPhase .closeIconMobile');

    // Input
    this.inputWrapper = page.locator('.searchInputWrapper');
    this.inputField = page.locator('input#search.searchInputField');
    this.clearIcon = page.locator('.searchClearIcon');

    // Recent Searches
    this.recentSearchSection = page.locator('.recentSearchSection');
    this.recentSearchTitle = page.locator('.recentSearchTitle');
    this.recentSearchItems = page.locator('.recentSearchItem');
    this.recentSearchTexts = page.locator('.recentSearchText');
    this.recentSearchCloseIcons = page.locator('.recentSearchCloseIcon');

    // Latest Reads / Articles
    this.latestReadsBox = page.locator('.bottomFixedBox');
    this.latestReadsHeading = page.locator('.latestReadsHeading');
    this.articleCards = page.locator('.bottomFixedBox .vibeCard');
    this.articleTitles = page.locator('.vibeHeading');
    this.articleImages = page.locator('.vibeImage img');
    this.articleMetas = page.locator('.vibeMeta');
    this.articleAuthorNames = page.locator('.authorName');
    this.articleLinks = page.locator('.vibeContent > a');

    // Product Results (dynamic, post-search — selectors TBD)
    this.resultCount = page.locator(null);
    this.productCards = page.locator(null);
    this.productNames = page.locator(null);
    this.productImages = page.locator(null);
    this.productPrices = page.locator(null);
    this.productDiscounts = page.locator(null);
    this.shopNowLinks = page.locator(null);
  }

  // ── Methods ───────────────────────────────────────────────────

  /**
   * Opens the search modal by clicking the search button and waits for the
   * overlay and input field to be ready.
   */
  async openSearch() {
    await this.searchBtn.click();
    await this.modalOverlay.waitFor({ state: 'visible', timeout: 10000 });
    await this.inputField.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Type a keyword into the search input field.
   * @param {string} keyword
   */
  async typeKeyword(keyword) {
    await this.inputField.click();
    await this.inputField.fill(keyword);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Clear the search input using the clear (×) icon.
   */
  async clearInput() {
    await this.clearIcon.click();
    await this.page.waitForTimeout(1500);
  }

  /**
   * Close the search modal using the desktop close icon.
   */
  async closeSearch() {
    await this.closeIconDesktop.click();
    await this.modalOverlay.waitFor({ state: 'hidden', timeout: 10000 });
  }

  /**
   * Returns the text of the first recent-search item, or null if none.
   * @returns {Promise<string|null>}
   */
  async getFirstRecentSearchText() {
    const count = await this.recentSearchItems.count();
    if (count === 0) return null;
    return (await this.recentSearchTexts.first().textContent()).trim();
  }

  /**
   * Press Enter after typing to submit a search.
   */
  async submitSearch() {
    await this.inputField.press('Enter');
    await this.page.waitForTimeout(2000);
  }
}

module.exports = SearchPage;
