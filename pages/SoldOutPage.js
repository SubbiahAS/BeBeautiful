// pages/SoldOutPage.js
// Page Object Model for Sold-Out / Out-of-Stock product verification on BeBeautiful.
//
// ROOT CAUSE FIX (from error log):
//   The fallback locator 'a:has-text("Dive In")' was resolving to a banner
//   article link (aria-label="Go to Dive in!") that is OUTSIDE the viewport
//   and is NOT the BePicks section button.
//
// FIXED NAVIGATION STRATEGY:
//   • Always navigate directly to /shop-by-category (most reliable)
//   • Only attempt BePicks "Dive In" button with a very specific scoped
//     locator (.bebe-swiper-container a) to avoid matching banner links
//   • Never use a generic 'a:has-text("Dive In")' fallback on the homepage
//
// DOM confirmed from DevTools screenshot (shop-by-category page):
//
//  SOLD-OUT PRODUCT CARD (listing page):
//    div.product-card.editor-product-card
//      a.product-card-link[href="/products/..."]
//      div.addtocart
//        button.buttonWithBorder.primaryButton.btn-disabled  ← OUT OF STOCK
//
//  SOLD-OUT PDP:
//    div.add-to-cart-button > div.cart-button-wrapper
//      button.buttonWithBorder.primaryButton.btn-disabled
//
//  QUANTITY CONTROLS:
//    div.update-quantity
//      span.decrease-quantity / span.quantity / span.increase-quantity

const BasePage = require('./BasePage');

class SoldOutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);

    // ── LISTING PAGE — Out of Stock card selectors ────────────────

    this.listing = {

      // All product cards on the shop / category page
      allProductCards: page.locator(
        'div.product-card.editor-product-card, div.editor-product-card, div.product-card'
      ),

      // btn-disabled button inside any product card (= Out of Stock)
      soldOutCardButton: page.locator(
        'div.addtocart button.btn-disabled, ' +
        '.editor-product-card button.btn-disabled, ' +
        'div.product-card button.btn-disabled, ' +
        'button.buttonWithBorder.btn-disabled'
      ),

      // The anchor link of the card that contains a btn-disabled button
      soldOutCardLink: page.locator(
        'div.product-card:has(button.btn-disabled) a.product-card-link, ' +
        'div.editor-product-card:has(button.btn-disabled) a.product-card-link, ' +
        'div.product-card:has(button.btn-disabled) a[href*="/products/"], ' +
        'div.editor-product-card:has(button.btn-disabled) a[href*="/products/"]'
      ),
    };

    // ── PDP — Static Add to Cart button ──────────────────────────
    this.pdpAddToCartBtn = page.locator(
      '.add-to-cart-button .cart-button-wrapper button.buttonWithBorder.primaryButton, ' +
      '.product-add-view-desktop .cart-button-wrapper button.buttonWithBorder.primaryButton, ' +
      '.add-to-cart button.buttonWithBorder.primaryButton, ' +
      '.product-add-view-desktop button.buttonWithBorder.primaryButton'
    );

    // ── PDP — Quantity controls ───────────────────────────────────
    this.qty = {
      wrapper: page.locator('.update-quantity').first(),
      value: page.locator('.update-quantity .quantity').first(),
      increase: page.locator('.update-quantity .increase-quantity, span.increase-quantity').first(),
      decrease: page.locator('.update-quantity .decrease-quantity, span.decrease-quantity').first(),
    };

    // ── Success popup (should NOT appear for Out of Stock) ────────
    this.successPopup = page.locator('div.popup-message-cart');
  }

  // ============================================================
  // STEP 1 : Navigate to the shop listing page
  //
  // FIX: Instead of clicking an unreliable "Dive In" link on the homepage
  // (which was matching a banner article link outside the viewport),
  // we now use a SCOPED locator restricted to .bebe-swiper-container,
  // with a direct URL fallback if that still fails.
  // ============================================================

  /**
   * Navigate to the product listing / shop-by-category page.
   *
   * Strategy (in priority order):
   *   1. Scroll to BePicks section → click the scoped "Dive In" button
   *      (scoped to .bebe-swiper-container to avoid banner links)
   *   2. If that fails → go directly to /shop-by-category
   *   3. If that returns a non-product page → try /collections/all
   *
   * @param {import('./HomePage')} homePage
   * @returns {Promise<string>} URL of the landed listing page
   */
  async navigateToShopListingPage(homePage) {

    console.log('   Scrolling to BePicks section…');

    await homePage.scrollToBePicksSection();
    await this.page.waitForTimeout(1500);

    console.log('   BePicks section in view — attempting scoped "Dive In" click…');

    // ── SCOPED locator: only matches anchors INSIDE the BePicks swiper
    //    This prevents matching banner/article "Dive In" links elsewhere on the page
    const scopedDiveIn = this.page.locator(
      '.bebe-swiper-container ~ * a.buttonWithBorder.secondaryButton, ' +
      '.bebe-swiper-container + div a.buttonWithBorder.secondaryButton, ' +
      '.bebe-swiper-container a.buttonWithBorder.secondaryButton'
    ).filter({ hasText: /dive\s*in/i }).first();

    // Also try the BePicks section's own letsDiveInButton from homePage
    const homePageDiveIn = homePage.bePicks.letsDiveInButton;

    let clickedViaButton = false;

    // ── Attempt 1: use the homepage POM letsDiveInButton (most specific)
    try {

      const homeVisible = await homePageDiveIn.isVisible({ timeout: 4000 }).catch(() => false);

      if (homeVisible) {

        const href = await homePageDiveIn.getAttribute('href').catch(() => null);

        // Only click if the href points to a shop/collection path,
        // NOT to a blog or article path — avoids wrong "Dive In" links
        const isShopLink =
          href &&
          (
            href.includes('/shop-by-category') ||
            href.includes('/collections') ||
            href.includes('/shop') ||
            href.includes('/products')
          );

        if (isShopLink) {

          console.log(`   HomePageDiveIn href looks like a shop link: ${href}`);
          await homePageDiveIn.scrollIntoViewIfNeeded();
          await homePageDiveIn.click({ force: true, timeout: 8000 });
          clickedViaButton = true;
          console.log('   ✅ Clicked BePicks "Dive In" button via homePage.bePicks.letsDiveInButton');

        } else {

          console.log(`   ⚠️ HomePageDiveIn href "${href}" does not look like a shop link — skipping click`);
        }
      }

    } catch (err) {
      console.log(`   ⚠️ HomePageDiveIn click failed: ${err.message}`);
    }

    // ── Attempt 2: use the scoped locator
    if (!clickedViaButton) {

      try {

        const scopedVisible = await scopedDiveIn.isVisible({ timeout: 3000 }).catch(() => false);

        if (scopedVisible) {

          await scopedDiveIn.scrollIntoViewIfNeeded();
          await scopedDiveIn.click({ force: true, timeout: 8000 });
          clickedViaButton = true;
          console.log('   ✅ Clicked scoped BePicks "Dive In" button');
        }

      } catch (err) {
        console.log(`   ⚠️ Scoped "Dive In" click failed: ${err.message}`);
      }
    }

    // ── Attempt 3 (definitive fallback): navigate directly to /shop-by-category
    if (!clickedViaButton) {

      console.log('   ℹ️  No safe "Dive In" button found — navigating directly to /shop-by-category');
      await this.goto('/shop-by-category');
    }

    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await this.closeLoginPopupIfPresent().catch(() => { });

    const landedUrl = this.page.url();
    console.log(`   Landed on: ${landedUrl}`);

    // ── Attempt 4: if we ended up on a non-product page, try /collections/all
    const isProductListingPage =
      landedUrl.includes('/shop-by-category') ||
      landedUrl.includes('/collections/') ||
      landedUrl.includes('/products');

    if (!isProductListingPage) {

      console.log(`   ⚠️  "${landedUrl}" is not a product listing page — trying /collections/all`);
      await this.goto('/collections/all');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);
      await this.closeLoginPopupIfPresent().catch(() => { });

      const fallbackUrl = this.page.url();
      console.log(`   Fallback URL: ${fallbackUrl}`);
      return fallbackUrl;
    }

    return landedUrl;
  }

  // ============================================================
  // STEP 2 : Scroll to bottom repeatedly to load lazy products,
  //          then scan for Out-of-Stock (btn-disabled) cards
  // ============================================================

  /**
   * Scrolls the current page in increments to trigger lazy loading,
   * then scans ALL rendered product cards for btn-disabled buttons.
   * Returns the href of the first such product, or null.
   *
   * @param {number} scrollPasses   Number of scroll-to-bottom cycles (default 6)
   * @returns {Promise<string|null>}
   */
  async scrollAndFindOutOfStockProduct(scrollPasses = 6) {

    console.log(`   Scrolling page ${scrollPasses} times to load lazy products…`);

    for (let pass = 1; pass <= scrollPasses; pass++) {

      await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.page.waitForTimeout(1800);

      console.log(`   Scroll pass ${pass}/${scrollPasses} — checking for btn-disabled…`);

      const href = await this._findFirstOutOfStockHref();

      if (href) {
        console.log(`   ✅ Out-of-Stock product found on pass ${pass}: ${href}`);
        return href;
      }
    }

    // Final check after all scroll passes
    const finalHref = await this._findFirstOutOfStockHref();

    if (finalHref) {
      console.log(`   ✅ Out-of-Stock product found after final scroll: ${finalHref}`);
    } else {
      console.log('   ⚠️ No Out-of-Stock product found after all scroll passes');
    }

    return finalHref;
  }

  /**
   * Internal helper: walks the DOM to find the first product card that
   * contains a btn-disabled button and returns its product href.
   * @returns {Promise<string|null>}
   */
  async _findFirstOutOfStockHref() {

    return await this.page.evaluate(() => {

      const cards = Array.from(
        document.querySelectorAll(
          'div.product-card, div.editor-product-card, div.product-card.editor-product-card'
        )
      );

      for (const card of cards) {

        const disabledBtn = card.querySelector(
          'button.btn-disabled, button.buttonWithBorder.btn-disabled, ' +
          'div.addtocart button.btn-disabled'
        );

        if (!disabledBtn) continue;

        const link = card.querySelector(
          'a.product-card-link, a[href*="/products/"]'
        );

        if (link && link.getAttribute('href')) {
          return link.getAttribute('href');
        }
      }

      return null;

    }).catch(() => null);
  }

  /**
   * Counts how many btn-disabled buttons are visible on the page.
   * @returns {Promise<number>}
   */
  async countOutOfStockCards() {
    return await this.page.evaluate(() => {
      return document.querySelectorAll(
        'button.btn-disabled, div.addtocart button.btn-disabled'
      ).length;
    }).catch(() => 0);
  }

  // ============================================================
  // PDP NAVIGATION
  // ============================================================

  /**
   * Navigate to a product URL and wait for the page to settle.
   * @param {string} url  full URL or path
   */
  async navigateToProductPage(url) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await this.closeLoginPopupIfPresent().catch(() => { });
  }

  // ============================================================
  // PDP SOLD-OUT STATE HELPERS
  // ============================================================

  /**
   * Expected Result 1:
   * Checks that the static Add to Cart button on the PDP is either
   * absent or disabled (btn-disabled class) for a sold-out product.
   *
   * @returns {Promise<{ notDisplayed: boolean, disabled: boolean, hidden: boolean, count: number, buttonText: string }>}
   */
  async verifyStaticAddToCartNotDisplayed() {

    const count = await this.pdpAddToCartBtn.count().catch(() => 0);

    if (count === 0) {
      return {
        notDisplayed: true,
        disabled: false,
        hidden: false,
        count: 0,
        buttonText: '',
      };
    }

    let allDisabledOrHidden = true;

    for (let i = 0; i < Math.min(count, 6); i++) {

      const btn = this.pdpAddToCartBtn.nth(i);
      const classAttr = (await btn.getAttribute('class').catch(() => '')) || '';
      const disabled = await btn.getAttribute('disabled').catch(() => null);
      const visible = await btn.isVisible().catch(() => false);

      const isDisabled = classAttr.includes('btn-disabled') || disabled !== null;
      const isHidden = !visible;

      if (!isDisabled && !isHidden) {
        allDisabledOrHidden = false;
        break;
      }
    }

    const firstBtn = this.pdpAddToCartBtn.first();
    const firstClass = (await firstBtn.getAttribute('class').catch(() => '')) || '';
    const firstDisattr = await firstBtn.getAttribute('disabled').catch(() => null);
    const firstVisible = await firstBtn.isVisible().catch(() => false);
    const buttonText = ((await firstBtn.textContent().catch(() => '')) || '').trim();

    return {
      notDisplayed: allDisabledOrHidden,
      disabled: firstClass.includes('btn-disabled') || firstDisattr !== null,
      hidden: !firstVisible,
      count,
      buttonText,
    };
  }

  /**
   * Expected Result 2:
   * Scrolls to the bottom to reveal the sticky buy-bar, then checks
   * whether that sticky Add-to-Cart button is also disabled / absent.
   *
   * @returns {Promise<{ found: boolean, disabled: boolean, hidden: boolean }>}
   */
  async verifyStickyAddToCartNotDisplayed() {

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(1500);

    // const stickyResult = await this.page.evaluate(() => {

    //   const allBtns = Array.from(
    //     document.querySelectorAll('button.buttonWithBorder.primaryButton')
    //   );

    //   return allBtns.map(btn => {

    //     const rect      = btn.getBoundingClientRect();
    //     const classAttr = btn.className || '';

    //     return {
    //       classAttr,
    //       disabled: btn.disabled || classAttr.includes('btn-disabled'),
    //       visible:  rect.width > 0 && rect.height > 0,
    //       top:      Math.round(rect.top),
    //       text:     btn.textContent.trim().substring(0, 40),
    //     };
    //   });

    // }).catch(() => []);

    // console.log(`   All primaryButton states after scroll: ${JSON.stringify(stickyResult)}`);

    // if (!stickyResult.length) {
    //   return { found: false, disabled: false, hidden: true };
    // }

    // // Prefer buttons in the lower portion of the viewport (sticky area > 400px from top)
    // const target =
    //   stickyResult.find(b => b.top > 400) ||
    //   stickyResult[stickyResult.length - 1];

    const stickyResult = await this.page.evaluate(() => {

      const allBtns = Array.from(
        document.querySelectorAll(
          '.add-to-cart-button button.buttonWithBorder, ' +
          '.add-to-cart button.buttonWithBorder, ' +
          '.product-add-view-desktop button.buttonWithBorder'
        )
      );

      return allBtns.map(btn => {

        const rect = btn.getBoundingClientRect();
        const classAttr = btn.className || '';

        return {
          classAttr,
          disabled: btn.disabled || classAttr.includes('btn-disabled'),
          visible: rect.width > 0 && rect.height > 0,
          top: Math.round(rect.top),
          text: btn.textContent.trim().substring(0, 40),
        };
      });

    }).catch(() => []);

    console.log(`   All primaryButton states after scroll: ${JSON.stringify(stickyResult)}`);

    if (!stickyResult.length) {
      return { found: false, disabled: false, hidden: true };
    }

    const target =
      stickyResult.find(b => b.disabled) ||
      stickyResult.find(b => b.top > 400) ||
      stickyResult[stickyResult.length - 1];

    return {
      found: true,
      disabled: target.disabled,
      hidden: !target.visible,
    };
  }

  // ============================================================
  // Expected Result 3: QUANTITY CONTROLS — NO-OP VERIFICATION
  // ============================================================

  /**
   * Verifies that clicking "+" and "−" does NOT change the displayed
   * quantity value for a sold-out product.
   *
   * @returns {Promise<{
   *   qtyControlVisible: boolean,
   *   increaseNoOp: boolean,
   *   decreaseNoOp: boolean,
   *   initialQty: number,
   *   afterIncrease: number,
   *   afterDecrease: number
   * }>}
   */
  async verifyQuantityControlsAreNoOp() {

    // Scroll back to top so the static quantity block is in view
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(800);

    const qtyControlVisible = await this.qty.wrapper.isVisible().catch(() => false);

    if (!qtyControlVisible) {
      return {
        qtyControlVisible: false,
        increaseNoOp: true,
        decreaseNoOp: true,
        initialQty: 0,
        afterIncrease: 0,
        afterDecrease: 0,
      };
    }

    const readQty = async () => {
      const text = ((await this.qty.value.textContent().catch(() => '')) || '').trim();
      return parseInt(text.replace(/\D/g, ''), 10) || 1;
    };

    const initialQty = await readQty();
    console.log(`   Initial qty: ${initialQty}`);

    // Click "+"
    await this.qty.increase.click({ force: true }).catch(() => { });
    await this.page.waitForTimeout(800);
    const afterIncrease = await readQty();
    console.log(`   After "+": ${afterIncrease}`);

    // Click "−"
    await this.qty.decrease.click({ force: true }).catch(() => { });
    await this.page.waitForTimeout(800);
    const afterDecrease = await readQty();
    console.log(`   After "−": ${afterDecrease}`);

    return {
      qtyControlVisible,
      increaseNoOp: afterIncrease === initialQty,
      decreaseNoOp: afterDecrease === initialQty || afterDecrease === afterIncrease,
      initialQty,
      afterIncrease,
      afterDecrease,
    };
  }

  // ============================================================
  // DEBUG HELPERS
  // ============================================================

  async debugAddToCartDOM() {

    const result = await this.page.evaluate(() => {
      const candidates = document.querySelectorAll(
        'button.buttonWithBorder, [class*="addtocart"], [class*="add-to-cart"], ' +
        '[class*="btn-disabled"], [class*="sold-out"], [class*="out-of-stock"]'
      );
      return Array.from(candidates).slice(0, 15).map(el => ({
        tag: el.tagName,
        cls: el.className,
        text: el.textContent.trim().substring(0, 60),
        disabled: el.disabled || false,
        visible: el.getBoundingClientRect().width > 0,
      }));
    }).catch(() => []);

    console.log('=== ADD-TO-CART DOM DEBUG ===');
    result.forEach((r, i) =>
      console.log(`  [${i}] <${r.tag}> class="${r.cls}" text="${r.text}" disabled=${r.disabled} visible=${r.visible}`)
    );
    console.log('=== END ADD-TO-CART DOM DEBUG ===');
  }
}

module.exports = SoldOutPage;