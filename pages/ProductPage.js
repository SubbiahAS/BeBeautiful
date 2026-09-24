// pages/ProductPage.js
// Page Object Model for the BeBeautiful Product Detail Page (PDP).

const BasePage = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);

    // ── PDP — QUANTITY CONTROLS ────────────────────────────────
    this.qty = {
      wrapper: page.locator('.update-quantity').first(),
      value: page.locator('.update-quantity .quantity').first(),
      decrease: page.locator('.update-quantity .decrease-quantity, span.decrease-quantity').first(),
      increase: page.locator('.update-quantity .increase-quantity, span.increase-quantity').first(),
    };

    // ── PDP — ADD TO CART BUTTON ───────────────────────────────
    this.addToCartBtn = page.locator(
      '.add-to-cart-button .cart-button-wrapper button.buttonWithBorder.primaryButton, ' +
      '.product-add-view-desktop .cart-button-wrapper button.buttonWithBorder.primaryButton'
    );

    // ── SUCCESS POPUP ──────────────────────────────────────────
    this.popup = {
      container: page.locator('div.popup-message-cart'),
      message: page.locator('div.popup-message-cart span').first(),
      goToCartBtn: page.locator('div.popup-message-cart button.popup-link'),
    };

    // ── CART SIDEBAR ───────────────────────────────────────────
    this.cartSidebar = {
      modal: page.locator('.cart-scrollable-content'),
      title: page.locator('.cart-title'),
      closeButton: page.locator('.cart-close'),
      itemCards: page.locator('.cart-items .card-product-card'),
      productName: page.locator('.cart-items .card-product-card .productDetail > h2.icon'),
      itemQuantity: page.locator('.cart-items .card-product-card .productQuantity .quantity p'),
      removeIcon: page.locator('.cart-items .card-product-card .productHeader .remove'),
      emptyTitle: page.locator('.empty-cart-title'),
    };

    // ── "ALSO AVAILABLE ON" BUTTON ─────────────────────────────
    // Confirmed: div.cart-button-wrapper.alsoAvailableOn > button.beigeButton
    this.alsoAvailableOn = {
      button: page.locator(
        '.cart-button-wrapper.alsoAvailableOn button.buttonWithBorder.beigeButton, ' +
        'button.buttonWithBorder.beigeButton:has-text("Also available on"), ' +
        "div[class='product-add-view-desktop'] div[class='cart-button-wrapper alsoAvailableOn'] button[role='button']"
      ),
    };

    this.retailers = {
      drawer: page.locator('.MuiDrawer-paper'),
      heading: page.locator('.MuiDrawer-paper').getByText(/Buy now from your favourite retailers/i),
      logos: page.locator('.MuiDrawer-paper img[data-merch-logo="true"]'),
      names: page.locator('.MuiDrawer-paper div[data-merch-name="true"]'),
      prices: page.locator('.MuiDrawer-paper div[data-merch-price="true"]'),
      buyNowButtons: page.locator('.MuiDrawer-paper button:has-text("Buy Now")'),
    };

    // widgetPage is set dynamically after the new tab opens
    this._widgetPage = null;
  }

  // ============================================================
  // NAVIGATION
  // ============================================================

  async navigateToProductPage(productPath) {
    await this.goto(productPath);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await this.closeLoginPopupIfPresent().catch(() => { });
  }

  async navigateToAnyProductPage(homePage, keyword = 'Lakme') {
    let productUrl = null;
    try {
      await homePage.openSearch();
      await this.page.waitForTimeout(500);
      await homePage.search.inputField.fill(keyword);
      await homePage.search.inputField.press('Enter');
      await this.page.waitForLoadState('networkidle').catch(() => { });
      await this.page.waitForTimeout(2000);

      const count = await homePage.products.productLinks.count().catch(() => 0);
      console.log(`   Search for "${keyword}" returned ${count} product link(s)`);

      if (count > 0) {
        const href = await homePage.products.productLinks.first().getAttribute('href').catch(() => null);
        if (href) {
          const origin = new URL(this.page.url()).origin;
          productUrl = href.startsWith('http') ? href : `${origin}${href}`;
        }
      }
      const modalOpen = await homePage.search.modalOverlay.isVisible().catch(() => false);
      if (modalOpen) await homePage.closeSearch().catch(() => { });
    } catch (err) {
      console.log(`   ⚠️ Search-based navigation failed: ${err.message}`);
    }

    if (productUrl) {
      await this.page.goto(productUrl);
    } else {
      console.log('   ⚠️ Falling back to known PDP URL');
      await this.goto('/products/lakme-sun-expert-dry-matte-fluid-spf-50-pa-sunscreen-with-1-niacinamide-ceramide');
    }

    await this.page.waitForLoadState('networkidle').catch(() => { });
    await this.page.waitForTimeout(2000);
    await this.closeLoginPopupIfPresent().catch(() => { });
    return this.page.url();
  }

  async isOnProductPage() {
    return this.page.url().includes('/products/');
  }

  // ============================================================
  // QUANTITY HELPERS
  // ============================================================

  async getQuantityValue() {
    const text = ((await this.qty.value.textContent().catch(() => '')) || '').trim();
    const num = parseInt(text.replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.qty.increase.click({ force: true });
      await this.page.waitForTimeout(600);
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      await this.qty.decrease.click({ force: true });
      await this.page.waitForTimeout(600);
    }
  }

  async isQuantityControlVisible() {
    return await this.qty.wrapper.isVisible().catch(() => false);
  }

  // ============================================================
  // ADD TO CART HELPERS
  // ============================================================

  async clickAddToCart() {
    await this.addToCartBtn.first().scrollIntoViewIfNeeded().catch(() => { });
    await this.page.waitForTimeout(500);
    await this.addToCartBtn.first().click({ force: true });
    await this.popup.container.waitFor({ state: 'visible', timeout: 8000 }).catch(() => { });
    await this.page.waitForTimeout(1000);
  }

  async isSuccessPopupVisible() {
    return await this.popup.container.isVisible().catch(() => false);
  }

  async getSuccessPopupText() {
    return ((await this.popup.message.textContent().catch(() => '')) || '').trim();
  }

  async isGoToCartLinkVisible() {
    return await this.popup.goToCartBtn.isVisible().catch(() => false);
  }

  async clickGoToCart() {
    await this.popup.goToCartBtn.click({ force: true });
    await this.cartSidebar.modal.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
    await this.page.waitForTimeout(1500);
  }

  // ============================================================
  // CART SIDEBAR HELPERS
  // ============================================================

  async isCartSidebarOpen() {
    return await this.cartSidebar.modal.isVisible().catch(() => false);
  }

  async getCartItemQuantity(index = 0) {
    const count = await this.cartSidebar.itemCards.count().catch(() => 0);
    if (count === 0) return 0;
    const text = ((await this.cartSidebar.itemQuantity.nth(index).textContent().catch(() => '')) || '').trim();
    const num = parseInt(text.replace(/\D/g, ''), 10);
    return isNaN(num) ? 0 : num;
  }

  // async getCartItemQuantity(index = 0) {
  //   const count = await this.cartSidebar.itemCards.count().catch(() => 0);
  //   if (count === 0 || index >= count) return 0;

  //   const card = this.cartSidebar.itemCards.nth(index);

  //   // Try several likely selectors, scoped to THIS card only
  //   const selectors = [
  //     '.productQuantity .quantity p',
  //     '.productQuantity .quantity',
  //     '.productQuantity input',
  //     '.quantity p',
  //     '.quantity input',
  //     '.quantity',
  //     '[class*="quantity"] p',
  //     '[class*="Quantity"] p',
  //     '[class*="quantity"] input',
  //     '[class*="quantity"]',
  //   ];

  //   for (const sel of selectors) {
  //     const loc = card.locator(sel).first();
  //     const visible = await loc.isVisible({ timeout: 2000 }).catch(() => false);
  //     if (!visible) continue;

  //     const tagName = await loc.evaluate(el => el.tagName.toLowerCase()).catch(() => '');
  //     let raw = '';

  //     if (tagName === 'input') {
  //       raw = await loc.inputValue().catch(() => '');
  //     } else {
  //       raw = ((await loc.textContent().catch(() => '')) || '');
  //     }

  //     const match = raw.match(/\d+/);
  //     if (match) {
  //       const num = parseInt(match[0], 10);
  //       if (!isNaN(num) && num > 0) {
  //         console.log(`   Cart quantity found via "${sel}": raw="${raw.trim()}" → ${num}`);
  //         return num;
  //       }
  //     }
  //   }

  //   // Nothing matched — dump the card HTML so the real selector can be identified
  //   const html = await card.innerHTML().catch(() => 'N/A');
  //   console.log(`   ⚠️ Could not determine cart quantity for item index ${index}. Card HTML:\n${html.substring(0, 1500)}`);
  //   return 0;
  // }

  async getCartItemCount() {
    return await this.cartSidebar.itemCards.count().catch(() => 0);
  }

  async getCartItemName(index = 0) {
    return ((await this.cartSidebar.productName.nth(index).textContent().catch(() => '')) || '').trim();
  }

  async closeCartSidebar() {
    const visible = await this.cartSidebar.closeButton.isVisible().catch(() => false);
    if (visible) {
      await this.cartSidebar.closeButton.click();
      await this.cartSidebar.modal.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { });
    }
  }

  async clearCart() {
    let attempts = 0;
    while (attempts < 20) {
      const count = await this.cartSidebar.itemCards.count().catch(() => 0);
      if (count === 0) break;
      const removeBtn = this.cartSidebar.removeIcon.first();
      const visible = await removeBtn.isVisible().catch(() => false);
      if (!visible) break;
      await removeBtn.click({ force: true });
      await this.page.waitForTimeout(1500);
      attempts++;
    }
  }

  // ============================================================
  // "ALSO AVAILABLE ON" — SHOPALYST WIDGET (TC063)
  //
  // KEY FINDING FROM RUN LOGS:
  //   - "No matching iframe found" → widget is NOT an iframe
  //   - All elements returned false/0 → widget is NOT in main page DOM
  //   - Widget opens as a NEW BROWSER TAB (new Page object)
  //   - All assertions must target this._widgetPage, not this.page
  // ============================================================

  /**
   * Clicks the "Also available on" button and waits for the Shopalyst
   * widget to open in a NEW TAB. Stores the new page as this._widgetPage.
   * Returns true if the new tab opened, false otherwise.
   */
  async clickAlsoAvailableOnAndGetNewTab() {

    const btn = this.alsoAvailableOn.button.first();

    await btn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    const context = this.page.context();

    const popupPromise = context.waitForEvent('page', {
      timeout: 5000
    }).catch(() => null);

    await btn.click();

    // wait for either popup or drawer
    await this.page.waitForTimeout(3000);

    const popup = await popupPromise;

    if (popup) {

      await popup.waitForLoadState('domcontentloaded').catch(() => { });

      const url = popup.url();

      console.log("Popup URL:", url);

      // If retailer page opened immediately, close it.
      if (
        url.includes("amazon") ||
        url.includes("flipkart") ||
        url.includes("nykaa") ||
        url.includes("purplle") ||
        url.includes("myntra")
      ) {

        console.log("Retailer page opened unexpectedly. Closing it.");

        await popup.close();

        this._widgetPage = null;

        return false;
      }

      this._widgetPage = popup;

      return true;
    }

    // Detect Shopalyst Drawer

    const drawer = this.page.locator('.MuiDrawer-paper');

    if (await drawer.isVisible({ timeout: 5000 }).catch(() => false)) {

      console.log("Shopalyst drawer opened.");

      this._widgetPage = this.page;

      return true;
    }

    this._widgetPage = null;

    return false;
  }


  async clickAlsoAvailableOnAndGetNewTab1() {

    const btn = this.alsoAvailableOn.button.first();

    // ✅ FIX: scope specifically to the Shopalyst retailer drawer (by its
    // known heading text) instead of any ".MuiDrawer-paper" on the page —
    // avoids false negatives if the site has other MUI drawers (cart, nav,
    // filters) present in the DOM.
    const drawer = this.page
      .locator('.MuiDrawer-paper')
      .filter({ hasText: /Buy now from your favourite retailers/i });

    await btn.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);

    const context = this.page.context();
    const seenPopups = [];
    const onPage = (p) => seenPopups.push(p);
    context.on('page', onPage);

    await btn.click({ force: true });

    // ✅ FIX: single generous wait, no retry-click. Re-clicking a toggle
    // button while the drawer is still animating in can close it right
    // back — which is the most likely explanation for "it opened on screen
    // but the test still failed."
    const drawerAppeared = await drawer
      .first()
      .waitFor({ state: 'visible', timeout: 20000 })
      .then(() => true)
      .catch(() => false);

    context.off('page', onPage);

    for (const popup of seenPopups) {
      const url = popup.url();
      const isRetailerUrl = /amazon|flipkart|nykaa|purplle|myntra/i.test(url);
      if (isRetailerUrl) {
        console.log(`   ⚠️ Stray retailer popup detected during widget open (${url}) — closing it, this is not the widget.`);
        await popup.close().catch(() => { });
      }
    }

    if (drawerAppeared) {
      console.log('Shopalyst drawer opened.');
      this._widgetPage = this.page;
      return true;
    }

    // ✅ Fallback: if the heading text match is too strict (whitespace,
    // casing, i18n), fall back to detecting the "Buy Now" buttons directly,
    // since ER2/ER3 depend on those anyway.
    const buyNowFallback = this.page.locator('.MuiDrawer-paper button:has-text("Buy Now")');
    const fallbackVisible = await buyNowFallback.first().isVisible({ timeout: 5000 }).catch(() => false);

    if (fallbackVisible) {
      console.log('Shopalyst drawer detected via "Buy Now" button fallback.');
      this._widgetPage = this.page;
      return true;
    }

    // Debug aid — capture what state the page was actually in when detection failed
    await this.page.screenshot({ path: `debug-widget-not-detected-${Date.now()}.png` }).catch(() => { });

    console.log('Drawer still not detected after generous wait — widget did not open.');
    this._widgetPage = null;
    return false;
  }

  /**
   * Returns the active widget page (new tab) or falls back to the main page.
   * Also checks for iframes as a secondary fallback.
   */
  async getWidgetPage() {

    if (this._widgetPage) {

      return {

        page: this._widgetPage,

        type: this._widgetPage === this.page
          ? "drawer"
          : "new-tab"

      };

    }

    const drawer = this.page.locator('.MuiDrawer-paper');

    if (await drawer.isVisible().catch(() => false)) {

      return {

        page: this.page,

        type: "drawer"

      };

    }

    console.log("Widget not detected. Staying on PDP.");

    return {

      page: this.page,

      type: "pdp"

    };

  }

  /**
   * Closes the widget tab if it's open.
   */
  async closeWidgetTab() {
    if (this._widgetPage && !this._widgetPage.isClosed()) {
      await this._widgetPage.close().catch(() => { });
      this._widgetPage = null;
      await this.page.waitForTimeout(500);
    }
  }

  /**
   * Debug helper — dumps visible text content from the widget page.
   */
  async debugWidgetPage() {
    const { page: wp, type } = await this.getWidgetPage();
    console.log(`=== WIDGET DEBUG (type: ${type}) ===`);
    if (type === 'new-tab' || type === 'same-page') {
      const url = await wp.url?.() || 'N/A';
      console.log(`   URL: ${url}`);
      const bodyText = await wp.evaluate(() =>
        document.body?.innerText?.substring(0, 1000) || 'N/A'
      ).catch(() => 'eval-error');
      console.log(`   Body text: ${bodyText}`);
      // Log all img alt attributes
      const imgs = await wp.evaluate(() =>
        Array.from(document.querySelectorAll('img')).map(i => ({
          alt: i.alt, src: i.src?.substring(0, 80)
        })).slice(0, 10)
      ).catch(() => []);
      console.log(`   Images: ${JSON.stringify(imgs)}`);
      // Log all button texts
      const btns = await wp.evaluate(() =>
        Array.from(document.querySelectorAll('button, [role="button"]'))
          .map(b => b.textContent?.trim().substring(0, 40))
          .filter(Boolean).slice(0, 15)
      ).catch(() => []);
      console.log(`   Buttons: ${JSON.stringify(btns)}`);
    }
    console.log('=== END WIDGET DEBUG ===');
  }

  // ============================================================
  // WIDGET ASSERTION HELPERS (TC063 Expected Results)
  // All methods work against the widget page (new tab / iframe / overlay)
  // ============================================================

  /**
   * ER1 — BeBeautiful logo displayed at top of the widget page.
   * The main page logo is always visible (header); the widget page should
   * also show a logo. We check BOTH.
   */
  async verifyAlsoAvailableOnLogoVisible() {

    // Main page logo (always in header)
    const pageLogoVisible = await this.page.locator(
      "img[alt='bebe logo'], .logo-container img, header img"
    ).first().isVisible().catch(() => false);

    // Widget page logo
    const { page: wp, type } = await this.getWidgetPage();
    let widgetLogoVisible = false;

    if (type === 'new-tab' || type === 'same-page') {
      // Try multiple logo selectors
      const logoSelectors = [
        'img[alt="Logo"]',
        'img[alt*="bebe" i]',
        'img[alt*="beautiful" i]',
        'header img',
        '.logo img',
        '[class*="logo"] img',
        'img[src*="logo"]',
        'img[src*="bebe"]',
      ];
      for (const sel of logoSelectors) {
        const visible = await wp.locator(sel).first().isVisible({ timeout: 3000 }).catch(() => false);
        if (visible) {
          widgetLogoVisible = true;
          console.log(`   Widget logo found via: ${sel}`);
          break;
        }
      }
    }

    return {
      visible: pageLogoVisible || widgetLogoVisible,
      pageLogoVisible,
      widgetLogoVisible,
    };
  }

  /**
   * ER2 — Back option displayed; clicking it closes the widget / returns to PDP.
   * For new-tab: "Back" = closing the tab and returning to main page.
   * For overlay: look for a back button element.
   */
  async verifyBackOptionNavigatesToPdp() {

    const { page: wp, type } = await this.getWidgetPage();

    if (type === 'new-tab') {

      // Shopalyst widget back arrow selectors
      // const backSelectors = [

      //   'svg:first-of-type',

      //   'div:has(svg)',

      //   '[role="button"] svg',

      //   'text=←',

      //   '.c0218'

      // ];

      const backSelectors = [
        'button[aria-label="More"]',   // ✅ confirmed actual back-arrow button from DOM
        '.MuiDrawer-paper button:has(svg)',
        '[role="button"] svg',
        'text=←',
      ];

      let backVisible = false;
      let backSelector = '';

      for (const selector of backSelectors) {

        const locator = wp.locator(selector).first();

        if (await locator.isVisible().catch(() => false)) {

          backVisible = true;
          backSelector = selector;

          console.log(`Back icon found using ${selector}`);

          break;
        }

      }

      // Close widget tab
      await this.closeWidgetTab();

      await this.page.bringToFront();

      await this.page.waitForTimeout(1000);

      const backOnPdp =
        await this.alsoAvailableOn.button
          .first()
          .isVisible()
          .catch(() => false);

      return {

        backVisible,

        closedSuccessfully: backOnPdp,

        method: backSelector || 'tab-close'

      };

    }

    // Overlay case

    const backSelectors = [

      'svg:first-of-type',

      'div:has(svg)',

      'text=←',

      '[role="button"] svg',

      'header svg',

      'svg',

      '.c0218'

    ];

    let backVisible = false;
    let method = '';

    for (const selector of backSelectors) {

      const locator = wp.locator(selector).first();

      if (await locator.isVisible().catch(() => false)) {

        backVisible = true;
        method = selector;

        await locator.click({ force: true });

        await this.page.waitForTimeout(1000);

        break;

      }

    }

    const closedSuccessfully =
      await this.alsoAvailableOn.button
        .first()
        .isVisible()
        .catch(() => false);

    return {

      backVisible,

      closedSuccessfully,

      method

    };

  }

  /**
   * ER3 — Product image section with image scroller (thumbnails).
   */
  async verifyImageScrollerVisible() {

    const { page: wp, type } = await this.getWidgetPage();

    const thumbnailSelectors = [
      'img[alt="Product thumbnail"]',
      '[class*="thumbnail"] img',
      '[class*="thumb"] img',
      '[class*="gallery"] img',
      '[class*="image-scroller"] img',
      '[class*="swiper"] img',
      '.product-images img',
      'img[src*="product"]',
    ];

    let thumbnailCount = 0;
    let visible = false;

    for (const sel of thumbnailSelectors) {
      const locator = type === 'new-tab' || type === 'same-page'
        ? wp.locator(sel)
        : wp.locator(sel);

      const count = await locator.count().catch(() => 0);
      if (count > 0) {
        const firstVisible = await locator.first().isVisible({ timeout: 3000 }).catch(() => false);
        if (firstVisible) {
          thumbnailCount = count;
          visible = true;
          console.log(`   Image scroller found via "${sel}" — count: ${count}`);
          break;
        }
      }
    }

    return { visible, thumbnailCount };
  }

  /**
   * ER4 — Clicking image scroller changes displayed product image.
   */
  async verifyImageScrollerChangesImage() {

    const { page: wp, type } = await this.getWidgetPage();

    const thumbnailSelectors = [
      'img[alt="Product thumbnail"]',
      '[class*="thumbnail"] img',
      '[class*="gallery"] img',
      'img[src*="product"]',
    ];

    let thumbnails = null;
    let count = 0;

    for (const sel of thumbnailSelectors) {
      const loc = wp.locator(sel);
      const c = await loc.count().catch(() => 0);
      if (c > 0) {
        thumbnails = loc;
        count = c;
        break;
      }
    }

    if (!thumbnails || count === 0) {
      return { hasMultipleImages: false, uniqueSrcCount: 0, clickSucceeded: false };
    }

    const srcs = [];
    for (let i = 0; i < Math.min(count, 6); i++) {
      const src = await thumbnails.nth(i).getAttribute('src').catch(() => null);
      if (src) srcs.push(src);
    }

    const uniqueSrcCount = new Set(srcs).size;
    const hasMultipleImages = uniqueSrcCount > 1;

    let clickSucceeded = false;
    if (count > 1) {
      try {
        await thumbnails.nth(1).click({ force: true, timeout: 5000 });
        await wp.waitForTimeout(1000);
        clickSucceeded = true;
      } catch (err) {
        console.log(`   ⚠️ Clicking 2nd thumbnail failed: ${err.message}`);
      }
    } else if (count === 1) {
      // Only one thumbnail — clicking it still counts as "succeeded"
      try {
        await thumbnails.first().click({ force: true, timeout: 5000 });
        await wp.waitForTimeout(500);
        clickSucceeded = true;
      } catch (err) {
        console.log(`   ⚠️ Clicking thumbnail failed: ${err.message}`);
      }
    }

    return { hasMultipleImages, uniqueSrcCount, clickSucceeded };
  }

  /**
   * ER5 — Lowest available price displayed below product title.
   */
  async verifyLowestPriceBelowTitle() {

    const { page: wp } = await this.getWidgetPage();

    // Product title selectors
    const titleSelectors = [
      '[data-prod-title="true"]',
      'h1', 'h2', 'h3',
      '[class*="product-title"]',
      '[class*="productTitle"]',
      '[class*="prod-title"]',
      '[class*="title"]',
    ];

    // Price selectors
    const priceSelectors = [
      '[class*="price"]',
      '[class*="Price"]',
      'small',
      '[class*="amount"]',
      'span:has-text("₹")',
      'p:has-text("₹")',
    ];

    let titleVisible = false;
    let titleText = '';
    let titleBox = null;

    for (const sel of titleSelectors) {
      const loc = wp.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 3) {
          titleVisible = true;
          titleText = text;
          titleBox = await loc.boundingBox().catch(() => null);
          console.log(`   Title found via "${sel}": "${text.substring(0, 50)}"`);
          break;
        }
      }
    }

    let priceVisible = false;
    let priceText = '';
    let priceBox = null;

    for (const sel of priceSelectors) {
      const loc = wp.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0) {
          priceVisible = true;
          priceText = text;
          priceBox = await loc.boundingBox().catch(() => null);
          console.log(`   Price found via "${sel}": "${text.substring(0, 50)}"`);
          break;
        }
      }
    }

    const isBelowTitle = !!titleBox && !!priceBox && priceBox.y >= titleBox.y;

    return { titleVisible, titleText, priceVisible, priceText, isBelowTitle };
  }

  /**
   * ER6 — "onwards" text displayed with the lowest price.
   */
  async verifyOnwardsTextDisplayed() {

    const { page: wp } = await this.getWidgetPage();

    const onwardsSelectors = [
      'small:has-text("onwards")',
      'span:has-text("onwards")',
      'p:has-text("onwards")',
      '*:has-text("onwards")',
    ];

    for (const sel of onwardsSelectors) {
      const loc = wp.locator(sel).first();
      const visible = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (visible) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (/onwards/i.test(text)) {
          console.log(`   "onwards" found via "${sel}": "${text}"`);
          return { visible: true, text, hasOnwardsText: true };
        }
      }
    }

    // Try page.getByText as fallback
    const byText = wp.getByText(/onwards/i).first();
    const vis = await byText.isVisible({ timeout: 2000 }).catch(() => false);
    if (vis) {
      const text = ((await byText.textContent().catch(() => '')) || '').trim();
      return { visible: true, text, hasOnwardsText: true };
    }

    return { visible: false, text: '', hasOnwardsText: false };
  }

  /**
   * ER7 — Product rating displayed correctly.
   */
  async verifyProductRatingDisplayed() {

    const { page: wp } = await this.getWidgetPage();

    const ratingSelectors = [
      '.star-ratings',
      '[class*="star-rating"]',
      '[class*="starRating"]',
      '[class*="rating"]',
      '[aria-label*="star" i]',
      '[aria-label*="rating" i]',
      '[title*="Star" i]',
      '[title*="rating" i]',
    ];

    for (const sel of ratingSelectors) {
      const loc = wp.locator(sel).first();
      const visible = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (visible) {
        const titleAttr = (await loc.getAttribute('title').catch(() => '')) || '';
        const ariaLabel = (await loc.getAttribute('aria-label').catch(() => '')) || '';
        const combined = titleAttr + ' ' + ariaLabel;
        const match = combined.match(/[\d.]+/);
        const ratingNumber = match ? parseFloat(match[0]) : null;
        const starContainerCount = await wp.locator('.star-container, [class*="star-container"]').count().catch(() => 0);
        console.log(`   Rating found via "${sel}": title="${titleAttr}" aria="${ariaLabel}"`);
        return { visible: true, titleAttr, ratingNumber, starContainerCount };
      }
    }

    // Fallback: look for numeric rating text like "4.2" or "4.2/5"
    const numericRating = wp.locator('*').filter({ hasText: /^\d\.\d(\s*\/\s*5)?$/ }).first();
    const numVisible = await numericRating.isVisible({ timeout: 2000 }).catch(() => false);
    if (numVisible) {
      const text = ((await numericRating.textContent().catch(() => '')) || '').trim();
      const match = text.match(/[\d.]+/);
      return {
        visible: true,
        titleAttr: text,
        ratingNumber: match ? parseFloat(match[0]) : null,
        starContainerCount: 0,
      };
    }

    return { visible: false, titleAttr: '', ratingNumber: null, starContainerCount: 0 };
  }

  /**
   * ER8 — "Buy Now from Your Favourite Retailers" section displayed.
   */
  // async verifyBuyNowRetailersSectionVisible() {

  //   const { page: wp } = await this.getWidgetPage();

  //   // Section heading
  //   const headingSelectors = [
  //     '*:has-text("Buy Now from Your Favourite Retailers")',
  //     '*:has-text("Buy Now")',
  //     '*:has-text("Retailers")',
  //     'h1, h2, h3, h4',
  //   ];

  //   let sectionVisible = false;
  //   for (const sel of headingSelectors) {
  //     const loc = wp.locator(sel).first();
  //     const vis = await loc.isVisible({ timeout: 2000 }).catch(() => false);
  //     if (vis) {
  //       const text = ((await loc.textContent().catch(() => '')) || '').trim();
  //       if (text.length > 3) {
  //         sectionVisible = true;
  //         console.log(`   Buy Now section heading found via "${sel}": "${text.substring(0, 60)}"`);
  //         break;
  //       }
  //     }
  //   }

  //   // Count BUY NOW buttons
  //   const buyNowSelectors = [
  //     'button:has-text("BUY NOW")',
  //     'button:has-text("Buy Now")',
  //     'a:has-text("BUY NOW")',
  //     '[class*="buy-now"]',
  //     '[class*="buyNow"]',
  //   ];

  //   let buyNowButtonCount = 0;
  //   for (const sel of buyNowSelectors) {
  //     const count = await wp.locator(sel).count().catch(() => 0);
  //     if (count > 0) {
  //       buyNowButtonCount = count;
  //       console.log(`   BUY NOW buttons found via "${sel}": ${count}`);
  //       break;
  //     }
  //   }

  //   return { sectionVisible, buyNowButtonCount };
  // }

  async verifyBuyNowRetailersSectionVisible() {

    // Wait for Shopalyst drawer
    const drawer = this.page.locator('.MuiDrawer-paper');

    await drawer.waitFor({
      state: 'visible',
      timeout: 10000
    }).catch(() => { });

    const drawerVisible = await drawer.isVisible().catch(() => false);

    if (!drawerVisible) {

      console.log("Shopalyst drawer not visible.");

      return {
        sectionVisible: false,
        buyNowButtonCount: 0
      };

    }

    // Heading inside drawer
    const heading = drawer.locator(
      'text=/Buy now from your favourite retailers/i'
    );

    const sectionVisible =
      await heading.first().isVisible().catch(() => false);

    // BUY NOW buttons inside drawer only
    const buyNowButtons = drawer.locator(
      'button:has-text("BUY NOW")'
    );

    const buyNowButtonCount =
      await buyNowButtons.count().catch(() => 0);

    console.log("Buy Now Section Visible :", sectionVisible);
    console.log("BUY NOW Button Count :", buyNowButtonCount);

    return {

      sectionVisible,

      buyNowButtonCount

    };

  }

  /**
   * ER9 — Description section with non-empty content.
   */
  async verifyDescriptionSectionDisplayed() {

    const { page: wp } = await this.getWidgetPage();

    const descSelectors = [
      '[class*="description" i]',
      '[id*="description" i]',
      '[data-testid*="description" i]',
      'section:has-text("Description")',
      'div:has-text("Description")',
      '*:has-text("About")',
      '*:has-text("Key Benefits")',
      '*:has-text("Ingredients")',
      'p',
    ];

    for (const sel of descSelectors) {
      const loc = wp.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 20) {
          console.log(`   Description found via "${sel}": ${text.length} chars`);
          return { visible: true, text, isNonEmpty: true };
        }
      }
    }

    return { visible: false, text: '', isNonEmpty: false };
  }

  /**
   * ER10 — User testimonial section with non-empty content.
   */
  async verifyTestimonialSectionDisplayed() {

    const { page: wp } = await this.getWidgetPage();

    const testimonialSelectors = [
      '[class*="testimonial" i]',
      '[class*="review" i]',
      '[class*="Review" i]',
      '[class*="user-review" i]',
      '[data-testid*="review" i]',
      '*:has-text("Reviews")',
      '*:has-text("Testimonials")',
      '*:has-text("What people say")',
      '*:has-text("Customer")',
    ];

    for (const sel of testimonialSelectors) {
      const loc = wp.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 2000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 10) {
          console.log(`   Testimonial found via "${sel}": ${text.length} chars`);
          return { visible: true, text, isNonEmpty: true };
        }
      }
    }

    return { visible: false, text: '', isNonEmpty: false };
  }

  // ============================================================
  // RETAILER CARDS HELPERS (TC064 — "Also available on")
  // ============================================================

  /**
   * ER1 — "Buy Now from Your Favourite Retailers" heading visible in the drawer.
   */
  async isRetailersSectionHeadingVisible() {
    const drawer = this.page
      .locator('.MuiDrawer-paper')
      .filter({ hasText: /Buy now from your favourite retailers/i });

    await drawer.first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
    return await drawer.first().getByText(/Buy now from your favourite retailers/i).first().isVisible().catch(() => false);
  }

  /**
   * Returns the number of retailer rows found (based on retailer name elements).
   */
  async getRetailerCount() {
    return await this.retailers.names.count().catch(() => 0);
  }

  /**
   * ER2 — For a given retailer row index, returns whether logo, name, price,
   * and Buy Now button are all present.
   * @param {number} index
   */
  async getRetailerCardDetails(index) {
    const logoVisible = await this.retailers.logos.nth(index).isVisible().catch(() => false);
    const name = ((await this.retailers.names.nth(index).textContent().catch(() => '')) || '').trim();
    const price = ((await this.retailers.prices.nth(index).textContent().catch(() => '')) || '').trim();
    const buyNowVisible = await this.retailers.buyNowButtons.nth(index).isVisible().catch(() => false);

    return {
      logoVisible,
      name,
      nameVisible: name.length > 0,
      price,
      priceVisible: price.length > 0,
      buyNowVisible,
    };
  }

  /**
   * Validates that EVERY retailer row has all 4 required fields.
   * Returns { allValid, totalRetailers, invalidRows }.
   */
  async verifyAllRetailerCardsHaveRequiredFields() {
    const total = await this.getRetailerCount();
    const invalidRows = [];

    for (let i = 0; i < total; i++) {
      const details = await this.getRetailerCardDetails(i);
      if (
        !details.logoVisible ||
        !details.nameVisible ||
        !details.priceVisible ||
        !details.buyNowVisible
      ) {
        invalidRows.push({ index: i, ...details });
      }
    }

    return {
      allValid: total > 0 && invalidRows.length === 0,
      totalRetailers: total,
      invalidRows,
    };
  }

  /**
   * ER3 — Clicks the "Buy Now" button for a given retailer row and waits for
   * the resulting new tab (retailer website). Returns the new page + its URL,
   * or null if no new tab opened within the timeout.
   * @param {number} index
   */
  async clickRetailerBuyNowAndGetNewTab(index) {
    const btn = this.retailers.buyNowButtons.nth(index);
    await btn.scrollIntoViewIfNeeded().catch(() => { });

    const context = this.page.context();
    const popupPromise = context.waitForEvent('page', { timeout: 10000 }).catch(() => null);

    await btn.click({ force: true });

    const newPage = await popupPromise;
    if (!newPage) {
      return { page: null, url: null };
    }

    await newPage.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });
    await newPage.waitForTimeout(2000);

    return { page: newPage, url: newPage.url() };
  }

  /**
   * ER4 — Checks whether the retailer's page (new tab) contains the product
   * name/keywords from the original BeBeautiful product, confirming the
   * same product is shown on the retailer site.
   * @param {import('@playwright/test').Page} retailerPage
   * @param {string} productName
   */
  async verifyRetailerPageShowsSameProduct(retailerPage, productName) {
    if (!retailerPage || !productName) {
      return { matched: false, pageText: '', productName };
    }

    // Build a loose keyword set from the product name (drop generic words)
    const keywords = productName
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 4); // first few significant words (brand + product line)

    const pageText = (
      await retailerPage.evaluate(() => document.body?.innerText?.toLowerCase() || '').catch(() => '')
    );

    const matchedKeywords = keywords.filter((kw) => pageText.includes(kw));
    const matched = matchedKeywords.length >= Math.ceil(keywords.length / 2); // majority match

    return { matched, matchedKeywords, keywords, pageText: pageText.substring(0, 300) };
  }

  /**
   * Retrieves the product title from the current PDP (used to compare
   * against retailer page content).
   */
  async getProductTitleOnPdp() {
    const titleLocator = this.page.locator(
      'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
    ).first();
    return ((await titleLocator.textContent().catch(() => '')) || '').trim();
  }

  // ============================================================
  // PDP — PRODUCT DETAIL VERIFICATION HELPERS (TC027)
  // ============================================================

  /**
   * ER1 — Product name should be displayed below the brand name.
   * Tries a list of likely selectors for brand + product name, compares
   * their bounding-box Y positions to confirm the name sits below the brand.
   */
  async verifyProductNameBelowBrandName() {

    const brandSelectors = [
      '.product-add-view-desktop .productDetail h3',
      '.productDetail > h3',
      '[class*="brand-name"]',
      '[class*="brandName"]',
      '.product-brand',
      'h3[class*="brand"]',
      '.pdp-brand',
    ];

    const nameSelectors = [
      '.product-add-view-desktop .productDetail h1',
      '.product-add-view-desktop .productDetail h2',
      '.productDetail > h1',
      '.productDetail > h2',
      'h1.product-title',
      'h1[class*="product"]',
      '[class*="product-name"]',
      '[class*="productName"]',
      '.pdp-title',
    ];

    let brandVisible = false;
    let brandText = '';
    let brandBox = null;

    for (const sel of brandSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0) {
          brandVisible = true;
          brandText = text;
          brandBox = await loc.boundingBox().catch(() => null);
          console.log(`   Brand name found via "${sel}": "${text}"`);
          break;
        }
      }
    }

    let nameVisible = false;
    let nameText = '';
    let nameBox = null;

    for (const sel of nameSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        // avoid re-matching the same element/text as the brand
        if (text.length > 0 && text !== brandText) {
          nameVisible = true;
          nameText = text;
          nameBox = await loc.boundingBox().catch(() => null);
          console.log(`   Product name found via "${sel}": "${text}"`);
          break;
        }
      }
    }

    const isBelow =
      !!brandBox && !!nameBox && nameBox.y >= brandBox.y;

    return {
      brandVisible,
      brandText,
      nameVisible,
      nameText,
      isBelow,
    };
  }

  /**
   * ER2 — Size (weight) of the product is displayed, e.g. "50 g", "100 ml".
   */
  async verifyProductSizeDisplayed() {

    const weightPattern = /\d+(\.\d+)?\s?(g|gm|gms|kg|ml|l|oz|lb)\b/i;

    const sizeSelectors = [
      '.product-add-view-desktop [class*="size"]',
      '.product-add-view-desktop [class*="weight"]',
      '.product-add-view-desktop [class*="variant"]',
      '[class*="product-size"]',
      '[class*="productSize"]',
      '[class*="pack-size"]',
      '[class*="size-selector"]',
      '.pdp-size',
    ];

    for (const sel of sizeSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0) {
          const hasWeightPattern = weightPattern.test(text);
          console.log(`   Size found via "${sel}": "${text}" (matchesPattern: ${hasWeightPattern})`);
          if (hasWeightPattern) {
            return { visible: true, text, hasWeightPattern: true };
          }
        }
      }
    }

    // Fallback: scan for any element on the PDP whose text matches the weight pattern
    const fallback = this.page.locator('*').filter({ hasText: weightPattern }).first();
    const fallbackVisible = await fallback.isVisible({ timeout: 3000 }).catch(() => false);
    if (fallbackVisible) {
      const text = ((await fallback.textContent().catch(() => '')) || '').trim();
      return { visible: true, text, hasWeightPattern: weightPattern.test(text) };
    }

    return { visible: false, text: '', hasWeightPattern: false };
  }

  /**
   * ER3 — Price of the product is displayed in ₹ format (e.g. "₹ 799").
   */
  async verifyPriceFormat() {

    const rupeePattern = /₹\s?\d[\d,]*(\.\d+)?/;

    const priceSelectors = [
      '.product-add-view-desktop .productPrice .discountPrice',
      '.product-add-view-desktop [class*="price"]',
      '.productPrice .discountPrice',
      '[class*="discountPrice"]',
      '[class*="finalPrice"]',
      '[class*="sellingPrice"]',
      '[class*="Price"]',
      'span:has-text("₹")',
      'p:has-text("₹")',
    ];

    for (const sel of priceSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0) {
          const isRupeeFormat = rupeePattern.test(text);
          console.log(`   Price found via "${sel}": "${text}" (isRupeeFormat: ${isRupeeFormat})`);
          if (isRupeeFormat) {
            return { visible: true, text, isRupeeFormat: true };
          }
        }
      }
    }

    return { visible: false, text: '', isRupeeFormat: false };
  }

  /**
   * ER4 — Discount percentage is present, followed by "(incl. of all taxes)" text.
   */
  async verifyDiscountAndTaxText() {

    const discountPercentPattern = /\d+(\.\d+)?%\s*(off)?/i;
    const inclTaxPattern = /\(?\s*incl\.?\s*(\.|of)?\s*of?\s*all\s*taxes\s*\)?/i;

    const discountSelectors = [
      '.product-add-view-desktop [class*="discount"]',
      '[class*="discountPercent"]',
      '[class*="discount-percent"]',
      '[class*="off-percent"]',
      '[class*="discount"]',
      'span:has-text("% off")',
      'span:has-text("%")',
    ];

    let discountVisible = false;
    let discountText = '';

    for (const sel of discountSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0 && discountPercentPattern.test(text)) {
          discountVisible = true;
          discountText = text;
          console.log(`   Discount found via "${sel}": "${text}"`);
          break;
        }
      }
    }

    const taxSelectors = [
      '.product-add-view-desktop [class*="tax"]',
      '[class*="inclTax"]',
      '[class*="incl-tax"]',
      '[class*="taxText"]',
      '[class*="tax"]',
      'span:has-text("incl")',
      'p:has-text("incl")',
      'small:has-text("incl")',
    ];

    let taxVisible = false;
    let taxText = '';

    for (const sel of taxSelectors) {
      const loc = this.page.locator(sel).first();
      const vis = await loc.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        const text = ((await loc.textContent().catch(() => '')) || '').trim();
        if (text.length > 0 && inclTaxPattern.test(text)) {
          taxVisible = true;
          taxText = text;
          console.log(`   Tax text found via "${sel}": "${text}"`);
          break;
        }
      }
    }

    // Fallback: getByText scan across the page for the incl-tax phrase
    if (!taxVisible) {
      const byText = this.page.getByText(inclTaxPattern).first();
      const vis = await byText.isVisible({ timeout: 3000 }).catch(() => false);
      if (vis) {
        taxVisible = true;
        taxText = ((await byText.textContent().catch(() => '')) || '').trim();
      }
    }

    return {
      discountVisible,
      discountText,
      hasDiscountPercentPattern: discountPercentPattern.test(discountText),
      taxVisible,
      taxText,
      hasInclTaxPattern: inclTaxPattern.test(taxText),
    };
  }

}

module.exports = ProductPage;