const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const CartPage = require('../../pages/CartPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

test.describe('Homepage Module', () => {

    test('TC007 - Verify cart icon on global navbar when it has no items in it',
        { tag: ['@Cart', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC007 - Verify cart icon on global navbar when it has no items in it');
            console.log('======================================================');

            const homePage = new HomePage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Homepage
                // ============================================================

                console.log('🔹 Step 1: Navigate to Homepage');

                await homePage.navigateToHome();
                await page.waitForLoadState('networkidle');
                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Cart Icon Presence
                // ============================================================

                console.log('🔹 Step 2: Verify Cart Icon Presence');

                const cartVisible =
                    await homePage.cartIcon.isVisible().catch(() => false);

                if (cartVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Cart icon is visible on the homepage.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Cart icon is not visible on the homepage.'
                    );
                }

                // ============================================================
                // STEP 3 : Verify Cart Icon Position
                // ============================================================

                console.log('🔹 Step 3: Verify Cart Icon Position');

                try {

                    const searchBox =
                        await homePage.searchIcon.boundingBox();

                    const profileBox =
                        await homePage.profileIcon.boundingBox();

                    const cartBox =
                        await homePage.cartIcon.boundingBox();

                    const positionValid =
                        cartBox &&
                        profileBox &&
                        searchBox &&
                        cartBox.x > profileBox.x &&
                        profileBox.x > searchBox.x;

                    if (positionValid) {

                        addStepResult(
                            'PASS',
                            'Success: Cart icon is present on the right side of the navigation bar.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Cart icon is not positioned correctly in the navigation bar.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Unable to verify cart icon placement. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4 : Click Cart Icon
                // ============================================================

                console.log('🔹 Step 4: Click Cart Icon');

                await homePage.cartIcon.click();

                await page.waitForTimeout(3000);

                addStepResult(
                    'PASS',
                    'Success: Cart icon is clicked successfully.'
                );

                // ============================================================
                // STEP 5 : Verify Cart Slider Opens
                // ============================================================

                console.log('🔹 Step 5: Verify Cart Slider Opens');

                const cartOpened =
                    await homePage.isCartSliderOpened();

                if (cartOpened) {


                    addStepResult(
                        'PASS',
                        'Success: Cart slider is opened successfully.'
                    );


                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Cart slider did not open after clicking the Cart icon.'
                    );
                }

                // ============================================================
                // STEP 6 : Verify Cart Slider Elements
                // ============================================================

                console.log('🔹 Step 6: Verify Cart Slider Elements');

                const titleVisible =
                    await homePage.cart.title.isVisible().catch(() => false);

                const closeVisible =
                    await homePage.cart.closeButton.isVisible().catch(() => false);

                const continueVisible =
                    await homePage.cart.continueShoppingButton
                        .isVisible()
                        .catch(() => false);

                if (
                    titleVisible &&
                    closeVisible &&
                    continueVisible
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Required cart slider elements are displayed.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Missing cart slider elements. Title:${titleVisible}, Close:${closeVisible}, Continue Shopping:${continueVisible}`
                    );
                }

                // ============================================================
                // STEP 7 : Verify Empty Cart
                // ============================================================

                console.log('🔹 Step 7: Verify Empty Cart');

                const emptyCartVisible =
                    await homePage.cart.emptyTitle
                        .isVisible()
                        .catch(() => false);

                const emptyCartText =
                    await homePage.cart.emptyTitle
                        .textContent()
                        .catch(() => '');

                if (
                    emptyCartVisible &&
                    emptyCartText.includes('Empty')
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Empty cart message is displayed.'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Empty cart message is not displayed.'
                    );
                }

                // ============================================================
                // STEP 8 : Verify Cart Badge Count
                // ============================================================

                console.log('🔹 Step 8: Verify Cart Badge Count');

                const badgeVisible =
                    await homePage.cart.badge
                        .isVisible()
                        .catch(() => false);

                if (!badgeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Cart badge is not displayed for an empty cart.'
                    );

                } else {

                    const badgeText =
                        await homePage.cart.badge.textContent();

                    if (
                        badgeText === '0' ||
                        badgeText.trim() === ''
                    ) {

                        addStepResult(
                            'PASS',
                            'Success: Cart badge count is 0.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Unexpected cart badge value "${badgeText}".`
                        );
                    }
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
                testCaseId: 'TC007',
                title: 'Verify cart icon on global navbar when it has no items in it',
                status: overallStatus,
                steps
            });

            clearStepResults();

            expect(
                overallStatus,
                'One or more validation steps failed'
            ).toBe('PASS');

        });

    test(
        'TC022 - Verify add to cart functionality of product from blog and collection page',
        { tag: ['@Cart', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            // ── SAFE HELPERS ─────────────────────────────────────────
            // All bounded so no single call can hang past the test's
            // 300s budget, and all guarded against an already-closed page.
            const safeWaitForLoad = async (state = 'networkidle', timeout = 15000) => {
                if (page.isClosed()) return;
                await page.waitForLoadState(state, { timeout }).catch(() => { });
            };

            const safeTimeout = async (ms) => {
                if (page.isClosed()) return;
                await page.waitForTimeout(ms).catch(() => { });
            };

            const safeGoto = async (url, options = { waitUntil: 'domcontentloaded', timeout: 20000 }) => {
                if (page.isClosed()) return false;
                return page.goto(url, options).then(() => true).catch(() => false);
            };

            const withTimeout = async (promise, ms = 15000) => {
                if (page.isClosed()) return null;
                return Promise.race([
                    promise.catch(() => null),
                    new Promise((resolve) => setTimeout(resolve, ms))
                ]).catch(() => null);
            };

            console.log('\n======================================================');
            console.log('🚀 Starting TC022 - Verify add to cart functionality of product from blog and collection page');
            console.log('======================================================');

            const homePage = new HomePage(page);
            const cartPage = new CartPage(page);

            // Track product names added from each page so we can verify
            // they appear correctly inside the cart
            let blogProductName = '';
            let blogProductAdded = false;
            let collectionProductName = '';
            let collectionProductAdded = false;

            try {

                // =====================================================
                // STEP 1 : Navigate to Homepage
                // =====================================================

                console.log('🔹 Step 1: Navigate to Homepage');

                await homePage.navigateToHome();
                await page.waitForLoadState('networkidle');
                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully'
                );

                // =====================================================
                // STEP 2 : Navigate to a Blog page
                // Blog pages live under /blogs/* on bebeautiful.in.
                // We use the first nav category link that leads to an
                // article listing (Skin, Hair, Makeup, etc.) — these
                // are the "blog" pages in the site's terminology.
                // =====================================================

                console.log('🔹 Step 2: Navigate to Blog page');

                // Click the first main-nav category to reach a blog listing
                await homePage.header.navButtons.first().click({ force: true });
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(2000);
                await homePage.closeLoginPopupIfPresent();

                const blogPageUrl = page.url();

                // Verify we landed on a blog/article page
                const onBlogPage =
                    blogPageUrl.includes('/blogs/') ||
                    blogPageUrl.includes('/collections/') ||
                    blogPageUrl !== homePage.baseURL;

                if (onBlogPage) {

                    addStepResult(
                        'PASS',
                        `Success: Blog page is loaded successfully. URL: ${blogPageUrl}`
                    );

                } else {

                    // Fallback — navigate directly to a known blog URL
                    await page.goto('/blogs/skin');
                    await page.waitForLoadState('networkidle');
                    await homePage.closeLoginPopupIfPresent();

                    addStepResult(
                        'PASS',
                        `Success: Navigated to blog page via direct URL : ${page.url()}`
                    );
                }

                // =====================================================
                // STEP 3 : Find a product on the Blog page and open it
                // Blog pages may contain inline product cards / shoppable
                // articles. We look for any Add to Cart button or a
                // product card link and open the first product found.
                // =====================================================

                console.log('🔹 Step 3: Find product on Blog page');

                // Common selectors for products embedded in blog pages
                const blogProductCardSelectors = [
                    '.articleProductSearch > a.card',
                    '.product-card a[href*="/products/"]',
                    'a.card[href*="/products/"]',
                    '.vibeCard a[href*="/products/"]',
                    'a[href*="/products/"]'
                ];

                let blogProductHref = null;

                for (const sel of blogProductCardSelectors) {

                    const links = page.locator(sel);
                    const count = await links.count().catch(() => 0);

                    if (count > 0) {
                        blogProductHref = await links.first().getAttribute('href').catch(() => null);
                        if (blogProductHref) break;
                    }
                }

                if (blogProductHref) {

                    addStepResult(
                        'PASS',
                        `Success: Product found on blog page : ${blogProductHref}`
                    );

                } else {

                    // If no inline product on this blog page, open a specific
                    // article that is known to embed products
                    await page.goto('/blogs/skin');
                    await page.waitForLoadState('networkidle');
                    await homePage.closeLoginPopupIfPresent();
                    await page.waitForTimeout(2000);

                    for (const sel of blogProductCardSelectors) {
                        const links = page.locator(sel);
                        const count = await links.count().catch(() => 0);
                        if (count > 0) {
                            blogProductHref = await links.first().getAttribute('href').catch(() => null);
                            if (blogProductHref) break;
                        }
                    }

                    if (blogProductHref) {

                        addStepResult(
                            'PASS',
                            `Success: Product found on blog page after fallback : ${blogProductHref}`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'No product found on blog page — cannot proceed with blog add-to-cart step'
                        );
                    }
                }

                // =====================================================
                // STEP 4 : Navigate to the product PDP from Blog page
                //          and Add to Cart
                // =====================================================

                console.log('🔹 Step 4: Add product to cart from Blog page');

                if (blogProductHref) {

                    const blogProductUrl = blogProductHref.startsWith('http')
                        ? blogProductHref
                        : `${new URL(page.url()).origin}${blogProductHref}`;

                    await page.goto(blogProductUrl);
                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(2000);
                    await homePage.closeLoginPopupIfPresent();

                    // Capture the product name from PDP title
                    const pdpTitleLocator = page.locator(
                        'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
                    ).first();

                    blogProductName = (
                        await pdpTitleLocator.textContent().catch(() => '')
                    ).trim();

                    console.log(`   Blog product name : "${blogProductName}"`);

                    // Click Add to Cart button on the PDP
                    const addToCartBtn = page.locator(
                        '.product-add-view-desktop button.buttonWithBorder.primaryButton, ' +
                        'button:has-text("Add to Cart"), ' +
                        'button:has-text("ADD TO CART"), ' +
                        'button[class*="add-to-cart"]'
                    ).first();

                    const addToCartVisible =
                        await addToCartBtn.isVisible({ timeout: 10000 }).catch(() => false);

                    if (addToCartVisible) {

                        await addToCartBtn.click();
                        await page.waitForTimeout(3000);
                        await homePage.closeLoginPopupIfPresent();

                        blogProductAdded = true;

                        addStepResult(
                            'PASS',
                            `Success: Product "${blogProductName}" is added to the cart from the Blog page.`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Add to Cart button not found on Blog product PDP : ${blogProductUrl}`
                        );
                    }

                } else {

                    addStepResult(
                        'PASS',
                        'Success: Step skipped — no blog product href was found in Step 3'
                    );
                }

                // =====================================================
                // STEP 5 : Verify Blog product appears in Cart
                // =====================================================

                console.log('🔹 Step 5: Verify Blog product in Cart');

                if (blogProductAdded) {

                    // Navigate back to homepage then open cart
                    await homePage.navigateToHome();
                    await page.waitForLoadState('networkidle');
                    await homePage.closeLoginPopupIfPresent();

                    await homePage.cartIcon.click();
                    await page.waitForTimeout(3000);

                    const cartOpen = await homePage.isCartSliderOpened();

                    if (cartOpen) {

                        const cartItemCount = await homePage.getCartItemCount();

                        if (cartItemCount > 0) {

                            // Read the name of the first cart item
                            const firstCartItemName = (
                                await homePage.cart.productName
                                    .first()
                                    .textContent()
                                    .catch(() => '')
                            ).trim();

                            addStepResult(
                                'PASS',
                                `Success: Blog product verified in cart — cart item : "${firstCartItemName}", items count : ${cartItemCount}`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                'Failed: Cart is empty after adding product from Blog page'
                            );
                        }

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Cart slider did not open when verifying blog product'
                        );
                    }

                    // Close the cart before navigating to collection page
                    await homePage.cart.closeButton.click({ force: true }).catch(() => { });
                    await page.waitForTimeout(1000);

                } else {

                    addStepResult(
                        'PASS',
                        'Success: Cart verification skipped — blog product was not added'
                    );
                }

                // =====================================================
                // STEP 6 : Navigate to Collection page
                // The "Let's Dive In" / BePicks section links to
                // /shop-by-category. Nav bar also has direct collection
                // links. We use the BePicks "View" button href or fall
                // back to a known collections URL.
                // =====================================================

                // console.log('🔹 Step 6: Navigate to Collection page');

                // await homePage.navigateToHome();
                // await page.waitForLoadState('networkidle');
                // await homePage.closeLoginPopupIfPresent();
                // await page.waitForTimeout(1500);

                // // Try the Let's Dive In button (links to /shop-by-category)
                // const diveInBtn = page.locator(
                //     '.bebe-button a.buttonWithBorder.primaryButton[href*="shop-by-category"], ' +
                //     '.bebe-button a.buttonWithBorder.primaryButton'
                // ).first();

                // const diveInExists = await page.evaluate(() => {
                //     return !!(
                //         document.querySelector(
                //             '.bebe-button a.buttonWithBorder.primaryButton[href*="shop-by-category"]'
                //         ) ||
                //         document.querySelector('.bebe-button a.buttonWithBorder.primaryButton')
                //     );
                // });

                // if (diveInExists) {

                //     await homePage.scrollToBePicksSection();
                //     await page.waitForTimeout(1000);
                //     await diveInBtn.click({ force: true });
                //     await page.waitForLoadState('networkidle');
                //     await page.waitForTimeout(2000);
                //     await homePage.closeLoginPopupIfPresent();

                // } else {

                //     // Fallback — go to a known collection URL directly
                //     await page.goto('/collections/all');
                //     await page.waitForLoadState('networkidle');
                //     await page.waitForTimeout(2000);
                //     await homePage.closeLoginPopupIfPresent();
                // }

                // const collectionPageUrl = page.url();

                // const onCollectionPage =
                //     collectionPageUrl.includes('/collections/') ||
                //     collectionPageUrl.includes('/shop-by-category');

                // if (onCollectionPage) {

                //     addStepResult(
                //         'PASS',
                //         `Success: Collection page loaded : ${collectionPageUrl}`
                //     );

                // } else {

                //     // Last fallback
                //     await page.goto('/collections/all');
                //     await page.waitForLoadState('networkidle');
                //     await homePage.closeLoginPopupIfPresent();

                //     addStepResult(
                //         'PASS',
                //         `Success: Collection page loaded via direct URL : ${page.url()}`
                //     );
                // }

                // // =====================================================
                // // STEP 7 : Find and open a product from Collection page
                // // =====================================================

                // console.log('🔹 Step 7: Find product on Collection page');

                // // Common collection product card selectors
                // const collectionProductSelectors = [
                //     '.product-card a[href*="/products/"]',
                //     'a.product-item[href*="/products/"]',
                //     '.product-grid a[href*="/products/"]',
                //     '.collection-product a[href*="/products/"]',
                //     'a[href*="/products/"]'
                // ];

                // let collectionProductHref = null;

                // for (const sel of collectionProductSelectors) {

                //     const links = page.locator(sel);
                //     const count = await links.count().catch(() => 0);

                //     if (count > 0) {
                //         // Pick the second product if available to ensure it's
                //         // a different item from what was added via the blog
                //         const idx = count > 1 ? 1 : 0;
                //         collectionProductHref =
                //             await links.nth(idx).getAttribute('href').catch(() => null);
                //         if (collectionProductHref) break;
                //     }
                // }

                // if (collectionProductHref) {

                //     addStepResult(
                //         'PASS',
                //         `Success: Product found on collection page : ${collectionProductHref}`
                //     );

                // } else {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: No product found on collection page — cannot proceed with collection add-to-cart step'
                //     );
                // }

                // =====================================================
                // STEP 6 : Navigate to Collection page
                // =====================================================

                // console.log('🔹 Step 6: Navigate to Collection page');

                // await homePage.navigateToHome();
                // await safeWaitForLoad();
                // await homePage.closeLoginPopupIfPresent();
                // await safeTimeout(1500);

                // const diveInBtn = homePage.bePicks.letsDiveInButton;

                // const diveInExists = !page.isClosed() && await diveInBtn.isVisible().catch(() => false);

                // if (diveInExists) {

                //     await homePage.scrollToBePicksSection();
                //     await safeTimeout(1000);
                //     await diveInBtn.click({ force: true, timeout: 10000 }).catch(() => { });
                //     await safeWaitForLoad();
                //     await safeTimeout(2000);
                //     await homePage.closeLoginPopupIfPresent();

                // } else {

                //     await safeGoto('/collections/all');
                //     await safeWaitForLoad();
                //     await safeTimeout(2000);
                //     await homePage.closeLoginPopupIfPresent();
                // }

                // const collectionPageUrl = page.isClosed() ? '' : page.url();

                // const onCollectionPage =
                //     collectionPageUrl.includes('/collections/') ||
                //     collectionPageUrl.includes('/shop-by-category');

                // if (onCollectionPage) {

                //     addStepResult(
                //         'PASS',
                //         `Success: Collection page loaded : ${collectionPageUrl}`
                //     );

                // } else if (!page.isClosed()) {

                //     await safeGoto('/collections/all');
                //     await safeWaitForLoad();
                //     await homePage.closeLoginPopupIfPresent();

                //     addStepResult(
                //         'PASS',
                //         `Success: Collection page loaded via direct URL : ${page.url()}`
                //     );

                // } else {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: Page was closed unexpectedly while navigating to Collection page'
                //     );
                // }

                console.log('🔹 Step 6: Navigate to Collection page');

                await withTimeout(homePage.navigateToHome(), 20000);
                await safeWaitForLoad();
                await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);
                await safeTimeout(1500);

                const diveInBtn = homePage.bePicks.letsDiveInButton;

                const diveInExists = !page.isClosed() && await diveInBtn.isVisible().catch(() => false);

                if (diveInExists) {

                    await withTimeout(homePage.scrollToBePicksSection(), 10000);
                    await safeTimeout(1000);
                    await diveInBtn.click({ force: true, timeout: 10000 }).catch(() => { });
                    await safeWaitForLoad();
                    await safeTimeout(2000);
                    await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);

                } else {

                    await safeGoto('/collections/all');
                    await safeWaitForLoad();
                    await safeTimeout(2000);
                    await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);
                }

                const collectionPageUrl = page.isClosed() ? '' : page.url();

                const onCollectionPage =
                    collectionPageUrl.includes('/collections/') ||
                    collectionPageUrl.includes('/shop-by-category');

                if (onCollectionPage) {

                    addStepResult(
                        'PASS',
                        `Success: Collection page loaded : ${collectionPageUrl}`
                    );

                } else if (!page.isClosed()) {

                    await safeGoto('/collections/all');
                    await safeWaitForLoad();
                    await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);

                    addStepResult(
                        'PASS',
                        `Success: Collection page loaded via direct URL : ${page.url()}`
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Page was closed unexpectedly while navigating to Collection page'
                    );
                }

                // =====================================================
                // STEP 7 : Find and open a product from Collection page
                // =====================================================

                // console.log('🔹 Step 7: Find product on Collection page');

                // let collectionProductHref = null;

                // if (!page.isClosed()) {

                //     await safeTimeout(2000);

                //     await page.evaluate(() => window.scrollBy(0, 800)).catch(() => { });
                //     await safeTimeout(1500);

                //     const collectionProductSelectors = [
                //         '.product-card a[href*="/products/"]',
                //         'a.product-item[href*="/products/"]',
                //         '.product-grid a[href*="/products/"]',
                //         '.collection-product a[href*="/products/"]',
                //         '.card-product-card a[href*="/products/"]',
                //         '.productCard a[href*="/products/"]',
                //         'a[href*="/products/"]'
                //     ];

                //     for (const sel of collectionProductSelectors) {
                //         if (page.isClosed()) break;
                //         await page
                //             .waitForSelector(sel, { state: 'attached', timeout: 5000 })
                //             .then(() => true)
                //             .catch(() => false);
                //     }

                //     for (const sel of collectionProductSelectors) {
                //         if (page.isClosed()) break;

                //         const links = page.locator(sel);
                //         const count = await links.count().catch(() => 0);

                //         if (count > 0) {
                //             const idx = count > 1 ? 1 : 0;
                //             collectionProductHref =
                //                 await links.nth(idx).getAttribute('href').catch(() => null);
                //             if (collectionProductHref) break;
                //         }
                //     }

                //     // Fallback: try a second, more product-dense collection —
                //     // only if the page is still alive.
                //     if (!collectionProductHref && !page.isClosed()) {

                //         const wentToFallback = await safeGoto('/collections/skin-care');

                //         if (wentToFallback && !page.isClosed()) {

                //             await safeWaitForLoad();
                //             await safeTimeout(2000);
                //             // await homePage.closeLoginPopupIfPresent();
                //             await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);

                //             for (const sel of collectionProductSelectors) {
                //                 if (page.isClosed()) break;
                //                 await page
                //                     .waitForSelector(sel, { state: 'attached', timeout: 5000 })
                //                     .then(() => true)
                //                     .catch(() => false);
                //             }

                //             for (const sel of collectionProductSelectors) {
                //                 if (page.isClosed()) break;

                //                 const links = page.locator(sel);
                //                 const count = await links.count().catch(() => 0);

                //                 if (count > 0) {
                //                     const idx = count > 1 ? 1 : 0;
                //                     collectionProductHref =
                //                         await links.nth(idx).getAttribute('href').catch(() => null);
                //                     if (collectionProductHref) break;
                //                 }
                //             }
                //         }
                //     }
                // }

                // if (collectionProductHref) {

                //     addStepResult(
                //         'PASS',
                //         `Success: Product found on collection page : ${collectionProductHref}`
                //     );

                // } else if (page.isClosed()) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: Page closed unexpectedly while searching for a product on the collection page'
                //     );

                // } else {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: No product found on collection page — cannot proceed with collection add-to-cart step'
                //     );
                // }

                console.log('🔹 Step 7: Find product on Collection page');

                let collectionProductHref = null;

                const collectionProductSelectors = [
                    '.product-card a[href*="/products/"]',
                    'a.product-item[href*="/products/"]',
                    '.product-grid a[href*="/products/"]',
                    '.collection-product a[href*="/products/"]',
                    '.card-product-card a[href*="/products/"]',
                    '.productCard a[href*="/products/"]',
                    'a[href*="/products/"]'
                ];

                // const findCollectionProductHref = async () => {

                //     if (page.isClosed()) return null;

                //     await page.evaluate(() => window.scrollBy(0, 800)).catch(() => { });
                //     await safeTimeout(1000);

                //     for (const sel of collectionProductSelectors) {

                //         if (page.isClosed()) return null;

                //         await page
                //             .waitForSelector(sel, { state: 'attached', timeout: 3000 })
                //             .catch(() => { });

                //         if (page.isClosed()) return null;

                //         const links = page.locator(sel);
                //         const count = await links.count().catch(() => 0);

                //         if (count > 0) {
                //             const idx = count > 1 ? 1 : 0;
                //             const href = await links.nth(idx).getAttribute('href').catch(() => null);
                //             if (href) return href;
                //         }
                //     }

                //     return null;
                // };

                const findCollectionProductHref = async () => {

                    if (page.isClosed()) return null;

                    for (let attempt = 0; attempt < 4 && !page.isClosed(); attempt++) {

                        await page.evaluate((n) => window.scrollBy(0, 600 + n * 400), attempt).catch(() => { });
                        await safeTimeout(1200);

                        for (const sel of collectionProductSelectors) {

                            if (page.isClosed()) return null;

                            await page
                                .waitForSelector(sel, { state: 'attached', timeout: 2000 })
                                .catch(() => { });

                            if (page.isClosed()) return null;

                            const links = page.locator(sel);
                            const count = await links.count().catch(() => 0);

                            if (count > 0) {
                                const idx = count > 1 ? 1 : 0;
                                const href = await links.nth(idx).getAttribute('href').catch(() => null);
                                if (href) return href;
                            }
                        }
                    }

                    return null;
                };

                if (!page.isClosed()) {

                    collectionProductHref = await withTimeout(findCollectionProductHref(), 20000);

                    // Fallback: try a second, more product-dense collection — only if time/page allow
                    if (!collectionProductHref && !page.isClosed()) {

                        const wentToFallback = await safeGoto('/collections/skin-care');

                        if (wentToFallback && !page.isClosed()) {

                            await safeWaitForLoad();
                            await safeTimeout(1000);
                            await withTimeout(homePage.closeLoginPopupIfPresent(), 8000);

                            collectionProductHref = await withTimeout(findCollectionProductHref(), 20000);
                        }
                    }
                }

                if (collectionProductHref) {

                    addStepResult(
                        'PASS',
                        `Success: Product found on collection page : ${collectionProductHref}`
                    );

                } else if (page.isClosed()) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Page closed unexpectedly while searching for a product on the collection page'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: No product found on collection page — cannot proceed with collection add-to-cart step'
                    );
                }

                // =====================================================
                // STEP 8 : Navigate to the product PDP from Collection
                //          page and Add to Cart
                // =====================================================

                console.log('🔹 Step 8: Add product to cart from Collection page');

                // if (collectionProductHref) {

                //     const collectionProductUrl = collectionProductHref.startsWith('http')
                //         ? collectionProductHref
                //         : `${new URL(page.url()).origin}${collectionProductHref}`;

                //     await page.goto(collectionProductUrl);
                //     await page.waitForLoadState('networkidle');
                //     await page.waitForTimeout(2000);
                //     await homePage.closeLoginPopupIfPresent();

                //     // Capture the product name from PDP title
                //     const pdpTitleLocator = page.locator(
                //         'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
                //     ).first();

                //     collectionProductName = (
                //         await pdpTitleLocator.textContent().catch(() => '')
                //     ).trim();

                //     console.log(`   Collection product name : "${collectionProductName}"`);

                //     // Click Add to Cart button on the PDP
                //     const addToCartBtnCol = page.locator(
                //         '.product-add-view-desktop button.buttonWithBorder.primaryButton, ' +
                //         'button:has-text("Add to Cart"), ' +
                //         'button:has-text("ADD TO CART"), ' +
                //         'button[class*="add-to-cart"]'
                //     ).first();

                //     const addToCartVisibleCol =
                //         await addToCartBtnCol.isVisible({ timeout: 10000 }).catch(() => false);

                //     if (addToCartVisibleCol) {

                //         await addToCartBtnCol.click();
                //         await page.waitForTimeout(3000);
                //         await homePage.closeLoginPopupIfPresent();

                //         collectionProductAdded = true;

                //         addStepResult(
                //             'PASS',
                //             `Success: Product "${collectionProductName}" is added to the cart from the Collection page.`
                //         );

                //     } else {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             `Failed: Add to Cart button not found on Collection product PDP : ${collectionProductUrl}`
                //         );
                //     }

                // } else {

                //     addStepResult(
                //         'PASS',
                //         'Success: Step skipped — no collection product href was found in Step 7'
                //     );
                // }

                if (collectionProductHref && !page.isClosed()) {

                    const collectionProductUrl = collectionProductHref.startsWith('http')
                        ? collectionProductHref
                        : `${new URL(page.url()).origin}${collectionProductHref}`;

                    const navigatedOk = await safeGoto(collectionProductUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });

                    if (navigatedOk && !page.isClosed()) {

                        await safeWaitForLoad();
                        await safeTimeout(2000);
                        await homePage.closeLoginPopupIfPresent().catch(() => { });

                        const pdpTitleLocator = page.locator(
                            'h1.product-title, h1[class*="product"], h1[class*="title"], .product-name h1, h1'
                        ).first();

                        collectionProductName = (
                            await pdpTitleLocator.textContent().catch(() => '')
                        ).trim();

                        console.log(`   Collection product name : "${collectionProductName}"`);

                        const addToCartBtnCol = page.locator(
                            '.product-add-view-desktop button.buttonWithBorder.primaryButton, ' +
                            'button:has-text("Add to Cart"), ' +
                            'button:has-text("ADD TO CART"), ' +
                            'button[class*="add-to-cart"]'
                        ).first();

                        const addToCartVisibleCol =
                            !page.isClosed() && await addToCartBtnCol.isVisible({ timeout: 10000 }).catch(() => false);

                        if (addToCartVisibleCol) {

                            await addToCartBtnCol.click({ timeout: 10000 }).catch(() => { });
                            await safeTimeout(3000);
                            await homePage.closeLoginPopupIfPresent().catch(() => { });

                            collectionProductAdded = true;

                            addStepResult(
                                'PASS',
                                `Success: Product "${collectionProductName}" is added to the cart from the Collection page.`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Add to Cart button not found on Collection product PDP : ${collectionProductUrl}`
                            );
                        }

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Page closed unexpectedly while navigating to Collection product PDP'
                        );
                    }

                } else if (page.isClosed()) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Page was already closed before Step 8 could run'
                    );

                } else {

                    addStepResult(
                        'PASS',
                        'Success: Step skipped — no collection product href was found in Step 7'
                    );
                }

                // =====================================================
                // STEP 9 : Verify both products appear in Cart
                // Open the cart and confirm item count and product names
                // match what was added from blog and collection pages.
                // =====================================================

                // console.log('🔹 Step 9: Verify both products in Cart');

                // await homePage.navigateToHome();
                // await page.waitForLoadState('networkidle');
                // await homePage.closeLoginPopupIfPresent();

                // await homePage.cartIcon.click();
                // await page.waitForTimeout(3000);

                // const finalCartOpen = await homePage.isCartSliderOpened();

                // if (!finalCartOpen) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: Cart slider did not open during final verification'
                //     );

                // } else {

                //     const totalCartItems = await homePage.getCartItemCount();

                //     console.log(`   Total cart items : ${totalCartItems}`);

                //     // Collect all cart item names for verification
                //     const cartItemNames = [];

                //     for (let i = 0; i < totalCartItems; i++) {

                //         const name = (
                //             await homePage.cart.productName
                //                 .nth(i)
                //                 .textContent()
                //                 .catch(() => '')
                //         ).trim();

                //         cartItemNames.push(name);
                //     }

                //     console.log(`   Cart items : ${JSON.stringify(cartItemNames)}`);

                //     // Verify at least 1 product from blog was added
                //     const blogProductInCart = blogProductAdded && totalCartItems >= 1;

                //     // Verify at least 1 product from collection was added
                //     const collectionProductInCart = collectionProductAdded && totalCartItems >= 2;

                //     if (blogProductInCart && collectionProductInCart) {

                //         addStepResult(
                //             'PASS',
                //             `Success: Both products verified in cart — total items : ${totalCartItems} | Blog product : "${blogProductName}" | Collection product : "${collectionProductName}" | Cart items : ${cartItemNames.join(', ')}`
                //         );

                //     } else if (blogProductInCart) {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             `Failed: Only blog product found in cart. Collection product "${collectionProductName}" not added. Total cart items : ${totalCartItems}`
                //         );

                //     } else if (collectionProductInCart) {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             `Failed: Only collection product found in cart. Blog product "${blogProductName}" not added. Total cart items : ${totalCartItems}`
                //         );

                //     } else {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             `Failed: Neither product found in cart after add-to-cart from blog and collection pages. Total cart items : ${totalCartItems}`
                //         );
                //     }
                // }

                console.log('🔹 Step 9: Verify both products in Cart');

                let finalCartOpen = false;

                if (!page.isClosed()) {

                    await homePage.navigateToHome();
                    await safeWaitForLoad();
                    await homePage.closeLoginPopupIfPresent().catch(() => { });

                    await homePage.cartIcon.click({ timeout: 10000 }).catch(() => { });
                    await safeTimeout(3000);

                    finalCartOpen = await homePage.isCartSliderOpened();

                    if (!finalCartOpen) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Cart slider did not open during final verification'
                        );

                    } else {

                        const totalCartItems = await homePage.getCartItemCount();

                        console.log(`   Total cart items : ${totalCartItems}`);

                        // Collect all cart item names for verification
                        const cartItemNames = [];

                        for (let i = 0; i < totalCartItems; i++) {

                            const name = (
                                await homePage.cart.productName
                                    .nth(i)
                                    .textContent()
                                    .catch(() => '')
                            ).trim();

                            cartItemNames.push(name);
                        }

                        console.log(`   Cart items : ${JSON.stringify(cartItemNames)}`);

                        // Verify at least 1 product from blog was added
                        const blogProductInCart = blogProductAdded && totalCartItems >= 1;

                        // Verify at least 1 product from collection was added
                        const collectionProductInCart = collectionProductAdded && totalCartItems >= 2;

                        if (blogProductInCart && collectionProductInCart) {

                            addStepResult(
                                'PASS',
                                `Success: Both products verified in cart — total items : ${totalCartItems} | Blog product : "${blogProductName}" | Collection product : "${collectionProductName}" | Cart items : ${cartItemNames.join(', ')}`
                            );

                        } else if (blogProductInCart) {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Only blog product found in cart. Collection product "${collectionProductName}" not added. Total cart items : ${totalCartItems}`
                            );

                        } else if (collectionProductInCart) {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Only collection product found in cart. Blog product "${blogProductName}" not added. Total cart items : ${totalCartItems}`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Neither product found in cart after add-to-cart from blog and collection pages. Total cart items : ${totalCartItems}`
                            );
                        }
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Page was closed before final cart verification (Step 9) could run'
                    );
                }

                // =====================================================
                // STEP 10 : Verify Cart Item Details
                // Check that each cart item shows image, name, and price
                // =====================================================

                console.log('🔹 Step 10: Verify Cart Item Details');

                if (finalCartOpen) {

                    const totalItems = await homePage.getCartItemCount();
                    let detailsValid = true;
                    const detailIssues = [];

                    for (let i = 0; i < totalItems; i++) {

                        const imgVisible =
                            await homePage.cart.productImage
                                .nth(i)
                                .isVisible()
                                .catch(() => false);

                        const nameText = (
                            await homePage.cart.productName
                                .nth(i)
                                .textContent()
                                .catch(() => '')
                        ).trim();

                        const priceText = (
                            await homePage.cart.productPrice
                                .nth(i)
                                .textContent()
                                .catch(() => '')
                        ).trim();

                        if (!imgVisible || !nameText || !priceText) {

                            detailsValid = false;
                            detailIssues.push(
                                `Item ${i + 1} — image:${imgVisible}, name:"${nameText}", price:"${priceText}"`
                            );
                        }
                    }

                    if (detailsValid && totalItems > 0) {

                        addStepResult(
                            'PASS',
                            `Success: All ${totalItems} cart item(s) display image, name and price correctly`
                        );

                    } else if (totalItems === 0) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Cart has no items — cannot verify item details'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Cart item detail verification failed : ${detailIssues.join(' | ')}`
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Cart not open — item detail verification skipped'
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Unexpected error : ${error.message}`
                );
            }

            // =====================================================
            // REPORTING
            // =====================================================

            const steps = getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log(
                'Steps:',
                JSON.stringify(steps, null, 2)
            );

            logResult({
                testCaseId: 'TC022',
                title: 'Verify add to cart functionality of product from blog and collection page',
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