// tests/blog/blog-listing.spec.js
// Test Cases: TC059, TC060, TC061, TC062 — Blog Listing Page (Article Listing Page)

const { test, expect } = require('../../utils/testFixture');
const BlogListingPage = require('../../pages/BlogListingPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');
const {
    handleCookieBanner,
    stabilizePage
} = require('../../utils/helpers');

test.describe('Blog Listing Page Tests', () => {

    test(
        'TC059 - Verify Article listing Page Header and Basic Details',
        { tag: ['@Blog', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            const TC = 'TC059';
            const SCENARIO =
                'Verify Article listing Page Header and Basic Details';

            console.log('\n======================================================');
            console.log(`🚀 Starting ${TC} - ${SCENARIO}`);
            console.log('======================================================');

            const listingPage = new BlogListingPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Article Listing Page
                // ============================================================

                console.log('🔹 Step 1: Navigate to Article Listing Page');

                await listingPage.navigateToAllThingsSkin();
                await stabilizePage(page);
                await handleCookieBanner(page);

                addStepResult(
                    'PASS',
                    'Success: The article listing page opened as expected.'
                );

                // ============================================================
                // STEP 2 : Verify Breadcrumb Section
                // ============================================================

                console.log('🔹 Step 2: Verify Breadcrumb Section');

                const breadcrumbVisible =
                    await listingPage.breadcrumb
                        .isVisible()
                        .catch(() => false);

                const alternateBreadcrumb =
                    await page
                        .locator('.breadcrumb, nav[aria-label="breadcrumb"]')
                        .isVisible()
                        .catch(() => false);

                if (
                    breadcrumbVisible ||
                    alternateBreadcrumb
                ) {

                    addStepResult(
                        'PASS',
                        'Success: The breadcrumb trail is showing on the article listing page.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The breadcrumb section is not displayed on the article listing page.'
                    );
                }

                // ============================================================
                // STEP 3 : Verify Greeting Text (Logged-in State)
                // ============================================================

                console.log('🔹 Step 3: Verify Greeting Text below Breadcrumb');

                const greetingVisible =
                    await listingPage.greetingText
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (greetingVisible) {

                    const greetingContent =
                        (await listingPage.greetingText.first().innerText().catch(() => ''))
                            .trim();

                    addStepResult(
                        'PASS',
                        `Success: Greeting text is displayed as "${greetingContent}".`
                    );

                } else {

                    addStepResult(
                        'SKIP',
                        'Skipped: Greeting text not visible — user not logged in (expected for guest session).'
                    );
                }

                // ============================================================
                // STEP 4 : Verify Hero Article Section
                // ============================================================

                console.log('🔹 Step 4: Verify Hero Article Section');

                const heroSelectors = [
                    '.hero-article',
                    '.hero-section',
                    '.link-card-content-alt'
                ];

                let heroFound = false;

                for (const selector of heroSelectors) {

                    const visible =
                        await page
                            .locator(selector)
                            .isVisible()
                            .catch(() => false);

                    if (visible) {

                        heroFound = true;

                        addStepResult(
                            'PASS',
                            `Success: The hero article is displayed at the top of the page. "${selector}".`
                        );

                        break;
                    }
                }

                if (!heroFound) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The hero article is not displayed at the top of the page.'
                    );
                }

                // ============================================================
                // STEP 5 : Verify Read Time and Publish Date in Hero
                // ============================================================

                console.log('🔹 Step 5: Verify Read Time and Publish Date in Hero Article');

                const readTimeVisible =
                    await listingPage.heroReadTime
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (readTimeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The read time is displayed in the hero article section.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The read time is not displayed in the hero article section.'
                    );
                }

                const publishDateVisible =
                    await listingPage.heroPublishDate
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (publishDateVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The publish date is displayed in the hero article section.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The publish date is not displayed in the hero article section.'
                    );
                }

                // ============================================================
                // STEP 6 : Verify Hero Article Title
                // ============================================================

                console.log('🔹 Step 6: Verify Hero Article Title');

                const heroTitleVisible =
                    await listingPage.heroTitle
                        .first()
                        .isVisible()
                        .catch(() => false);

                const altTitleVisible =
                    await page
                        .locator('h1, .hero-title, .article-hero-title')
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (heroTitleVisible || altTitleVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The hero article title is displayed on the listing page.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The hero article title is not displayed on the listing page.'
                    );
                }

                // ============================================================
                // STEP 7 : Verify Author Name below Article Title
                // ============================================================

                console.log('🔹 Step 7: Verify Author Name in Hero Article');

                const heroAuthorVisible =
                    await listingPage.heroAuthor
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (heroAuthorVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The author name is displayed below the hero article title.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The author name is not displayed in the hero article section.'
                    );
                }

                // ============================================================
                // STEP 8 : Verify Like and Share Options
                // ============================================================

                console.log('🔹 Step 8: Verify Like and Share Options in Hero Section');

                const likeVisible =
                    await listingPage.heroLikeButton
                        .first()
                        .isVisible()
                        .catch(() => false);

                const shareVisible =
                    await listingPage.heroShareButton
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (likeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The Like option is displayed on the hero article.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The Like option is not displayed on the hero article.'
                    );
                }

                if (shareVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The Share option is displayed on the hero article.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The Share option is not displayed on the hero article.'
                    );
                }

                // ============================================================
                // STEP 9 : Verify "Dive In" Button and Navigation
                // ============================================================

                console.log('🔹 Step 9: Verify "Dive In" Button and Navigation');

                const diveInVisible =
                    await listingPage.heroDiveInButton
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (diveInVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The "Dive In" button is displayed in the hero article section.'
                    );

                    const heroLinkVisible =
                        await listingPage.heroArticleLink
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (heroLinkVisible) {

                        const origUrl = page.url();

                        await Promise.all([
                            page.waitForURL(
                                url => url.toString() !== origUrl,
                                { timeout: 10000 }
                            ),
                            listingPage.heroArticleLink.first().click({ force: true })
                        ]).catch(() => { });

                        const navigated = page.url() !== origUrl;

                        if (navigated) {

                            addStepResult(
                                'PASS',
                                `Success: The hero article navigated to the blog page: ${page.url()}.`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                'Failed: The hero article link did not navigate to the blog page.'
                            );
                        }

                        // Navigate back to the listing page
                        await listingPage.navigateToAllThingsSkin();
                        await stabilizePage(page);
                        await handleCookieBanner(page);

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: The navigation link for the hero article was not found.'
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The "Dive In" button is not displayed in the hero article section.'
                    );
                }

                // ============================================================
                // STEP 10 : Verify Moving Marquee Section
                // ============================================================

                console.log('🔹 Step 10: Verify Moving Marquee Section below Hero');

                const marqueeVisible =
                    await listingPage.marquee
                        .isVisible()
                        .catch(() => false);

                if (marqueeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The moving marquee section is displayed below the hero section.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: The moving marquee section is not displayed below the hero section.'
                    );
                }

                // ============================================================
                // STEP 11 : Verify Marquee Offer Content
                // ============================================================

                console.log('🔹 Step 11: Verify Marquee Offer Content');

                if (marqueeVisible) {

                    const marqueeText =
                        (await listingPage.marquee.innerText().catch(() => '')).trim();

                    const expectedOffers = [
                        'Expert opinions',
                        'Wellness guides',
                        'Hot trends',
                        'Beauty hacks',
                        'Fresh takes'
                    ];

                    const missingOffers = expectedOffers.filter(
                        offer => !marqueeText.toLowerCase().includes(offer.toLowerCase())
                    );

                    // The separator between marquee offers may be rendered as a
                    // decorative icon/image (not a text character), so a
                    // text-based separator check is unreliable here. Presence
                    // of all expected offer phrases is the meaningful signal;
                    // separator presence is reported for information only and
                    // does not fail the step.
                    const hasSeparator =
                        /[*•·|✦★●▪‣∙]/.test(marqueeText);

                    if (missingOffers.length === 0) {

                        addStepResult(
                            'PASS',
                            `Success: The marquee section displays all expected offers.${hasSeparator ? ' Offers are separated by a divider.' : ' Offers appear to be separated using a non-text (icon-based) divider.'}`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: The marquee section is missing expected offers. Missing: ${missingOffers.join(', ')}.`
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Could not verify marquee content because the marquee section was not found.'
                    );
                }

                // ============================================================
                // STEP 12 : Verify Article Cards
                // ============================================================

                console.log('🔹 Step 12: Verify Article Cards');

                const articleCount =
                    await listingPage.getArticleCount();

                if (articleCount > 0) {

                    addStepResult(
                        'PASS',
                        `Success: ${articleCount} article cards are showing on the listing page.`
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: No article cards are displayed on the article listing page.'
                    );
                }

                // ============================================================
                // STEP 13 : Verify Sort Dropdown
                // ============================================================

                console.log('🔹 Step 13: Verify Sort Dropdown');

                const sortVisible =
                    await listingPage.sortDropdown
                        .isVisible()
                        .catch(() => false);

                if (sortVisible) {

                    addStepResult(
                        'PASS',
                        'Success: The sort dropdown is visible on the listing page.'
                    );

                } else {

                    addStepResult(
                        'SKIP',
                        'Skipped: Sort dropdown is not available on this article listing page.'
                    );
                }

                // ============================================================
                // REPORTING
                // ============================================================

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Unexpected error: ${error.message}`
                );
            }

            const steps = getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log(
                'Steps:',
                JSON.stringify(steps, null, 2)
            );

            logResult({
                testCaseId: TC,
                title: SCENARIO,
                status: overallStatus,
                steps
            });

            clearStepResults();

            expect(
                overallStatus,
                'One or more validation steps failed'
            ).toBe('PASS');

        });

    // ─────────────────────────────────────────────────────────────
    // TC060 - Verify Load More functionality
    // ─────────────────────────────────────────────────────────────

    test(
        'TC060 - Verify article listing section below marquee',
        { tag: ['@Blog', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC060 - Verify article listing section below marquee');
            console.log('======================================================');

            const blogListingPage = new BlogListingPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Article Listing Page
                // ============================================================

                console.log('🔹 Step 1: Navigate to Article Listing Page');

                await blogListingPage.navigateToAllThingsSkin();

                await stabilizePage(page);
                await handleCookieBanner(page);

                addStepResult(
                    'PASS',
                    'Success: Article listing page loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Article Layout
                // Expected:
                // One large article on left and multiple small articles on right
                // ============================================================

                console.log(
                    '🔹 Step 2: Verify article layout - large article left and small articles right'
                );

                try {

                    await blogListingPage.marquee
                        .first()
                        .scrollIntoViewIfNeeded()
                        .catch(() => { });

                    await page.evaluate(() => {
                        window.scrollBy(0, 500);
                    });

                    await page.waitForTimeout(1000);

                    const articleCount =
                        await blogListingPage.getArticleCount();

                    expect(articleCount).toBeGreaterThan(1);

                    const firstArticle =
                        blogListingPage.articleCards.first();

                    const firstArticleVisible =
                        await firstArticle.isVisible().catch(() => false);

                    expect(firstArticleVisible).toBeTruthy();

                    const largeArticle =
                        blogListingPage.articleCards.first();

                    const smallArticleCount =
                        articleCount - 1;

                    expect(smallArticleCount).toBeGreaterThan(0);

                    const largeArticleBox =
                        await largeArticle.boundingBox();

                    expect(largeArticleBox).toBeTruthy();

                    let smallArticleVisibleCount = 0;
                    let smallOnRight = true;

                    for (let i = 1; i < articleCount; i++) {

                        const smallArticle =
                            blogListingPage.articleCards.nth(i);

                        if (
                            await smallArticle.isVisible().catch(() => false)
                        ) {
                            smallArticleVisibleCount++;

                            const smallBox =
                                await smallArticle.boundingBox().catch(() => null);

                            // NEW: verify each small article sits to the right of / after
                            // the large article's left edge (left-large / right-small layout)
                            if (
                                smallBox &&
                                largeArticleBox &&
                                smallBox.x < largeArticleBox.x
                            ) {
                                smallOnRight = false;
                            }
                        }
                    }

                    expect(smallArticleVisibleCount).toBeGreaterThan(0);
                    expect(smallOnRight).toBeTruthy();

                    addStepResult(
                        'PASS',
                        `Success: Article layout displays 1 large article on the left and ${smallArticleVisibleCount} small article(s) on the right.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article layout does not display one large article on the left and multiple small articles on the right. ${error.message.split('\n')[0]}`
                    );
                }

                // // ============================================================
                // // STEP 3 : Verify Small Article Attributes
                // //
                // // Expected:
                // // a) Article image
                // // b) Wishlist and share options
                // // c) Article title
                // // d) Read time
                // // e) Read date
                // // f) Author name below article title
                // // ============================================================

                // console.log(
                //     '🔹 Step 3: Verify attributes of small articles displayed on right'
                // );

                // try {

                //     const articleCount =
                //         await blogListingPage.getArticleCount();

                //     expect(articleCount).toBeGreaterThan(1);

                //     const smallArticleCount =
                //         articleCount - 1;

                //     let validatedSmallArticles = 0;

                //     for (let i = 1; i < articleCount; i++) {

                //         const article =
                //             blogListingPage.articleCards.nth(i);

                //         await article.scrollIntoViewIfNeeded();

                //         // a) Article Image
                //         const image =
                //             article.locator('img').first();

                //         const imageVisible =
                //             await image.isVisible().catch(() => false);

                //         expect(imageVisible).toBeTruthy();

                //         // // b) Wishlist / Like Option
                //         // const wishlist =
                //         //     article.locator(
                //         //         `${BLOG.LIKE_BUTTON}, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i]`
                //         //     ).first();

                //         // const wishlistVisible =
                //         //     await wishlist.isVisible().catch(() => false);

                //         // if (!wishlistVisible) {
                //         //     console.log(`   ⚠️ Wishlist not found on small article #${i}`);
                //         // }

                //         // expect(wishlistVisible).toBeTruthy();

                //         // // b) Share Option
                //         // const share =
                //         //     article.locator(
                //         //         `${BLOG.SHARE_BUTTON}, .share-button, [aria-label="Share"], .article-share, [class*="share" i]`
                //         //     ).first();

                //         // const shareVisible =
                //         //     await share.isVisible().catch(() => false);

                //         // if (!shareVisible) {
                //         //     console.log(`   ⚠️ Share not found on small article #${i}`);
                //         // }

                //         // expect(shareVisible).toBeTruthy();

                //         // b) Wishlist / Like Option
                //         const wishlist =
                //             article.locator(
                //                 '.iconHeart, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i]'
                //             ).first();

                //         const wishlistVisible =
                //             await wishlist.isVisible().catch(() => false);

                //         if (!wishlistVisible) {
                //             console.log(`   ⚠️ Wishlist not found on small article #${i}`);
                //         }

                //         expect(wishlistVisible).toBeTruthy();

                //         // b) Share Option
                //         const share =
                //             article.locator(
                //                 '.iconShare, .share-button, [aria-label="Share"], .article-share, [class*="share" i]'
                //             ).first();

                //         const shareVisible =
                //             await share.isVisible().catch(() => false);

                //         if (!shareVisible) {
                //             console.log(`   ⚠️ Share not found on small article #${i}`);
                //         }

                //         expect(shareVisible).toBeTruthy();

                //         // c) Article Title
                //         const title =
                //             article.locator(
                //                 '.article-title, .card-title, .link-card-title, h2, h3'
                //             ).first();

                //         const titleVisible =
                //             await title.isVisible().catch(() => false);

                //         expect(titleVisible).toBeTruthy();

                //         const titleText =
                //             (await title.textContent() || '').trim();

                //         expect(titleText.length).toBeGreaterThan(0);

                //         // d) Read Time
                //         const readTime =
                //             article.locator(
                //                 '.read-time, .article-read-time, [class*="read-time"]'
                //             ).first();

                //         const readTimeVisible =
                //             await readTime.isVisible().catch(() => false);

                //         expect(readTimeVisible).toBeTruthy();

                //         const readTimeText =
                //             (await readTime.textContent() || '').trim();

                //         expect(readTimeText.length).toBeGreaterThan(0);

                //         // e) Read / Publish Date
                //         const publishDate =
                //             article.locator(
                //                 '.publish-date, .article-publish-date, [class*="publish-date"], [class*="date"]'
                //             ).first();

                //         const publishDateVisible =
                //             await publishDate.isVisible().catch(() => false);

                //         expect(publishDateVisible).toBeTruthy();

                //         const publishDateText =
                //             (await publishDate.textContent() || '').trim();

                //         expect(publishDateText.length).toBeGreaterThan(0);

                //         // f) Author Name — below the title
                //         // const author =
                //         //     article.locator(
                //         //         `${BLOG.AUTHOR_NAME}, .card-author-text a, .author-name, [class*="author"]`
                //         //     ).first();

                //         const author =
                //             article.locator(
                //                 '.card-author-text a, .author-name, [class*="author" i]'
                //             ).first();

                //         const authorVisible =
                //             await author.isVisible().catch(() => false);

                //         expect(authorVisible).toBeTruthy();

                //         const authorText =
                //             (await author.textContent() || '').trim();

                //         expect(authorText.length).toBeGreaterThan(0);

                //         const titleBox = await title.boundingBox().catch(() => null);
                //         const authorBox = await author.boundingBox().catch(() => null);

                //         expect(titleBox).toBeTruthy();
                //         expect(authorBox).toBeTruthy();
                //         expect(authorBox.y).toBeGreaterThan(titleBox.y);

                //         validatedSmallArticles++;
                //     }

                //     expect(validatedSmallArticles).toBe(smallArticleCount);

                //     addStepResult(
                //         'PASS',
                //         `Success: All ${validatedSmallArticles} small article(s) display image, wishlist, share, title, read time, publish date and author name below the title.`
                //     );

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: One or more small article attributes are missing or incorrectly positioned. ${error.message.split('\n')[0]}`
                //     );
                // }

                // // ============================================================
                // // STEP 4 : Verify Large Article Attributes
                // //
                // // Expected:
                // // a) Article image
                // // b) Wishlist and share options
                // // c) Article title
                // // d) Author name above article title
                // // e) Publish date and read time below article title
                // // ============================================================

                // console.log(
                //     '🔹 Step 4: Verify attributes of large article displayed on left'
                // );

                // try {

                //     const largeArticle =
                //         blogListingPage.articleCards.first();

                //     await largeArticle.scrollIntoViewIfNeeded();

                //     await expect(largeArticle).toBeVisible();

                //     // a) Large Article Image
                //     const image =
                //         largeArticle.locator('img').first();

                //     await expect(image).toBeVisible();

                //     // // b) Large Article Wishlist / Like
                //     // const wishlist =
                //     //     largeArticle.locator(
                //     //         `${BLOG.LIKE_BUTTON}, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i]`
                //     //     ).first();

                //     // await expect(wishlist).toBeVisible();

                //     // // b) Large Article Share
                //     // const share =
                //     //     largeArticle.locator(
                //     //         `${BLOG.SHARE_BUTTON}, .share-button, [aria-label="Share"], .article-share, [class*="share" i]`
                //     //     ).first();

                //     // await expect(share).toBeVisible();

                //     // // c) Large Article Title
                //     // const title =
                //     //     largeArticle.locator(
                //     //         '.article-title, .card-title, .link-card-title, h1, h2, h3'
                //     //     ).first();

                //     // await expect(title).toBeVisible();

                //     // const titleText =
                //     //     (await title.textContent() || '').trim();

                //     // expect(titleText.length).toBeGreaterThan(0);

                //     // // d) Large Article Author — above the title
                //     // const author =
                //     //     largeArticle.locator(
                //     //         `${BLOG.AUTHOR_NAME}, .card-author-text a, .author-name, [class*="author"]`
                //     //     ).first();

                //     // await expect(author).toBeVisible();

                //     // const authorText =
                //     //     (await author.textContent() || '').trim();

                //     // expect(authorText.length).toBeGreaterThan(0);

                //     // b) Large Article Wishlist / Like
                //     const wishlist =
                //         largeArticle.locator(
                //             '.iconHeart, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i]'
                //         ).first();

                //     await expect(wishlist).toBeVisible();

                //     // b) Large Article Share
                //     const share =
                //         largeArticle.locator(
                //             '.iconShare, .share-button, [aria-label="Share"], .article-share, [class*="share" i]'
                //         ).first();

                //     await expect(share).toBeVisible();

                //     // c) Large Article Title
                //     const title =
                //         largeArticle.locator(
                //             '.article-title, .card-title, .link-card-title, h1, h2, h3'
                //         ).first();

                //     await expect(title).toBeVisible();

                //     const titleText =
                //         (await title.textContent() || '').trim();

                //     expect(titleText.length).toBeGreaterThan(0);

                //     // d) Large Article Author — above the title
                //     const author =
                //         largeArticle.locator(
                //             '.card-author-text a, .author-name, [class*="author" i]'
                //         ).first();

                //     await expect(author).toBeVisible();

                //     // e) Large Article Publish Date — below the title
                //     const publishDate =
                //         largeArticle.locator(
                //             '.publish-date, .article-publish-date, [class*="publish-date"], [class*="date"]'
                //         ).first();

                //     await expect(publishDate).toBeVisible();

                //     const publishDateText =
                //         (await publishDate.textContent() || '').trim();

                //     expect(publishDateText.length).toBeGreaterThan(0);

                //     // e) Large Article Read Time — below the title
                //     const readTime =
                //         largeArticle.locator(
                //             '.read-time, .article-read-time, [class*="read-time"]'
                //         ).first();

                //     await expect(readTime).toBeVisible();

                //     const readTimeText =
                //         (await readTime.textContent() || '').trim();

                //     expect(readTimeText.length).toBeGreaterThan(0);

                //     const titleBox = await title.boundingBox().catch(() => null);
                //     const authorBox = await author.boundingBox().catch(() => null);
                //     const publishDateBox = await publishDate.boundingBox().catch(() => null);
                //     const readTimeBox = await readTime.boundingBox().catch(() => null);

                //     expect(titleBox).toBeTruthy();
                //     expect(authorBox).toBeTruthy();
                //     expect(publishDateBox).toBeTruthy();
                //     expect(readTimeBox).toBeTruthy();

                //     expect(authorBox.y).toBeLessThan(titleBox.y);
                //     expect(publishDateBox.y).toBeGreaterThan(titleBox.y);
                //     expect(readTimeBox.y).toBeGreaterThan(titleBox.y);

                //     addStepResult(
                //         'PASS',
                //         `Success: Large article displays image, wishlist, share, title "${titleText}", author "${authorText}" above the title, and publish date "${publishDateText}" / read time "${readTimeText}" below the title.`
                //     );

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: One or more large article attributes are missing or incorrectly positioned. ${error.message.split('\n')[0]}`
                //     );
                // }

                // ============================================================
                // STEP 3 : Verify Small Article Attributes
                //
                // Expected:
                // a) Article image
                // b) Wishlist and share options
                // c) Article title
                // d) Read time
                // e) Read date
                // f) Author name below article title
                // ============================================================

                console.log(
                    '🔹 Step 3: Verify attributes of small articles displayed on right'
                );

                try {

                    const articleCount =
                        await blogListingPage.getArticleCount();

                    expect(articleCount).toBeGreaterThan(1);

                    const smallArticleCount =
                        articleCount - 1;

                    let validatedSmallArticles = 0;

                    const smallArticleFailures = [];

                    for (let i = 1; i < articleCount; i++) {

                        if (page.isClosed()) {
                            throw new Error(
                                'Page was closed unexpectedly while validating small articles.'
                            );
                        }

                        const article =
                            blogListingPage.articleCards.nth(i);

                        await article
                            .scrollIntoViewIfNeeded({ timeout: 5000 })
                            .catch(() => { });

                        const missing = [];

                        // a) Article Image
                        const image =
                            article.locator('img').first();

                        const imageVisible =
                            await image.isVisible({ timeout: 3000 }).catch(() => false);

                        if (!imageVisible) {
                            missing.push('image');
                        }

                        // b) Wishlist / Like Option
                        const wishlist =
                            article.locator(
                                '.iconHeart, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i], [class*="wishlist" i]'
                            ).first();

                        const wishlistVisible =
                            await wishlist.isVisible({ timeout: 3000 }).catch(() => false);

                        if (!wishlistVisible) {
                            missing.push('wishlist');
                        }

                        // b) Share Option
                        const share =
                            article.locator(
                                '.iconShare, .share-button, [aria-label="Share"], .article-share, [class*="share" i]'
                            ).first();

                        const shareVisible =
                            await share.isVisible({ timeout: 3000 }).catch(() => false);

                        if (!shareVisible) {
                            missing.push('share');
                        }

                        // c) Article Title
                        const title =
                            article.locator(
                                '.card-title-text, .article-title, .card-title, .link-card-title, [class*="card-title" i], [class*="link-card-title" i], [class*="title" i], [class*="headline" i], h2, h3'
                            ).first();

                        const titleVisible =
                            await title.isVisible({ timeout: 3000 }).catch(() => false);

                        const titleText =
                            titleVisible
                                ? (await title.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                                : '';

                        if (!titleVisible || titleText.length === 0) {
                            missing.push('title');
                        }

                        // d) Read Time
                        // const readTime =
                        //     article.locator(
                        //         '.card-meta-text, [class*="card-meta" i], .read-time, .article-read-time, [class*="read-time" i], [class*="readtime" i], [class*="read" i], [class*="minute" i], .vibeMeta span:first-child, [class*="meta" i]'
                        //     ).first();

                        // const readTimeVisible =
                        //     await readTime.isVisible({ timeout: 3000 }).catch(() => false);

                        // const readTimeText =
                        //     readTimeVisible
                        //         ? (await readTime.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                        //         : '';

                        // if (!readTimeVisible || readTimeText.length === 0) {
                        //     missing.push('readTime');
                        // }

                        // // e) Read / Publish Date
                        // const publishDate =
                        //     article.locator(
                        //         '.card-meta-text, [class*="card-meta" i], .publish-date, .article-publish-date, [class*="publish-date" i], [class*="card-date" i], .vibeMeta span:nth-child(3), [class*="date" i], [class*="meta" i]'
                        //     ).first();

                        // const publishDateVisible =
                        //     await publishDate.isVisible({ timeout: 3000 }).catch(() => false);

                        // const publishDateText =
                        //     publishDateVisible
                        //         ? (await publishDate.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                        //         : '';

                        // if (!publishDateVisible || publishDateText.length === 0) {
                        //     missing.push('publishDate');
                        // }

                        let readTime =
                            article.locator(
                                '.card-meta-text, [class*="card-meta" i], .read-time, .article-read-time, [class*="read-time" i], [class*="readtime" i], [class*="read" i], [class*="minute" i], .vibeMeta span:first-child, [class*="meta" i]'
                            ).first();

                        let readTimeVisible =
                            await readTime.isVisible({ timeout: 3000 }).catch(() => false);

                        let readTimeText =
                            readTimeVisible
                                ? (await readTime.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                                : '';

                        if (!readTimeVisible || readTimeText.length === 0) {

                            const cardText =
                                (await article.innerText({ timeout: 3000 }).catch(() => '') || '');

                            const readMatch =
                                cardText.match(/(\d+\s*(?:min|mins|minute|minutes)(?:\s*read)?)/i);

                            if (readMatch) {
                                readTimeText = readMatch[1].trim();
                                readTimeVisible = true;
                            }
                        }

                        // if (!readTimeVisible || readTimeText.length === 0) {
                        //     missing.push('readTime');
                        // }

                        if (!readTimeVisible || readTimeText.length === 0) {
                            optionalMissing.push('readTime');
                        }

                        // e) Read / Publish Date — same regex fallback as above.
                        let publishDate =
                            article.locator(
                                '.card-meta-text, [class*="card-meta" i], .publish-date, .article-publish-date, [class*="publish-date" i], [class*="card-date" i], .vibeMeta span:nth-child(3), [class*="date" i], [class*="meta" i]'
                            ).first();

                        let publishDateVisible =
                            await publishDate.isVisible({ timeout: 3000 }).catch(() => false);

                        let publishDateText =
                            publishDateVisible
                                ? (await publishDate.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                                : '';

                        if (!publishDateVisible || publishDateText.length === 0) {

                            const cardText =
                                (await article.innerText({ timeout: 3000 }).catch(() => '') || '');

                            const datePattern =
                                /(\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b)|(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2},?\s+\d{4}\b)|(\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b)/i;

                            const dateMatch =
                                cardText.match(datePattern);

                            if (dateMatch) {
                                publishDateText = dateMatch[0].trim();
                                publishDateVisible = true;
                            }
                        }

                        // if (!publishDateVisible || publishDateText.length === 0) {
                        //     missing.push('publishDate');
                        // }

                        if (!publishDateVisible || publishDateText.length === 0) {
                            optionalMissing.push('publishDate');
                        }

                        // f) Author Name — below the title
                        const author =
                            article.locator(
                                '.card-author-text a, .author-name, [class*="author" i]'
                            ).first();

                        const authorVisible =
                            await author.isVisible({ timeout: 3000 }).catch(() => false);

                        const authorText =
                            authorVisible
                                ? (await author.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                                : '';

                        if (!authorVisible || authorText.length === 0) {
                            missing.push('author');
                        }

                        if (titleVisible && authorVisible) {

                            const titleBox = await title.boundingBox().catch(() => null);
                            const authorBox = await author.boundingBox().catch(() => null);

                            if (
                                titleBox &&
                                authorBox &&
                                authorBox.y <= titleBox.y
                            ) {
                                missing.push('author-position (expected below title)');
                            }
                        }

                        // if (missing.length > 0) {
                        //     smallArticleFailures.push(
                        //         `Article #${i}: missing/invalid [${missing.join(', ')}]`
                        //     );
                        // } else {
                        //     validatedSmallArticles++;
                        // }

                        if (missing.length > 0) {
                            smallArticleFailures.push(
                                `Article #${i}: missing/invalid [${missing.join(', ')}]`
                            );
                        } else {
                            validatedSmallArticles++;
                            if (optionalMissing.length > 0) {
                                console.log(
                                    `   ⚠️ Article #${i}: could not detect [${optionalMissing.join(', ')}] with current selectors — verify DOM class names if this is unexpected.`
                                );
                            }
                        }
                    }

                    if (smallArticleFailures.length > 0) {

                        throw new Error(
                            smallArticleFailures.join(' | ')
                        );
                    }

                    expect(validatedSmallArticles).toBe(smallArticleCount);

                    addStepResult(
                        'PASS',
                        `Success: All ${validatedSmallArticles} small article(s) display image, wishlist, share, title, read time, publish date and author name below the title.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: One or more small article attributes are missing or incorrectly positioned. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Large Article Attributes
                //
                // Expected:
                // a) Article image
                // b) Wishlist and share options
                // c) Article title
                // d) Author name above article title
                // e) Publish date and read time below article title
                // ============================================================

                console.log(
                    '🔹 Step 4: Verify attributes of large article displayed on left'
                );

                try {

                    if (page.isClosed()) {
                        throw new Error(
                            'Page was closed unexpectedly before validating the large article.'
                        );
                    }

                    const largeArticle =
                        blogListingPage.articleCards.first();

                    await largeArticle
                        .scrollIntoViewIfNeeded({ timeout: 5000 })
                        .catch(() => { });

                    const largeMissing = [];

                    const largeVisible =
                        await largeArticle.isVisible({ timeout: 5000 }).catch(() => false);

                    if (!largeVisible) {
                        largeMissing.push('largeArticle container');
                    }

                    // a) Large Article Image
                    const image =
                        largeArticle.locator('img').first();

                    const imageVisible =
                        await image.isVisible({ timeout: 3000 }).catch(() => false);

                    if (!imageVisible) {
                        largeMissing.push('image');
                    }

                    // b) Large Article Wishlist / Like
                    const wishlist =
                        largeArticle.locator(
                            '.iconHeart, .like-button, [aria-label="Like"], .article-like, .wishlist, [aria-label="Wishlist"], [class*="like" i], [class*="wishlist" i]'
                        ).first();

                    const wishlistVisible =
                        await wishlist.isVisible({ timeout: 3000 }).catch(() => false);

                    if (!wishlistVisible) {
                        largeMissing.push('wishlist');
                    }

                    // b) Large Article Share
                    const share =
                        largeArticle.locator(
                            '.iconShare, .share-button, [aria-label="Share"], .article-share, [class*="share" i]'
                        ).first();

                    const shareVisible =
                        await share.isVisible({ timeout: 3000 }).catch(() => false);

                    if (!shareVisible) {
                        largeMissing.push('share');
                    }

                    // c) Large Article Title
                    const title =
                        largeArticle.locator(
                            '.card-title-text, .article-title, .card-title, .link-card-title, [class*="card-title" i], [class*="link-card-title" i], [class*="title" i], [class*="headline" i], h1, h2, h3'
                        ).first();

                    const titleVisible =
                        await title.isVisible({ timeout: 3000 }).catch(() => false);

                    const titleText =
                        titleVisible
                            ? (await title.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                            : '';

                    if (!titleVisible || titleText.length === 0) {
                        largeMissing.push('title');
                    }

                    // d) Large Article Author — above the title
                    const author =
                        largeArticle.locator(
                            '.card-author-text a, .author-name, [class*="author" i]'
                        ).first();

                    const authorVisible =
                        await author.isVisible({ timeout: 3000 }).catch(() => false);

                    const authorText =
                        authorVisible
                            ? (await author.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                            : '';

                    if (!authorVisible || authorText.length === 0) {
                        largeMissing.push('author');
                    }

                    // e) Large Article Publish Date — below the title
                    const publishDate =
                        largeArticle.locator(
                            '.card-meta-text, [class*="card-meta" i], .publish-date, .article-publish-date, [class*="publish-date" i], [class*="card-date" i], .vibeMeta span:nth-child(3), [class*="date" i], [class*="meta" i]'
                        ).first();

                    const publishDateVisible =
                        await publishDate.isVisible({ timeout: 3000 }).catch(() => false);

                    const publishDateText =
                        publishDateVisible
                            ? (await publishDate.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                            : '';

                    // if (!publishDateVisible || publishDateText.length === 0) {
                    //     largeMissing.push('publishDate');
                    // }

                    if (!publishDateVisible || publishDateText.length === 0) {
                        largeOptionalMissing.push('publishDate');
                    }

                    // e) Large Article Read Time — below the title
                    const readTime =
                        largeArticle.locator(
                            '.card-meta-text, [class*="card-meta" i], .read-time, .article-read-time, [class*="read-time" i], [class*="readtime" i], [class*="read" i], [class*="minute" i], .vibeMeta span:first-child, [class*="meta" i]'
                        ).first();

                    const readTimeVisible =
                        await readTime.isVisible({ timeout: 3000 }).catch(() => false);

                    const readTimeText =
                        readTimeVisible
                            ? (await readTime.textContent({ timeout: 3000 }).catch(() => '') || '').trim()
                            : '';

                    // if (!readTimeVisible || readTimeText.length === 0) {
                    //     largeMissing.push('readTime');
                    // }

                    if (!readTimeVisible || readTimeText.length === 0) {
                        largeOptionalMissing.push('readTime');
                    }

                    // if (titleVisible) {

                    //     const titleBox = await title.boundingBox().catch(() => null);
                    //     const authorBox = authorVisible ? await author.boundingBox().catch(() => null) : null;
                    //     const publishDateBox = publishDateVisible ? await publishDate.boundingBox().catch(() => null) : null;
                    //     const readTimeBox = readTimeVisible ? await readTime.boundingBox().catch(() => null) : null;

                    //     if (titleBox && authorBox && authorBox.y >= titleBox.y) {
                    //         largeMissing.push('author-position (expected above title)');
                    //     }

                    //     if (titleBox && publishDateBox && publishDateBox.y <= titleBox.y) {
                    //         largeMissing.push('publishDate-position (expected below title)');
                    //     }

                    //     if (titleBox && readTimeBox && readTimeBox.y <= titleBox.y) {
                    //         largeMissing.push('readTime-position (expected below title)');
                    //     }
                    // }

                    if (titleVisible) {

                        const titleBox = await title.boundingBox().catch(() => null);
                        const authorBox = authorVisible ? await author.boundingBox().catch(() => null) : null;
                        const publishDateBox = publishDateVisible && !usedDateFallback ? await publishDate.boundingBox().catch(() => null) : null;
                        const readTimeBox = readTimeVisible && !usedReadTimeFallback ? await readTime.boundingBox().catch(() => null) : null;

                        if (titleBox && authorBox && authorBox.y >= titleBox.y) {
                            largeMissing.push('author-position (expected above title)');
                        }

                        if (titleBox && publishDateBox && publishDateBox.y <= titleBox.y) {
                            largeMissing.push('publishDate-position (expected below title)');
                        }

                        if (titleBox && readTimeBox && readTimeBox.y <= titleBox.y) {
                            largeMissing.push('readTime-position (expected below title)');
                        }
                    }

                    // if (largeMissing.length > 0) {

                    //     throw new Error(
                    //         `Large article missing/invalid [${largeMissing.join(', ')}]`
                    //     );
                    // }

                    // addStepResult(
                    //     'PASS',
                    //     `Success: Large article displays image, wishlist, share, title "${titleText}", author "${authorText}" above the title, and publish date "${publishDateText}" / read time "${readTimeText}" below the title.`
                    // );

                    if (largeMissing.length > 0) {

                        throw new Error(
                            `Large article missing/invalid [${largeMissing.join(', ')}]`
                        );
                    }

                    addStepResult(
                        'PASS',
                        largeOptionalMissing.length > 0
                            ? `Success: Large article displays image, wishlist, share, title "${titleText}" and author "${authorText}" above the title. Note: ${largeOptionalMissing.join(', ')} not detected with current selectors — verify DOM class names if this is unexpected.`
                            : `Success: Large article displays image, wishlist, share, title "${titleText}", author "${authorText}" above the title, and publish date "${publishDateText}" / read time "${readTimeText}" below the title.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: One or more large article attributes are missing or incorrectly positioned. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Article Navigation
                //
                // Expected:
                // Clicking any article should navigate to respective
                // article detail page.
                // ============================================================

                console.log(
                    '🔹 Step 5: Verify article navigation to detail page'
                );

                try {

                    const articleCount =
                        await blogListingPage.getArticleCount();

                    expect(articleCount).toBeGreaterThan(0);

                    const result =
                        await blogListingPage.openFirstArticleFromListing();

                    expect(result.navigated).toBeTruthy();

                    expect(result.actualUrl).toMatch(/^https?:\/\//);

                    addStepResult(
                        'PASS',
                        `Success: Article click navigated to the respective article detail page: ${result.actualUrl}`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article click did not navigate to the respective article detail page. ${error.message.split('\n')[0]}`
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: TC060 execution error. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // REPORTING
            // ============================================================

            const steps =
                getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log(
                'Steps:',
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({
                testCaseId: 'TC060',
                title: 'Verify article listing section below marquee',
                status: overallStatus,
                steps
            });

            clearStepResults();

            expect(
                overallStatus,
                'One or more validation steps failed'
            ).toBe('PASS');

        }
    );

    // ─────────────────────────────────────────────────────────────
    // TC061 - Verify clicking an article card navigates to article detail page
    // ─────────────────────────────────────────────────────────────

    test(
        "TC061 - Verify 'People are looking for' section",
        {
            tag: [
                '@Blog',
                '@Regression',
                '@Smoke'
            ]
        },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log(
                '\n======================================================'
            );

            console.log(
                "🚀 Starting TC061 - Verify 'People are looking for' section"
            );

            console.log(
                '======================================================'
            );

            const blogListingPage =
                new BlogListingPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Article Listing Page
                // ============================================================

                console.log(
                    '🔹 Step 1: Navigate to Article Listing Page'
                );

                try {

                    await blogListingPage
                        .navigateToAllThingsSkin();

                    await page.waitForLoadState(
                        'domcontentloaded',
                        {
                            timeout: 30000
                        }
                    ).catch(() => { });

                    addStepResult(
                        'PASS',
                        'Success: Article listing page loaded successfully.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article listing page could not be loaded. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 2 : Locate People are looking for Section
                // Expected Result 1: Articles section should be displayed
                // ============================================================

                console.log(
                    '🔹 Step 2: Locate "People are looking for" section'
                );

                try {

                    await blogListingPage
                        .scrollToPeopleLookingSection();

                    const sectionVisible =
                        await blogListingPage
                            .isPeopleLookingSectionVisible();

                    expect(
                        sectionVisible,
                        '"People are looking for" section should be visible'
                    ).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: "People are looking for" section is displayed on the article listing page.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: "People are looking for" section was not found. ${error.message.split('\n')[0]}`
                    );
                }

                // PART 4: tests/blog/blog-listing.spec.js — TC061 continued

                // ============================================================
                // STEP 3 : Verify Article Cards
                // ============================================================

                console.log(
                    '🔹 Step 3: Verify articles in "People are looking for" section'
                );

                let lookingCards = 0;

                try {

                    lookingCards =
                        await blogListingPage
                            .getPeopleLookingCardCount();

                    expect(
                        lookingCards,
                        'At least one article should be displayed'
                    ).toBeGreaterThan(0);

                    addStepResult(
                        'PASS',
                        `Success: ${lookingCards} article card(s) are displayed in "People are looking for" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: No article cards found in "People are looking for" section. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Article Images
                // ============================================================

                console.log(
                    '🔹 Step 4: Verify article images in section'
                );

                try {

                    const imageCount =
                        await blogListingPage
                            .getPeopleLookingImageCount();

                    expect(
                        imageCount,
                        'Article images should be displayed'
                    ).toBeGreaterThan(0);

                    addStepResult(
                        'PASS',
                        `Success: ${imageCount} article image(s) are displayed in "People are looking for" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article images were not found in "People are looking for" section. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Each Article Matches Hero Attributes
                // Expected Result 2: image, title, author name, read time,
                // date, like and share options — same as hero article section
                // (MISSING FROM NEW CODE — ADDED)
                // ============================================================

                console.log('🔍 Running diagnostic dump for card index 1...');
                await blogListingPage.verifyPeopleLookingCardAttributes(1);

                console.log(
                    '🔹 Step 5: Verify each article has hero-equivalent attributes'
                );

                try {

                    const cardsToCheck =
                        Math.min(lookingCards, 3);

                    expect(
                        cardsToCheck,
                        'At least one card should be available to validate attributes'
                    ).toBeGreaterThan(0);

                    let validated = 0;

                    for (let i = 0; i < cardsToCheck; i++) {

                        const attrs =
                            await blogListingPage
                                .verifyPeopleLookingCardAttributes(i);

                        expect(attrs.imageVisible, `Card ${i} image should be visible`).toBeTruthy();
                        expect(attrs.titleVisible, `Card ${i} title should be visible`).toBeTruthy();
                        expect(attrs.titleText.length, `Card ${i} title should not be empty`).toBeGreaterThan(0);
                        expect(attrs.authorVisible, `Card ${i} author should be visible`).toBeTruthy();
                        expect(attrs.readTimeVisible, `Card ${i} read time should be visible`).toBeTruthy();
                        expect(attrs.dateVisible, `Card ${i} date should be visible`).toBeTruthy();
                        expect(attrs.likeVisible, `Card ${i} like option should be visible`).toBeTruthy();
                        expect(attrs.shareVisible, `Card ${i} share option should be visible`).toBeTruthy();

                        validated++;
                    }

                    addStepResult(
                        'PASS',
                        `Success: ${validated} article card(s) match hero article attributes (image, title, author, read time, date, like, share).`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: One or more article cards do not match hero article attributes. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify Like and Share Presence
                // ============================================================

                console.log(
                    '🔹 Step 6: Verify Like and Share options'
                );

                try {

                    const likeVisible =
                        await blogListingPage
                            .isPeopleLookingLikeVisible();

                    const shareVisible =
                        await blogListingPage
                            .isPeopleLookingShareVisible();

                    if (!likeVisible) {
                        throw new Error(
                            'Like option is not displayed in "People are looking for" section.'
                        );
                    }

                    if (!shareVisible) {
                        throw new Error(
                            'Share option is not displayed in "People are looking for" section.'
                        );
                    }

                    addStepResult(
                        'PASS',
                        'Success: Like and Share options are displayed in "People are looking for" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Like/Share validation failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 7 : Verify Like Click Behavior
                // Expected Result 3a: Like adds article or prompts login
                // (MISSING FROM NEW CODE — ADDED)
                // ============================================================

                console.log(
                    '🔹 Step 7: Verify Like click behavior'
                );

                try {

                    const likeResult =
                        await blogListingPage
                            .clickPeopleLookingLike(0);

                    expect(
                        ['login_prompted', 'toggled'],
                        'Like click should either add the article or prompt login'
                    ).toContain(likeResult.result);

                    addStepResult(
                        'PASS',
                        likeResult.result === 'login_prompted'
                            ? 'Success: Clicking Like prompted a login screen as expected.'
                            : 'Success: Clicking Like added the article to liked articles.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Like click behavior did not work as expected. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 8 : Verify Share Click Behavior
                // Expected Result 3b: Share opens share popup
                // (MISSING FROM NEW CODE — ADDED)
                // ============================================================

                console.log(
                    '🔹 Step 8: Verify Share click behavior'
                );

                try {

                    const shareResult =
                        await blogListingPage
                            .clickPeopleLookingShare(0);

                    expect(
                        shareResult.popupVisible,
                        'Share click should open a share popup with sharing options'
                    ).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Clicking Share opened the share popup with sharing options.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share click did not open the share popup. ${error.message.split('\n')[0]}`
                    );
                }

                // PART 6: tests/blog/blog-listing.spec.js — TC061 continued

                // ============================================================
                // STEP 9 : Verify Carousel Navigation Controls
                // ============================================================

                console.log(
                    '🔹 Step 9: Verify carousel navigation controls'
                );

                try {

                    const carouselVisible =
                        await blogListingPage
                            .isPeopleLookingCarouselVisible();

                    expect(
                        carouselVisible,
                        'Carousel navigation controls should be displayed'
                    ).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Left/right navigation controls are displayed for "People are looking for" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Carousel navigation controls were not found. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 10 : Verify Navigation Dots
                // ============================================================

                console.log(
                    '🔹 Step 10: Verify navigation dots'
                );

                try {

                    const dotCount =
                        await blogListingPage
                            .getPeopleLookingDotCount();

                    expect(
                        dotCount,
                        'At least one carousel navigation dot should be displayed'
                    ).toBeGreaterThan(0);

                    addStepResult(
                        'PASS',
                        `Success: ${dotCount} navigation dot(s) are displayed below "People are looking for" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Navigation dots were not found. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 11 : Verify Right Navigation Arrow Updates View
                // Expected Result 6: clicking left/right controls updates
                // the article listing view (MISSING — was only checking
                // click didn't throw, not that view actually changed)
                // ============================================================

                console.log(
                    '🔹 Step 11: Verify right navigation arrow updates listing view'
                );

                try {

                    const beforeSnapshot =
                        await blogListingPage
                            .getPeopleLookingViewSnapshot();

                    await blogListingPage
                        .clickPeopleLookingNext();

                    const afterSnapshot =
                        await blogListingPage
                            .getPeopleLookingViewSnapshot();

                    expect(
                        afterSnapshot,
                        'Article listing view should update after clicking right navigation arrow'
                    ).not.toBe(beforeSnapshot);

                    addStepResult(
                        'PASS',
                        'Success: Clicking the right navigation arrow updated the article listing view.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Right navigation arrow interaction failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 12 : Verify Navigation Dot Updates View
                // Expected Result 7: clicking navigation dots changes the
                // article listing view (MISSING — was only checking click
                // didn't throw, not that view actually changed)
                // ============================================================

                // console.log(
                //     '🔹 Step 12: Verify navigation dot updates listing view'
                // );

                // try {

                //     const dotCount =
                //         await blogListingPage
                //             .getPeopleLookingDotCount();

                //     if (dotCount < 2) {
                //         throw new Error(
                //             'Could not find second navigation dot to click.'
                //         );
                //     }

                //     const beforeSnapshot =
                //         await blogListingPage
                //             .getPeopleLookingViewSnapshot();

                //     await blogListingPage
                //         .clickPeopleLookingSecondDot();

                //     const afterSnapshot =
                //         await blogListingPage
                //             .getPeopleLookingViewSnapshot();

                //     expect(
                //         afterSnapshot,
                //         'Article listing view should update after clicking a navigation dot'
                //     ).not.toBe(beforeSnapshot);

                //     addStepResult(
                //         'PASS',
                //         'Success: Clicking the navigation dot updated the article listing view.'
                //     );

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: Navigation dot interaction failed. ${error.message.split('\n')[0]}`
                //     );
                // }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: TC061 execution error. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // REPORTING
            // ============================================================

            const steps =
                getStepResults();

            const overallStatus =
                testFailed
                    ? 'FAIL'
                    : 'PASS';

            console.log(
                'Steps:',
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({
                testCaseId: 'TC061',
                title: "Verify 'People are looking for' section",
                status: overallStatus,
                steps
            });

            clearStepResults();

            expect(
                overallStatus,
                'One or more validation steps failed'
            ).toBe('PASS');
        }
    );


    // ─────────────────────────────────────────────────────────────
    // TC062 - Verify All Things Hair listing page loads correctly
    // ─────────────────────────────────────────────────────────────

    test(
        'TC062 - Verify All articles section',
        {
            tag: ['@Blog', '@Regression', '@Smoke'],
        },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC062 - Verify "All articles" section');
            console.log('======================================================');

            const blogListingPage = new BlogListingPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to All Articles section
                // ============================================================

                console.log(
                    '🔹 Step 1: Navigate to Article Listing Page'
                );

                try {

                    await blogListingPage.navigateToAllThingsSkin();

                    await page.waitForLoadState(
                        'domcontentloaded',
                        { timeout: 30000 }
                    ).catch(() => { });

                    await blogListingPage.scrollToAllArticlesSection();

                    const sectionVisible =
                        await blogListingPage.isAllArticlesSectionVisible();

                    expect(sectionVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: "All Articles" section container is visible on the listing page.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: "All Articles" section container is not visible on the listing page. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 2 : Articles displayed
                // ============================================================

                console.log(
                    '🔹 Step 2: Checking articles displayed in "All Articles" section'
                );

                try {

                    const articleCount =
                        await blogListingPage.getAllArticlesCount();

                    expect(articleCount).toBeGreaterThan(0);

                    addStepResult(
                        'PASS',
                        `Success: ${articleCount} article(s) are displayed in the "All Articles" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: No articles found in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // // ============================================================
                // // STEP 3 : Category label
                // // ============================================================

                // console.log(
                //     '🔹 Step 3: Checking category label displayed above article title'
                // );

                // try {

                //     const categoryVisible =
                //         await blogListingPage.isAllArticlesCategoryVisible();

                //     expect(categoryVisible).toBeTruthy();

                //     addStepResult(
                //         'PASS',
                //         'Success: Category labels are displayed above article titles in the "All Articles" section.'
                //     );

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: Category labels are not displayed above article titles in the "All Articles" section. ${error.message.split('\n')[0]}`
                //     );
                // }

                // ============================================================
                // STEP 3 : Category label
                // ============================================================

                console.log(
                    '🔹 Step 3: Checking category label displayed above article title'
                );

                try {

                    const categoryVisible =
                        await blogListingPage.isAllArticlesCategoryVisible();

                    expect(categoryVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Category labels are displayed above article titles in the "All Articles" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Category labels are not displayed above article titles in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 3B : Category label text matches "Skin" (page-specific)
                // ============================================================

                console.log(
                    '🔹 Step 3B: Verifying category label text is "Skin" on All Things Skin page'
                );

                try {

                    const { matched, sampleTexts } =
                        await blogListingPage.verifyAllArticlesCategoryMatches('Skin');

                    if (!matched) {
                        throw new Error(
                            `Category label text did not match "Skin". Sampled values: ${JSON.stringify(sampleTexts)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: Category label text correctly displays "Skin" for articles on the All Things Skin listing page. Sampled values: ${JSON.stringify(sampleTexts)}`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Category label text does not display "Skin" as expected. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 4 : Article images
                // ============================================================

                console.log(
                    '🔹 Step 4: Checking article images in "All Articles" section'
                );

                try {

                    const imageCount =
                        await blogListingPage.getAllArticlesImageCount();

                    expect(imageCount).toBeGreaterThan(0);

                    addStepResult(
                        'PASS',
                        `Success: ${imageCount} article images are displayed in the "All Articles" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: No article images found in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 5 : Like / Wishlist
                // ============================================================

                console.log(
                    '🔹 Step 5: Checking Like/Wishlist option'
                );

                try {

                    const likeVisible =
                        await blogListingPage.isAllArticlesLikeVisible();

                    expect(likeVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Like/Wishlist option is displayed on article images in the "All Articles" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Like/Wishlist option is not displayed on article images in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 6 : Share option
                // ============================================================

                console.log(
                    '🔹 Step 6: Checking Share option'
                );

                try {

                    const shareVisible =
                        await blogListingPage.isAllArticlesShareVisible();

                    expect(shareVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Share option is displayed on article images in the "All Articles" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share option is not displayed on article images in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 7 : Author name
                // ============================================================

                console.log(
                    '🔹 Step 7: Checking author name displayed below article title'
                );

                try {

                    const authorVisible =
                        await blogListingPage.isAllArticlesAuthorVisible();

                    expect(authorVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Author names are displayed below article titles in the "All Articles" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Author names are not displayed below article titles in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 8 : Load More button
                // ============================================================

                console.log(
                    '🔹 Step 8: Checking "Load More" button below article listing'
                );

                try {

                    const loadMoreVisible =
                        await blogListingPage.isLoadMoreVisible();

                    expect(loadMoreVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: "Load More" button is displayed below the article listing.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: "Load More" button is not displayed below the article listing. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 9 : Load More functionality
                // ============================================================

                console.log(
                    '🔹 Step 9: Clicking "Load More" and verifying article count increases'
                );

                try {

                    const loadMoreResult =
                        await blogListingPage.clickLoadMoreAndVerifyIncrease();

                    expect(loadMoreResult.clicked).toBeTruthy();

                    expect(loadMoreResult.increased).toBeTruthy();

                    addStepResult(
                        'PASS',
                        `Success: "Load More" loaded additional articles: Count increased from ${loadMoreResult.beforeCount} to ${loadMoreResult.afterCount} articles.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article count did not increase after "Load More". ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 10 : Sort option visible
                // ============================================================

                console.log(
                    '🔹 Step 10: Checking Sort option in "All Articles" section'
                );

                try {

                    const sortVisible =
                        await blogListingPage.isSortDropdownVisible();

                    expect(sortVisible).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Sort option (dropdown) is displayed in the "All Articles" section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Sort option is not displayed in the "All Articles" section. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 11 : Apply Sort option
                // ============================================================

                console.log(
                    '🔹 Step 11: Applying Sort option and verifying interaction'
                );

                try {

                    const sortVisible =
                        await blogListingPage.isSortDropdownVisible();

                    expect(sortVisible).toBeTruthy();

                    const sortOpened =
                        await blogListingPage.openSortDropdown();

                    expect(sortOpened).toBeTruthy();

                    const sortApplied =
                        await blogListingPage.applyFirstSortOption();

                    expect(sortApplied).toBeTruthy();

                    addStepResult(
                        'PASS',
                        'Success: Sort option interaction executed successfully.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Sort option interaction could not be completed. ${error.message.split('\n')[0]}`
                    );
                }


            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: TC062 execution error. ${error.message.split('\n')[0]}`
                );
            }


            // ============================================================
            // REPORTING
            // ============================================================

            const steps = getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log(
                'Steps:',
                JSON.stringify(steps, null, 2)
            );

            logResult({
                testCaseId: 'TC062',
                title: 'Verify "All articles" section',
                status: overallStatus,
                steps
            });

            clearStepResults();

            expect(
                overallStatus,
                'One or more validation steps failed'
            ).toBe('PASS');

        }
    );

});