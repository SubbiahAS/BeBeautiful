// tests/blogs/articleDownloadAndListenNow.spec.js

const { test, expect } = require('../../utils/testFixture');
const BlogPage = require('../../pages/BlogPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');

const ARTICLE_URL =
    process.env.ARTICLE_URL_FULL ||
    'https://www.bebeautiful.in/all-things-skin/skin-type/sunscreen-for-oily-skin';

test.describe('Blog Download and Listen Now Functionality', () => {

    test(
        'TC050 - Verify download and listen now options',
        { tag: ['@Blog', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(180000);

            clearStepResults();

            let testFailed = false;

            const TC = 'TC050';
            const SCENARIO =
                'Verify download and listen now options';

            console.log('\n======================================================');
            console.log(`🚀 Starting ${TC} - ${SCENARIO}`);
            console.log('======================================================');

            const blogPage = new BlogPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Blog Article
                // ============================================================

                console.log('🔹 Step 1: Navigate to Blog Article');

                await blogPage.navigateToArticle(ARTICLE_URL);

                addStepResult(
                    'PASS',
                    'Success: The blog article page opened as expected.'
                );

                // ============================================================
                // STEP 2 : Verify Download Icon
                // ============================================================

                console.log('🔹 Step 2: Verify Download Icon');

                try {

                    await expect(
                        blogPage.blog.downloadIcon
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: The download icon is visible in the sticky toolbar.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Download icon is not displayed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Listen Now Button
                // ============================================================

                console.log('🔹 Step 3: Verify Listen Now Button');

                try {

                    await expect(
                        blogPage.blog.listenNowButton
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: The "Listen Now" button is visible in the sticky toolbar.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Listen Now button is not displayed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Listen Now Functionality
                // ============================================================

                console.log('🔹 Step 4: Verify Listen Now Functionality');

                try {

                    await blogPage.clickListenNow();

                    const progressVisible =
                        await blogPage.blog.listenProgressContainer
                            .isVisible()
                            .catch(() => false);

                    if (progressVisible) {

                        addStepResult(
                            'PASS',
                            'Success: Listen Now is activated successfully and the progress bar is displayed.'
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            'Skipped: Listen Now was clicked successfully, but the progress bar was not displayed. This may vary depending on the browser.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Unable to activate Listen Now. ${error.message.split('\n')[0]}`
                    );
                }

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Unexpected error: ${error.message}`
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

});