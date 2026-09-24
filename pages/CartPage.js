// pages/CartPage.js

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class CartPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ── BLOG / ARTICLE PAGE ────────────────────────────────────────────────────
        this.blogPage = {

            // Product cards embedded in blog/article listings
            // (shoppable article widgets use .articleProductSearch)
            productLinks: page.locator(
                '.articleProductSearch > a.card, ' +
                '.product-card a[href*="/products/"], ' +
                'a.card[href*="/products/"], ' +
                'a[href*="/products/"]'
            ),

            // "Add to Cart" button on a Product Detail Page reached from a blog
            addToCartButton: page.locator(
                '.product-add-view-desktop button.buttonWithBorder.primaryButton'
            ),

            // Product title on the PDP
            productTitle: page.locator(
                'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
            ).first(),
        };

        // ── COLLECTION PAGE ────────────────────────────────────────────────────────
        this.collectionPage = {

            // Product card links inside any /collections/* page
            productLinks: page.locator(
                '.product-card a[href*="/products/"], ' +
                'a.product-item[href*="/products/"], ' +
                '.product-grid a[href*="/products/"], ' +
                '.collection-product a[href*="/products/"], ' +
                'a[href*="/products/"]'
            ),

            // "Add to Cart" button on a PDP reached from a collection page
            addToCartButton: page.locator(
                '.product-add-view-desktop button.buttonWithBorder.primaryButton'
            ),

            // Product title on the PDP
            productTitle: page.locator(
                'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
            ).first(),
        };


    }

    // ============================================================
    // NAVIGATION METHODS
    // ============================================================


    async navigateToBlogPage() {

        await this.header.navButtons.first().click({ force: true });
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await this.closeLoginPopupIfPresent();

        const url = this.page.url();

        if (!url.includes('/blogs/') && !url.includes('/collections/')) {
            await this.page.goto('/blogs/skin');
            await this.page.waitForLoadState('networkidle');
            await this.closeLoginPopupIfPresent();
        }
    }

    /**
     * Navigate to a collection page.
     * Tries the "Let's dive in!" button from BePicks; falls back to /collections/all.
     */
    async navigateToCollectionPage() {

        await this.navigateToHome();
        await this.page.waitForLoadState('networkidle');
        await this.closeLoginPopupIfPresent();

        // const diveInExists = await this.page.evaluate(() => {
        //     return !!(
        //         document.querySelector(
        //             '.bebe-button a.buttonWithBorder.primaryButton[href*="shop-by-category"]'
        //         ) ||
        //         document.querySelector('.bebe-button a.buttonWithBorder.primaryButton')
        //     );
        // });

        const diveInBtn = homePage.bePicks.letsDiveInButton;

        const diveInExists = await diveInBtn.isVisible().catch(() => false);

        if (diveInExists) {

            await this.scrollToBePicksSection();
            await this.page.waitForTimeout(1000);

            const diveInBtn = this.page.locator(
                '.bebe-button a.buttonWithBorder.primaryButton[href*="shop-by-category"], ' +
                '.bebe-button a.buttonWithBorder.primaryButton'
            ).first();

            await diveInBtn.click({ force: true });
            await this.page.waitForLoadState('networkidle');
            await this.closeLoginPopupIfPresent();

        } else {

            await this.page.goto('/collections/all');
            await this.page.waitForLoadState('networkidle');
            await this.closeLoginPopupIfPresent();
        }
    }

    /**
     * Given a product href (relative or absolute), navigate to its PDP,
     * capture the product title, click Add to Cart, and return the title.
     * @param {string} productHref
     * @returns {Promise<string>} product title, or '' on failure
     */
    async addProductToCartFromHref(productHref) {

        const origin = new URL(this.page.url()).origin;
        const productUrl = productHref.startsWith('http')
            ? productHref
            : `${origin}${productHref}`;

        await this.page.goto(productUrl);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await this.closeLoginPopupIfPresent();

        const title = (
            await this.page.locator(
                'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
            ).first().textContent().catch(() => '')
        ).trim();

        const addToCartBtn = this.page.locator(
            '.product-add-view-desktop button.buttonWithBorder.primaryButton, ' +
            'button:has-text("Add to Cart"), ' +
            'button:has-text("ADD TO CART"), ' +
            'button[class*="add-to-cart"]'
        ).first();

        const visible = await addToCartBtn.isVisible({ timeout: 10000 }).catch(() => false);

        if (visible) {
            await addToCartBtn.click();
            await this.page.waitForTimeout(3000);
            await this.closeLoginPopupIfPresent();
        }

        return title;
    }

}

module.exports = CartPage;