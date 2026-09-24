// pages/CollectionPage.js

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class CollectionPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {

        super(page);

        // ============================================================
        // COLLECTION PAGE
        // ============================================================

        this.collection = {

            pageContainer: page.locator('.collection-page, .product-listing-page'),

            // filterSection: page.locator(
            //     '.left-header-column, .filter-container, .collection-filter'
            // ),
            filterSection: page.locator(
                '.left-column .filters-container'
            ),

            filterTitle: page.locator(
                '.left-header-column h2, .filter-title'
            ),

            productSection: page.locator(
                '.product-grid'
            ),

            productCards: page.locator(
                '.product-grid .editor-product-card'
            ),

            productImages: page.locator(
                '.product-grid .editor-product-card img'
            ),

            wishlistIcons: page.locator(
                '.product-grid .editor-product-card .wishlistIcon'
            ),

            productTitles: page.locator(
                '.product-grid .editor-product-card .productDetail h2.icon'
            ),

            productPrices: page.locator(
                '.product-grid .editor-product-card .discountPrice'
            ),

            taxText: page.locator(
                '.product-grid .editor-product-card .taxText'
            ),

            addToCartButtons: page.locator(
                '.product-grid .editor-product-card button.buttonWithBorder.primaryButton'
            ),

            loadMoreButton: page.locator(
                'button:has-text("Load More"), button:has-text("LOAD MORE"), button:has-text("View More"), .load-more button'
            ),

            loadingSpinner: page.locator(
                '.loading,.loader,.spinner'
            ),

            productCount: page.locator(
                '.product-count-desktop'
            )
        };

    }

    // ============================================================
    // NAVIGATION
    // ============================================================

    async navigateToCollectionPage() {

        await this.goto('/shop-by-category');

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

        await this.closeLoginPopupIfPresent().catch(() => { });

    }

    // ============================================================
    // FILTER SECTION
    // ============================================================

    async isFilterSectionVisible() {

        await this.collection.filterSection.first().waitFor({
            state: 'visible',
            timeout: 10000
        });

        return await this.collection.filterSection
            .first()
            .isVisible();

    }

    // ============================================================
    // PRODUCT SECTION
    // ============================================================

    async isProductSectionVisible() {

        return await this.collection.productSection
            .isVisible()
            .catch(() => false);

    }

    async getProductCount() {

        return await this.collection.productCards
            .count()
            .catch(() => 0);

    }

    async areProductImagesVisible() {

        const total =
            await this.collection.productImages.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const visible =
                await this.collection.productImages
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (!visible)
                return false;

        }

        return true;

    }

    async areWishlistIconsVisible() {

        const total =
            await this.collection.wishlistIcons.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const visible =
                await this.collection.wishlistIcons
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (!visible)
                return false;

        }

        return true;

    }

    async areProductTitlesVisible() {

        const total =
            await this.collection.productTitles.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const text =
                await this.collection.productTitles
                    .nth(i)
                    .textContent()
                    .catch(() => '');

            if (text.trim() === '')
                return false;

        }

        return true;

    }

    async arePricesVisible() {

        const total =
            await this.collection.productPrices.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const text =
                await this.collection.productPrices
                    .nth(i)
                    .textContent()
                    .catch(() => '');

            if (text.trim() === '')
                return false;

        }

        return true;

    }

    async isTaxTextVisible() {

        const total =
            await this.collection.taxText.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const text =
                await this.collection.taxText
                    .nth(i)
                    .textContent()
                    .catch(() => '');

            if (!text.includes('MRP'))
                return false;

        }

        return true;

    }

    async areAddToCartButtonsVisible() {

        const total =
            await this.collection.addToCartButtons.count();

        if (total === 0)
            return false;

        for (let i = 0; i < total; i++) {

            const visible =
                await this.collection.addToCartButtons
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (!visible)
                return false;

        }

        return true;

    }

    async loadMoreProductsOnScroll() {

    const previous =
        await this.getProductCount();

    await this.page.evaluate(() => {

        window.scrollTo(
            0,
            document.body.scrollHeight
        );

    });

    await this.page.waitForLoadState('networkidle');

    await this.page.waitForTimeout(5000);

    const latest =
        await this.getProductCount();

    return {

        previous,

        latest,

        loaded: latest > previous

    };

}

}

module.exports = CollectionPage;