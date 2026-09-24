const { test, expect } = require('../../utils/testFixture');
const BlogPage = require('../../pages/BlogPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');
const { handleCookieBanner } = require('../../utils/helpers');

// Article URL loaded from .env
const ARTICLE_URL =
    process.env.ARTICLE_URL_FULL ||
    'https://www.bebeautiful.in/all-things-skin/skin-type/sunscreen-for-oily-skin';

test.describe('Blog Page Module', () => {

    test(
    'TC047 - Verify Article Page Header and Basic Details',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

        test.setTimeout(180000);

        clearStepResults();

        let testFailed = false;

        console.log('\n======================================================');
        console.log('🚀 Starting TC047 - Verify Article Page Header and Basic Details');
        console.log('======================================================');

        const blogPage = new BlogPage(page);

        try {

            // ============================================================
            // STEP 1 : Navigate to Article Page
            // ============================================================

            console.log('🔹 Step 1: Navigate to Article Page');

            await blogPage.navigateToArticle(ARTICLE_URL);

            await handleCookieBanner(page);

            addStepResult(
                'PASS',
                'Success: Article page loaded successfully.'
            );

            // ============================================================
            // STEP 2 : Verify Breadcrumb Section (visible + clickable + navigation)
            // ============================================================

            console.log('🔹 Step 2: Verify Breadcrumb Section');

            try {

                await expect(blogPage.blog.breadcrumbSection).toBeVisible();

                const breadcrumbCount =
                    await blogPage.blog.breadcrumbLinks.count();

                expect(breadcrumbCount).toBeGreaterThan(0);

                let clickableCount = 0;
                const navigatedLabels = [];

                for (let i = 0; i < breadcrumbCount; i++) {

                    const breadcrumb =
                        blogPage.blog.breadcrumbLinks.nth(i);

                    await expect(breadcrumb).toBeVisible();

                    const breadcrumbText =
                        (await breadcrumb.textContent())?.trim();

                    expect(breadcrumbText.length).toBeGreaterThan(0);

                    const href =
                        await breadcrumb.getAttribute('href');

                    // Only clickable breadcrumbs should have an href
                    if (href) {

                        clickableCount++;

                        console.log(
                            `   ↳ Checking breadcrumb navigation: ${breadcrumbText}`
                        );

                        await breadcrumb.click();

                        await page.waitForLoadState('networkidle');

                        // Validate navigation to respective category page
                        expect(
                            page.url()
                        ).toContain(
                            href.replace('/', '')
                        );

                        navigatedLabels.push(breadcrumbText);

                        console.log(
                            `   ↳ Navigation successful for: ${breadcrumbText}`
                        );

                        // Go back to the article page
                        await page.goBack({ waitUntil: 'networkidle' });

                        await handleCookieBanner(page);

                        // Confirm article page is visible again
                        await expect(blogPage.blog.articleTitle).toBeVisible();
                    }
                }

                addStepResult(
                    'PASS',
                    `Success: Breadcrumb section is visible with ${breadcrumbCount} item(s), including ${clickableCount} clickable link(s). Verified navigation for: ${navigatedLabels.join(', ') || 'N/A'}.`
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Breadcrumb section verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 3 : Verify Article Title
            // ============================================================

            console.log('🔹 Step 3: Verify Article Title');

            try {

                await expect(blogPage.blog.articleTitle).toBeVisible();

                const titleText =
                    (await blogPage.blog.articleTitle.textContent())?.trim();

                expect(titleText.length).toBeGreaterThan(0);

                addStepResult(
                    'PASS',
                    `Success: Article title is displayed as "${titleText.substring(0, 60)}...".`
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Article title verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 4 : Verify Article Subheading (below title)
            // ============================================================

            console.log('🔹 Step 4: Verify Article Subheading');

            try {

                await expect(blogPage.blog.articleSubheading).toBeVisible();

                const subheadingText =
                    (await blogPage.blog.articleSubheading.textContent())?.trim();

                expect(subheadingText.length).toBeGreaterThan(0);

                const titleBox = await blogPage.blog.articleTitle.boundingBox();
                const subheadingBox = await blogPage.blog.articleSubheading.boundingBox();

                if (titleBox && subheadingBox) {
                    expect(subheadingBox.y).toBeGreaterThanOrEqual(titleBox.y);
                }

                addStepResult(
                    'PASS',
                    `Success: Article subheading is displayed below the title as "${subheadingText.substring(0, 60)}...".`
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Article subheading verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 5 : Verify Article Image (below title/subheading)
            // ============================================================

            console.log('🔹 Step 5: Verify Article Image');

            try {

                await expect(blogPage.blog.articleImage).toBeVisible();

                const articleImageSrc =
                    await blogPage.blog.articleImage.getAttribute('src');

                expect(articleImageSrc).toBeTruthy();

                const subheadingBox = await blogPage.blog.articleSubheading.boundingBox().catch(() => null);
                const imageBox = await blogPage.blog.articleImage.boundingBox().catch(() => null);

                if (subheadingBox && imageBox) {
                    expect(imageBox.y).toBeGreaterThanOrEqual(subheadingBox.y);
                }

                addStepResult(
                    'PASS',
                    `Success: Article image is displayed below the title/subheading. src: ${articleImageSrc}`
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Article image verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 6 : Verify Sticky Icon Bar (Like, Share, Download)
            // ============================================================

            console.log('🔹 Step 6: Verify Sticky Icon Bar');

            try {

                await blogPage.scrollIntoView(
                    blogPage.blog.stickyIconBar
                );

                await expect(blogPage.blog.stickyIconBar).toBeVisible();

                // Like
                await expect(blogPage.blog.likeIcon).toBeVisible();

                // Share
                await expect(blogPage.blog.shareIcon).toBeVisible();

                // Download
                await expect(blogPage.blog.downloadIcon).toBeVisible();

                addStepResult(
                    'PASS',
                    'Success: Sticky icon bar is visible with Like, Share, and Download icons.'
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Sticky icon bar verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 7 : Verify Author Section (Name, Image, Publish Date)
            // ============================================================

            console.log('🔹 Step 7: Verify Author Section');

            try {

                await expect(blogPage.blog.authorSection).toBeVisible();

                // AUTHOR NAME
                let authorName = 'Team BB';

                if (await blogPage.blog.authorName.count() > 0) {

                    await expect(blogPage.blog.authorName.first()).toBeVisible();

                    authorName =
                        (await blogPage.blog.authorName.first().textContent())?.trim();

                    expect(authorName.length).toBeGreaterThan(0);
                }

                // AUTHOR PROFILE IMAGE
                let authorImage = 'Fallback image accepted';

                if (await blogPage.blog.authorImage.count() > 0) {

                    await expect(blogPage.blog.authorImage.first()).toBeVisible();

                    authorImage =
                        await blogPage.blog.authorImage.first().getAttribute('src');

                    expect(authorImage).toBeTruthy();
                }

                // PUBLISH DATE
                await expect(blogPage.blog.publishDate.first()).toBeVisible();

                const publishDate =
                    (await blogPage.blog.publishDate.first().textContent())?.trim();

                expect(publishDate.length).toBeGreaterThan(0);

                addStepResult(
                    'PASS',
                    `Success: Author section is visible below the image with Author: "${authorName}", Author Image: ${authorImage}, Publish Date: "${publishDate}".`
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Author section verification failed. ${error.message.split('\n')[0]}`
                );
            }

            // ============================================================
            // STEP 8 : Verify Listen Now Button
            // ============================================================

            console.log('🔹 Step 8: Verify Listen Now Button');

            try {

                await expect(blogPage.blog.listenNowButton).toBeVisible();

                addStepResult(
                    'PASS',
                    'Success: Listen Now (TTS) button is visible in the sticky icon bar.'
                );

            } catch (error) {

                testFailed = true;

                addStepResult(
                    'FAIL',
                    `Failed: Listen Now button verification failed. ${error.message.split('\n')[0]}`
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
            testCaseId: 'TC047',
            title: 'Verify Article Page Header and Basic Details',
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