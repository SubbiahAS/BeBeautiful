// pages/StickyCTAPage.js
// Page Object Model for Sticky CTA Bar verification on BeBeautiful PDP.
//
// DOM confirmed from DevTools screenshot:
//
//  STICKY BAR WRAPPER:
//    div.product-scroll-view-wrapper
//      div.product-scroll-view                     ← the whole sticky bar
//        div.product-scroll-view-detail
//          img[alt="productImage"]                 ← product image
//          div.product-category-title
//            p.product-category                   ← brand name (e.g. "Lakme")
//            p.product-title                      ← product name
//          div.product-price
//            div.product-price
//              p.product-actualPrice              ← original / strike price
//              p.product-discontPrice             ← discounted price  (₹424)
//              p.discount-percentage              ← "-15% off"
//        div.add-to-cart
//          div.update-quantity
//            span.white-minus                     ← "−"
//            span.white-text                      ← "01"  (current qty)
//            span.white-plus                      ← "+"
//          div.add-to-cart-button
//            div.cart-button-wrapper
//              button.buttonWithBorder.primaryButton  ← "Add to Cart ›"
//            div.cart-button-wrapper.alsoAvailableOn  ← "Also available on ›"
//
//  SUCCESS POPUP (after clicking Add to Cart):
//    div.popup-message-cart[aria-live="polite"]
//      span  → "Product added to cart"
//      button.popup-link  → "Go to cart"

const BasePage = require('./BasePage');

class StickyCTAPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ── STICKY BAR — outer wrapper ────────────────────────────
        this.stickyWrapper = page.locator('.product-scroll-view-wrapper');

        // ── STICKY BAR — main container ──────────────────────────
        // this.stickyBar = page.locator('.product-scroll-view');
        this.stickyBar = page.locator('.product-scroll-view');

        // ── STICKY BAR — product image ────────────────────────────
        // img inside div.product-scroll-view-detail
        // this.stickyProductImage = page.locator(
        //     '.product-scroll-view .product-scroll-view-detail img[alt="productImage"], ' +
        //     '.product-scroll-view .product-scroll-view-detail img'
        // ).first();
        this.stickyProductImage =
            this.stickyBar.locator('img[alt="productImage"]');

        // ── STICKY BAR — brand / category name ───────────────────
        // p.product-category inside div.product-category-title
        this.stickyBrandName = page.locator(
            '.product-scroll-view .product-category-title p.product-category'
        ).first();

        // ── STICKY BAR — product title ────────────────────────────
        // p.product-title inside div.product-category-title
        // this.stickyProductName = page.locator(
        //     '.product-scroll-view .product-category-title p.product-title'
        // ).first();
        this.stickyProductName =
            this.stickyBar.locator('.product-title');


        // ── STICKY BAR — price block ──────────────────────────────
        this.stickyPriceBlock = page.locator(
            '.product-scroll-view .product-price'
        ).first();

        // Original / strike-through price  e.g. ₹499
        this.stickyOriginalPrice = page.locator(
            '.product-scroll-view .product-price p.product-actualPrice'
        ).first();

        // Discounted / final price  e.g. ₹424
        // this.stickyDiscountPrice = page.locator(
        //     '.product-scroll-view .product-price p.product-discontPrice'
        // ).first();
        this.stickyDiscountPrice =
            this.stickyBar.locator('.product-discontPrice');


        // Discount percentage badge  e.g. "-15% off"
        // this.stickyDiscountPercent = page.locator(
        //     '.product-scroll-view .product-price p.discount-percentage'
        // ).first();
        this.stickyDiscountPercent =
            this.stickyBar.locator('.discount-percentage');

        // ── STICKY BAR — quantity controls ───────────────────────
        // div.update-quantity inside the sticky bar
        // this.stickyQty = {

        //     wrapper: page.locator('.product-scroll-view .update-quantity').first(),

        //     // "−" span
        //     decrease: page.locator(
        //         '.product-scroll-view .update-quantity span.white-minus'
        //     ).first(),

        //     // current qty text  e.g. "01"
        //     value: page.locator(
        //         '.product-scroll-view .update-quantity span.white-text'
        //     ).first(),

        //     // "+" span
        //     increase: page.locator(
        //         '.product-scroll-view .update-quantity span.white-plus'
        //     ).first(),
        // };

        this.stickyQty = {
            wrapper: this.stickyBar.locator('.update-quantity'),
            decrease: this.stickyBar.locator('.white-minus'),
            value: this.stickyBar.locator('.white-text'),
            increase: this.stickyBar.locator('.white-plus')
        };

        // ── STICKY BAR — Add to Cart button ──────────────────────
        // button inside div.add-to-cart-button > div.cart-button-wrapper
        // this.stickyAddToCartBtn = page.locator(
        //   '.product-scroll-view .add-to-cart-button .cart-button-wrapper button.buttonWithBorder.primaryButton'
        // ).first();
        // this.stickyAddToCartBtn = page.locator(
        //     '.product-scroll-view button:has-text("Add to Cart")'
        // ).first();
        this.stickyAddToCartBtn =
            this.stickyBar.locator('button:has-text("Add to Cart")');

        // ── STATIC PDP — Add to Cart button ──────────────────────
        // (used to check the page is a valid in-stock PDP before scrolling)
        this.staticAddToCartBtn = page.locator(
            '.product-add-view-desktop button.buttonWithBorder.primaryButton, ' +
            '.add-to-cart-button .cart-button-wrapper button.buttonWithBorder.primaryButton'
        ).first();

        // ── STATIC PDP — discount percentage (to filter only discounted products)
        // Confirms this PDP has a discount before running TC036
        this.staticDiscountPercent = page.locator(
            '.product-detail-info .discount-percent, ' +
            '.product-detail-info [class*="discount"][class*="percent"], ' +
            '.product-detail-info [class*="discountPercent"], ' +
            '[class*="discount-percent"], ' +
            'span[class*="off"], ' +
            '.discountValue, ' +
            '.discount-badge, ' +
            'p.discount-percentage'
        ).first();

        // ── SUCCESS POPUP ─────────────────────────────────────────
        this.popup = {
            container: page.locator('div.popup-message-cart'),
            message: page.locator('div.popup-message-cart span').first(),
            goToCartBtn: page.locator('div.popup-message-cart button.popup-link'),
        };

        // ── CART SIDEBAR ─────────────────────────────────────────
        this.cartSidebar = {
            modal: page.locator('.cart-scrollable-content'),
            title: page.locator('.cart-title'),
            closeButton: page.locator('.cart-close'),
            itemCards: page.locator('.cart-items .card-product-card'),
            productName: page.locator('.cart-items .card-product-card .productDetail > h2.icon'),
            emptyTitle: page.locator('.empty-cart-title'),
        };
    }

    // ============================================================
    // NAVIGATION — find a discounted in-stock product
    // ============================================================

    /**
     * Navigates to any available in-stock product that carries a
     * discount percentage on its PDP.
     *
     * Strategy:
     *  1. Search for a keyword (e.g. "Lakme") to get a list of product hrefs
     *  2. For each href navigate to the PDP and check:
     *       a. The static Add-to-Cart button is NOT btn-disabled
     *       b. A discount-percentage element is visible on the page
     *  3. Stop at the first qualifying PDP and return its URL
     *  4. If no qualifying product found from search, try a known URL fallback
     *
     * @param {import('./HomePage')} homePage
     * @param {string} keyword   search term to find candidate products
     * @returns {Promise<string>} URL of the qualifying PDP
     */
    async navigateToDiscountedInStockProduct(homePage, keyword = 'Lakme') {

        console.log(`   Searching for discounted in-stock product — keyword: "${keyword}"`);

        let candidateHrefs = [];

        // ── 1. Collect product hrefs via search ──────────────────
        try {

            await homePage.openSearch();
            await this.page.waitForTimeout(500);
            await homePage.search.inputField.fill(keyword);
            await homePage.search.inputField.press('Enter');
            await this.page.waitForLoadState('networkidle').catch(() => { });
            await this.page.waitForTimeout(2000);

            const count = await homePage.products.productLinks.count().catch(() => 0);
            console.log(`   Search returned ${count} product link(s) for "${keyword}"`);

            for (let i = 0; i < Math.min(count, 10); i++) {
                const href = await homePage.products.productLinks.nth(i)
                    .getAttribute('href').catch(() => null);
                if (href && !candidateHrefs.includes(href)) {
                    candidateHrefs.push(href);
                }
            }

            const modalOpen = await homePage.search.modalOverlay.isVisible().catch(() => false);
            if (modalOpen) await homePage.closeSearch().catch(() => { });

        } catch (err) {
            console.log(`   ⚠️ Search failed: ${err.message}`);
        }

        // ── 2. Check each candidate PDP for discount + in-stock ──
        const origin = new URL(this.page.url()).origin;

        for (const href of candidateHrefs) {

            const productUrl = href.startsWith('http') ? href : `${origin}${href}`;

            console.log(`   Checking PDP: ${productUrl}`);

            await this.page.goto(productUrl);
            await this.page.waitForLoadState('networkidle').catch(() => { });
            await this.page.waitForTimeout(1500);
            await this.closeLoginPopupIfPresent().catch(() => { });

            // a. In-stock check: Add-to-Cart button must NOT have btn-disabled
            const addToCartClass = (
                await this.staticAddToCartBtn.getAttribute('class').catch(() => '')
            ) || '';

            const isInStock =
                !addToCartClass.includes('btn-disabled') &&
                (await this.staticAddToCartBtn.isVisible().catch(() => false));

            if (!isInStock) {
                console.log(`   ↳ Skipped (sold-out): ${productUrl}`);
                continue;
            }

            // b. Discount check: a discount-percentage element must be visible
            const hasDiscount = await this.staticDiscountPercent
                .isVisible({ timeout: 3000 })
                .catch(() => false);

            if (!hasDiscount) {
                console.log(`   ↳ Skipped (no discount): ${productUrl}`);
                continue;
            }

            const discountText = (
                await this.staticDiscountPercent.textContent().catch(() => '')
            ).trim();

            console.log(`   ✅ Qualifying product found — discount: "${discountText}", URL: ${productUrl}`);
            return productUrl;
        }

        // ── 3. Fallback: use the known PDP from the screenshot ───
        const fallbackUrl = `${origin}/products/lakme-sun-expert-dry-matte-fluid-spf-50-pa-sunscreen-with-1-niacinamide-ceramide`;
        console.log(`   ⚠️ No qualifying product found via search — using fallback URL: ${fallbackUrl}`);

        await this.page.goto(fallbackUrl);
        await this.page.waitForLoadState('networkidle').catch(() => { });
        await this.page.waitForTimeout(2000);
        await this.closeLoginPopupIfPresent().catch(() => { });

        return this.page.url();
    }

    // ============================================================
    // STICKY BAR — VISIBILITY HELPERS
    // ============================================================

    /**
     * Scrolls the page down incrementally until the sticky bar becomes
     * visible OR the maximum scroll distance is reached.
     *
     * @param {number} maxScrollPx   Maximum pixels to scroll (default 3000)
     * @param {number} stepPx        Pixels scrolled per step (default 300)
     * @returns {Promise<boolean>}   true if sticky bar became visible
     */
    async scrollUntilStickyBarVisible(maxScrollPx = 3000, stepPx = 300) {

        let scrolled = 0;

        while (scrolled <= maxScrollPx) {

            await this.page.evaluate((step) => window.scrollBy(0, step), stepPx);
            await this.page.waitForTimeout(400);

            scrolled += stepPx;

            const visible = await this.stickyBar.isVisible().catch(() => false);
            if (visible) {
                console.log(`   ✅ Sticky bar visible after scrolling ~${scrolled}px`);
                return true;
            }
        }

        console.log(`   ⚠️ Sticky bar not visible after scrolling ${scrolled}px`);
        return false;
    }

    /**
     * Returns true if the sticky bar is currently visible in the viewport.
     * @returns {Promise<boolean>}
     */
    async isStickyBarVisible() {
        return await this.stickyBar.isVisible().catch(() => false);
    }

    /**
     * Returns the bounding box of the sticky bar to confirm it appears
     * near the bottom of the viewport.
     * @returns {Promise<{x:number,y:number,width:number,height:number}|null>}
     */
    async getStickyBarBoundingBox() {
        return await this.stickyBar.boundingBox().catch(() => null);
    }

    /**
     * Checks whether the sticky bar is positioned at the bottom of the screen
     * by comparing its top-edge to the viewport height.
     * @returns {Promise<boolean>}
     */
    async isStickyBarAtBottom() {

        const box = await this.getStickyBarBoundingBox();
        if (!box) return false;

        const viewportHeight = await this.page.evaluate(() => window.innerHeight);

        // The bar's top edge should be in the lower 30% of the viewport
        const isNearBottom = box.y >= viewportHeight * 0.6;

        console.log(
            `   Sticky bar y=${Math.round(box.y)}, viewportH=${viewportHeight}, ` +
            `isNearBottom=${isNearBottom}`
        );

        return isNearBottom;
    }

    // ============================================================
    // STICKY BAR — ELEMENT PRESENCE HELPERS (Expected Result 2)
    // ============================================================

    /** @returns {Promise<boolean>} */
    async isStickyProductImageVisible() {
        return await this.stickyProductImage.isVisible().catch(() => false);
    }

    /** @returns {Promise<boolean>} */
    async isStickyProductNameVisible() {
        return await this.stickyProductName.isVisible().catch(() => false);
    }

    /** @returns {Promise<string>} */
    async getStickyProductNameText() {
        return (
            (await this.stickyProductName.textContent().catch(() => '')) || ''
        ).trim();
    }

    /** @returns {Promise<boolean>} */
    async isStickyPriceVisible() {
        // At least the discounted price must be visible
        return await this.stickyDiscountPrice.isVisible().catch(() => false);
    }

    /** @returns {Promise<string>} */
    async getStickyDiscountPriceText() {
        return (
            (await this.stickyDiscountPrice.textContent().catch(() => '')) || ''
        ).trim();
    }

    /** @returns {Promise<boolean>} */
    async isStickyDiscountPercentVisible() {
        return await this.stickyDiscountPercent.isVisible().catch(() => false);
    }

    /** @returns {Promise<string>} */
    async getStickyDiscountPercentText() {
        return (
            (await this.stickyDiscountPercent.textContent().catch(() => '')) || ''
        ).trim();
    }

    /** @returns {Promise<boolean>} */
    async isStickyQtySelectorVisible() {
        return await this.stickyQty.wrapper.isVisible().catch(() => false);
    }

    /** @returns {Promise<boolean>} */
    async isStickyAddToCartBtnVisible() {
        return await this.stickyAddToCartBtn.isVisible().catch(() => false);
    }

    // ============================================================
    // STICKY BAR — QUANTITY HELPERS
    // ============================================================

    /**
     * Returns the current quantity value shown in the sticky bar qty control.
     * @returns {Promise<number>}
     */
    async getStickyQtyValue() {
        const text = (
            (await this.stickyQty.value.textContent().catch(() => '')) || ''
        ).trim();
        return parseInt(text.replace(/\D/g, ''), 10) || 1;
    }

    /**
     * Clicks the sticky "+" button and returns the new qty value.
     * @returns {Promise<number>}
     */
    async increaseStickyQty() {
        await this.stickyQty.increase.click({ force: true });
        await this.page.waitForTimeout(700);
        return await this.getStickyQtyValue();
    }

    /**
     * Clicks the sticky "−" button and returns the new qty value.
     * @returns {Promise<number>}
     */
    async decreaseStickyQty() {
        await this.stickyQty.decrease.click({ force: true });
        await this.page.waitForTimeout(700);
        return await this.getStickyQtyValue();
    }

    // ============================================================
    // STICKY BAR — ADD TO CART (Expected Result 3)
    // ============================================================

    /**
     * Clicks the sticky Add to Cart button and waits for the success popup.
     * @returns {Promise<boolean>} true if popup appeared
     */
    // async clickStickyAddToCart() {

    //     await this.stickyAddToCartBtn.scrollIntoViewIfNeeded().catch(() => { });
    //     await this.page.waitForTimeout(300);

    //     await this.stickyAddToCartBtn.click({ force: true });

    //     const popupVisible = await this.popup.container
    //         .waitFor({ state: 'visible', timeout: 10000 })
    //         .then(() => true)
    //         .catch(() => false);

    //     await this.page.waitForTimeout(1000);
    //     return popupVisible;
    // }

    async clickStickyAddToCart() {

        await this.stickyBar.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await this.stickyAddToCartBtn.waitFor({
            state: 'visible',
            timeout: 10000
        });

        await this.stickyAddToCartBtn.scrollIntoViewIfNeeded();

        await this.stickyAddToCartBtn.click();

        const popupVisible =
            await this.popup.container
                .waitFor({
                    state: 'visible',
                    timeout: 10000
                })
                .then(() => true)
                .catch(() => false);

        return popupVisible;
    }

    /** @returns {Promise<boolean>} */
    async isSuccessPopupVisible() {
        return await this.popup.container.isVisible().catch(() => false);
    }

    /** @returns {Promise<string>} */
    async getSuccessPopupText() {
        return (
            (await this.popup.message.textContent().catch(() => '')) || ''
        ).trim();
    }

    /** @returns {Promise<boolean>} */
    async isGoToCartBtnVisible() {
        return await this.popup.goToCartBtn.isVisible().catch(() => false);
    }

    /**
     * Clicks "Go to cart" in the popup and waits for the cart sidebar.
     */
    async clickGoToCart() {
        await this.popup.goToCartBtn.click({ force: true });
        await this.cartSidebar.modal
            .waitFor({ state: 'visible', timeout: 10000 })
            .catch(() => { });
        await this.page.waitForTimeout(1500);
    }

    /** @returns {Promise<boolean>} */
    async isCartSidebarOpen() {
        return await this.cartSidebar.modal.isVisible().catch(() => false);
    }

    /** @returns {Promise<number>} */
    async getCartItemCount() {
        return await this.cartSidebar.itemCards.count().catch(() => 0);
    }

    // ============================================================
    // DEBUG HELPER
    // ============================================================

    async debugStickyBarDOM() {

        const result = await this.page.evaluate(() => {

            const bar = document.querySelector('.product-scroll-view');
            if (!bar) return 'STICKY BAR NOT FOUND IN DOM';

            const rect = bar.getBoundingClientRect();

            return {
                visible: rect.width > 0 && rect.height > 0,
                position: { top: Math.round(rect.top), left: Math.round(rect.left) },
                size: { width: Math.round(rect.width), height: Math.round(rect.height) },
                html: bar.outerHTML.substring(0, 2000),
            };
        }).catch(() => null);

        console.log('=== STICKY BAR DOM DEBUG ===');
        console.log(JSON.stringify(result, null, 2));
        console.log('=== END STICKY BAR DOM DEBUG ===');
    }
}

module.exports = StickyCTAPage;