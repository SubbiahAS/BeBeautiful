// tests/collection/verifyCollectionPageLayout.spec.js

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const CollectionPage = require('../../pages/CollectionPage');

const { logResult } = require('../../utils/reportLogger');

const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

test.describe('Collection Page Module', () => {

    test(
        'TC042 - Verify collection page layout',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC042 - Verify collection page layout');
            console.log('======================================================');

            const homePage = new HomePage(page);
            const collectionPage = new CollectionPage(page);

            try {

                // =====================================================
                // STEP 1
                // =====================================================

                console.log('🔹 Step 1 : Navigate to Homepage');

                await homePage.navigateToHome();

                await page.waitForLoadState('networkidle');

                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully'
                );

                // =====================================================
                // STEP 2
                // =====================================================

                console.log('🔹 Step 2 : Navigate to Collection Page');

                await collectionPage.navigateToCollectionPage();

                const collectionLoaded =
                    page.url().includes('/shop-by-category');

                if (collectionLoaded) {

                    addStepResult(
                        'PASS',
                        'Success: Collection page loaded successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Collection page failed to load'
                    );

                }

                // =====================================================
                // STEP 3
                // =====================================================

                console.log('🔹 Step 3 : Verify Filter Section');

                const filterVisible =
                    await collectionPage.isFilterSectionVisible();

                if (filterVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Filter section displayed on left side'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Filter section not displayed'
                    );

                }

                // =====================================================
                // STEP 4
                // =====================================================

                console.log('🔹 Step 4 : Verify Product Listing');

                const productListing =
                    await collectionPage.isProductSectionVisible();

                if (productListing) {

                    addStepResult(
                        'PASS',
                        'Success: Product listing section displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Product listing section missing'
                    );

                }

                // =====================================================
                // STEP 5
                // =====================================================

                console.log('🔹 Step 5 : Verify Product Image');

                const imageVisible =
                    await collectionPage.areProductImagesVisible();

                if (imageVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Product images displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Product images missing'
                    );

                }

                // =====================================================
                // STEP 6
                // =====================================================

                console.log('🔹 Step 6 : Verify Wishlist');

                const wishlistVisible =
                    await collectionPage.areWishlistIconsVisible();

                if (wishlistVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Wishlist option displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Wishlist option missing'
                    );

                }

                // =====================================================
                // STEP 7
                // =====================================================

                console.log('🔹 Step 7 : Verify Product Title');

                const titleVisible =
                    await collectionPage.areProductTitlesVisible();

                if (titleVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Product title displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Product title missing'
                    );

                }

                // =====================================================
                // STEP 8
                // =====================================================

                console.log('🔹 Step 8 : Verify Product Price');

                const priceVisible =
                    await collectionPage.arePricesVisible();

                if (priceVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Product price displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Product price missing'
                    );

                }

                // =====================================================
                // STEP 9
                // =====================================================

                console.log('🔹 Step 9 : Verify Tax Text');

                const taxVisible =
                    await collectionPage.isTaxTextVisible();

                if (taxVisible) {

                    addStepResult(
                        'PASS',
                        'Success: MRP inclusive of all taxes displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: MRP inclusive of all taxes text missing'
                    );

                }

                // =====================================================
                // STEP 10
                // =====================================================

                console.log('🔹 Step 10 : Verify Add To Cart');

                const cartVisible =
                    await collectionPage.areAddToCartButtonsVisible();

                if (cartVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Add To Cart button displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Add To Cart button missing'
                    );

                }

                // =====================================================
                // STEP 11
                // =====================================================

                console.log(
                    '🔹 Step 11 : Verify Infinite Scroll'
                );

                const result =
                    await collectionPage.loadMoreProductsOnScroll();


                if (result.loaded) {

                    addStepResult(

                        'PASS',

                        `Success: Additional products loaded successfully (${result.previous} → ${result.latest})`

                    );

                } else {
                    testFailed = true;

                    addStepResult(

                        'FAIL',

                        `Failed: Scrolling did not load additional products (${result.previous} → ${result.latest})`

                    );

                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    error.message
                );

            }

            // =====================================================
            // REPORT
            // =====================================================

            const steps =
                getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log(
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({

                testCaseId: 'TC042',

                title: 'Verify collection page layout',

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