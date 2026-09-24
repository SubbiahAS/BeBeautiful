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

test.describe('Blog Share Functionality', () => {

    test(
        'TC049 - Verify Share Functionality',
        { tag: ['@Blog', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(180000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC049 - Verify Share Functionality');
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
                // STEP 2 : Verify Share Popup
                // ============================================================

                console.log('🔹 Step 2: Verify Share Popup');

                try {

                    await expect(blogPage.blog.shareIcon).toBeVisible();

                    await blogPage.openSharePopup();

                    await expect(blogPage.blog.sharePopup).toBeVisible();
                    await expect(blogPage.blog.sharePopupTitle).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Share popup opened successfully with the title displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share popup verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Share/Close Icon Position (top-right corner)
                // ============================================================

                console.log('🔹 Step 3: Verify Share/Close Icon Position');

                try {

                    const { popupBox, closeBox, isTopRight } =
                        await blogPage.verifyShareCloseIconPosition();

                    if (!popupBox || !closeBox) {
                        throw new Error('Could not determine bounding box of popup or close icon.');
                    }

                    if (!isTopRight) {
                        throw new Error(
                            `Close icon is not positioned in the top-right corner of the popup. popupBox=${JSON.stringify(popupBox)}, closeBox=${JSON.stringify(closeBox)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        'Success: Close icon is positioned correctly in the top-right corner of the share popup.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share/Close icon position verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Share Icons Visible
                // ============================================================

                console.log('🔹 Step 4: Verify Share Icons Visible');

                try {

                    await expect(blogPage.blog.instagramShare).toBeVisible();
                    await expect(blogPage.blog.whatsappShare).toBeVisible();
                    await expect(blogPage.blog.mailShare).toBeVisible();
                    await expect(blogPage.blog.twitterShare).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Instagram, WhatsApp, Mail, and Twitter share icons are displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share icon verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Instagram Share Redirect
                // ============================================================

                console.log('🔹 Step 5: Verify Instagram Share Redirect');

                try {

                    const result = await blogPage.verifyShareRedirect(
                        blogPage.blog.instagramShare,
                        /instagram\.com/i
                    );

                    if (!result.matches) {
                        throw new Error(
                            `Instagram share did not resolve to instagram.com. Result: ${JSON.stringify(result)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: Instagram share opened the correct platform (${result.method}: ${result.url}).`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Instagram share verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify WhatsApp Share Redirect
                // ============================================================

                console.log('🔹 Step 6: Verify WhatsApp Share Redirect');

                try {

                    const result = await blogPage.verifyShareRedirect(
                        blogPage.blog.whatsappShare,
                        /(whatsapp\.com|wa\.me)/i
                    );

                    if (!result.matches) {
                        throw new Error(
                            `WhatsApp share did not resolve to whatsapp.com/wa.me. Result: ${JSON.stringify(result)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: WhatsApp share opened the correct platform (${result.method}: ${result.url}).`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: WhatsApp share verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // // ============================================================
                // // STEP 7 : Verify Mail Share
                // // ============================================================

                // console.log('🔹 Step 7: Verify Mail Share');

                // try {

                //     // mailto: links hand off to the OS mail client rather than
                //     // opening a browser tab, so verify via the href instead of
                //     // waiting for a new page.
                //     const href = await blogPage.getMailShareHref();

                //     if (!href || !/^mailto:/i.test(href)) {
                //         throw new Error(
                //             `Mail share href is not a valid mailto link. href=${href}`
                //         );
                //     }

                //     if (!href.includes(encodeURIComponent(ARTICLE_URL).slice(0, 20)) &&
                //         !decodeURIComponent(href).includes(ARTICLE_URL)) {
                //         console.log('⚠️ Mail share href does not appear to carry the article URL — verify manually.');
                //     }

                //     addStepResult(
                //         'PASS',
                //         `Success: Mail share link is a valid mailto: link (${href}).`
                //     );

                // } catch (error) {

                //     testFailed = true;

                //     addStepResult(
                //         'FAIL',
                //         `Failed: Mail share verification failed. ${error.message.split('\n')[0]}`
                //     );
                // }

                // ============================================================
                // STEP 7 : Verify Twitter Share Redirect
                // ============================================================

                console.log('🔹 Step 7: Verify Twitter Share Redirect');

                try {

                    const result = await blogPage.verifyShareRedirect(
                        blogPage.blog.twitterShare,
                        /(twitter\.com|x\.com)/i
                    );

                    if (!result.matches) {
                        throw new Error(
                            `Twitter share did not resolve to twitter.com/x.com. Result: ${JSON.stringify(result)}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: Twitter share opened the correct platform (${result.method}: ${result.url}).`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Twitter share verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 8 : Verify Copy Link Copies Correct URL & Opens Same Article
                // ============================================================

                console.log('🔹 Step 8: Verify Copy Link Functionality');

                try {

                    await expect(blogPage.blog.copyLinkInput).toBeVisible();
                    await expect(blogPage.blog.copyLinkButton).toBeVisible();

                    const currentArticleUrl = page.url();

                    const { copiedUrl, newUrl, matches } =
                        await blogPage.verifyCopyLinkOpensArticle(currentArticleUrl);

                    if (!copiedUrl) {
                        throw new Error('Copy link input did not contain a URL.');
                    }

                    if (!matches) {
                        throw new Error(
                            `Copied link did not open the same article page. copiedUrl=${copiedUrl}, openedUrl=${newUrl}, expected=${currentArticleUrl}`
                        );
                    }

                    addStepResult(
                        'PASS',
                        `Success: Copy Link field shows the correct article URL (${copiedUrl}), and opening it navigates to the same article page.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Copy link verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 9 : Verify Closing Share Popup
                // ============================================================

                console.log('🔹 Step 9: Verify Closing Share Popup');

                try {

                    await blogPage.closeSharePopup();

                    await expect(blogPage.blog.sharePopup).toBeHidden({
                        timeout: 5000
                    });

                    addStepResult(
                        'PASS',
                        'Success: Share popup closed successfully using the close button.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Share popup close verification failed. ${error.message.split('\n')[0]}`
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
                testCaseId: 'TC049',
                title: 'Verify Share Functionality',
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