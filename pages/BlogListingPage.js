// ============================================================
// PART 1: pages/BlogListingPage.js
// Updated POM with TC061 methods
// ============================================================

const BasePage = require('./BasePage');

class BlogListingPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        // ── URLs ──────────────────────────────────────────────────
        this.urls = {
            allThingsSkin:
                process.env.ALL_THINGS_SKIN_URL || '/all-things-skin',

            allThingsHair:
                process.env.ALL_THINGS_HAIR_URL || '/all-things-hair',
        };

        // ── Breadcrumb & Marquee ─────────────────────────────────
        this.breadcrumb =
            page.locator('.readingheroNav a');

        this.marquee =
            page.locator('.marqueeContainer');

        // ── Greeting Text ─────────────────────────────────────────
        this.greetingText =
            page.locator('.greeting-text, text=Hi ');

        // ── Hero Section ──────────────────────────────────────────
        this.heroTitle =
            page.locator(
                "//div[@class='link-card-content-alt']//div[@class='link-card-title']"
            );

        this.heroArticleLink =
            page.locator(
                '.articleListingLinking a[href], .link-card-content-alt a[href]'
            );

        this.heroDiveInButton =
            page.locator(
                '.banner-button button, button:has-text("Dive in"), button:has-text("Dive In")'
            );

        this.heroReadTime =
            page.locator(
                '.read-time, .article-read-time, .vibeMeta span:first-child'
            );

        this.heroPublishDate =
            page.locator(
                '.publish-date, ' +
                '.article-publish-date, ' +
                '.card-date, ' +
                '.articleDate, ' +
                '.postDate, ' +
                '.vibeMeta span:nth-child(3), ' +
                '[class*="date" i]'
            );

        this.heroAuthor =
            page.locator(
                '.card-author-text a'
            );

        this.heroLikeButton =
            page.locator(
                '.like-button, ' +
                '[aria-label="Like"], ' +
                '.article-like, ' +
                '.iconHeart, ' +
                '.iconLike, ' +
                '[aria-label*="like" i], ' +
                '[class*="like" i]'
            );

        this.heroShareButton =
            page.locator(
                '.share-button, ' +
                '[aria-label="Share"], ' +
                '.article-share, ' +
                '.iconShare, ' +
                '[aria-label*="share" i], ' +
                '[class*="share" i]'
            );

        // ── Article Category Cards ────────────────────────────────
        this.articleCategoryCards =
            page.locator(
                '.articleListingCategoryContentCardContainer a'
            );

        // ── People Looking For ───────────────────────────────────
        this.peopleLookingSection =
            page.locator(
                '.articleListingLookingFor'
            );

        // this.peopleLookingCards =
        //     page.locator(
        //         '.articleListingLookingForContent a'
        //     );

        this.peopleLookingCards =
            page.locator(
                '.articleListingLookingForContent a'
            ).filter({
                has: page.locator(
                    'img, picture, h1, h2, h3, h4, .article-title, .card-title, .link-card-title, [class*="title" i]'
                )
            });

        this.carousel =
            page.locator(
                '.custom-looking-navigation'
            );

        // this.carouselNext =
        //     page.locator(
        //         '.swiper-button-next, .carousel-next'
        //     );

        this.carouselNext =
            page.locator(
                '.swiper-button-next, ' +
                '.carousel-next, ' +
                '.custom-looking-navigation .swiper-button-next, ' +
                "button[aria-label='Next'], " +
                '[class*="next" i]'
            );

        // this.carouselPrev =
        //     page.locator(
        //         '.swiper-button-prev, .carousel-prev'
        //     );

        this.carouselPrev =
            page.locator(
                '.swiper-button-prev, ' +
                '.carousel-prev, ' +
                '.custom-looking-navigation .swiper-button-prev, ' +
                "button[aria-label='Prev'], button[aria-label='Previous'], " +
                '[class*="prev" i]'
            );

        this.peopleLookingTitles =
            page.locator(
                '.articleListingLookingForContent .article-title, ' +
                '.articleListingLookingForContent .card-title, ' +
                '.articleListingLookingForContent .link-card-title, ' +
                '.articleListingLookingForContent h2, ' +
                '.articleListingLookingForContent h3'
            );

        this.peopleLookingAuthors =
            page.locator(
                '.articleListingLookingForContent .card-author-text a, ' +
                '.articleListingLookingForContent .author-name, ' +
                '.articleListingLookingForContent [class*="author" i]'
            );

        this.peopleLookingReadTimes =
            page.locator(
                '.articleListingLookingForContent .read-time, ' +
                '.articleListingLookingForContent .article-read-time, ' +
                '.articleListingLookingForContent [class*="read-time" i]'
            );

        this.peopleLookingDates =
            page.locator(
                '.articleListingLookingForContent .publish-date, ' +
                '.articleListingLookingForContent .article-publish-date, ' +
                '.articleListingLookingForContent [class*="date" i]'
            );

        // this.sharePopup =
        //     page.locator(
        //         '.share-popup, .share-modal, [class*="share-popup" i], ' +
        //         '[class*="share-modal" i], [role="dialog"][class*="share" i]'
        //     );

        this.sharePopup =
            page.locator(
                '.share-popup, .share-modal, [class*="share-popup" i], ' +
                '[class*="share-modal" i], [role="dialog"][class*="share" i], ' +
                '[class*="share" i][class*="dropdown" i], ' +
                '[class*="share" i][class*="list" i], ' +
                '[class*="social" i], [role="dialog"]'
            );

        this.loginModal =
            page.locator(
                '.modalPoplogin, [class*="login-modal" i], [class*="loginModal" i]'
            );

        this.carouselDots =
            page.locator(
                '.swiper-pagination-bullet, .carousel-dot'
            );

        this.activeSlide =
            page.locator(
                '.swiper-slide-active'
            );

        // ── People Looking For Images ─────────────────────────────
        this.peopleLookingImages =
            page.locator(
                '.articleListingLookingFor img, ' +
                '.articleListingLookingForContent img, ' +
                '.articleListingLookingForContent a img'
            );

        // ── People Looking For Like / Share ───────────────────────
        // this.peopleLookingLikeButton =
        //   page.locator(
        //     '.articleListingLookingFor .like-button, ' +
        //     '.articleListingLookingFor [aria-label="Like"], ' +
        //     '.articleListingLookingFor .article-like, ' +
        //     '.articleListingLookingFor [class*="like"]'
        //   );

        // this.peopleLookingLikeButton =
        //     page.locator(
        //         '.articleListingLookingFor .like-button, ' +
        //         '.articleListingLookingFor [aria-label="Like"], ' +
        //         '.articleListingLookingFor .article-like, ' +
        //         '.articleListingLookingFor [class*="like" i], ' +
        //         '.like-button, [aria-label="Like"], .article-like, [class*="like" i]'
        //     );

        this.peopleLookingLikeButton =
            this.page.locator(
                '.like-button, [aria-label="Like"], .article-like, .iconHeart, .iconLike, [aria-label*="like" i], [class*="like" i]'
            );

        // this.peopleLookingShareButton =
        //     page.locator(
        //         '.articleListingLookingFor .share-button, ' +
        //         '.articleListingLookingFor [aria-label="Share"], ' +
        //         '.articleListingLookingFor .article-share, ' +
        //         '.articleListingLookingFor [class*="share"]'
        //     );

        // this.peopleLookingShareButton =
        //     page.locator(
        //         '.articleListingLookingFor .share-button, ' +
        //         '.articleListingLookingFor [aria-label="Share"], ' +
        //         '.articleListingLookingFor .article-share, ' +
        //         '.articleListingLookingFor [class*="share" i], ' +
        //         '.share-button, [aria-label="Share"], .article-share, [class*="share" i]'
        //     );

        this.peopleLookingShareButton =
            this.page.locator(
                '.share-button, [aria-label="Share"], .article-share, .iconShare, [aria-label*="share" i], [class*="share" i]'
            );

        // ── Article Listing ───────────────────────────────────────
        this.allArticleContainer =
            page.locator(
                '.allArticleListingContainer'
            );

        this.articleCards =
            page.locator(
                '.articleCard'
            );

        this.firstArticle =
            page.locator(
                '.articleCard a'
            );

        this.loadMoreBtn =
            page.locator(
                '.article-listing-banner-button'
            );

        // ── Article Listing Fallback Locators ─────────────────────
        this.articleListingFallback =
            page.locator(
                '.article-listing, .articles-grid'
            );

        this.articleCardFallback =
            page.locator(
                '.article-card, .content-card'
            );

        // ── Article Images ────────────────────────────────────────
        this.articleImages =
            page.locator(
                '.articleListingCategoryContentCardContainer img, ' +
                '.allArticleListingContainer .articleCard img, ' +
                '.articleCard img, ' +
                '.article-card img, ' +
                '.content-card img'
            );

        // ── Article Card Like / Wishlist ──────────────────────────
        this.articleLikeButton =
            page.locator(
                '.like-button, ' +
                '[aria-label="Like"], ' +
                '.article-like, ' +
                '[class*="like"]'
            );

        // ── Article Card Share ────────────────────────────────────
        this.articleShareButton =
            page.locator(
                '.share-button, ' +
                '[aria-label="Share"], ' +
                '.article-share, ' +
                '[class*="share"]'
            );

        // ── Article Card Author ───────────────────────────────────
        this.articleAuthor =
            page.locator(
                '.card-author-text, ' +
                '.card-author-text a, ' +
                '.article-author, ' +
                '.author-name, ' +
                '.articleCard .author'
            );

        // ── Sort Dropdown ─────────────────────────────────────────
        this.sortDropdown =
            page.locator(
                '.article-page-sort-dropdown'
            );

        this.sortOptions =
            page.locator(
                '.custom-dropdown li'
            );
    }

    // ============================================================
    // EXISTING METHODS
    // ============================================================

    async navigateToAllThingsSkin() {
        await this.goto(
            this.urls.allThingsSkin
        );
    }

    async navigateToAllThingsHair() {
        await this.goto(
            this.urls.allThingsHair
        );
    }

    async navigateTo(url) {
        await this.goto(url);
    }

    async getArticleCount() {
        return this.articleCards.count();
    }

    async clickLoadMore() {
        await this.loadMoreBtn.click();
        await this.page.waitForTimeout(2000);
    }

    async openFirstArticle() {
        await this.firstArticle.first().click();

        await this.page.waitForLoadState(
            'domcontentloaded'
        );
    }

    async selectSortOption(optionLabel) {
        await this.sortDropdown.click();

        await this.page.waitForTimeout(500);

        await this.sortOptions
            .filter({
                hasText: optionLabel
            })
            .first()
            .click();

        await this.page.waitForTimeout(2000);
    }

    // ============================================================
    // TC060 METHODS
    // ============================================================

    async scrollToArticleListing() {
        const marqueeVisible =
            await this.marquee
                .first()
                .isVisible()
                .catch(() => false);

        if (marqueeVisible) {
            await this.marquee
                .first()
                .scrollIntoViewIfNeeded()
                .catch(() => { });

            await this.page.evaluate(() => {
                window.scrollBy(0, 500);
            });
        }

        await this.page.waitForTimeout(500);

        await this.allArticleContainer
            .first()
            .scrollIntoViewIfNeeded()
            .catch(() => { });

        await this.page.waitForTimeout(500);
    }

    async isArticleListingVisible() {
        const primaryVisible =
            await this.allArticleContainer
                .first()
                .isVisible()
                .catch(() => false);

        if (primaryVisible) {
            return true;
        }

        return await this.articleListingFallback
            .first()
            .isVisible()
            .catch(() => false);
    }

    async getTotalArticleListingCount() {
        const primaryCount =
            await this.articleCards.count();

        const fallbackCount =
            await this.articleCardFallback.count();

        return Math.max(
            primaryCount,
            fallbackCount
        );
    }

    async getArticleImageCount() {
        return await this.articleImages.count();
    }

    async isArticleLikeVisible() {
        const count =
            await this.articleLikeButton.count();

        if (count === 0) {
            return false;
        }

        for (let i = 0; i < count; i++) {
            const visible =
                await this.articleLikeButton
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (visible) {
                return true;
            }
        }

        return false;
    }

    async isArticleShareVisible() {
        const count =
            await this.articleShareButton.count();

        if (count === 0) {
            return false;
        }

        for (let i = 0; i < count; i++) {
            const visible =
                await this.articleShareButton
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (visible) {
                return true;
            }
        }

        return false;
    }

    async isArticleAuthorVisible() {
        const count =
            await this.articleAuthor.count();

        if (count === 0) {
            return false;
        }

        for (let i = 0; i < count; i++) {
            const visible =
                await this.articleAuthor
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (visible) {
                const text =
                    (
                        await this.articleAuthor
                            .nth(i)
                            .textContent()
                            .catch(() => '')
                    ).trim();

                if (text.length > 0) {
                    return true;
                }
            }
        }

        return false;
    }

    async getFirstClickableArticle() {
        const selectors = [
            '.allArticleListingContainer .articleCard a[href]',
            '.articleCard a[href]',
            '.article-card a[href]',
            '.content-card a[href]',
            '.articleListingCategoryContentCardContainer a[href]'
        ];

        for (const selector of selectors) {
            const locator =
                this.page.locator(selector);

            const count =
                await locator.count();

            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    const visible =
                        await locator
                            .nth(i)
                            .isVisible()
                            .catch(() => false);

                    if (visible) {
                        return locator.nth(i);
                    }
                }
            }
        }

        return null;
    }

    async openFirstArticleFromListing() {
        const article =
            await this.getFirstClickableArticle();

        if (!article) {
            throw new Error(
                'No clickable article found in listing section.'
            );
        }

        const beforeUrl =
            this.page.url();

        const href =
            await article.getAttribute('href');

        if (!href) {
            throw new Error(
                'First article does not contain a valid href.'
            );
        }

        const expectedUrl =
            new URL(
                href,
                beforeUrl
            ).toString();

        await article.scrollIntoViewIfNeeded();

        await article.click({
            timeout: 15000
        }).catch(async () => {
            await this.page.goto(
                expectedUrl,
                {
                    waitUntil: 'domcontentloaded',
                    timeout: 30000
                }
            );
        });

        await this.page.waitForURL(
            url => url.toString() !== beforeUrl,
            {
                timeout: 15000
            }
        ).catch(() => { });

        await this.page.waitForLoadState(
            'domcontentloaded',
            {
                timeout: 15000
            }
        ).catch(() => { });

        return {
            beforeUrl,
            expectedUrl,
            actualUrl: this.page.url(),
            navigated: this.page.url() !== beforeUrl
        };
    }

    // ============================================================
    // TC061 — PEOPLE ARE LOOKING FOR METHODS
    // ============================================================

    /**
     * Scroll to the People are looking for section.
     */
    async scrollToPeopleLookingSection() {
        await this.peopleLookingSection
            .first()
            .scrollIntoViewIfNeeded()
            .catch(async () => {
                const heading =
                    this.page.getByText(
                        'People are looking for',
                        { exact: false }
                    ).first();

                await heading
                    .scrollIntoViewIfNeeded()
                    .catch(() => { });
            });

        await this.page.waitForTimeout(500);
    }

    /**
     * Verify People are looking for section.
     */
    async isPeopleLookingSectionVisible() {
        const sectionVisible =
            await this.peopleLookingSection
                .first()
                .isVisible()
                .catch(() => false);

        if (sectionVisible) {
            return true;
        }

        return await this.page
            .getByText(
                'People are looking for',
                { exact: false }
            )
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Get number of article cards in People are looking for section.
     */
    async getPeopleLookingCardCount() {
        return await this.peopleLookingCards.count();
    }

    /**
     * Get number of article images in People are looking for section.
     */
    async getPeopleLookingImageCount() {
        return await this.peopleLookingImages.count();
    }

    /**
     * Verify Like option in People are looking for section.
     */
    // async isPeopleLookingLikeVisible() {
    //     const count =
    //         await this.peopleLookingLikeButton.count();

    //     for (let i = 0; i < count; i++) {
    //         if (
    //             await this.peopleLookingLikeButton
    //                 .nth(i)
    //                 .isVisible()
    //                 .catch(() => false)
    //         ) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    async isPeopleLookingLikeVisible() {
        return await this.peopleLookingLikeButton
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Verify Share option in People are looking for section.
     */
    // async isPeopleLookingShareVisible() {
    //     const count =
    //         await this.peopleLookingShareButton.count();

    //     for (let i = 0; i < count; i++) {
    //         if (
    //             await this.peopleLookingShareButton
    //                 .nth(i)
    //                 .isVisible()
    //                 .catch(() => false)
    //         ) {
    //             return true;
    //         }
    //     }

    //     return false;
    // }

    async isPeopleLookingShareVisible() {
        return await this.peopleLookingShareButton
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Verify carousel navigation controls.
     */
    async isPeopleLookingCarouselVisible() {
        const primary =
            await this.carousel
                .first()
                .isVisible()
                .catch(() => false);

        if (primary) {
            return true;
        }

        return (
            await this.carouselNext
                .first()
                .isVisible()
                .catch(() => false)
        ) || (
                await this.carouselPrev
                    .first()
                    .isVisible()
                    .catch(() => false)
            );
    }

    /**
     * Get number of carousel navigation dots.
     */
    async getPeopleLookingDotCount() {
        return await this.carouselDots.count();
    }

    /**
     * Click the next carousel button.
     */
    async clickPeopleLookingNext() {
        const nextButton =
            this.carouselNext.first();

        const count =
            await nextButton.count();

        if (count === 0) {
            throw new Error(
                'Right navigation arrow not found.'
            );
        }

        await nextButton
            .scrollIntoViewIfNeeded()
            .catch(() => { });

        await nextButton.click({
            force: true,
            timeout: 10000
        });

        await this.page.waitForTimeout(1000);
    }

    /**
     * Click the second carousel navigation dot.
     */
    async clickPeopleLookingSecondDot() {
        const dotCount =
            await this.carouselDots.count();

        if (dotCount < 2) {
            throw new Error(
                'Could not find second navigation dot to click.'
            );
        }

        const secondDot =
            this.carouselDots.nth(1);

        await secondDot
            .scrollIntoViewIfNeeded()
            .catch(() => { });

        await secondDot.click({
            force: true,
            timeout: 10000
        });

        await this.page.waitForTimeout(1000);
    }

    // async verifyPeopleLookingCardAttributes(index) {

    //     const card =
    //         this.peopleLookingCards.nth(index);

    //     await card.scrollIntoViewIfNeeded().catch(() => { });

    //     const image =
    //         card.locator('img').first();

    //     const imageVisible =
    //         await image.isVisible().catch(() => false);

    //     const title =
    //         this.peopleLookingTitles.nth(index);

    //     const titleVisible =
    //         await title.isVisible().catch(() => false);

    //     const titleText =
    //         titleVisible
    //             ? (await title.textContent().catch(() => '') || '').trim()
    //             : '';

    //     const author =
    //         this.peopleLookingAuthors.nth(index);

    //     const authorVisible =
    //         await author.isVisible().catch(() => false);

    //     const authorText =
    //         authorVisible
    //             ? (await author.textContent().catch(() => '') || '').trim()
    //             : '';

    //     const readTime =
    //         this.peopleLookingReadTimes.nth(index);

    //     const readTimeVisible =
    //         await readTime.isVisible().catch(() => false);

    //     const readTimeText =
    //         readTimeVisible
    //             ? (await readTime.textContent().catch(() => '') || '').trim()
    //             : '';

    //     const date =
    //         this.peopleLookingDates.nth(index);

    //     const dateVisible =
    //         await date.isVisible().catch(() => false);

    //     const dateText =
    //         dateVisible
    //             ? (await date.textContent().catch(() => '') || '').trim()
    //             : '';

    //     const likeVisible =
    //         await this.peopleLookingLikeButton
    //             .nth(index)
    //             .isVisible()
    //             .catch(() => false);

    //     const shareVisible =
    //         await this.peopleLookingShareButton
    //             .nth(index)
    //             .isVisible()
    //             .catch(() => false);

    //     return {
    //         imageVisible,
    //         titleVisible,
    //         titleText,
    //         authorVisible,
    //         authorText,
    //         readTimeVisible,
    //         readTimeText,
    //         dateVisible,
    //         dateText,
    //         likeVisible,
    //         shareVisible,
    //     };
    // }

    async verifyPeopleLookingCardAttributes(index) {

        const card =
            this.peopleLookingCards.nth(index);

        await card.scrollIntoViewIfNeeded().catch(() => { });

        // ── IMAGE ────────────────────────────────────────────────

        // const isRealImageSrc = (value) => {

        //     if (!value) {
        //         return false;
        //     }

        //     const v = value.trim().toLowerCase();

        //     if (v.length === 0) {
        //         return false;
        //     }

        //     if (v.startsWith('data:image/gif') || v.includes('placeholder') || v.includes('blank.gif')) {
        //         return false;
        //     }

        //     return true;
        // };

        // const detectImageVisible = async () => {

        //     const imgEl =
        //         card.locator('img').first();

        //     const imgCount =
        //         await imgEl.count().catch(() => 0);

        //     if (imgCount > 0) {

        //         const src =
        //             await imgEl.getAttribute('src', { timeout: 2000 }).catch(() => null);

        //         const dataSrc =
        //             await imgEl.getAttribute('data-src', { timeout: 2000 }).catch(() => null);

        //         const srcset =
        //             await imgEl.getAttribute('srcset', { timeout: 2000 }).catch(() => null);

        //         const dataSrcset =
        //             await imgEl.getAttribute('data-srcset', { timeout: 2000 }).catch(() => null);

        //         if (
        //             isRealImageSrc(src) ||
        //             isRealImageSrc(dataSrc) ||
        //             isRealImageSrc(srcset) ||
        //             isRealImageSrc(dataSrcset)
        //         ) {
        //             return true;
        //         }

        //         const naturalWidth =
        //             await imgEl.evaluate(
        //                 (el) => el.naturalWidth || 0,
        //                 undefined,
        //                 { timeout: 2000 }
        //             ).catch(() => 0);

        //         if (naturalWidth > 0) {
        //             return true;
        //         }
        //     }

        //     const svgCount =
        //         await card.locator('svg').count().catch(() => 0);

        //     if (svgCount > 0) {
        //         return true;
        //     }

        //     const bgHandle =
        //         card.locator(
        //             '[class*="image" i], [class*="thumbnail" i], [class*="photo" i], [class*="banner" i]'
        //         ).first();

        //     const bgCount =
        //         await bgHandle.count().catch(() => 0);

        //     if (bgCount > 0) {

        //         const bgImage =
        //             await bgHandle.evaluate(
        //                 (el) => window.getComputedStyle(el).backgroundImage,
        //                 undefined,
        //                 { timeout: 2000 }
        //             ).catch(() => 'none');

        //         if (bgImage && bgImage !== 'none') {
        //             return true;
        //         }
        //     }

        //     return false;
        // };

        // // Try to bring the card into view, but never let it eat the test
        // // budget — bound every action with a short explicit timeout.
        // await card
        //     .scrollIntoViewIfNeeded({ timeout: 3000 })
        //     .catch(() => { });

        // let imageVisible = await detectImageVisible();

        // if (!imageVisible) {

        //     // One retry only, with a short bounded wait — not five.
        //     await this.page.waitForTimeout(500);

        //     await card
        //         .scrollIntoViewIfNeeded({ timeout: 3000 })
        //         .catch(() => { });

        //     imageVisible = await detectImageVisible();
        // }

        await card.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => { });

        const imageLocator =
            card.locator('img, picture, svg, [style*="background-image"]').first();

        const imageVisible =
            await imageLocator.isVisible().catch(() => false);

        if (!imageVisible) {

            const debugInfo = await card.evaluate((el) => {

                return {
                    outerHTML: el.outerHTML.slice(0, 2000),
                    boundingRect: el.getBoundingClientRect(),
                    computedDisplay: window.getComputedStyle(el).display,
                    computedVisibility: window.getComputedStyle(el).visibility,
                    computedOpacity: window.getComputedStyle(el).opacity,
                    imgCount: el.querySelectorAll('img').length,
                    parentClass: el.parentElement ? el.parentElement.className : null,
                    grandparentClass:
                        el.parentElement && el.parentElement.parentElement
                            ? el.parentElement.parentElement.className
                            : null,
                };
            }, { timeout: 3000 }).catch((e) => ({ evaluateError: e.message }));

            console.log(
                `\n🔍 DEBUG — Card ${index} image not visible:\n` +
                JSON.stringify(debugInfo, null, 2) +
                '\n'
            );
        }

        // ── TITLE ────────────────────────────────────────────────
        const titleLocator =
            card.locator(
                'h1, h2, h3, h4, .article-title, .card-title, .link-card-title, [class*="title" i]'
            ).first();

        let titleVisible =
            await titleLocator.isVisible().catch(() => false);

        let titleText =
            titleVisible
                ? (await titleLocator.textContent().catch(() => '') || '').trim()
                : '';

        if (titleText.length === 0) {
            titleText =
                (await card.innerText().catch(() => '') || '').trim();
        }

        if (titleText.length === 0) {
            titleText =
                (await card.getAttribute('aria-label').catch(() => '') ||
                    await card.getAttribute('title').catch(() => '') ||
                    '').trim();
        }

        if (titleText.length === 0) {
            titleText =
                (await card.locator('img').first().getAttribute('alt').catch(() => '') || '').trim();
        }

        titleVisible = titleText.length > 0;

        // ── AUTHOR ───────────────────────────────────────────────
        const authorResult =
            await this.findInCardOrAncestors(
                card,
                '.card-author-text a, .card-author-text, .author-name, ' +
                'a[href*="author" i], [class*="author" i], [data-author]'
            );

        let authorVisible = authorResult.visible;
        let authorText = authorResult.text;

        if (!authorVisible) {

            let scope = card;

            for (let level = 0; level <= 4 && !authorVisible; level++) {

                const scopeText =
                    (await scope.innerText().catch(() => '') || '');

                const byMatch =
                    scopeText.match(/By\s+([A-Za-z][A-Za-z .'-]{1,40})/);

                if (byMatch) {
                    authorText = byMatch[1].trim();
                    authorVisible = authorText.length > 0;
                    break;
                }

                scope = scope.locator('xpath=..');

                const scopeExists =
                    await scope.count().catch(() => 0);

                if (scopeExists === 0) {
                    break;
                }
            }
        }

        // ── READ TIME ────────────────────────────────────────────
        const readTimeResult =
            await this.findInCardOrAncestors(
                card,
                '.read-time, .article-read-time, [class*="read-time" i], .vibeMeta span:first-child'
            );

        let readTimeVisible = readTimeResult.visible;
        let readTimeText = readTimeResult.text;

        if (!readTimeVisible) {

            let scope = card;

            for (let level = 0; level <= 4 && !readTimeVisible; level++) {

                const scopeText =
                    (await scope.innerText().catch(() => '') || '');

                const readMatch =
                    scopeText.match(/(\d+\s*(?:min|mins|minute|minutes)(?:\s*read)?)/i);

                if (readMatch) {
                    readTimeText = readMatch[1].trim();
                    readTimeVisible = readTimeText.length > 0;
                    break;
                }

                scope = scope.locator('xpath=..');

                const scopeExists =
                    await scope.count().catch(() => 0);

                if (scopeExists === 0) {
                    break;
                }
            }
        }

        // ── DATE ─────────────────────────────────────────────────
        const dateResult =
            await this.findInCardOrAncestors(
                card,
                '.publish-date, .article-publish-date, [class*="date" i], .vibeMeta span:nth-child(3)'
            );

        let dateVisible = dateResult.visible;
        let dateText = dateResult.text;

        if (!dateVisible) {

            let scope = card;

            const datePattern =
                /(\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b)|(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b)|(\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b)/i;

            for (let level = 0; level <= 4 && !dateVisible; level++) {

                const scopeText =
                    (await scope.innerText().catch(() => '') || '');

                const dateMatch =
                    scopeText.match(datePattern);

                if (dateMatch) {
                    dateText = dateMatch[0].trim();
                    dateVisible = dateText.length > 0;
                    break;
                }

                scope = scope.locator('xpath=..');

                const scopeExists =
                    await scope.count().catch(() => 0);

                if (scopeExists === 0) {
                    break;
                }
            }
        }

        // ── LIKE / SHARE ─────────────────────────────────────────
        const likeBtn =
            card.locator(
                '.like-button, [aria-label="Like"], .article-like, .iconHeart, .iconLike, [aria-label*="like" i], [class*="like" i]'
            ).first();

        const likeVisible =
            await likeBtn.isVisible().catch(() => false);

        const shareBtn =
            card.locator(
                '.share-button, [aria-label="Share"], .article-share, .iconShare, [aria-label*="share" i], [class*="share" i]'
            ).first();

        const shareVisible =
            await shareBtn.isVisible().catch(() => false);

        return {
            imageVisible,
            titleVisible,
            titleText,
            authorVisible,
            authorText,
            readTimeVisible,
            readTimeText,
            dateVisible,
            dateText,
            likeVisible,
            shareVisible,
        };
    }

    // async clickPeopleLookingLike(index = 0) {

    //     const likeBtn =
    //         this.peopleLookingLikeButton.nth(index);

    //     await likeBtn.scrollIntoViewIfNeeded().catch(() => { });

    //     const initialClass =
    //         await likeBtn.getAttribute('class').catch(() => null);

    //     await likeBtn.click({ force: true, timeout: 10000 });

    //     await this.page.waitForTimeout(1000);

    //     const loginPrompted =
    //         (await this.loginModal.first().isVisible().catch(() => false)) ||
    //         this.page.url().includes('/login') ||
    //         this.page.url().includes('/account');

    //     if (loginPrompted) {
    //         return { result: 'login_prompted' };
    //     }

    //     const newClass =
    //         await likeBtn.getAttribute('class').catch(() => null);

    //     return {
    //         result: newClass !== initialClass ? 'toggled' : 'no_change',
    //     };
    // }

    async clickPeopleLookingLike(index = 0) {

        const card =
            this.peopleLookingCards.nth(index);

        const likeBtn =
            card.locator(
                '.like-button, [aria-label="Like"], .article-like, .iconHeart, .iconLike, [aria-label*="like" i], [class*="like" i]'
            ).first();

        await likeBtn.scrollIntoViewIfNeeded().catch(() => { });

        const initialClass =
            await likeBtn.getAttribute('class').catch(() => null);

        await likeBtn.click({ force: true, timeout: 10000 });

        await Promise.race([
            this.loginModal.first().waitFor({ state: 'visible', timeout: 3000 }),
            this.page.waitForURL(/login|account/, { timeout: 3000 }),
            this.page.waitForTimeout(3000),
        ]).catch(() => { });

        const loginPrompted =
            (await this.loginModal.first().isVisible().catch(() => false)) ||
            this.page.url().includes('/login') ||
            this.page.url().includes('/account');

        if (loginPrompted) {
            return { result: 'login_prompted' };
        }

        const newClass =
            await likeBtn.getAttribute('class').catch(() => null);

        return {
            result: newClass !== initialClass ? 'toggled' : 'no_change',
        };
    }

    // async clickPeopleLookingShare(index = 0) {

    //     const shareBtn =
    //         this.peopleLookingShareButton.nth(index);

    //     await shareBtn.scrollIntoViewIfNeeded().catch(() => { });

    //     await shareBtn.click({ force: true, timeout: 10000 });

    //     await this.page.waitForTimeout(1000);

    //     const popupVisible =
    //         await this.sharePopup.first().isVisible().catch(() => false);

    //     return { popupVisible };
    // }

    async clickPeopleLookingShare(index = 0) {

        const card =
            this.peopleLookingCards.nth(index);

        const shareBtn =
            card.locator(
                '.share-button, [aria-label="Share"], .article-share, .iconShare, [aria-label*="share" i], [class*="share" i]'
            ).first();

        await shareBtn.scrollIntoViewIfNeeded().catch(() => { });

        await shareBtn.click({ force: true, timeout: 10000 });

        let popupVisible =
            await this.sharePopup
                .first()
                .waitFor({ state: 'visible', timeout: 3000 })
                .then(() => true)
                .catch(() => false);

        return { popupVisible };
    }

    async getPeopleLookingViewSnapshot() {

        const activeCard =
            this.activeSlide.first();

        const activeVisible =
            await activeCard.isVisible().catch(() => false);

        if (activeVisible) {
            return (await activeCard.textContent().catch(() => '') || '').trim();
        }

        const firstTitle =
            this.peopleLookingTitles.first();

        return (await firstTitle.textContent().catch(() => '') || '').trim();
    }

    // ============================================================
    // TC062 — ALL ARTICLES METHODS
    // ============================================================

    /**
     * Scroll to the All Articles section.
     */
    async scrollToAllArticlesSection() {
        await this.allArticleContainer
            .first()
            .scrollIntoViewIfNeeded()
            .catch(async () => {
                await this.page.evaluate(() => {
                    window.scrollTo(
                        0,
                        document.body.scrollHeight / 2
                    );
                });
            });

        await this.page.waitForTimeout(500);
    }

    /**
     * Verify All Articles section container is visible.
     */
    async isAllArticlesSectionVisible() {
        return await this.allArticleContainer
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Get the number of article cards in All Articles section.
     */
    async getAllArticlesCount() {
        return await this.articleCards.count();
    }

    /**
     * Verify category label above article title.
     */
    async isAllArticlesCategoryVisible() {
        const categoryLocator = this.page.locator(
            '.allArticleListingContainer .category-label, ' +
            '.allArticleListingContainer [class*="category" i], ' +
            '.articleCard .category-label, ' +
            '.articleCard [class*="category" i]'
        );

        const count = await categoryLocator.count();

        for (let i = 0; i < count; i++) {
            const visible = await categoryLocator
                .nth(i)
                .isVisible()
                .catch(() => false);

            if (visible) {
                const text =
                    (
                        await categoryLocator
                            .nth(i)
                            .textContent()
                            .catch(() => '')
                    ).trim();

                if (text.length > 0) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Get article image count in All Articles section.
     */
    async getAllArticlesImageCount() {
        const locator = this.page.locator(
            '.allArticleListingContainer .articleCard img'
        );

        return await locator.count();
    }

    /**
     * Verify Like/Wishlist option in All Articles section.
     */
    async isAllArticlesLikeVisible() {
        const count = await this.articleLikeButton.count();

        for (let i = 0; i < count; i++) {
            const visible = await this.articleLikeButton
                .nth(i)
                .isVisible()
                .catch(() => false);

            if (visible) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verify Share option in All Articles section.
     */
    async isAllArticlesShareVisible() {
        const count = await this.articleShareButton.count();

        for (let i = 0; i < count; i++) {
            const visible = await this.articleShareButton
                .nth(i)
                .isVisible()
                .catch(() => false);

            if (visible) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verify author name in All Articles section.
     */
    async isAllArticlesAuthorVisible() {
        const count = await this.articleAuthor.count();

        for (let i = 0; i < count; i++) {
            const locator = this.articleAuthor.nth(i);

            const visible = await locator
                .isVisible()
                .catch(() => false);

            if (!visible) {
                continue;
            }

            const text =
                (
                    await locator
                        .textContent()
                        .catch(() => '')
                ).trim();

            if (text.length > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Verify Load More button.
     */
    async isLoadMoreVisible() {
        const primaryVisible = await this.loadMoreBtn
            .first()
            .isVisible()
            .catch(() => false);

        if (primaryVisible) {
            return true;
        }

        return await this.page
            .getByRole('button', { name: /Load More/i })
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Click Load More and verify article count increases.
     */
    async clickLoadMoreAndVerifyIncrease() {
        const beforeCount = await this.getAllArticlesCount();

        const loadMoreButton = this.loadMoreBtn.first();

        let buttonVisible = await loadMoreButton
            .isVisible()
            .catch(() => false);

        if (!buttonVisible) {
            const fallbackButton = this.page.getByRole(
                'button',
                { name: /Load More/i }
            ).first();

            buttonVisible = await fallbackButton
                .isVisible()
                .catch(() => false);

            if (!buttonVisible) {
                return {
                    clicked: false,
                    increased: false,
                    beforeCount,
                    afterCount: beforeCount,
                };
            }

            await fallbackButton.scrollIntoViewIfNeeded().catch(() => { });

            await fallbackButton.click({
                force: true,
                timeout: 10000,
            });
        } else {
            await loadMoreButton
                .scrollIntoViewIfNeeded()
                .catch(() => { });

            await loadMoreButton.click({
                force: true,
                timeout: 10000,
            });
        }

        const increased = await this.page
            .waitForFunction(
                (previousCount) => {
                    return document.querySelectorAll(
                        '.allArticleListingContainer .articleCard'
                    ).length > previousCount;
                },
                beforeCount,
                {
                    timeout: 10000,
                }
            )
            .then(() => true)
            .catch(() => false);

        const afterCount =
            await this.getAllArticlesCount();

        return {
            clicked: true,
            increased: increased && afterCount > beforeCount,
            beforeCount,
            afterCount,
        };
    }

    /**
     * Verify Sort dropdown.
     */
    async isSortDropdownVisible() {
        return await this.sortDropdown
            .first()
            .isVisible()
            .catch(() => false);
    }

    /**
     * Open the Sort dropdown and verify options are displayed.
     */
    async openSortDropdown() {
        const dropdown = this.sortDropdown.first();

        await dropdown
            .scrollIntoViewIfNeeded()
            .catch(() => { });

        await dropdown.click({
            force: true,
            timeout: 10000,
        });

        await this.page.waitForTimeout(500);

        const optionCount =
            await this.sortOptions.count();

        return optionCount > 0;
    }

    /**
     * Apply the first available Sort option.
     */
    async applyFirstSortOption() {
        const optionCount =
            await this.sortOptions.count();

        if (optionCount === 0) {
            return false;
        }

        await this.sortOptions
            .first()
            .scrollIntoViewIfNeeded()
            .catch(() => { });

        await this.sortOptions
            .first()
            .click({
                force: true,
                timeout: 10000,
            });

        await this.page.waitForTimeout(1500);

        return true;
    }

    // ============================================================
    // FILE: pages/BlogListingPage.js
    // Root cause: peopleLookingCards is scoped to the <a> anchor
    // itself ('.articleListingLookingForContent a'), but author
    // metadata is rendered as a SIBLING of that anchor inside a
    // wrapper container, not as a descendant of it — so no selector
    // inside card.locator(...) can ever find it. Walk up to the
    // anchor's ancestor container and search there instead.
    // ============================================================

    // ── Add this helper method to the class ──
    async findInCardOrAncestors(card, selector, maxLevels = 4) {

        let scope = card;

        for (let level = 0; level <= maxLevels; level++) {

            const el =
                scope.locator(selector).first();

            const visible =
                await el.isVisible().catch(() => false);

            if (visible) {

                const text =
                    (await el.textContent().catch(() => '') || '').trim();

                if (text.length > 0) {
                    return { el, visible: true, text };
                }
            }

            scope =
                scope.locator('xpath=..');

            const scopeExists =
                await scope.count().catch(() => 0);

            if (scopeExists === 0) {
                break;
            }
        }

        return { el: null, visible: false, text: '' };
    }

    /**
     * Returns the visible category label text for each article card in
     * the All Articles section (only for cards where a category label
     * is actually visible with non-empty text).
     * @returns {Promise<string[]>}
     */
    async getAllArticlesCategoryTexts() {

        const categoryLocator = this.page.locator(
            '.allArticleListingContainer .category-label, ' +
            '.allArticleListingContainer [class*="category" i], ' +
            '.articleCard .category-label, ' +
            '.articleCard [class*="category" i]'
        );

        const count = await categoryLocator.count();

        const texts = [];

        for (let i = 0; i < count; i++) {

            const visible =
                await categoryLocator
                    .nth(i)
                    .isVisible()
                    .catch(() => false);

            if (!visible) {
                continue;
            }

            const text =
                (
                    await categoryLocator
                        .nth(i)
                        .textContent()
                        .catch(() => '')
                ).trim();

            if (text.length > 0) {
                texts.push(text);
            }
        }

        return texts;
    }

    /**
     * Verifies that the visible category labels in the All Articles
     * section match the expected category name (case-insensitive),
     * for at least one sampled card.
     * @param {string} expectedCategory - e.g. "Skin" or "Hair"
     * @returns {Promise<{ matched: boolean, sampleTexts: string[] }>}
     */
    async verifyAllArticlesCategoryMatches(expectedCategory) {

        const texts =
            await this.getAllArticlesCategoryTexts();

        if (texts.length === 0) {
            throw new Error(
                'No visible category label text found in the "All Articles" section to verify.'
            );
        }

        const lowerExpected =
            expectedCategory.toLowerCase();

        const sampleSize =
            Math.min(texts.length, 5);

        const sampleTexts =
            texts.slice(0, sampleSize);

        const matched =
            sampleTexts.some(
                (text) => text.toLowerCase().includes(lowerExpected)
            );

        return { matched, sampleTexts };
    }

}

module.exports = BlogListingPage;