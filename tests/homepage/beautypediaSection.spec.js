// tests/Beautypedia/TC069_Verify_beautypedia_page_layout.spec.js

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const BeautypediaPage = require('../../pages/BeautypediaPage');

const { logResult } = require('../../utils/reportLogger');

const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

test.describe('Beautypedia Module', () => {

    test(
        'TC068 - Verify beautypedia section',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            clearStepResults();

            let testFailed = false;

            const homePage = new HomePage(page);

            console.log('================================================');
            console.log('TC068 - Verify beautypedia section');
            console.log('================================================');

            try {

                await test.step(
                    'Step 1 - Open homepage',
                    async () => {

                        await homePage.navigateToHome();

                        addStepResult(
                            'PASS',
                            'Success: Homepage opened successfully'
                        );
                    }
                );

                await test.step(
                    'Step 2 - Scroll to Beautypedia section',
                    async () => {

                        await homePage.scrollToBeautypediaSection();

                        const isVisible =
                            await homePage.isBeautypediaVisible();

                        if (isVisible) {

                            addStepResult(
                                'PASS',
                                'Success: Beautypedia section is displayed above Newsletter section.'
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                'Failed: Beautypedia section is not displayed above Newsletter section.'
                            );
                        }

                        expect(isVisible).toBeTruthy();
                    }
                );

                await test.step(
                    'Step 3 - Verify left text and right video',
                    async () => {

                        await expect(
                            homePage.beautyLingo.textContainer
                        ).toBeVisible();

                        await expect(
                            homePage.beautyLingo.video
                        ).toBeVisible();

                        addStepResult(
                            'PASS',
                            'Success: Left side displays text and right side displays playing video.'
                        );
                    }
                );

                await test.step(
                    'Step 4 - Verify heading text',
                    async () => {

                        const heading =
                            await homePage.getBeautypediaHeading();

                        expect(heading).toContain(
                            'Beauty lingo'
                        );

                        expect(heading).toContain(
                            'A to Z'
                        );

                        addStepResult(
                            'PASS',
                            'Success: "Beauty Lingo: From A to Z" text displayed.'
                        );
                    }
                );

                await test.step(
                    'Step 5 - Verify Open Beautypedia button',
                    async () => {

                        await expect(
                            homePage.beautyLingo.openBeautypediaButton
                        ).toBeVisible();

                        addStepResult(
                            'PASS',
                            'Success: Open Beautypedia button is displayed.'
                        );
                    }
                );

                await test.step(
                    'Step 6 - Verify navigation',
                    async () => {

                        await homePage.clickOpenBeautypedia();

                        await expect(page).toHaveURL(
                            /beautypedia/
                        );

                        addStepResult(
                            'PASS',
                            'Success: User navigated to Beautypedia page.'
                        );
                    }
                );

            } catch (error) {

                testFailed = true;

                console.log('❌ Exception Occurred');
                console.log(error);

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

            console.log('================================================');
            console.log('TC068 EXECUTION SUMMARY');
            console.log('================================================');

            console.log(
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({

                testCaseId: 'TC068',

                title: 'Verify beautypedia section',

                status: overallStatus,

                steps

            });

            clearStepResults();

            expect(

                overallStatus,

                'One or more validation steps failed.'

            ).toBe('PASS');
        }
    );

    test(
        'TC069 - Verify beauty pedia page layout',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(300000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC069 - Verify beauty pedia page layout');
            console.log('======================================================');

            const homePage = new HomePage(page);
            const beautypediaPage = new BeautypediaPage(page);

            try {

                // =====================================================
                // STEP 1
                // Navigate to Homepage
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
                // Open Beautypedia
                // =====================================================

                console.log('🔹 Step 2 : Open Beautypedia');

                await homePage.beautyLingo.section.scrollIntoViewIfNeeded();

                await page.waitForTimeout(2000);

                await expect(
                    homePage.beautyLingo.openBeautypediaButton
                ).toBeVisible();

                await homePage.beautyLingo.openBeautypediaButton.click();

                await page.waitForLoadState('networkidle');

                addStepResult(
                    'PASS',
                    'Success: Beautypedia page opened successfully'
                );

                // =====================================================
                // STEP 3
                // Verify Banner
                // =====================================================

                console.log('🔹 Step 3 : Verify Banner');

                const bannerVisible =
                    await beautypediaPage.banner.wrapper
                        .isVisible()
                        .catch(() => false);

                if (bannerVisible) {

                    console.log('✅ Banner displayed');

                    addStepResult(
                        'PASS',
                        'Success: Banner displayed at top of Beautypedia page'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Banner missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Banner is not displayed'
                    );

                }

                // =====================================================
                // STEP 4
                // Verify Search Section
                // =====================================================

                console.log('🔹 Step 4 : Verify Search Section');

                const searchVisible =
                    await beautypediaPage.search.wrapper
                        .isVisible()
                        .catch(() => false);

                const inputVisible =
                    await beautypediaPage.search.input
                        .isVisible()
                        .catch(() => false);

                if (
                    searchVisible &&
                    inputVisible
                ) {

                    console.log('✅ Search section displayed');

                    addStepResult(
                        'PASS',
                        'Success: Search section displayed below banner'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Search section missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Search section is not displayed'
                    );

                }

                // =====================================================
                // STEP 5
                // Search Hair
                // =====================================================

                console.log('🔹 Step 5 : Search keyword "hair"');

                await beautypediaPage.searchIngredient('hair');

                const resultCount =
                    await beautypediaPage.getResultCount();

                if (resultCount > 0) {

                    console.log(
                        `✅ ${resultCount} search results displayed`
                    );

                    addStepResult(
                        'PASS',
                        'Success: "hair" search displays related articles (${resultCount} results)'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ No search result');

                    addStepResult(
                        'FAIL',
                        'Failed: No article displayed after searching "hair"'
                    );

                }

                // =====================================================
                // STEP 6
                // Verify Alphabet Section
                // =====================================================

                console.log('🔹 Step 6 : Verify Alphabet Filter');

                await beautypediaPage.scrollToAlphabetSection();

                const alphabetVisible =
                    await beautypediaPage.alphabet.wrapper
                        .isVisible()
                        .catch(() => false);

                if (alphabetVisible) {

                    console.log('✅ Alphabet filter displayed');

                    addStepResult(
                        'PASS',
                        'Success: Alphabet filter displayed below search section'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Alphabet filter missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Alphabet filter is not displayed'
                    );

                }

                // Remaining steps (click A, verify articles,
                // verify image/title/What is it/share icon,
                // verify share popup, reporting)
                // continue in Part 2B...

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         error.message
                //     );

                // }

                // =====================================================
                // STEP 7
                // Click Alphabet "A"
                // =====================================================

                console.log('🔹 Step 7 : Click Alphabet "A"');

                await beautypediaPage.clickAlphabet('A');

                const firstTitle =
                    await beautypediaPage
                        .getFirstArticleTitle()
                        .catch(() => '');

                if (
                    firstTitle &&
                    firstTitle
                        .trim()
                        .toUpperCase()
                        .startsWith('A')
                ) {

                    console.log(
                        `✅ First article starts with A : ${firstTitle}`
                    );

                    addStepResult(
                        'PASS',
                        `Success: Articles starting with alphabet "A" are displayed`
                    );

                } else {

                    testFailed = true;

                    console.log(
                        `❌ Invalid article title : ${firstTitle}`
                    );

                    addStepResult(
                        'FAIL',
                        `Failed: Articles displayed are not starting with alphabet "A"`
                    );

                }

                // =====================================================
                // STEP 8
                // Verify Article Image
                // =====================================================

                console.log('🔹 Step 8 : Verify Article Image');

                const imageVisible =
                    await beautypediaPage.article.image
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (imageVisible) {

                    console.log('✅ Article image displayed');

                    addStepResult(
                        'PASS',
                        'Success: Article image is displayed'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Article image missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Article image is not displayed'
                    );

                }

                // =====================================================
                // STEP 9
                // Verify Article Title
                // =====================================================

                console.log('🔹 Step 9 : Verify Article Title');

                const titleVisible =
                    await beautypediaPage.article.title
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (titleVisible) {

                    console.log('✅ Article title displayed');

                    addStepResult(
                        'PASS',
                        'Success: Article title is displayed'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Article title missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Article title is not displayed'
                    );

                }

                // =====================================================
                // STEP 10
                // Verify What Is It Text
                // =====================================================

                console.log('🔹 Step 10 : Verify "What is it" text');

                const descriptionVisible =
                    await beautypediaPage.article.description
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (descriptionVisible) {

                    console.log('✅ Description displayed');

                    addStepResult(
                        'PASS',
                        'Success: "What is it" text is displayed'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Description missing');

                    addStepResult(
                        'FAIL',
                        'Failed: "What is it" text is not displayed'
                    );

                }

                // =====================================================
                // STEP 11
                // Verify Share Icon
                // =====================================================

                console.log('🔹 Step 11 : Verify Share Icon');

                const shareVisible =
                    await beautypediaPage.article.shareIcon
                        .first()
                        .isVisible()
                        .catch(() => false);

                if (shareVisible) {

                    console.log('✅ Share icon displayed');

                    addStepResult(
                        'PASS',
                        'Success: Share icon is displayed on article'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Share icon missing');

                    addStepResult(
                        'FAIL',
                        'Failed: Share icon is not displayed'
                    );

                }

                // =====================================================
                // STEP 12
                // Click Share Icon
                // =====================================================

                console.log('🔹 Step 12 : Click Share Icon');

                await beautypediaPage.clickShareIcon();

                // const popupVisible =
                //     await beautypediaPage.sharePopup.container
                //         .isVisible()
                //         .catch(() => false);
                const popupVisible =
                    await beautypediaPage.sharePopup.title
                        .isVisible()
                        .catch(() => false);

                if (popupVisible) {

                    console.log('✅ Share popup opened');

                    addStepResult(
                        'PASS',
                        'Success: Share popup opened successfully'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ Share popup not opened');

                    addStepResult(
                        'FAIL',
                        'Failed: Share popup did not open'
                    );

                }

                // =====================================================
                // STEP 13
                // Verify Share Options
                // =====================================================

                console.log('🔹 Step 13 : Verify Share Options');

                // const optionCount =
                //     await beautypediaPage.sharePopup.socialIcons
                //         .count()
                //         .catch(() => 0);

                await expect(
                    beautypediaPage.sharePopup.iconsContainer
                ).toBeVisible();

                const optionCount =
                    await beautypediaPage.sharePopup.socialIcons.count();

                if (optionCount > 0) {

                    console.log(
                        `✅ ${optionCount} sharing options available`
                    );

                    addStepResult(
                        'PASS',
                        'Success: Sharing options are available in popup'
                    );

                } else {

                    testFailed = true;

                    console.log('❌ No sharing options');

                    addStepResult(
                        'FAIL',
                        'Failed: No sharing options found in popup'
                    );

                }

                await beautypediaPage.closeSharePopup();

            } catch (error) {

                testFailed = true;

                console.log('❌ Exception Occurred');
                console.log(error);

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

            console.log('\n======================================================');
            console.log('TC069 EXECUTION SUMMARY');
            console.log('======================================================');

            console.log(
                JSON.stringify(
                    steps,
                    null,
                    2
                )
            );

            logResult({

                testCaseId: 'TC069',

                title: 'Verify beauty pedia page layout',

                status: overallStatus,

                steps

            });

            clearStepResults();

            expect(

                overallStatus,

                'One or more validation steps failed.'

            ).toBe('PASS');

        }

    );

});