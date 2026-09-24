const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const { logResult } = require('../../utils/reportLogger');

const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

test.describe('Homepage - Beauty Edit Module', () => {

    test('TC087 - Verify Beauty Edit Section',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC087 - Verify Beauty Edit Section');
            console.log('======================================================');

            const homePage = new HomePage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Homepage
                // ============================================================

                console.log('🔹 Step 1 : Navigate to Homepage');

                await homePage.navigateToHome();

                await page.waitForLoadState('networkidle');

                await homePage.closeLoginPopupIfPresent();

                addStepResult(
                    'PASS',
                    'Success: Homepage loaded successfully'
                );

                // ============================================================
                // STEP 2 : Verify Hero Carousel is displayed
                // ============================================================

                console.log('🔹 Step 2 : Verify Hero Carousel');

                // const carouselVisible =
                //     await homePage.heroCarousel
                //         .isVisible()
                //         .catch(() => false);

                await homePage.beautyEditSection.scrollIntoViewIfNeeded();

                await page.waitForTimeout(1500);

                const carouselVisible =
                    await homePage.beautyEditSection
                        .isVisible()
                        .catch(() => false);

                if (carouselVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Homepage Hero Carousel is displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Homepage Hero Carousel is not displayed'
                    );
                }

                // ============================================================
                // STEP 3 : Verify Hero Image
                // ============================================================

                console.log('🔹 Step 3 : Verify Hero Image');

                // const imageVisible =
                //     await homePage.heroImage
                //         .isVisible()
                //         .catch(() => false);

                const imageVisible =
                    await homePage.heroImage
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (imageVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Hero image is displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Hero image is not displayed'
                    );
                }

                // ============================================================
                // STEP 4 : Verify Article Title
                // ============================================================

                console.log('🔹 Step 4 : Verify Article Title');

                const titleVisible =
                    await homePage.articleTitle
                        .isVisible()
                        .catch(() => false);

                const titleText =
                    await homePage.articleTitle
                        .textContent()
                        .catch(() => '');

                if (titleVisible && titleText.trim().length > 0) {

                    addStepResult(
                        'PASS',
                        `Success: Article title displayed : ${titleText}`
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Article title is not displayed'
                    );
                }

                // =====================================================
                // STEP 5
                // Verify Read Time
                // =====================================================

                console.log('🔹 Step 5 : Verify Read Time');

                const readTimeVisible =
                    await homePage.readTime
                        .isVisible()
                        .catch(() => false);

                if (readTimeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Read time is displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Read time is not displayed'
                    );
                }

                // =====================================================
                // STEP 6
                // Verify Publish Date
                // =====================================================

                console.log('🔹 Step 6 : Verify Publish Date');

                const publishDateVisible =
                    await homePage.publishDate
                        .isVisible()
                        .catch(() => false);

                if (publishDateVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Publish date is displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Publish date is not displayed'
                    );
                }

                // =====================================================
                // STEP 7
                // Verify Author Name
                // =====================================================

                console.log('🔹 Step 7 : Verify Author Name');

                const authorVisible =
                    await homePage.authorName
                        .isVisible()
                        .catch(() => false);

                if (authorVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Author name is displayed'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Author name is not displayed'
                    );
                }

                // ============================================================
                // STEP 8 : Verify Article Description
                // ============================================================

                console.log('🔹 Step 8 : Verify Article Description');

                const descriptionVisible =
                    await homePage.articleDescription
                        .isVisible()
                        .catch(() => false);

                const descriptionText =
                    await homePage.articleDescription
                        .textContent()
                        .catch(() => '');

                if (
                    descriptionVisible &&
                    descriptionText.trim().length > 0
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Article description is displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Article description is not displayed'
                    );
                }

                // ============================================================
                // STEP 9 : Verify Like Button
                // ============================================================

                console.log('🔹 Step 9 : Verify Like Button');

                const likeVisible =
                    await homePage.likeButton
                        .isVisible()
                        .catch(() => false);

                if (likeVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Like button is displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Like button is not displayed'
                    );
                }

                // ============================================================
                // STEP 10 : Verify Share Button
                // ============================================================

                console.log('🔹 Step 10 : Verify Share Button');

                const shareVisible =
                    await homePage.shareButton
                        .isVisible()
                        .catch(() => false);

                if (shareVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Share button is displayed successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Share button is not displayed'
                    );
                }

                // ============================================================
                // STEP 11 : Verify Dive In Button
                // ============================================================

                console.log('🔹 Step 11 : Verify Dive In Button');

                const diveInVisible =
                    await homePage.diveInButton
                        .isVisible()
                        .catch(() => false);

                const diveInText =
                    await homePage.diveInButton
                        .textContent()
                        .catch(() => '');

                if (
                    diveInVisible &&
                    diveInText.trim().length > 0
                ) {

                    addStepResult(
                        'PASS',
                        `Success: Dive In button is displayed with text : ${diveInText.trim()}`
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Dive In button is not displayed'
                    );
                }

                // ============================================================
                // STEP 12 : Verify Right Navigation Arrow
                // ============================================================

                console.log('🔹 Step 12 : Verify Right Navigation Arrow');

                const rightArrowVisible =
                    await homePage.rightArrow
                        .isVisible()
                        .catch(() => false);

                const rightArrowEnabled =
                    await homePage.rightArrow
                        .isEnabled()
                        .catch(() => false);

                if (
                    rightArrowVisible &&
                    rightArrowEnabled
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Right navigation arrow is visible and enabled'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Right navigation arrow is not enabled'
                    );
                }

                // ============================================================
                // STEP 13 : Click Right Navigation Arrow
                // ============================================================

                console.log('🔹 Step 13 : Click Right Navigation Arrow');

                const firstTitle =
                    await homePage.articleTitle
                        .textContent()
                        .catch(() => '');
                const imageBefore =
                    await homePage.heroImage.getAttribute('src');

                await homePage.rightArrow.click();

                await page.waitForTimeout(2000);

                addStepResult(
                    'PASS',
                    'Clicked the right navigation arrow successfully'
                );

                // ============================================================
                // STEP 14 : Verify Carousel Navigated to Next Slide
                // ============================================================

                console.log('🔹 Step 14 : Verify Next Slide');

                const secondTitle =
                    await homePage.articleTitle
                        .textContent()
                        .catch(() => '');

                if (
                    firstTitle.trim() !== secondTitle.trim()
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Carousel navigated to the next slide successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Carousel did not navigate to the next slide'
                    );
                }

                // ============================================================
                // STEP 15 : Verify Left Navigation Arrow Enabled
                // ============================================================

                console.log('🔹 Step 15 : Verify Left Navigation Arrow');

                const leftArrowVisible =
                    await homePage.leftArrow
                        .isVisible()
                        .catch(() => false);

                const leftArrowEnabled =
                    await homePage.leftArrow
                        .isEnabled()
                        .catch(() => false);

                if (
                    leftArrowVisible &&
                    leftArrowEnabled
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Left navigation arrow is enabled after clicking the right arrow'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Left navigation arrow is still disabled'
                    );
                }

                // ============================================================
                // STEP 16 : Click Left Navigation Arrow
                // ============================================================

                console.log('🔹 Step 16 : Click Left Navigation Arrow');

                await homePage.leftArrow.click();

                await page.waitForTimeout(2000);

                addStepResult(
                    'PASS',
                    'Success: Clicked the left navigation arrow successfully'
                );

                // ============================================================
                // STEP 17 : Verify Carousel Returned to First Slide
                // ============================================================

                console.log('🔹 Step 17 : Verify First Slide');

                const returnedTitle =
                    await homePage.articleTitle
                        .textContent()
                        .catch(() => '');

                if (
                    returnedTitle.trim() === firstTitle.trim()
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Carousel returned to the first slide successfully'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Carousel did not return to the first slide'
                    );
                }

                // ============================================================
                // STEP 18 : Verify Like Button On Returned Slide
                // ============================================================

                console.log('🔹 Step 18 : Verify Like Button After Navigation');

                const likeAfterNavigation =
                    await homePage.likeButton
                        .isVisible()
                        .catch(() => false);

                if (likeAfterNavigation) {

                    addStepResult(
                        'PASS',
                        'Success: Like button is displayed after returning to the first slide'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Like button is not displayed after carousel navigation'
                    );
                }

                console.log('🔹 Click Like Button');

                await homePage.likeButton.click();

                await page.waitForTimeout(2000);

                // Login popup appears for guest user
                if (await homePage.loginPopup.isVisible().catch(() => false)) {

                    addStepResult(
                        'PASS',
                        'Success: Login popup displayed for guest user after clicking Like icon'
                    );

                }
                else {

                    addStepResult(
                        'PASS',
                        'Success: Article added to liked articles'
                    );

                }

                // ============================================================
                // STEP 19 : Verify Share Button On Returned Slide
                // ============================================================

                console.log('🔹 Step 19 : Verify Share Button After Navigation');

                const shareAfterNavigation =
                    await homePage.shareButton
                        .isVisible()
                        .catch(() => false);

                if (shareAfterNavigation) {

                    addStepResult(
                        'PASS',
                        'Success: Share button is displayed after returning to the first slide'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Share button is not displayed after carousel navigation'
                    );
                }


                await homePage.closeLoginPopupIfPresent();

                await homePage.acceptCookiesIfPresent();

                await page.waitForTimeout(1000);

                await homePage.shareButton.click();

                await page.waitForTimeout(1000);

                const popupVisible =
                    await homePage.sharePopup
                        .waitFor({ state: 'visible', timeout: 5000 })
                        .then(() => true)
                        .catch(() => false);

                if (popupVisible) {

                    await expect(homePage.shareTitle).toHaveText(/Share Article/i);

                    await expect(homePage.instagramShare).toBeVisible();

                    await expect(homePage.whatsappShare).toBeVisible();

                    await expect(homePage.mailShare).toBeVisible();

                    await expect(homePage.twitterShare).toBeVisible();

                    await expect(homePage.copyLinkButton).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Share popup displayed with all sharing options'
                    );

                    // await homePage.closeSharePopup.click();

                    await homePage.closeSharePopup
                        .click({ timeout: 5000 })
                        .catch(async () => {
                            // Fallback: press Escape if the close button click fails for any reason
                            await page.keyboard.press('Escape').catch(() => { });
                        });
                }
                else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Share popup did not open'
                    );

                }

                await page.keyboard.press('Escape');

                await page.waitForTimeout(1000);

                // ============================================================
                // STEP 20 : Verify Dive In Button After Navigation
                // ============================================================

                console.log('🔹 Step 20 : Verify Dive In Button After Navigation');

                const diveInAfterNavigation =
                    await homePage.diveInButton
                        .isVisible()
                        .catch(() => false);

                if (diveInAfterNavigation) {

                    addStepResult(
                        'PASS',
                        'Success: Dive In button is displayed after returning to the first slide'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Dive In button is not displayed after carousel navigation'
                    );
                }


                const currentUrl = page.url();

                await homePage.diveInButton.click();

                await page.waitForLoadState('networkidle');

                const newUrl = page.url();

                if (newUrl !== currentUrl) {

                    addStepResult(
                        'PASS',
                        'Success: Dive In navigated to article page'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Dive In did not navigate'
                    );
                }

                // ============================================================
                // STEP 21 : Verify Carousel Navigation Functionality
                // ============================================================

                console.log('🔹 Step 21 : Verify Carousel Navigation');

                if (
                    firstTitle.trim() !== secondTitle.trim() &&
                    returnedTitle.trim() === firstTitle.trim()
                ) {

                    addStepResult(
                        'PASS',
                        'Success: Homepage hero carousel navigation works correctly using right and left arrows'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Homepage hero carousel navigation is not functioning correctly'
                    );
                }

            } catch (error) {

                testFailed = true;

                console.log('❌ Exception Occurred');
                console.log(error);

                addStepResult(
                    'FAIL',
                    'Failed: ' + error.message
                );

            }

            // ============================================================
            // REPORTING
            // ============================================================

            const steps = getStepResults();

            const overallStatus =
                testFailed ? 'FAIL' : 'PASS';

            console.log('\n======================================================');
            console.log('TCXXX EXECUTION SUMMARY');
            console.log('======================================================');

            console.log(
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({

                testCaseId: 'TC087',

                title: 'Verify Beauty Edit Section',

                status: overallStatus,

                steps

            });

            clearStepResults();

            expect(

                overallStatus,

                'One or more validation steps failed.'

            ).toBe('PASS');

        });

});

