// tests/homepage/asSeenOnGram.spec.js

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

test.describe('Homepage Module', () => {

    test(
        'TC009 - Verify "As seen on gram" section',
        { tag: ['@Homepage', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(120000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC009 - Verify "As Seen on Gram" Section');
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

                addStepResult('PASS', 'Homepage loaded successfully');

                // ============================================================
                // STEP 2 : Scroll to "As Seen on Gram" Section
                // ============================================================

                console.log('🔹 Step 2: Scroll to "As Seen on Gram" Section');

                await homePage.asSeenOnGram.section.scrollIntoViewIfNeeded({ timeout: 15000 });
                await page.waitForTimeout(3000);

                const sectionVisible =
                    await homePage.asSeenOnGram.section.isVisible().catch(() => false);

                if (sectionVisible) {
                    addStepResult('PASS', '"As Seen on Gram" section is displayed on the homepage');
                } else {
                    testFailed = true;
                    addStepResult('FAIL', '"As Seen on Gram" section is not displayed on the homepage');
                }

                // ============================================================
                // DEBUG: Dump shadow DOM content to identify reel/modal selectors
                // ============================================================
                await homePage.debugAsSeenOnGramDOM();

                // ============================================================
                // STEP 2a : Verify Reels Are Displayed
                // Expected: Reels are displayed inside the section
                // ============================================================

                console.log('🔹 Step 2a: Verify Reels Are Displayed');

                const initialReelCount = await homePage.getReelCount();
                console.log(`   Initial reel count: ${initialReelCount}`);

                if (initialReelCount > 0) {

                    addStepResult(
                        'PASS',
                        `Success: Reels are displayed in the "As Seen on Gram" section — found ${initialReelCount} reel(s)`
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: No reels are displayed in the "As Seen on Gram" section'
                    );
                }

                // ============================================================
                // STEP 2b : Verify "View More" Button Is Displayed
                // Expected: "View More" button is displayed
                // ============================================================

                console.log('🔹 Step 2b: Verify "View More" Button Is Displayed');

                const viewMoreVisible =
                    await homePage.asSeenOnGram.viewMoreButton.isVisible().catch(() => false);

                if (viewMoreVisible) {

                    addStepResult(
                        'PASS',
                        'Success: "View More" button is available in this widget'
                    );

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: "View More" button is not displayed in the "As Seen on Gram" section'
                    );
                }

                // ============================================================
                // STEP 3 : Click "View More" Button — Verify More Reels Load
                // Expected: Clicking "View More" loads additional reels and count increases
                // ============================================================

                console.log('🔹 Step 3: Click "View More" Button and Verify Additional Reels Load');

                if (viewMoreVisible) {

                    try {

                        await homePage.clickViewMore();

                        const updatedReelCount = await homePage.getReelCount();
                        console.log(`   Updated reel count after "View More" click: ${updatedReelCount}`);

                        if (updatedReelCount > initialReelCount) {

                            addStepResult(
                                'PASS',
                                `Success: Clicking "View More" loaded additional reels — count increased from ${initialReelCount} to ${updatedReelCount}`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Reel count did not increase after clicking "View More" — before: ${initialReelCount}, after: ${updatedReelCount}`
                            );
                        }

                    } catch (error) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Unable to click "View More" button: ${error.message}`
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Skipped "View More" verification — button was not visible'
                    );
                }

                // ============================================================
                // STEP 4 : Click on a Reel — Verify Expanded View Opens
                // ============================================================

                console.log('🔹 Step 4: Click on a Reel and Verify Expanded View Opens');

                try {

                    await homePage.clickFirstReel();
                    await homePage.debugReelControlsDOM();

                    // ── DEBUG: dump modal DOM to identify correct selectors ──
                    await homePage.debugReelModalDOM();
                    await homePage.debugReelControlsDOM();

                    const modalOpened = await homePage.isReelModalOpened();

                    if (modalOpened) {
                        addStepResult('PASS', 'Success: Clicking on a reel opens the reel in an expanded view');
                    } else {
                        testFailed = true;
                        addStepResult('FAIL', 'Failed: Clicking on a reel did not open the expanded reel view');
                    }

                } catch (error) {
                    testFailed = true;
                    addStepResult('FAIL', `Failed: Unable to click on reel: ${error.message}`);
                }

                // ============================================================
                // STEP 4a : Verify Close (Cross) Icon at Top-Right
                // Expected: Cross icon displayed at top-right corner of expanded view
                // ============================================================

                // console.log('🔹 Step 4a: Verify Close (Cross) Icon');

                // const closeIconVisible =
                //     await homePage.isCloseButtonVisible();

                // if (closeIconVisible) {

                //     addStepResult(
                //         'PASS',
                //         'Success: Cross (close) icon is displayed at the top-right corner of the expanded reel view'
                //     );

                // } else {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         'Failed: Cross (close) icon is not displayed in the expanded reel view'
                //     );
                // }

                console.log('🔹 Step 4a: Verify Close (Cross) Icon');

                try {

                    const {
                        modalBox,
                        closeBox,
                        isTopRight
                    } = await homePage.verifyCloseIconTopRightPosition();

                    if (!closeBox) {
                        throw new Error('Close (cross) icon was not found in the expanded reel view.');
                    }

                    if (!modalBox) {
                        throw new Error('Expanded reel view container could not be located to verify close icon position.');
                    }

                    if (!isTopRight) {
                        throw new Error(
                            `Close icon is displayed but NOT positioned at the top-right corner. ` +
                            `Modal: ${JSON.stringify(modalBox)}, Close icon: ${JSON.stringify(closeBox)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        'Success: Cross (close) icon is displayed at the top-right corner of the expanded reel view'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4b : Verify Left and Right Carousel Controls & Navigation
                // Expected: Left/right controls displayed and allow navigation between reels
                // ============================================================
                const leftDisabled = await homePage.isLeftButtonDisabled();
                console.log(`   Left button disabled state: ${leftDisabled}`);

                console.log('🔹 Step 4b: Verify Carousel Navigation Controls');

                const rightArrowVisible =
                    await homePage.isRightArrowVisible();

                const leftArrowVisible =
                    await homePage.isLeftArrowVisible();

                if (rightArrowVisible && leftArrowVisible) {

                    addStepResult(
                        'PASS',
                        'Success: Left and right carousel controls are displayed in the expanded reel view'
                    );

                    // Verify navigation actually works
                    try {

                        // const videoSrcBefore = await homePage.getVideoSrc();

                        // await homePage.navigateReelRight();
                        // await page.waitForTimeout(1000);

                        // const videoSrcAfter = await homePage.getVideoSrc();

                        // console.log(`   Video src before: ${videoSrcBefore}`);
                        // console.log(`   Video src after right navigation: ${videoSrcAfter}`);

                        // if (rightArrowVisible) {

                        //     addStepResult(
                        //         'PASS',
                        //         'Success: Right carousel control is displayed and clickable'
                        //     );

                        // } else {

                        //     testFailed = true;

                        //     addStepResult(
                        //         'FAIL',
                        //         'Failed: Right carousel control is not available'
                        //     );

                        // }

                        // // Navigate back left to verify left control too
                        // await homePage.navigateReelLeft();
                        // await page.waitForTimeout(1000);

                        // const videoSrcAfterLeft = await homePage.getVideoSrc();

                        // console.log(`   Video src after left navigation: ${videoSrcAfterLeft}`);

                        // if (videoSrcAfterLeft === videoSrcBefore) {

                        //     addStepResult(
                        //         'PASS',
                        //         'Success: Left carousel control successfully navigates back to the previous reel'
                        //     );

                        // } else {

                        //     testFailed = true;

                        //     addStepResult(
                        //         'FAIL',
                        //         'Failed: Left carousel control did not navigate back to the previous reel'
                        //     );
                        // }


                        // Verify that the current index changes when navigating right
                        // const currentIndexBefore =
                        //     await homePage.getCurrentCarouselIndex();

                        // const rightClicked =
                        //     await homePage.navigateReelRight();

                        // await page.waitForTimeout(1500);

                        // const currentIndexAfter =
                        //     await homePage.getCurrentCarouselIndex();

                        // console.log(`Index before: ${currentIndexBefore}`);
                        // console.log(`Index after right navigation: ${currentIndexAfter}`);

                        // if (
                        //     rightClicked &&
                        //     currentIndexAfter !== currentIndexBefore
                        // ) {

                        //     addStepResult(
                        //         'PASS',
                        //         'Success: Right carousel control successfully navigates to the next reel'
                        //     );

                        // } else {

                        //     testFailed = true;

                        //     addStepResult(
                        //         'FAIL',
                        //         'Failed: Right carousel control did not move to another reel'
                        //     );
                        // }

                        // // Navigate back left to verify left control too
                        // const leftClicked = await homePage.navigateReelLeft();
                        // await page.waitForTimeout(1500);

                        // const currentIndexAfterLeft =
                        //     await homePage.getCurrentCarouselIndex();

                        // console.log(`Index after left navigation: ${currentIndexAfterLeft}`);

                        // if (
                        //     leftClicked &&
                        //     currentIndexAfterLeft === currentIndexBefore
                        // ) {

                        //     addStepResult(
                        //         'PASS',
                        //         'Success: Left carousel control successfully navigates back to the previous reel'
                        //     );

                        // } else {

                        //     testFailed = true;

                        //     addStepResult(
                        //         'FAIL',
                        //         'Failed: Left carousel control did not navigate back to the previous reel'
                        //     );
                        // }

                    } catch (error) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Unable to verify carousel navigation: ${error.message}`
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Carousel controls missing — left: ${leftArrowVisible}, right: ${rightArrowVisible}`
                    );
                }

                // ============================================================
                // STEP 4c : Verify Mute/Unmute Controls Work Correctly
                // Expected: Mute and unmute controls displayed and work correctly
                // ============================================================
                console.log('🔹 Step 4c: Verify Mute/Unmute Controls Work Correctly');

                const muteButtonVisible = await homePage.isMuteButtonVisible();

                if (muteButtonVisible) {

                    try {

                        const mutedStateBefore = await homePage.getVideoMutedState();
                        console.log(`   Video muted state before toggle: ${mutedStateBefore}`);

                        await homePage.toggleMute();
                        await page.waitForTimeout(500);

                        const mutedStateAfter = await homePage.getVideoMutedState();
                        console.log(`   Video muted state after toggle: ${mutedStateAfter}`);

                        if (
                            mutedStateBefore !== null &&
                            mutedStateAfter !== null &&
                            mutedStateBefore !== mutedStateAfter
                        ) {

                            addStepResult(
                                'PASS',
                                `Success: Mute/unmute control (video click-to-toggle) works correctly — muted state changed from ${mutedStateBefore} to ${mutedStateAfter}`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Mute/unmute control did not toggle video mute state — before: ${mutedStateBefore}, after: ${mutedStateAfter}`
                            );
                        }

                    } catch (error) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Unable to verify mute/unmute toggle: ${error.message}`
                        );
                    }

                } else {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        'Failed: Video element (mute control) is not displayed in the expanded reel view'
                    );
                }

                // // ============================================================
                // // STEP 4d : Verify Video Content on Left Side
                // // Expected: Video content displayed on left side of expanded view
                // // ============================================================

                // console.log('🔹 Step 4d: Verify Video Content on Left Side');

                // await homePage.debugLayoutBoxes();

                // try {

                //     const videoVisible = await homePage.isVideoVisible();

                //     if (videoVisible) {

                //         const videoBox = await homePage.getVideoBoundingBox();
                //         const authorBox = await homePage.getAuthorBoundingBox();

                //         const isOnLeft =
                //             videoBox !== null;

                //         if (isOnLeft) {

                //             addStepResult(
                //                 'PASS',
                //                 'Success: Video content is displayed on the left side of the expanded reel view'
                //             );

                //         } else {

                //             testFailed = true;

                //             addStepResult(
                //                 'FAIL',
                //                 'Failed: Video content is not positioned on the left side of the expanded reel view'
                //             );
                //         }

                //     } else {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             'Failed: Video content is not displayed in the expanded reel view'
                //         );
                //     }

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: Unable to verify video content position: ${error.message}`
                //     );
                // }

                // // ============================================================
                // // STEP 4e : Verify Author Details on Right Side
                // // Expected: Author details displayed on right side of expanded view
                // // ============================================================

                // console.log('🔹 Step 4e: Verify Author Details on Right Side');

                // try {

                //     const authorBoxCheck = await homePage.getAuthorBoundingBox();
                //     const authorVisible = authorBoxCheck !== null;

                //     if (authorVisible) {

                //         const authorNameText = await homePage.getAuthorNameText();

                //         console.log(`   Author name: ${authorNameText.trim()}`);

                //         const videoBox = await homePage.getVideoBoundingBox();
                //         const authorBox = authorBoxCheck;

                //         const isOnRight =
                //             authorBox !== null;

                //         if (isOnRight) {

                //             addStepResult(
                //                 'PASS',
                //                 `Success: Author details are displayed on the right side of the expanded reel view: "${authorNameText.trim()}"`
                //             );

                //         } else {

                //             testFailed = true;

                //             addStepResult(
                //                 'FAIL',
                //                 `Failed: Author details are not positioned on the right side of the expanded reel view: "${authorNameText.trim()}"`
                //             );
                //         }

                //     } else {

                //         testFailed = true;

                //         addStepResult(
                //             'FAIL',
                //             `Failed: Author details are not displayed in the expanded reel view: "${authorNameText.trim()}"`
                //         );
                //     }

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: Unable to verify author details: ${error.message}`
                //     );
                // }

                // ============================================================
                // STEP 4d : Verify Video Content on Left Side
                // Expected: Video content displayed on left side of expanded view
                // ============================================================

                console.log('🔹 Step 4d: Verify Video Content on Left Side');

                await homePage.debugLayoutBoxes();

                let videoLayoutResult = null;

                try {

                    const videoVisible = await homePage.isVideoVisible();

                    if (!videoVisible) {
                        throw new Error('Video content is not displayed in the expanded reel view.');
                    }

                    videoLayoutResult = await homePage.verifyVideoLeftAuthorRightLayout();

                    const { modalBox, videoBox, isVideoOnLeft } = videoLayoutResult;

                    if (!videoBox) {
                        throw new Error('Video bounding box could not be determined.');
                    }

                    console.log(`   Modal box: ${JSON.stringify(modalBox)}`);
                    console.log(`   Video box: ${JSON.stringify(videoBox)}`);

                    if (!isVideoOnLeft) {
                        throw new Error(
                            'Video content is not positioned on the left side of the expanded reel view relative to the author details / modal midpoint.'
                        );
                    }

                    addStepResult(
                        'PASS',
                        'Success: Video content is displayed on the left side of the expanded reel view'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4e : Verify Author Details on Right Side
                // Expected: Author details displayed on right side of expanded view
                // ============================================================

                console.log('🔹 Step 4e: Verify Author Details on Right Side');

                try {

                    const authorBoxCheck = await homePage.getAuthorBoundingBox();

                    if (!authorBoxCheck) {
                        throw new Error('Author details are not displayed in the expanded reel view.');
                    }

                    const authorNameText = await homePage.getAuthorNameText();

                    // Re-use the layout comparison computed in Step 4d when available,
                    // otherwise compute it fresh (e.g. if Step 4d failed before reaching this point).
                    const layoutResult =
                        videoLayoutResult ?? (await homePage.verifyVideoLeftAuthorRightLayout());

                    const { modalBox, videoBox, authorBox, isAuthorOnRight } = layoutResult;

                    if (!authorBox) {
                        throw new Error('Author details bounding box could not be determined.');
                    }

                    console.log(`   Modal box: ${JSON.stringify(modalBox)}`);
                    console.log(`   Video box: ${JSON.stringify(videoBox)}`);
                    console.log(`   Author box: ${JSON.stringify(authorBox)}`);

                    if (!isAuthorOnRight) {
                        throw new Error(
                            `Author details ("${authorNameText.trim()}") are not positioned on the right side of the expanded reel view relative to the video / modal midpoint.`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: Author details are displayed on the right side of the expanded reel view: "${authorNameText.trim()}"`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: ${error.message}`
                    );
                }

                // ============================================================
                // STEP 5 : Close the Expanded Reel View
                // ============================================================

                console.log('🔹 Step 5: Close the Expanded Reel View');

                try {

                    await homePage.closeReelModal();

                    const modalClosed =
                        !(await homePage.isReelModalOpened());

                    if (modalClosed) {

                        addStepResult(
                            'PASS',
                            'Success: Expanded reel view closed successfully using the close icon'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Expanded reel view did not close after clicking the close icon'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Unable to close expanded reel view: ${error.message}`
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult('FAIL', error.message);
            }

            // ============================================================
            // REPORTING
            // ============================================================

            const steps = getStepResults();
            const overallStatus = testFailed ? 'FAIL' : 'PASS';

            console.log('Steps:', JSON.stringify(steps, null, 2));

            logResult({
                testCaseId: 'TC009',
                title: 'Verify "As seen on gram" section',
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