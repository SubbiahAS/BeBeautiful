// pages/BeautypediaPage.js

const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class BeautypediaPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {

        super(page);

        // ============================================================
        // BEAUTYPEDIA LANDING PAGE
        // ============================================================

        this.banner = {

            wrapper: page.locator('.single-launch-wrapper'),

            image: page.locator("img[alt='BeautyPedia Banner']"),

            title: page.locator('.vector-content-title'),

            subtitle: page.locator('.vector-content-subtitle')

        };

        // ============================================================
        // SEARCH SECTION
        // ============================================================

        this.search = {

            wrapper: page.locator('.searchInputWrapper'),

            input: page.locator("input[placeholder='Search for an ingredient']"),

            searchText: page.locator('.searchSubtext'),

            clearButton: page.locator('.searchClearIcon'),

            resultContainer: page.locator('.ingredientGrid')

        };

        // ============================================================
        // ALPHABET FILTER
        // ============================================================

        this.alphabet = {

            wrapper: page.locator('.alphabetFilter'),

            letters: page.locator('.alphabetLetter'),

            selectedLetter: page.locator('.alphabetLetter.selected')

        };

        // ============================================================
        // ARTICLE CARD
        // ============================================================

        this.article = {

            cards: page.locator('.ingredientCard'),

            image: page.locator('.ingredientCard .ingredientImage'),

            title: page.locator('.ingredientTitle'),

            description: page.locator('.ingredientSubtitle p'),

            shareIcon: page.locator('.shareIcon'),

            imageWrapper: page.locator('.imageWrapper')

        };

        // ============================================================
        // SHARE POPUP
        // ============================================================

        // this.sharePopup = {

        //     container: page.locator(
        //         '.sharePopup,.share-modal,.share-dialog'
        //     ),

        //     closeButton: page.locator(
        //         '.sharePopup .close,.share-modal .close'
        //     ),

        //     socialIcons: page.locator(
        //         '.sharePopup a,.sharePopup button'
        //     )

        // };

        this.sharePopup = {

            // Popup container
            container: page.locator('div.popup-content'),

            // Popup title
            title: page.locator('h3.share-title'),

            // Close button
            closeButton: page.locator('button.close-btn'),

            // Social icons container
            iconsContainer: page.locator('div.icons-container'),

            // All share buttons
            socialIcons: page.locator('div.icons-container button'),

            instagram: page.locator('button.instagram-icon'),

            whatsapp: page.locator('button.whatsapp-icon'),

            mail: page.locator('button.mail-icon'),

            twitter: page.locator('button.twitter-icon'),

            copyContainer: page.locator('form.copy-container')

        };

    }

    // ============================================================
    // NAVIGATION
    // ============================================================

    async navigateToBeautypedia() {

        await this.goto('/beautypedia');

        await this.page.waitForLoadState('networkidle');

    }

    // ============================================================
    // VERIFY BANNER
    // ============================================================

    async verifyBannerDisplayed() {

        await expect(
            this.banner.wrapper
        ).toBeVisible();

    }

    // ============================================================
    // VERIFY SEARCH
    // ============================================================

    async verifySearchSection() {

        await expect(
            this.search.wrapper
        ).toBeVisible();

        await expect(
            this.search.input
        ).toBeVisible();

    }

    // ============================================================
    // SEARCH KEYWORD
    // ============================================================

    async searchIngredient(keyword) {

        await this.search.input.click();

        await this.search.input.fill('');

        await this.search.input.fill(keyword);

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

    }

    // ============================================================
    // RESULT COUNT
    // ============================================================

    async getResultCount() {

        return await this.article.cards.count();

    }

    // ============================================================
    // VERIFY RESULTS
    // ============================================================

    async verifyResultsDisplayed() {

        const count =
            await this.getResultCount();

        expect(count).toBeGreaterThan(0);

    }

    // ============================================================
    // SCROLL TO ALPHABET
    // ============================================================

    async scrollToAlphabetSection() {

        await this.alphabet.wrapper.scrollIntoViewIfNeeded();

        await this.page.waitForTimeout(1500);

    }

    // ============================================================
    // CLICK LETTER
    // ============================================================

    async clickAlphabet(letter) {

        await this.alphabet.letters
            .filter({ hasText: letter })
            .first()
            .click();

        await this.page.waitForLoadState('networkidle');

        await this.page.waitForTimeout(2000);

    }

    // ============================================================
    // VERIFY ACTIVE LETTER
    // ============================================================

    async verifySelectedAlphabet(letter) {

        await expect(
            this.alphabet.selectedLetter
        ).toHaveText(letter);

    }

    // ============================================================
    // VERIFY ARTICLE TITLE
    // ============================================================

    async getFirstArticleTitle() {

        return (
            await this.article.title
                .first()
                .textContent()
        ).trim();

    }

    // ============================================================
    // VERIFY ARTICLE IMAGE
    // ============================================================

    async verifyArticleImage() {

        await expect(
            this.article.image.first()
        ).toBeVisible();

    }

    // ============================================================
    // VERIFY ARTICLE TITLE
    // ============================================================

    async verifyArticleTitle() {

        await expect(
            this.article.title.first()
        ).toBeVisible();

    }

    // ============================================================
    // VERIFY WHAT IS IT TEXT
    // ============================================================

    async verifyWhatIsItText() {

        await expect(
            this.article.description.first()
        ).toBeVisible();

    }

    // ============================================================
    // VERIFY SHARE ICON
    // ============================================================

    async verifyShareIcon() {

        await expect(
            this.article.shareIcon.first()
        ).toBeVisible();

    }

    // ============================================================
    // CLICK SHARE
    // ============================================================

    // async clickShareIcon() {

    //     await this.article.shareIcon
    //         .first()
    //         .click();

    //     await this.page.waitForTimeout(2000);

    // }

    async clickShareIcon() {

        await this.article.shareIcon.first().click();

        await this.sharePopup.container.waitFor({
            state: 'visible',
            timeout: 10000
        });

    }

    // ============================================================
    // VERIFY SHARE POPUP
    // ============================================================

    async verifySharePopup() {

        await expect(
            this.sharePopup.container
        ).toBeVisible();

    }

    // ============================================================
    // CLOSE SHARE
    // ============================================================

    async closeSharePopup() {

        if (
            await this.sharePopup.closeButton
                .isVisible()
                .catch(() => false)
        ) {

            await this.sharePopup.closeButton.click();

        }

    }

}

module.exports = BeautypediaPage;