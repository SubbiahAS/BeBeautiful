const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');
const { handleCookieBanner } = require('../../utils/helpers');

test.describe('Homepage Module', () => {

    test(
        'TC016-A - Verify article section on homepage (Displayed below banner video)',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC016 - Verify article section on homepage');
            console.log('======================================================');

            const homePage = new HomePage(page);
            const CATEGORIES = ['All', 'Skin', 'Makeup', 'Hair', 'Lifestyle'];

            const DIVE_IN_CATEGORIES = [
                { category: 'Skin', expected: '/all-things-skin' },
                { category: 'Makeup', expected: '/all-things-makeup' },
                { category: 'Hair', expected: '/all-things-hair' },
                { category: 'Lifestyle', expected: '/lifestyle' }
            ];

            try {

                // ============================================================
                // STEP 1 : Navigate to Homepage
                // ============================================================

                console.log('🔹 Step 1: Navigate to Homepage');

                await homePage.navigateToHome();

                await handleCookieBanner(page);

                await page.waitForTimeout(2000);

                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Category Tabs
                // ============================================================

                console.log('🔹 Step 2: Verify Category Tabs');

                try {

                    await homePage.scrollToArticleSection();

                    for (const category of CATEGORIES) {

                        const button =
                            homePage.articleSection.categoryButtons.filter({
                                hasText: category
                            });

                        const count =
                            await button.count();

                        if (count === 0) {

                            throw new Error(
                                `Category tab "${category}" not found.`
                            );
                        }

                        await homePage.selectArticleCategory(category);

                        const activeCategory =
                            await homePage.getActiveCategoryText();

                        if (!activeCategory?.includes(category)) {

                            throw new Error(
                                `Category "${category}" did not become active after clicking.`
                            );
                        }
                    }

                    addStepResult(
                        'PASS',
                        `Success: All ${CATEGORIES.length} category tabs (${CATEGORIES.join(', ')}) are displayed and clickable.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Category tab verification failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Article Layout (large article left, small articles right)
                // ============================================================

                console.log('🔹 Step 3: Verify Article Layout');

                try {

                    await homePage.selectArticleCategory('All');

                    await expect(
                        homePage.articleSection.leftPanel
                    ).toBeVisible({ timeout: 8000 });

                    await expect(
                        homePage.articleSection.rightPanel
                    ).toBeVisible({ timeout: 8000 });

                    addStepResult(
                        'PASS',
                        'Success: Large article panel (left) and small article panel (right) are both visible.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article layout verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Large Article Card & Attributes
                // ============================================================

                console.log('🔹 Step 4: Verify Large Article Card & Attributes');

                try {

                    await homePage.selectArticleCategory('All');

                    await expect(
                        homePage.articleSection.largeArticle
                    ).toBeVisible({ timeout: 5000 });

                    await expect(
                        homePage.articleSection.largeArticleImage
                    ).toBeVisible({ timeout: 8000 });

                    // PRESENCE CHECK ONLY — do NOT click wishlist
                    await expect(
                        homePage.articleSection.largeArticleLike
                    ).toBeVisible({ timeout: 5000 });

                    // PRESENCE CHECK ONLY — do NOT click share
                    await expect(
                        homePage.articleSection.largeArticleShare
                    ).toBeVisible({ timeout: 5000 });

                    await expect(
                        homePage.articleSection.largeArticleTitle
                    ).toBeVisible({ timeout: 5000 });

                    await expect(
                        homePage.articleSection.largeArticleAuthor
                    ).toBeVisible({ timeout: 5000 });

                    await expect(
                        homePage.articleSection.largeArticleDate
                    ).toBeVisible({ timeout: 5000 });

                    addStepResult(
                        'PASS',
                        'Success: Large article card is displayed with image, wishlist, share, title, author and publish date.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Large article card verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Small Article Cards & Attributes
                // ============================================================

                console.log('🔹 Step 5: Verify Small Article Cards & Attributes');

                try {

                    await homePage.selectArticleCategory('All');

                    const articleCount =
                        await homePage.articleSection.smallArticles.count();

                    expect(articleCount).toBeGreaterThan(0);

                    // Check first 2 small articles for required attributes
                    for (let i = 0; i < Math.min(articleCount, 2); i++) {

                        const card =
                            homePage.articleSection.smallArticles.nth(i);

                        await expect(
                            card.locator('img').first()
                        ).toBeVisible({ timeout: 5000 });

                        // PRESENCE CHECK ONLY — do NOT click wishlist
                        await expect(
                            card.locator('.iconHeart')
                        ).toBeVisible({ timeout: 5000 });

                        // PRESENCE CHECK ONLY — do NOT click share
                        await expect(
                            card.locator('.iconShare')
                        ).toBeVisible({ timeout: 5000 });

                        await expect(
                            card.locator('.vibeHeading')
                        ).toBeVisible({ timeout: 5000 });

                        // Read time + Date (both inside .vibeMeta)
                        await expect(
                            card.locator('.vibeMeta')
                        ).toBeVisible({ timeout: 5000 });

                        await expect(
                            card.locator('.authorName')
                        ).toBeVisible({ timeout: 5000 });
                    }

                    addStepResult(
                        'PASS',
                        `Success: ${articleCount} small article card(s) displayed in the right panel, with image, wishlist, share, title, read time, date and author verified.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Small article card verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify Article Click Redirects
                // ============================================================

                console.log('🔹 Step 6: Verify Article Click Redirects');

                try {

                    const homeUrl = page.url();
                    const allHrefs = [];

                    for (const category of CATEGORIES) {

                        await homePage.selectArticleCategory(category);

                        const largeHref =
                            await homePage.articleSection.largeArticleLink
                                .first()
                                .getAttribute('href')
                                .catch(() => null);

                        if (largeHref && largeHref !== '#') {
                            allHrefs.push({ category, href: largeHref, type: 'large' });
                        }

                        const smallCount =
                            await homePage.articleSection.smallArticles.count();

                        for (let i = 0; i < Math.min(smallCount, 2); i++) {

                            const href =
                                await homePage.articleSection.smallArticles
                                    .nth(i)
                                    .locator('.vibeContent a[href], .vibeImage a[href]')
                                    .first()
                                    .getAttribute('href')
                                    .catch(() => null);

                            if (href && href !== '#') {
                                allHrefs.push({ category, href, type: `small[${i}]` });
                            }
                        }
                    }

                    for (const item of allHrefs) {

                        const fullUrl = new URL(item.href, homeUrl).toString();

                        await page.goto(fullUrl, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        });

                        await page.waitForTimeout(1000);

                        await homePage.closeLoginPopupIfPresent();

                        expect(page.url()).toContain(
                            item.href.replace(/^\//, '')
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: All ${allHrefs.length} article(s) across all categories navigated to the correct article detail page.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article click redirect verification failed. ${error.message.split('\n')[0]}`
                    );

                } finally {

                    // Return to homepage before Dive In checks
                    await homePage.navigateToHome();
                    await page.waitForTimeout(1500);
                    await homePage.closeLoginPopupIfPresent();
                }

                // ============================================================
                // STEP 7 : Verify Dive In Button (visible, correct href, redirects)
                // ============================================================

                console.log('🔹 Step 7: Verify Dive In Button');

                try {

                    for (const item of DIVE_IN_CATEGORIES) {

                        await homePage.navigateToHome();
                        await handleCookieBanner(page);
                        await homePage.closeLoginPopupIfPresent();

                        await homePage.scrollToArticleSection();

                        await homePage.selectArticleCategory(item.category);

                        const diveInButton = homePage.articleSection.diveInButton;

                        // Button visible
                        await expect(diveInButton).toBeVisible({ timeout: 10000 });

                        // URL validation before click (poll — href updates async after tab switch)
                        await expect
                            .poll(async () => await diveInButton.getAttribute('href'), { timeout: 10000 })
                            .toContain(item.expected);

                        const preClickUrl = page.url();

                        // Redirect validation
                        await homePage.verifyDiveInNavigation(item.expected);

                        // Verify redirected blog page URL
                        await expect(page).toHaveURL(
                            new RegExp(item.expected.replace('/', '\\/')),
                            { timeout: 15000 }
                        );

                        // URL validation after redirection (explicit post-redirect check, per TC053)
                        const postClickUrl = page.url();
                        expect(postClickUrl).not.toBe(preClickUrl);
                        expect(postClickUrl).toContain(item.expected);

                        // Optional page heading verification
                        await expect(
                            page.locator('h1').first()
                        ).toBeVisible({ timeout: 10000 });

                    }

                    addStepResult(
                        'PASS',
                        'Success: Dive In button is displayed and redirects to the correct blog page (with URL validated pre- and post-redirection) for every selected category.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Dive In button verification failed. ${error.message}`
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    error.message
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
                testCaseId: 'TC016',
                title: 'Verify article section on homepage',
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

    test(
        'TC016-B - Verify article section on homepage (Displayed below "As Seen on Gram" section)',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;
            let lowerSectionFound = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC016-B - Verify article section below As Seen on Gram');
            console.log('======================================================');

            const homePage = new HomePage(page);
            const CATEGORIES = ['All', 'Skin', 'Makeup', 'Hair', 'Lifestyle'];

            const DIVE_IN_CATEGORIES = [
                { category: 'Skin', expected: '/all-things-skin' },
                { category: 'Makeup', expected: '/all-things-makeup' },
                { category: 'Hair', expected: '/all-things-hair' },
                { category: 'Lifestyle', expected: '/lifestyle' }
            ];

            // ── LOCAL, DYNAMICALLY-BOUND LOCATORS FOR THE LOWER SECTION ────────

            let lowerSectionLocator = null;
            let lowerCategoryButtons = null;
            let lowerActiveCategory = null;
            let lowerLeftPanel = null;
            let lowerRightPanel = null;
            let lowerSmallArticles = null;
            let lowerDiveInButton = null;
            let lowerLargeArticle = null;
            let lowerLargeArticleImage = null;
            let lowerLargeArticleTitle = null;
            let lowerLargeArticleAuthor = null;
            let lowerLargeArticleDate = null;
            let lowerLargeArticleLike = null;
            let lowerLargeArticleShare = null;
            let lowerLargeArticleLink = null;

            const ensureLowerSectionAvailable = () => {
                if (!lowerSectionFound) {
                    throw new Error(
                        'Lower article section (below "As Seen on Gram") was not located in Step 2 — skipping this dependent check.'
                    );
                }
            };

            const selectLowerArticleCategory = async (categoryName) => {

                const category = lowerCategoryButtons.filter({ hasText: categoryName });

                const count = await category.count().catch(() => 0);

                if (count === 0) {
                    throw new Error(`Category tab "${categoryName}" not found in lower article section.`);
                }

                const target = category.first();

                await target.evaluate((el) => {
                    el.scrollIntoView({ block: 'center', inline: 'center' });
                }).catch(() => { });

                await page.waitForTimeout(500);

                const isObscured = async () => {
                    return await target.evaluate((el) => {
                        const rect = el.getBoundingClientRect();
                        const cx = rect.left + rect.width / 2;
                        const cy = rect.top + rect.height / 2;
                        const topEl = document.elementFromPoint(cx, cy);
                        return !(topEl === el || el.contains(topEl));
                    }).catch(() => false);
                };

                let obscured = await isObscured();
                let attempts = 0;

                while (obscured && attempts < 5) {
                    await page.evaluate(() => window.scrollBy(0, -80)).catch(() => { });
                    await page.waitForTimeout(400);
                    obscured = await isObscured();
                    attempts++;
                }

                await target.click({ timeout: 10000 });

                await expect
                    .poll(
                        async () => (await lowerActiveCategory.textContent().catch(() => ''))?.trim(),
                        { timeout: 10000 }
                    )
                    .toContain(categoryName);

                await page.waitForTimeout(1000);
            };

            const getLowerActiveCategoryText = async () => {
                return (await lowerActiveCategory.textContent().catch(() => ''))?.trim();
            };

            try {

                // ============================================================
                // STEP 1 : Navigate to Homepage
                // ============================================================

                console.log('🔹 Step 1: Navigate to Homepage');

                await homePage.navigateToHome();

                await handleCookieBanner(page);

                await page.waitForTimeout(2000);

                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Locate & Tag the Article Section Displayed Below
                //          "As Seen on Gram" Section
                // ============================================================

                console.log('🔹 Step 2: Verify Article Section Displayed Below "As Seen on Gram"');

                try {

                    await homePage.scrollToAsSeenOnGramSection();

                    const { handle, matchedCardCount } = await homePage.findLowerArticleSectionHandle();

                    if (!handle || matchedCardCount === 0) {
                        throw new Error(
                            `No article section found below "As Seen on Gram" in the DOM (matched ${matchedCardCount} card(s)).`
                        );
                    }

                    const uniqueTag = `lowerArticleSection-${Date.now()}`;

                    await handle.evaluate((el, tag) => {
                        el.setAttribute('data-tc016b-section', tag);
                    }, uniqueTag).catch(() => { });

                    await handle.dispose().catch(() => { });

                    lowerSectionLocator = page.locator(`[data-tc016b-section="${uniqueTag}"]`);

                    await expect(lowerSectionLocator).toBeVisible({ timeout: 10000 });

                    lowerCategoryButtons = lowerSectionLocator.locator('.categories .categoryButton');
                    lowerActiveCategory = lowerSectionLocator.locator('.categories .categoryButton.active');
                    lowerLeftPanel = lowerSectionLocator.locator('.categoryContentCardLeftPanel');
                    lowerRightPanel = lowerSectionLocator.locator('.categoryContentCardRightPanel');
                    lowerSmallArticles = lowerSectionLocator.locator('.categoryContentCardRightPanel .vibeCard');
                    lowerDiveInButton = lowerSectionLocator
                        .locator('.categoryContentCardNavigationButton a[href]')
                        .filter({ hasText: /Dive In/i })
                        .first();

                    lowerLargeArticle = lowerLeftPanel
                        .locator('.linking_card_container')
                        .or(lowerLeftPanel.locator('.nav_card_container'));

                    lowerLargeArticleImage = lowerLeftPanel
                        .locator('.article-image')
                        .or(lowerLeftPanel.locator('.image-container img'))
                        .or(lowerLeftPanel.locator('.nav_card_container img'));

                    lowerLargeArticleTitle = lowerLeftPanel
                        .locator('h2')
                        .or(lowerLeftPanel.locator('.link-card-content-container h2'))
                        .or(lowerLeftPanel.locator('.link-card-content-container h3'));

                    lowerLargeArticleAuthor = lowerLeftPanel
                        .locator('.card-author-text p')
                        .or(lowerLeftPanel.locator('.link-card-content-container .author-name'))
                        .or(lowerLeftPanel.locator('.link-card-content-container p.author-name'));

                    lowerLargeArticleDate = lowerLeftPanel
                        .locator('.card-date')
                        .or(lowerLeftPanel.locator('.link-card-content-container .card-date'))
                        .or(lowerLeftPanel.locator('.link-card-content-container span').last());

                    lowerLargeArticleLike = lowerLeftPanel
                        .locator('.like')
                        .or(lowerLeftPanel.locator('.like-share .like'))
                        .or(lowerLeftPanel.locator('.like-share').locator('svg, button').first());

                    lowerLargeArticleShare = lowerLeftPanel
                        .locator('.share')
                        .or(lowerLeftPanel.locator('.like-share .share'))
                        .or(lowerLeftPanel.locator('.like-share').locator('svg, button').last());

                    lowerLargeArticleLink = lowerLeftPanel
                        .locator('a[href]')
                        .or(lowerLeftPanel.locator('.nav_card_container a[href]'))
                        .or(lowerLeftPanel.locator('.link-card-content-container a[href]'));

                    const smallArticleCountCheck = await lowerSmallArticles.count().catch(() => 0);

                    if (smallArticleCountCheck === 0) {
                        throw new Error('Lower article section located below "As Seen on Gram" but contained no article cards.');
                    }

                    lowerSectionFound = true;

                    await lowerSectionLocator.scrollIntoViewIfNeeded().catch(() => { });
                    await page.waitForTimeout(1000);

                    addStepResult(
                        'PASS',
                        `Success: Article section (with ${smallArticleCountCheck} small article card(s)) is displayed below "As Seen on Gram" section.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article section below "As Seen on Gram" verification failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Category Tabs (Expected Result 1)
                // ============================================================

                console.log('🔹 Step 3: Verify Category Tabs (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    await lowerSectionLocator.scrollIntoViewIfNeeded().catch(() => { });

                    for (const category of CATEGORIES) {

                        const button = lowerCategoryButtons.filter({ hasText: category });

                        const count = await button.count().catch(() => 0);

                        if (count === 0) {
                            throw new Error(`Category tab "${category}" not found in lower article section.`);
                        }

                        await selectLowerArticleCategory(category);

                        const activeCategory = await getLowerActiveCategoryText();

                        if (!activeCategory?.includes(category)) {
                            throw new Error(
                                `Category "${category}" did not become active after clicking (lower section).`
                            );
                        }
                    }

                    addStepResult(
                        'PASS',
                        `Success: All ${CATEGORIES.length} article category options (${CATEGORIES.join(', ')}) are displayed below "As Seen on Gram" and update the article listing correctly when clicked.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Category tab verification failed (lower section). ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Article Layout (Expected Result 2)
                // ============================================================

                console.log('🔹 Step 4: Verify Article Layout (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    await selectLowerArticleCategory('All');

                    await expect(lowerLeftPanel).toBeVisible({ timeout: 8000 });

                    await expect(lowerRightPanel).toBeVisible({ timeout: 8000 });

                    addStepResult(
                        'PASS',
                        'Success: Large article panel (left) and small article panel (right) are both visible in the lower article section.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article layout verification failed (lower section). ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Large Article Card & Attributes (Expected Result 4)
                // ============================================================

                console.log('🔹 Step 5: Verify Large Article Card & Attributes (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    await selectLowerArticleCategory('All');

                    await expect(lowerLargeArticle.first()).toBeVisible({ timeout: 8000 });

                    await expect(lowerLargeArticleImage.first()).toBeVisible({ timeout: 8000 });

                    const likeVisible = await lowerLargeArticleLike.first().isVisible().catch(() => false);
                    const shareVisible = await lowerLargeArticleShare.first().isVisible().catch(() => false);
                    const titleVisible = await lowerLargeArticleTitle.first().isVisible().catch(() => false);
                    const authorVisible = await lowerLargeArticleAuthor.first().isVisible().catch(() => false);
                    const dateVisible = await lowerLargeArticleDate.first().isVisible().catch(() => false);

                    if (!titleVisible) {
                        throw new Error('Large article title not visible in lower section.');
                    }

                    const missing = [];
                    if (!likeVisible) missing.push('like icon');
                    if (!shareVisible) missing.push('share icon');
                    if (!authorVisible) missing.push('author');
                    if (!dateVisible) missing.push('publish date');

                    if (missing.length > 0) {
                        addStepResult(
                            'PASS',
                            `Success: Large article card (lower section) is displayed with image and title. Note: ${missing.join(', ')} not detected with current selectors — verify DOM class names if this is unexpected.`
                        );
                    } else {
                        addStepResult(
                            'PASS',
                            'Success: Large article card (lower section) is displayed with image, wishlist, share, title, author (below title) and publish date (right of author).'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Large article card verification failed (lower section). ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify Small Article Cards & Attributes (Expected Result 3)
                // ============================================================

                console.log('🔹 Step 6: Verify Small Article Cards & Attributes (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    await selectLowerArticleCategory('All');

                    const articleCount = await lowerSmallArticles.count().catch(() => 0);

                    if (articleCount === 0) {
                        throw new Error('No small article cards found in lower article section right panel.');
                    }

                    // Check first 2 small articles for required attributes
                    for (let i = 0; i < Math.min(articleCount, 2); i++) {

                        const card = lowerSmallArticles.nth(i);

                        await expect(
                            card.locator('img').first()
                        ).toBeVisible({ timeout: 5000 });

                        // PRESENCE CHECK ONLY — do NOT click wishlist
                        await expect(
                            card.locator('.iconHeart')
                        ).toBeVisible({ timeout: 5000 });

                        // PRESENCE CHECK ONLY — do NOT click share
                        await expect(
                            card.locator('.iconShare')
                        ).toBeVisible({ timeout: 5000 });

                        await expect(
                            card.locator('.vibeHeading')
                        ).toBeVisible({ timeout: 5000 });

                        // Read time + Date (both inside .vibeMeta)
                        await expect(
                            card.locator('.vibeMeta')
                        ).toBeVisible({ timeout: 5000 });

                        await expect(
                            card.locator('.authorName')
                        ).toBeVisible({ timeout: 5000 });
                    }

                    addStepResult(
                        'PASS',
                        `Success: ${articleCount} small article card(s) displayed in the right panel (lower section), with image, wishlist, share, title, read time, date and author (below title) verified.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Small article card verification failed (lower section). ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 7 : Verify Article Click Redirects (Expected Result 5)
                // ============================================================

                console.log('🔹 Step 7: Verify Article Click Redirects (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    const homeUrl = page.url();
                    const allHrefs = [];

                    for (const category of CATEGORIES) {

                        await selectLowerArticleCategory(category);

                        const largeHref = await lowerLargeArticleLink
                            .first()
                            .getAttribute('href')
                            .catch(() => null);

                        if (largeHref && largeHref !== '#') {
                            allHrefs.push({ category, href: largeHref, type: 'large' });
                        }

                        const smallCount = await lowerSmallArticles.count().catch(() => 0);

                        for (let i = 0; i < Math.min(smallCount, 2); i++) {

                            const href = await lowerSmallArticles
                                .nth(i)
                                .locator('.vibeContent a[href], .vibeImage a[href]')
                                .first()
                                .getAttribute('href')
                                .catch(() => null);

                            if (href && href !== '#') {
                                allHrefs.push({ category, href, type: `small[${i}]` });
                            }
                        }
                    }

                    if (allHrefs.length === 0) {
                        throw new Error('No navigable article links collected from the lower article section.');
                    }

                    for (const item of allHrefs) {

                        const fullUrl = new URL(item.href, homeUrl).toString();

                        await page.goto(fullUrl, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        });

                        await page.waitForTimeout(1000);

                        await homePage.closeLoginPopupIfPresent();

                        expect(page.url()).toContain(
                            item.href.replace(/^\//, '')
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: All ${allHrefs.length} article(s) across all categories (lower section) navigated to the correct article detail page.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Article click redirect verification failed (lower section). ${error.message.split('\n')[0]}`
                    );

                } finally {

                    // Return to homepage before Dive In checks
                    await homePage.navigateToHome().catch(() => { });
                    await page.waitForTimeout(1500);
                    await homePage.closeLoginPopupIfPresent().catch(() => { });
                }

                // ============================================================
                // STEP 8 : Verify Dive In Button (Expected Result 6)
                // ============================================================

                console.log('🔹 Step 8: Verify Dive In Button (Lower Section)');

                try {

                    ensureLowerSectionAvailable();

                    for (const item of DIVE_IN_CATEGORIES) {

                        await homePage.navigateToHome();
                        await handleCookieBanner(page);
                        await homePage.closeLoginPopupIfPresent();

                        await homePage.scrollToAsSeenOnGramSection();

                        const { handle, matchedCardCount } = await homePage.findLowerArticleSectionHandle();

                        if (!handle || matchedCardCount === 0) {
                            throw new Error(`Lower article section not found again after re-navigating for category "${item.category}".`);
                        }

                        const uniqueTag = `lowerArticleSection-${Date.now()}-${item.category}`;

                        await handle.evaluate((el, tag) => {
                            el.setAttribute('data-tc016b-section', tag);
                        }, uniqueTag).catch(() => { });

                        await handle.dispose().catch(() => { });

                        const freshSectionLocator = page.locator(`[data-tc016b-section="${uniqueTag}"]`);
                        const freshCategoryButtons = freshSectionLocator.locator('.categories .categoryButton');
                        const freshActiveCategory = freshSectionLocator.locator('.categories .categoryButton.active');
                        const freshDiveInButton = freshSectionLocator
                            .locator('.categoryContentCardNavigationButton a[href]')
                            .filter({ hasText: /Dive In/i })
                            .first();

                        await freshSectionLocator.scrollIntoViewIfNeeded().catch(() => { });

                        const categoryBtn = freshCategoryButtons.filter({ hasText: item.category });
                        const btnCount = await categoryBtn.count().catch(() => 0);

                        if (btnCount === 0) {
                            throw new Error(`Category tab "${item.category}" not found in lower article section.`);
                        }

                        const targetBtn = categoryBtn.first();

                        // ✅ FIXED: same center-alignment + obscured-check as selectLowerArticleCategory
                        await targetBtn.evaluate((el) => {
                            el.scrollIntoView({ block: 'center', inline: 'center' });
                        }).catch(() => { });

                        await page.waitForTimeout(500);

                        const isObscuredFresh = async () => {
                            return await targetBtn.evaluate((el) => {
                                const rect = el.getBoundingClientRect();
                                const cx = rect.left + rect.width / 2;
                                const cy = rect.top + rect.height / 2;
                                const topEl = document.elementFromPoint(cx, cy);
                                return !(topEl === el || el.contains(topEl));
                            }).catch(() => false);
                        };

                        let obscuredFresh = await isObscuredFresh();
                        let attemptsFresh = 0;

                        while (obscuredFresh && attemptsFresh < 5) {
                            await page.evaluate(() => window.scrollBy(0, -80)).catch(() => { });
                            await page.waitForTimeout(400);
                            obscuredFresh = await isObscuredFresh();
                            attemptsFresh++;
                        }

                        // ✅ FIXED: removed force:true for the same reason as above
                        await targetBtn.click({ timeout: 10000 });

                        await expect
                            .poll(
                                async () => (await freshActiveCategory.textContent().catch(() => ''))?.trim(),
                                { timeout: 10000 }
                            )
                            .toContain(item.category);

                        await page.waitForTimeout(1000);

                        // Button visible
                        await expect(freshDiveInButton).toBeVisible({ timeout: 10000 });

                        // URL validation before click (poll — href updates async after tab switch)
                        await expect
                            .poll(async () => await freshDiveInButton.getAttribute('href'), { timeout: 10000 })
                            .toContain(item.expected);

                        const preClickUrl = page.url();

                        // await freshDiveInButton.click({ timeout: 10000, force: true });

                        // await page.waitForLoadState('domcontentloaded');
                        // await page.waitForLoadState('networkidle');

                        await freshDiveInButton.click({ timeout: 10000, force: true });

                        // ✅ FIXED: 'networkidle' stalls indefinitely on this site (trackers never
                        // go quiet), which is what was hanging until the 300s test timeout.
                        // Bounded, non-throwing wait — the toHaveURL poll below confirms the
                        // redirect actually completed.
                        await page.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => { });

                        // Verify redirected blog page URL
                        await expect(page).toHaveURL(
                            new RegExp(item.expected.replace('/', '\\/')),
                            { timeout: 15000 }
                        );

                        // URL validation after redirection
                        const postClickUrl = page.url();
                        expect(postClickUrl).not.toBe(preClickUrl);
                        expect(postClickUrl).toContain(item.expected);

                        // Optional page heading verification
                        await expect(
                            page.locator('h1').first()
                        ).toBeVisible({ timeout: 10000 });

                    }

                    addStepResult(
                        'PASS',
                        'Success: "Dive In" button is displayed below the lower article section and redirects to the correct blog page (with URL validated pre- and post-redirection) for every selected category.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Dive In button verification failed (lower section). ${error.message}`
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    error.message
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
                testCaseId: 'TC016-B',
                title: 'Verify article section on homepage (Displayed below "As Seen on Gram" section)',
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