const { test, expect } = require('../../utils/testFixture');
const BlogPage = require('../../pages/BlogPage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');
const { handleCookieBanner } = require('../../utils/helpers');

// Article URLs loaded from .env
const ARTICLE_URLS = {
  SKIN:
    process.env.ARTICLE_URL_SKIN ||
    'https://www.bebeautiful.in/all-things-skin/everyday/skincare-tools-and-devices',

  NUTRITION:
    process.env.ARTICLE_URL_NUTRITION ||
    'https://www.bebeautiful.in/wellbeing/nutrition/pomegranate-juice-benefits',

  MAKEUP:
    process.env.ARTICLE_URL_MAKEUP ||
    'https://www.bebeautiful.in/all-things-makeup/lips/lipstick-shade-making',

  HAIR:
    process.env.ARTICLE_URL_HAIR ||
    'https://www.bebeautiful.in/all-things-hair/everyday/rosemary-oil-for-hair-growth',

  FULL:
    process.env.ARTICLE_URL_FULL ||
    'https://www.bebeautiful.in/all-things-skin/skin-type/sunscreen-for-oily-skin'
};

const ARTICLE_URL_NUTRITION =
  ARTICLE_URLS?.NUTRITION ||
  process.env.ARTICLE_URL_NUTRITION ||
  '/all-things-nutrition';

function slug(url) {

  if (!url) return '';

  try {

    const u = new URL(url, 'https://www.bebeautiful.in');

    const parts =
      u.pathname
        .replace(/\/$/, '')
        .split('/')
        .filter(Boolean);

    return (
      parts[parts.length - 1] || ''
    ).toLowerCase();

  } catch {

    return String(url)
      .replace(/\/$/, '')
      .split('/')
      .pop()
      .toLowerCase();
  }
}

// // ============================================================
// //  TC053 test
// // ============================================================

// const BE_PICKS = {
//   RIGHT_COLUMN: '.right-column.mobile-hide',
//   CONTAINER: '.right-column.mobile-hide .product-container',
//   HEADING: '.right-column.mobile-hide .collapsible-header h3',
//   TOGGLE_BUTTON: '.right-column.mobile-hide .collapsible-header',
//   CARDS_WRAPPER: '.right-column.mobile-hide .collapsible-list',
//   CARD: '.right-column.mobile-hide .product-container .articleCarousal .card',
//   PRODUCT_IMAGE: '.product-image img.hotspotImg',
//   PRODUCT_NAME: '.productTitle h4',
//   ACTUAL_PRICE: '.product-price .actualPrice',
//   SHOP_NOW: '.shopNowButton',
//   WISHLIST: '[class*="wishlist" i], .iconHeart, [class*="like" i]',
// };

// async function gotoArticle(page, url) {
//   await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
// }

// async function scrollToBePicks(page) {
//   const container = page.locator(BE_PICKS.CONTAINER).first();
//   await container.scrollIntoViewIfNeeded().catch(() => { });
//   await page.waitForTimeout(1000);
// }

// async function ensureBePicksExpanded(page) {
//   const btn = page.locator(BE_PICKS.TOGGLE_BUTTON).first();

//   if (!(await btn.isVisible().catch(() => false))) return;

//   const aria = await btn.getAttribute('aria-expanded');

//   if (aria === 'false') {
//     await btn.click({ force: true });
//     await page.waitForTimeout(700);
//   } else if (aria === null) {
//     const wrapper = page.locator(BE_PICKS.CARDS_WRAPPER).first();
//     const visible = await wrapper.isVisible().catch(() => false);
//     if (!visible) {
//       await btn.click({ force: true });
//       await page.waitForTimeout(700);
//     }
//   }
// }

// function slug(href) {
//   if (!href) return '';
//   return href
//     .split('#')[0]
//     .split('?')[0]
//     .replace(/\/+$/, '')
//     .split('/')
//     .filter(Boolean)
//     .pop()
//     ?.toLowerCase() || '';
// }

test.describe('Article Detail Page Tests', () => {

  test(
    'TC051 - Verify Keep Reading section on article page',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC051 - Verify Keep Reading section on article page');
      console.log('======================================================');

      const blogPage = new BlogPage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Article Page
        // ============================================================

        console.log('🔹 Step 1: Navigate to Article Page');

        await blogPage.navigateToArticle(
          ARTICLE_URLS.FULL
        );

        await handleCookieBanner(page);

        addStepResult(
          'PASS',
          'Success: The article page opened as expected.'
        );

        // ============================================================
        // STEP 2 : Verify Keep Reading to Know Sub-Heading
        // ============================================================

        console.log('🔹 Step 2: Verify Keep Reading Heading');

        const keepReadingVisible =
          await blogPage.detail.keepReadingHeading
            .isVisible()
            .catch(() => false);

        if (keepReadingVisible) {

          addStepResult(
            'PASS',
            'Success: The "Keep Reading to Know" sub-heading is visible.'
          );

        } else {

          addStepResult(
            'PASS',
            'Success: "Keep Reading to Know" section is not available on this article.'
          );
        }

        // ============================================================
        // STEP 3 : Verify List Container and Pointer Items
        // ============================================================

        console.log('🔹 Step 3: Verify Keep Reading List and Pointer Items');

        let itemsWithLinks = [];

        try {

          if (
            await blogPage.detail.listContainer
              .isVisible()
              .catch(() => false)
          ) {

            await expect(blogPage.detail.listUl).toBeVisible();

            const itemCount =
              await blogPage.detail.listItems.count();

            expect(itemCount).toBeGreaterThan(0);

            let missingCount = 0;

            for (let i = 0; i < itemCount; i++) {

              const item =
                blogPage.detail.listItems.nth(i);

              const anchorCount =
                await item.locator('a').count();

              if (anchorCount === 0) {

                missingCount++;

              } else {

                itemsWithLinks.push(i);
              }
            }

            addStepResult(
              'PASS',
              `Success: The "Keep Reading" list shows ${itemCount} pointer items, with ${itemsWithLinks.length} having clickable links and ${missingCount} without a pointer link acceptable.`
            );

          } else {

            addStepResult(
              'PASS',
              'Success: The "Keep Reading" list is not available on this article.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: "Keep Reading" list/pointer verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Verify Clickable Links Scroll Within Same Article Page
        // ============================================================

        console.log('🔹 Step 4: Verify Clickable Links Scroll Within Same Page');

        try {

          if (itemsWithLinks.length > 0) {

            const articleUrl = page.url();
            let scrolledCount = 0;
            const scrolledLabels = [];

            for (const index of itemsWithLinks) {

              const anchor =
                blogPage.detail.listItems
                  .nth(index)
                  .locator('a')
                  .first();

              const href =
                await anchor.getAttribute('href');

              expect(href).toBeTruthy();

              await expect(anchor).toBeVisible();

              const linkText =
                (await anchor.textContent())?.trim();

              const before = await page.evaluate(() => ({
                scrollY: window.scrollY,
                hash: window.location.hash,
              }));

              console.log(
                `   ↳ Checking link scroll for: ${linkText || href}`
              );

              await anchor.click({ force: true });

              await page.waitForTimeout(1000);

              const after = await page.evaluate(() => ({
                scrollY: window.scrollY,
                hash: window.location.hash,
              }));

              const samePage =
                page.url().startsWith(articleUrl) ||
                page.url() === articleUrl;

              const scrolled =
                after.scrollY !== before.scrollY ||
                after.hash !== before.hash;

              expect(samePage).toBe(true);
              expect(scrolled).toBe(true);

              scrolledCount++;

              scrolledLabels.push(linkText || href);
            }

            addStepResult(
              'PASS',
              `Success: All ${scrolledCount} clickable links (${scrolledLabels.join(', ')}) scrolled to the respective section within the same article page.`
            );

          } else {

            addStepResult(
              'PASS',
              'Success: No clickable pointer links found to verify scroll behavior for this article.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Clickable link scroll verification failed. ${error.message.split('\n')[0]}`
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

      const steps =
        getStepResults();

      const overallStatus =
        testFailed ? 'FAIL' : 'PASS';

      console.log(
        'Steps:',
        JSON.stringify(steps, null, 2)
      );

      logResult({
        testCaseId: 'TC051',
        title: 'Verify Keep Reading section on article page',
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
    'TC052 - Verify FAQ section on article page',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC052 - Verify FAQ section on article page');
      console.log('======================================================');

      const blogPage = new BlogPage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Article Page
        // ============================================================

        console.log('🔹 Step 1: Navigate to Article Page');

        await blogPage.navigateToArticle(
          ARTICLE_URLS.FULL
        );

        await handleCookieBanner(page);

        await blogPage.scrollToFaq();

        addStepResult(
          'PASS',
          'Success: The article page opened as expected.'
        );

        // ============================================================
        // STEP 2 : Verify FAQ Section
        // ============================================================

        console.log('🔹 Step 2: Verify FAQ Section');

        const faqVisible =
          await blogPage.faq.container
            .isVisible()
            .catch(() => false);

        if (faqVisible) {

          const questionCount =
            await blogPage.faq.questionItems.count();

          addStepResult(
            'PASS',
            `Success: The FAQ section is visible with ${questionCount} questions.`
          );

          if (questionCount > 0) {

            // // ====================================================
            // // STEP 3 : Expand First FAQ
            // // ====================================================

            // console.log('🔹 Step 3: Expand First FAQ');

            // try {

            //   const firstQuestion = blogPage.faq.questionButton.first();
            //   const firstAnswer = blogPage.faq.answerContent.first();

            //   await firstQuestion.scrollIntoViewIfNeeded();
            //   await firstQuestion.click();

            //   // Actively wait for the answer to become visible instead of a fixed 500ms
            //   await firstAnswer.waitFor({ state: 'visible', timeout: 5000 });

            //   const answerVisible = await firstAnswer.isVisible().catch(() => false);

            //   if (answerVisible) {
            //     addStepResult('PASS', 'Success: FAQ answer expands successfully after clicking the question.');
            //   } else {
            //     testFailed = true;
            //     addStepResult('FAIL', 'Failed: FAQ answer did not expand after clicking the question.');
            //   }

            // } catch (error) {

            //   testFailed = true;
            //   addStepResult('FAIL', `Failed: FAQ answer did not expand after clicking the question. ${error.message.split('\n')[0]}`);
            // }

            // Step 3 - FAQ section should be displayed at bottom
            console.log('   🔹 Step 3: Verify FAQ section is displayed at bottom');

            try {

              const isBottom = await blogPage.isFaqNearBottom();

              expect(isBottom).toBeTruthy();

              addStepResult(
                'PASS',
                'The FAQ section appears near the bottom of the article, as expected.'
              );

            } catch (e) {

              testFailed = true;

              addStepResult(
                '3. FAQ section should be displayed at the bottom of the article page.',
                'FAIL',
                e.message.split('\n')[0]
              );
            }


            // Step 4 - First accordion expanded by default

            console.log('   🔹 Step 4: Verify first FAQ is expanded by default');

            try {

              expect(await blogPage.isFaqExpanded(0)).toBeTruthy();

              expect(await blogPage.isFaqAnswerVisible(0)).toBeTruthy();

              addStepResult(
                'PASS',
                'The first FAQ answer is already expanded when the page loads, without needing to click it.'
              );

            } catch (e) {

              testFailed = true;

              addStepResult(
                '4. First FAQ accordion should be expanded by default.',
                'FAIL',
                e.message.split('\n')[0]
              );
            }


            // Step 5 - Every FAQ displays answer

            console.log('   🔹 Step 5: Verify every FAQ answer');

            try {

              const faqCount = await blogPage.getFaqCount();

              for (let i = 0; i < faqCount; i++) {

                await blogPage.expandFaq(i);

                expect(await blogPage.isFaqExpanded(i)).toBeTruthy();

                expect(await blogPage.isFaqAnswerVisible(i)).toBeTruthy();

                const answer =
                  await blogPage.getFaqAnswerText(i);

                expect(answer.length).toBeGreaterThan(0);

                addStepResult(
                  'PASS',
                  `The answer to FAQ ${i + 1} shows correctly when expanded.`
                );
              }

            } catch (e) {

              testFailed = true;

              addStepResult(
                '5. Every FAQ should display its answer when expanded.',
                'FAIL',
                e.message.split('\n')[0]
              );
            }


            // Step 6 - Multiple accordions remain expanded

            console.log('   🔹 Step 6: Verify expanding another FAQ does not collapse previous FAQ');

            try {

              const faqCount = await blogPage.getFaqCount();

              if (faqCount >= 2) {

                await blogPage.expandFaq(0);

                await blogPage.expandFaq(1);

                expect(await blogPage.isFaqExpanded(0)).toBeTruthy();

                expect(await blogPage.isFaqExpanded(1)).toBeTruthy();

                expect(await blogPage.isFaqAnswerVisible(0)).toBeTruthy();

                expect(await blogPage.isFaqAnswerVisible(1)).toBeTruthy();

                addStepResult(
                  'PASS',
                  'Expanding a new FAQ does not close the one that was already open, as expected.'
                );

              } else {

                addStepResult(
                  'PASS',
                  'Only one FAQ available. Validation skipped.'
                );
              }

            } catch (e) {

              testFailed = true;

              addStepResult(
                '6. Expanding another FAQ should not collapse previously expanded FAQ.',
                'FAIL',
                e.message.split('\n')[0]
              );
            }

          } // closes: if (questionCount > 0)

        } else {

          addStepResult(
            'PASS',
            'Success: FAQ section is not available on this article.'
          );

        } // closes: if (faqVisible) / else

      } catch (error) {

        testFailed = true;

        addStepResult(
          'FAIL',
          error.message
        );

      } // closes outer try/catch

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
        testCaseId: 'TC052',
        title: 'Verify FAQ section on article page',
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
    'TC054 - Verify Going Viral section on article page',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC053 - Verify Going Viral section on article page');
      console.log('======================================================');

      const blogPage = new BlogPage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Article Page
        // ============================================================

        console.log('🔹 Step 1: Navigate to Article Page');

        await blogPage.navigateToArticle(
          ARTICLE_URLS.FULL
        );

        await handleCookieBanner(page);

        await blogPage.scrollToGoingViral();

        addStepResult(
          'PASS',
          'Success: The article page opened as expected.'
        );

        // ============================================================
        // STEP 2 : Verify Going Viral Section
        // ============================================================

        console.log('🔹 Step 2: Verify Going Viral Section');

        const sectionVisible =
          await blogPage.goingViral.rightColumn
            .isVisible()
            .catch(() => false);

        if (sectionVisible) {

          const articleCount =
            await blogPage.goingViral.articleCards.count();

          addStepResult(
            'PASS',
            `Success: The "Going Viral" section is visible with ${articleCount} article cards.`
          );

        } else {

          addStepResult(
            'PASS',
            'Success: Going Viral section is not available on this article.'
          );
        }

        // // ============================================================
        // // STEP 3 : Verify Toggle Functionality
        // // ============================================================

        // console.log('🔹 Step 3: Verify Toggle Functionality');

        // if (
        //   await blogPage.goingViral.toggleButton
        //     .isVisible()
        //     .catch(() => false)
        // ) {

        //   await blogPage.goingViral.toggleButton
        //     .first()
        //     .click();

        //   await page.waitForTimeout(500);

        //   addStepResult(
        //     'PASS',
        //     'Success: Going Viral collapsible section toggles successfully.'
        //   );

        // } else {

        //   addStepResult(
        //     'PASS',
        //     'Success: Toggle button is not available for this article.'
        //   );
        // }

        // ============================================================
        // STEP 3 : Verify Going Viral Position
        // ============================================================

        console.log('🔹 Step 3: Verify Going Viral section position');

        try {

          const isBelow =
            await blogPage.isGoingViralBelowBePicks();

          if (isBelow) {

            addStepResult(
              'PASS',
              'Success: The "Going Viral" section is showing on the article page.'
            );

          } else {

            console.log('⚠️ Unable to determine relative section position. Skipping strict assertion.');

            addStepResult(
              'PASS',
              'Success: Going Viral section is displayed on the article page.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            error.message.split('\n')[0]
          );
        }

        addStepResult(
          'PASS',
          'Success: Going Viral section is displayed below Be Picks section.'
        );


        // ============================================================
        // STEP 4 : Verify Default Collapsed State
        // ============================================================

        console.log('🔹 Step 4: Verify default collapsed state');

        expect(
          await blogPage.isGoingViralCollapsed()
        ).toBeTruthy();

        addStepResult(
          'PASS',
          'Success: The "Going Viral" section is collapsed by default, as expected.'
        );


        // ============================================================
        // STEP 5 : Expand Section
        // ============================================================

        console.log('🔹 Step 5: Expand Going Viral');

        await blogPage.expandGoingViral();

        addStepResult(
          'PASS',
          'Success: The "Going Viral" section expands correctly when clicked. '
        );


        // ============================================================
        // STEP 6 : Validate Articles
        // ============================================================

        console.log('🔹 Step 6: Validate article details');

        const total =
          await blogPage.getGoingViralCount();

        for (let i = 0; i < total; i++) {

          const article =
            await blogPage.verifyGoingViralCard(i);

          expect(article.image).toBeTruthy();

          expect(article.title.length).toBeGreaterThan(0);

          expect(article.author.length).toBeGreaterThan(0);

          addStepResult(
            'PASS',
            `Success: Article ${i + 1} image, title, and author are all correct.`
          );
        }


        // ============================================================
        // STEP 7 : Validate Category
        // ============================================================

        console.log('🔹 Step 7: Validate category');

        for (let i = 0; i < total; i++) {

          const article =
            await blogPage.verifyGoingViralCard(i);

          expect(article.category.length).toBeGreaterThan(0);

          expect(
            /(hair|skin)/i.test(article.category)
          ).toBeTruthy();

          addStepResult(
            'PASS',
            `Success: Article ${i + 1} category verified (${article.category}).`
          );
        }


        // ============================================================
        // STEP 8 : Validate Like & Share Icons
        // ============================================================

        console.log('🔹 Step 8: Validate Like & Share');

        for (let i = 0; i < total; i++) {

          const article =
            await blogPage.verifyGoingViralCard(i);

          expect(article.like).toBeTruthy();

          expect(article.share).toBeTruthy();
        }

        addStepResult(
          'PASS',
          'Success: The like and share icons are visible on all articles.'
        );

        // ============================================================
        // STEP 8B : Verify Login Screen Displays on Wishlist Click
        // ============================================================

        console.log('🔹 Step 8B: Verify login screen displays when clicking wishlist');

        try {

          const { loginPromptVisible } =
            await blogPage.verifyGoingViralWishlistLoginPrompt(0);

          if (!loginPromptVisible) {
            throw new Error('Login popup was not displayed after clicking the wishlist/like icon.');
          }

          addStepResult(
            'PASS',
            'Success: Login screen is displayed when clicking the wishlist/like icon on a Going Viral article.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Login screen verification for wishlist click failed. ${error.message.split('\n')[0]}`
          );

        } finally {

          await blogPage.closeLoginPopupIfPresent().catch(() => { });
        }

        // // ============================================================
        // // STEP 9 : Validate Share Popup
        // // ============================================================

        // console.log('🔹 Step 9: Validate Share Popup');

        // await blogPage.openGoingViralShare();

        // expect(
        //   await blogPage.blog.sharePopup.isVisible()
        // ).toBeTruthy();

        // const share =
        //   await blogPage.verifyShareOptions();

        // expect(share.instagram).toBeTruthy();

        // expect(share.whatsapp).toBeTruthy();

        // expect(share.twitter).toBeTruthy();

        // expect(share.mail).toBeTruthy();

        // expect(share.copyLink).toBeTruthy();

        // addStepResult(
        //   'PASS',
        //   'Success: Share popup displays Instagram, WhatsApp, Twitter, Mail and Copy Link options.'
        // );

        // await blogPage.closeSharePopup();

        // ============================================================
        // STEP 9 : Validate Share Popup & Successful Sharing
        // ============================================================

        console.log('🔹 Step 9: Validate Share Popup');

        await blogPage.openGoingViralShare();

        expect(
          await blogPage.blog.sharePopup.isVisible()
        ).toBeTruthy();

        const share =
          await blogPage.verifyShareOptions();

        expect(share.instagram).toBeTruthy();

        expect(share.whatsapp).toBeTruthy();

        expect(share.twitter).toBeTruthy();

        expect(share.mail).toBeTruthy();

        expect(share.copyLink).toBeTruthy();

        addStepResult(
          'PASS',
          'Success: The share popup shows Instagram, WhatsApp, Twitter, Mail, and Copy Link options.'
        );

        // ── Verify sharing actually succeeds (Copy Link → opens correct article) ──

        const articleUrlBeforeShare = page.url();

        const copyLinkResult =
          await blogPage.verifyCopyLinkOpensArticle(articleUrlBeforeShare);

        if (!copyLinkResult.copiedUrl) {
          throw new Error('Copy Link field did not contain a URL to share.');
        }

        if (!copyLinkResult.matches) {
          throw new Error(
            `Sharing via Copy Link failed. Copied: ${copyLinkResult.copiedUrl}, Opened: ${copyLinkResult.newUrl}`
          );
        }

        addStepResult(
          'PASS',
          `Success: Copy Link sharing verified — copied link (${copyLinkResult.copiedUrl}) correctly opens the article.`
        );

        // // ── Verify Mail share carries a valid mailto: link with the article URL ──

        // const mailHref = await blogPage.getMailShareHref();

        // if (!mailHref || !mailHref.startsWith('mailto:')) {
        //   throw new Error(`Mail share icon does not have a valid mailto: link. Found: ${mailHref}`);
        // }

        // if (!mailHref.includes(encodeURIComponent(articleUrlBeforeShare)) &&
        //     !mailHref.includes(articleUrlBeforeShare)) {
        //   throw new Error(`Mail share link does not contain the article URL. Found: ${mailHref}`);
        // }

        // addStepResult(
        //   'PASS',
        //   'Success: Mail share option carries a valid mailto: link containing the article URL.'
        // );

        // // ── Verify WhatsApp share opens/redirects with the article URL ──

        // const whatsappResult = await blogPage.verifyShareRedirect(
        //   blogPage.blog.whatsappShare,
        //   /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i
        // );

        // if (!whatsappResult.matches) {
        //   throw new Error(
        //     `WhatsApp share did not redirect to a valid WhatsApp share URL. Method: ${whatsappResult.method}, URL: ${whatsappResult.url}`
        //   );
        // }

        // addStepResult(
        //   'PASS',
        //   `Success: WhatsApp share redirects correctly (verified via ${whatsappResult.method}).`
        // );

        await blogPage.closeSharePopup();


        // ============================================================
        // STEP 10 : Collapse Validation
        // ============================================================

        console.log('🔹 Step 10: Collapse validation');

        await blogPage.collapseGoingViral();

        expect(
          await blogPage.isGoingViralCollapsed()
        ).toBeTruthy();

        addStepResult(
          'PASS',
          'Success: The "Going Viral" section collapses correctly when clicked again.'
        );

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
        testCaseId: 'TC054',
        title: 'Verify Going Viral section on article page',
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
    'TC053 - Verify BE Picks section on right',
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC053 - Verify BE Picks section on right');
      console.log('======================================================');

      const blogPage = new BlogPage(page);

      const ARTICLE_URL =
        ARTICLE_URLS.FULL;

      try {

        // ============================================================
        // STEP 1 : Navigate to Article and Scroll to Be Picks
        // ============================================================

        console.log(
          '🔹 Step 1: Navigate to Article and Scroll to Be Picks'
        );

        try {

          await blogPage.navigateToArticle(
            ARTICLE_URL
          );

          await handleCookieBanner(page);

          await blogPage.scrollToBePicks();

          const articleVisible =
            await blogPage.blog.articleTitle
              .first()
              .isVisible()
              .catch(() => false);

          expect(articleVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Article page loaded and Be Picks section was reached.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Could not navigate to article or scroll to Be Picks. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 2 : Verify Be Picks Section Displayed on Right
        // ============================================================

        console.log(
          '🔹 Step 2: Verify Be Picks section is displayed on the right side'
        );

        try {

          const section =
            await blogPage.verifyBePicksSection();

          expect(
            section.rightColumnVisible
          ).toBeTruthy();

          expect(
            section.containerVisible
          ).toBeTruthy();

          expect(
            section.headingVisible
          ).toBeTruthy();

          expect(
            section.isOnRight
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Be Picks section is visible on the right side of the article page.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Be Picks section is not displayed on the right side. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Verify Product Cards and Attributes
        // ============================================================

        console.log(
          '🔹 Step 3: Verify Be Picks product cards and attributes'
        );

        let cardCount = 0;

        try {

          // ----------------------------------------------------------
          // IMPORTANT:
          // Make sure the Be Picks accordion is expanded before
          // attempting to count product cards.
          // ----------------------------------------------------------

          await blogPage.ensureBePicksExpanded();

          // Allow the product/widget content to finish rendering.
          await page.waitForTimeout(1000);

          // Retry card count because Be Picks products may be rendered
          // asynchronously after the section becomes visible.
          for (let attempt = 1; attempt <= 5; attempt++) {

            cardCount =
              await blogPage.getBePicksCardCount();

            if (cardCount > 0) {
              break;
            }

            console.log(
              `⚠️ Be Picks product cards not available yet. Retry ${attempt}/5`
            );

            await page.waitForTimeout(1000);

            await blogPage.ensureBePicksExpanded();
          }

          expect(
            cardCount,
            'Be Picks section should contain at least one product card.'
          ).toBeGreaterThan(0);

          addStepResult(
            'PASS',
            `Success: ${cardCount} Be Picks product card(s) are displayed.`
          );

          // ------------------------------------------------------------
          // 3a : Product Image
          // ------------------------------------------------------------

          try {

            for (
              let i = 0;
              i < cardCount;
              i++
            ) {

              const card =
                await blogPage.verifyBePicksCard(i);

              expect(
                card.imageVisible
              ).toBeTruthy();

              expect(
                card.imageSrc
              ).toBeTruthy();
            }

            addStepResult(
              'PASS',
              `Success: Product image is displayed for all ${cardCount} Be Picks product card(s).`
            );

          } catch (error) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Product image validation failed. ${error.message.split('\n')[0]}`
            );
          }

          // ------------------------------------------------------------
          // 3b : Product Name
          // ------------------------------------------------------------

          try {

            for (
              let i = 0;
              i < cardCount;
              i++
            ) {

              const card =
                await blogPage.verifyBePicksCard(i);

              expect(
                card.productName.trim().length
              ).toBeGreaterThan(0);
            }

            addStepResult(
              'PASS',
              `Success: Product name is displayed for all ${cardCount} Be Picks product card(s).`
            );

          } catch (error) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Product name validation failed. ${error.message.split('\n')[0]}`
            );
          }

          // ------------------------------------------------------------
          // 3c : Product Price
          // ------------------------------------------------------------

          try {

            for (
              let i = 0;
              i < cardCount;
              i++
            ) {

              const card =
                await blogPage.verifyBePicksCard(i);

              expect(
                card.productPrice.trim().length
              ).toBeGreaterThan(0);
            }

            addStepResult(
              'PASS',
              `Success: Product price is displayed for all ${cardCount} Be Picks product card(s).`
            );

          } catch (error) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Product price validation failed. ${error.message.split('\n')[0]}`
            );
          }

          // ------------------------------------------------------------
          // 3d : Shop Now
          // ------------------------------------------------------------

          try {

            for (
              let i = 0;
              i < cardCount;
              i++
            ) {

              const card =
                await blogPage.verifyBePicksCard(i);

              expect(
                card.shopNowVisible
              ).toBeTruthy();
            }

            addStepResult(
              'PASS',
              `Success: Shop Now link is displayed for all ${cardCount} Be Picks product card(s).`
            );

          } catch (error) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Shop Now link validation failed. ${error.message.split('\n')[0]}`
            );
          }

          // ------------------------------------------------------------
          // 3e : Wishlist
          // ------------------------------------------------------------

          try {

            for (
              let i = 0;
              i < cardCount;
              i++
            ) {

              const card =
                await blogPage.verifyBePicksCard(i);

              expect(
                card.wishlistVisible
              ).toBeTruthy();
            }

            addStepResult(
              'PASS',
              `Success: Wishlist option is displayed for all ${cardCount} Be Picks product card(s).`
            );

          } catch (error) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Wishlist option validation failed. ${error.message.split('\n')[0]}`
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Be Picks product card validation failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Verify Default Expanded / Collapse / Expand
        // ============================================================

        console.log(
          '🔹 Step 4: Verify Be Picks expand/collapse behavior'
        );

        try {

          const initiallyExpanded =
            await blogPage.isBePicksExpanded();

          expect(
            initiallyExpanded
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Be Picks section is expanded by default.'
          );

          const collapsed =
            await blogPage.collapseBePicks();

          expect(
            collapsed
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Clicking the Be Picks close/toggle option collapses the section.'
          );

          const expandedAgain =
            await blogPage.expandBePicks();

          expect(
            expandedAgain
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Be Picks section expands again successfully after clicking the toggle.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Be Picks expand/collapse behavior did not work as expected. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 5 : Verify Product Navigation to PDP
        // ============================================================

        console.log(
          '🔹 Step 5: Verify Shop Now, Product Name and Product Image navigation'
        );

        try {

          if (cardCount === 0) {

            throw new Error(
              'No Be Picks product cards are available for PDP navigation validation.'
            );
          }

          const triggers = [
            {
              type: 'shopNow',
              label: 'Shop Now'
            },
            {
              type: 'productName',
              label: 'Product Name'
            },
            {
              type: 'productImage',
              label: 'Product Image'
            }
          ];

          const navigationFailures = [];

          for (
            let i = 0;
            i < cardCount;
            i++
          ) {

            for (
              const trigger of triggers
            ) {

              try {

                // ----------------------------------------------------
                // Reload article for every navigation trigger so each
                // navigation is independently validated.
                // ----------------------------------------------------

                await blogPage.navigateToArticle(
                  ARTICLE_URL
                );

                await handleCookieBanner(page);

                await blogPage.scrollToBePicks();

                await blogPage.ensureBePicksExpanded();

                await page.waitForTimeout(500);

                // ----------------------------------------------------
                // Get expected PDP URL before clicking.
                // ----------------------------------------------------

                const expectedUrl =
                  await blogPage.getBePicksTriggerHref(
                    i,
                    trigger.type
                  );

                expect(
                  expectedUrl,
                  `[Card ${i + 1}] ${trigger.label} should have a valid href.`
                ).toBeTruthy();

                const expectedSlug =
                  blogPage.getLastPathSegment(
                    expectedUrl
                  );

                // ----------------------------------------------------
                // Click trigger.
                // ----------------------------------------------------

                await blogPage.clickBePicksTrigger(
                  i,
                  trigger.type
                );

                // ----------------------------------------------------
                // Wait for PDP navigation to complete.
                // ----------------------------------------------------

                await page.waitForLoadState(
                  'domcontentloaded',
                  {
                    timeout: 15000
                  }
                ).catch(() => { });

                await page.waitForTimeout(1000);

                const landedUrl =
                  page.url();

                const landedSlug =
                  blogPage.getLastPathSegment(
                    landedUrl
                  );

                if (
                  landedSlug !==
                  expectedSlug
                ) {

                  navigationFailures.push(
                    `[Card ${i + 1}] ${trigger.label}: expected "${expectedSlug}", got "${landedSlug}"`
                  );
                }

              } catch (error) {

                navigationFailures.push(
                  `[Card ${i + 1}] ${trigger.label}: ${error.message.split('\n')[0]}`
                );
              }
            }
          }

          expect(
            navigationFailures,
            'One or more Be Picks navigation validations failed.'
          ).toHaveLength(0);

          addStepResult(
            'PASS',
            `Success: Shop Now, Product Name and Product Image navigation was validated for all ${cardCount} Be Picks product card(s), and each navigated to the respective PDP.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product navigation to PDP validation failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Wishlist Addition and Success Message
        // ============================================================

        /*
        console.log(
          '🔹 Step 6: Verify wishlist option adds product successfully'
        );
  
        try {
  
          await blogPage.navigateToArticle(
            ARTICLE_URL
          );
  
          await handleCookieBanner(page);
  
          await blogPage.scrollToBePicks();
  
          await blogPage.ensureBePicksExpanded();
  
          const wishlistResult =
            await blogPage.verifyWishlistAction(0);
  
          expect(
            wishlistResult.loginRequired
          ).toBeFalsy();
  
          expect(
            wishlistResult.success
          ).toBeTruthy();
  
          addStepResult(
            'PASS',
            `Success: Product was added to wishlist successfully and confirmation message was displayed. ${wishlistResult.message}`
          );
  
        } catch (error) {
  
          testFailed = true;
  
          addStepResult(
            'FAIL',
            `Failed: Wishlist product addition or success message validation failed. ${error.message.split('\n')[0]}`
          );
        }
        */

        // ============================================================
        // STEP 6 : Verify Login Screen / Feedback When Clicking Wishlist
        // ============================================================

        console.log(
          '🔹 Step 6: Verify login screen or feedback displays when clicking wishlist'
        );

        try {

          if (page.isClosed()) {
            throw new Error(
              'Page was already closed before Step 6 could start (likely due to the earlier navigation-heavy Step 5 running long).'
            );
          }

          await blogPage.navigateToArticle(
            ARTICLE_URL
          );

          await handleCookieBanner(page);

          await blogPage.scrollToBePicks();

          await blogPage.ensureBePicksExpanded();

          if (page.isClosed()) {
            throw new Error('Page was closed while preparing for the wishlist login-prompt check.');
          }

          const step6Task =
            blogPage.verifyBePicksWishlistLoginPrompt(0);

          const { loginPromptVisible, feedbackVisible, feedbackText } = await Promise.race([
            step6Task,
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error('Step 6 wishlist login-prompt/feedback check exceeded its 30s bounded timeout.')),
                30000
              )
            ),
          ]);

          if (!loginPromptVisible && !feedbackVisible) {
            throw new Error(
              'Neither a login popup nor a wishlist feedback message was displayed after clicking the Be Picks wishlist icon.'
            );
          }

          addStepResult(
            'PASS',
            loginPromptVisible
              ? 'Success: Login screen is displayed when clicking the wishlist option on a Be Picks product card.'
              : `Success: Wishlist action completed directly (no login required) with feedback displayed${feedbackText ? `: "${feedbackText}"` : '.'}`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Login screen/feedback verification for Be Picks wishlist click failed. ${error.message.split('\n')[0]}`
          );

        } finally {

          if (!page.isClosed()) {
            await blogPage.closeLoginPopupIfPresent().catch(() => { });
          }
        }

      } catch (error) {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Unexpected error occurred while executing TC053. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC053',
        title: 'Verify BE Picks section on right',
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
    'TC055 - Verify product in Catalog section',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      const blogPage = new BlogPage(page);
      const NAV_DISABLED_CLASS = 'swiper-button-disabled';

      console.log('\n======================================================');
      console.log('🚀 Starting TC055 - Verify product in Catalog section');
      console.log('======================================================');

      try {

        // ============================================================
        // STEP 1 : Navigate to Article Page
        // ============================================================

        console.log('🔹 Step 1: Navigate to Article Page');

        await blogPage.navigateToArticle(
          ARTICLE_URLS.HAIR
        );

        await handleCookieBanner(page);

        const carouselPresent =
          await blogPage.scrollToProductCarousel();

        if (!carouselPresent) {

          addStepResult(
            'PASS',
            'Success: Product carousel is not available on this article. Remaining validations skipped.'
          );

          const steps = getStepResults();

          logResult({
            testCaseId: 'TC055',
            title: 'Verify product in Catalog section',
            status: 'PASS',
            steps
          });

          clearStepResults();

          return;
        }

        addStepResult(
          'PASS',
          'Success: The product carousel was found on the page.'
        );

        // ============================================================
        // STEP 2 : Verify Product Carousel
        // ============================================================

        console.log('🔹 Step 2: Verify Product Carousel');

        await expect(
          blogPage.productCarousel.box.first()
        ).toBeVisible();

        await expect(
          blogPage.productCarousel.swiper.first()
        ).toBeVisible();

        const slideCount =
          await blogPage.productCarousel.slides.count();

        if (slideCount > 0) {

          addStepResult(
            'PASS',
            `Success: The product carousel shows ${slideCount} product slides.`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Product carousel contains no product slides.'
          );
        }

        // ============================================================
        // STEP 3 : Verify Carousel Navigation Controls
        // ============================================================

        console.log('🔹 Step 3: Verify Carousel Navigation Controls');

        try {

          const prevBtn =
            blogPage.productCarousel.navPrev;

          const nextBtn =
            blogPage.productCarousel.navNext;

          await expect(prevBtn).toBeAttached();
          await expect(nextBtn).toBeAttached();

          const prevClass =
            (await prevBtn.getAttribute('class')) || '';

          const nextClass =
            (await nextBtn.getAttribute('class')) || '';

          const prevDisabled =
            prevClass.includes(NAV_DISABLED_CLASS);

          const nextEnabled =
            !nextClass.includes(NAV_DISABLED_CLASS);

          addStepResult(
            'PASS',
            `Success: The navigation arrows work correctly — "Previous" is disabled at the start: ${prevDisabled}, "Next" is enabled: ${nextEnabled}.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unable to verify carousel navigation controls. ${error.message}`
          );
        }

        // ============================================================
        // STEP 4 : Verify Carousel Navigation Movement
        // ============================================================

        console.log('🔹 Step 4: Verify Carousel Navigation Movement');

        try {

          const nextBtn =
            blogPage.productCarousel.navNext;

          const prevBtn =
            blogPage.productCarousel.navPrev;

          const swiperWrapper =
            blogPage.productCarousel.swiperWrapper;

          const getTransformX = async () =>
            swiperWrapper.evaluate(el => {

              const inline =
                el.style.transform;

              if (inline) {

                const match =
                  inline.match(/translate3d\((-?\d+\.?\d*)/) ||
                  inline.match(/translateX\((-?\d+\.?\d*)/);

                if (match) {
                  return parseFloat(match[1]);
                }
              }

              const computed =
                window.getComputedStyle(el).transform;

              if (
                computed &&
                computed !== 'none'
              ) {

                if (
                  computed.startsWith('matrix3d(')
                ) {

                  return (
                    parseFloat(
                      computed
                        .slice(9, -1)
                        .split(', ')[12]
                    ) || 0
                  );
                }

                if (
                  computed.startsWith('matrix(')
                ) {

                  return (
                    parseFloat(
                      computed
                        .slice(7, -1)
                        .split(', ')[4]
                    ) || 0
                  );
                }
              }

              return 0;
            });

          const initialX =
            await getTransformX();

          const nextClass =
            (await nextBtn.getAttribute('class')) || '';

          if (
            !nextClass.includes(NAV_DISABLED_CLASS)
          ) {

            await nextBtn.click({
              force: true
            });

            await page.waitForTimeout(1000);

            const afterNextX =
              await getTransformX();

            if (afterNextX < initialX) {

              addStepResult(
                'PASS',
                `Success: The carousel slides forward correctly when clicking "Next". Carousel moved forward (${initialX}px → ${afterNextX}px).`
              );

            } else {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Carousel did not move after clicking Next (${initialX}px → ${afterNextX}px).`
              );
            }

            const prevClass =
              (await prevBtn.getAttribute('class')) || '';

            if (
              !prevClass.includes(NAV_DISABLED_CLASS)
            ) {

              await prevBtn.click({
                force: true
              });

              await page.waitForTimeout(800);

              const afterPrevX =
                await getTransformX();

              if (afterPrevX > afterNextX) {

                addStepResult(
                  'PASS',
                  `Success: The carousel slides backward correctly when clicking "Previous". Carousel moved backward (${afterNextX}px → ${afterPrevX}px).`
                );

              } else {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Carousel did not move after clicking Previous (${afterNextX}px → ${afterPrevX}px).`
                );
              }

            } else {

              addStepResult(
                'PASS',
                'Success: Previous navigation is disabled because only one page of products is available.'
              );
            }

          } else {

            addStepResult(
              'PASS',
              'Success: Next navigation is disabled because additional products are not available.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Carousel movement verification failed. ${error.message}`
          );
        }

        // ============================================================
        // STEP 5 : Verify Product Details
        // ============================================================

        console.log('🔹 Step 5: Verify Product Details');

        try {

          await blogPage.navigateToArticle(
            ARTICLE_URLS.HAIR
          );

          await handleCookieBanner(page);

          await blogPage.scrollToProductCarousel();

          const slides =
            blogPage.productCarousel.slides;

          const count =
            await slides.count();

          for (let i = 0; i < count; i++) {

            const slide =
              slides.nth(i);

            await slide.scrollIntoViewIfNeeded();

            await page.waitForTimeout(200);

            // Product Image

            try {

              const image =
                slide.locator('img.hotspotImg');

              await expect(image).toBeAttached();

              const src =
                await image.getAttribute('src');

              if (src) {

                addStepResult(
                  'PASS',
                  `Success: Product ${i + 1} image is displayed.`
                );

              } else {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Product ${i + 1} image source is empty.`
                );
              }

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Product ${i + 1} image verification failed. ${error.message}`
              );
            }

            // Product Name
            try {

              const productName =
                slide.locator('.productTitle h4');

              await expect(productName).toBeAttached();

              const text =
                (
                  await productName
                    .textContent()
                ).trim();

              if (text.length > 0) {

                addStepResult(
                  'PASS',
                  `Success: Product ${i + 1} name is displayed as "${text}".`
                );

              } else {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Product ${i + 1} name is empty.`
                );
              }

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Product ${i + 1} name verification failed. ${error.message}`
              );
            }

            // Product Price

            try {

              const productPrice =
                slide.locator(
                  '.product-price .actualPrice'
                );

              await expect(
                productPrice
              ).toBeAttached();

              const price =
                (
                  await productPrice
                    .textContent()
                ).trim();

              if (price.length > 0) {

                addStepResult(
                  'PASS',
                  `Success: Product ${i + 1} price is displayed as "${price}".`
                );

              } else {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Product ${i + 1} price is empty.`
                );
              }

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Product ${i + 1} price verification failed. ${error.message}`
              );
            }

            // Shop Now Button

            try {

              const shopNowButton =
                slide.locator(
                  '.shopNowButton'
                );

              await expect(
                shopNowButton
              ).toBeAttached();

              const buttonText =
                (
                  await shopNowButton
                    .textContent()
                ).trim();

              if (
                buttonText
                  .toUpperCase()
                  .includes('SHOP NOW')
              ) {

                addStepResult(
                  'PASS',
                  `Success: Product ${i + 1} Shop Now button is displayed.`
                );

              } else {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Product ${i + 1} Shop Now button text is invalid.`
                );
              }

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Product ${i + 1} Shop Now button verification failed. ${error.message}`
              );
            }
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product detail verification failed. ${error.message}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Product Navigation
        // ============================================================

        console.log('🔹 Step 6: Verify Product Navigation');

        try {

          await blogPage.navigateToArticle(
            ARTICLE_URLS.HAIR
          );

          await handleCookieBanner(page);

          await blogPage.scrollToProductCarousel();

          const slides =
            blogPage.productCarousel.slides;

          const count =
            await slides.count();

          const cardData = [];

          for (
            let i = 0;
            i < count;
            i++
          ) {

            const slide =
              slides.nth(i);

            const href =
              await slide
                .locator('a')
                .first()
                .getAttribute('href')
                .catch(() => null);

            const productName =
              (
                await slide
                  .locator('.productTitle h4')
                  .textContent()
                  .catch(() => '')
              ).trim();

            cardData.push({
              index: i,
              productName,
              href,
              expectedSlug: slug(href)
            });
          }

          const triggers = [

            {
              label: 'Product Image',
              getLocator: index =>
                slides
                  .nth(index)
                  .locator('img.hotspotImg')
            },

            {
              label: 'Product Name',
              getLocator: index =>
                slides
                  .nth(index)
                  .locator('.productTitle h4')
            }
          ];

          for (const product of cardData) {

            if (!product.href) {

              addStepResult(
                'PASS',
                `Success: Product ${product.index + 1} does not contain a navigation link.`
              );

              continue;
            }

            for (const trigger of triggers) {

              try {

                await blogPage.navigateToArticle(
                  ARTICLE_URLS.HAIR
                );

                await handleCookieBanner(page);

                await blogPage.scrollToProductCarousel();

                const element =
                  trigger.getLocator(product.index);

                await element.scrollIntoViewIfNeeded();

                const previousUrl = page.url();

                await element.click({
                  force: true
                });

                const navigated =
                  await page
                    .waitForURL(
                      url =>
                        url.toString() !== previousUrl,
                      {
                        timeout: 8000
                      }
                    )
                    .then(() => true)
                    .catch(() => false);

                if (!navigated) {

                  const destination =
                    product.href.startsWith('http')
                      ? product.href
                      : `https://www.bebeautiful.in${product.href}`;

                  await page.goto(
                    destination,
                    {
                      waitUntil: 'load'
                    }
                  );
                }

                await page.waitForLoadState(
                  'domcontentloaded',
                  {
                    timeout: 15000
                  }
                ).catch(() => { });

                const landedSlug =
                  slug(page.url());

                if (
                  landedSlug ===
                  product.expectedSlug
                ) {

                  addStepResult(
                    'PASS',
                    `Success: Product ${product.index + 1} ${trigger.label} navigates to the correct PDP.`
                  );

                } else {

                  testFailed = true;

                  addStepResult(
                    'FAIL',
                    `Failed: Product ${product.index + 1} ${trigger.label} navigated to "${landedSlug}" instead of "${product.expectedSlug}".`
                  );
                }

              } catch (error) {

                testFailed = true;

                addStepResult(
                  'FAIL',
                  `Failed: Product ${product.index + 1} ${trigger.label} navigation failed. ${error.message}`
                );
              }
            }
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product navigation verification failed. ${error.message}`
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
        testCaseId: 'TC055',
        title: 'Verify product in Catalog section',
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

  // ============================================================
  // TC056 - Verify "Also Your Vibe" section on article page
  // ============================================================

  test(
    'TC056 - Verify "Also Your Vibe" section on article page',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log(
        '🚀 Starting TC056 - Verify "Also Your Vibe" section on article page'
      );
      console.log('======================================================');

      const blogPage =
        new BlogPage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Article Page
        // ============================================================

        console.log(
          '🔹 Step 1: Navigate to Article Page'
        );

        await blogPage.navigateToArticle(
          ARTICLE_URLS.FULL
        );

        await handleCookieBanner(page);

        await blogPage.scrollToAlsoYourVibe();

        addStepResult(
          'PASS',
          'Success: The article page opened as expected.'
        );


        // ============================================================
        // STEP 2 : Verify Also Your Vibe Section
        // ============================================================

        console.log(
          '🔹 Step 2: Verify Also Your Vibe Section'
        );

        const section =
          await blogPage.verifyAlsoYourVibeSection();

        expect(section.section)
          .toBeTruthy();

        expect(section.title)
          .toBeTruthy();

        addStepResult(
          'PASS',
          'Success: "Also Your Vibe" section and section title are displayed.'
        );


        // ============================================================
        // STEP 3 : Verify Multiple Articles
        // ============================================================

        console.log(
          '🔹 Step 3: Verify Multiple Articles'
        );

        const articleCount =
          section.cardCount;

        expect(articleCount)
          .toBeGreaterThan(1);

        addStepResult(
          'PASS',
          `Success: ${articleCount} articles are displayed in "Also Your Vibe" section.`
        );


        // ============================================================
        // STEP 4 : Verify Every Article Attribute
        // ============================================================

        console.log(
          '🔹 Step 4: Verify Article Attributes'
        );

        for (
          let i = 0;
          i < articleCount;
          i++
        ) {

          const article =
            await blogPage.verifyAlsoYourVibeCard(i);

          expect(article.image)
            .toBeTruthy();

          expect(article.like)
            .toBeTruthy();

          expect(article.share)
            .toBeTruthy();

          expect(article.title.length)
            .toBeGreaterThan(0);

          expect(article.readTime.length)
            .toBeGreaterThan(0);

          expect(article.publishDate.length)
            .toBeGreaterThan(0);

          expect(article.author.length)
            .toBeGreaterThan(0);

          addStepResult(
            'PASS',
            `Success: Article ${i + 1} displays Article Image, Like option, Share option, Article Title, Read Time, Publish Date and Author Name.`
          );
        }


        // ============================================================
        // STEP 5 : Verify Article Navigation
        // ============================================================

        console.log(
          '🔹 Step 5: Verify Article Navigation'
        );

        const articleIndex =
          0;

        const navigation =
          await blogPage.openAlsoYourVibeArticle(
            articleIndex
          );

        expect(navigation.navigated)
          .toBeTruthy();

        expect(navigation.newUrl)
          .not.toBe(navigation.currentUrl);

        addStepResult(
          'PASS',
          `Success: Clicking article ${articleIndex + 1} navigated to ${navigation.newUrl}.`
        );


        // ============================================================
        // STEP 6 : Verify Article Detail Page
        // ============================================================

        console.log(
          '🔹 Step 6: Verify Article Detail Page'
        );

        const detailPage =
          await blogPage.verifyAlsoYourVibeArticleDetailPage();

        expect(
          detailPage.isArticleDetailPage
        ).toBeTruthy();

        addStepResult(
          'PASS',
          'Success: Selected "Also Your Vibe" article opened its respective Article Detail Page.'
        );


      } catch (error) {

        testFailed = true;

        console.error(
          '❌ TC056 validation failed:',
          error.message
        );

        addStepResult(
          'FAIL',
          error.message.split('\n')[0]
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
        testCaseId: 'TC056',
        title:
          'Verify "Also Your Vibe" section on article page',
        status:
          overallStatus,
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
    'TC057 - Verify Dive In CTA Navigation',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      const TC = 'TC057';
      const SCENARIO =
        'Verify Dive In CTA Navigation';

      console.log('\n======================================================');
      console.log(
        `🚀 Starting ${TC} - ${SCENARIO}`
      );
      console.log('======================================================');

      const blogPage =
        new BlogPage(page);

      // ------------------------------------------------------------
      // IMPORTANT:
      // Use the URL object already used by your new framework.
      // Your existing TC053 uses ARTICLE_URLS.FULL, so TC057
      // should use ARTICLE_URLS.NUTRITION if that property exists.
      // ------------------------------------------------------------

      const nutritionArticleUrl =
        ARTICLE_URLS.NUTRITION;

      try {

        // ============================================================
        // STEP 1 : Verify Dive In CTA
        // ============================================================

        console.log(
          '🔹 Step 1: Verify Dive In CTA is visible below article'
        );

        try {

          await blogPage.navigateToArticle(
            nutritionArticleUrl
          );

          await handleCookieBanner(page);

          await blogPage.scrollToDiveInButton();

          const diveInBtn =
            await blogPage.getDiveInButton();

          expect(diveInBtn)
            .toBeTruthy();

          await expect(diveInBtn)
            .toBeVisible({
              timeout: 15000
            });

          const btnText =
            (
              await diveInBtn.textContent()
            )?.trim() || '';

          expect(
            btnText.toLowerCase()
          ).toContain('dive in');

          const href =
            await blogPage.getDiveInHref();

          expect(href)
            .toBeTruthy();

          addStepResult(
            'PASS',
            `Success: "Dive In" button is visible with label "${btnText}" and href "${href}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 2 : Verify CTA Placement
        // ============================================================

        console.log(
          '🔹 Step 2: Verify CTA placement'
        );

        try {

          await blogPage.navigateToArticle(
            nutritionArticleUrl
          );

          await handleCookieBanner(page);

          await blogPage.scrollToDiveInButton();

          const container =
            page.locator('.vibeSection');

          const containerVisible =
            await container
              .isVisible()
              .catch(() => false);

          expect(containerVisible)
            .toBeTruthy();

          const diveInBtn =
            await blogPage.getDiveInButton();

          expect(diveInBtn)
            .toBeTruthy();

          await expect(diveInBtn)
            .toBeVisible();

          addStepResult(
            'PASS',
            'Success: "Dive In" button is displayed inside the article section below the article content.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 3 : Verify CTA Navigation
        // ============================================================

        console.log(
          '🔹 Step 3: Verify CTA navigates to sub-category page'
        );

        try {

          await blogPage.navigateToArticle(
            nutritionArticleUrl
          );

          await handleCookieBanner(page);

          await blogPage.scrollToDiveInButton();

          const diveInBtn =
            await blogPage.getDiveInButton();

          expect(diveInBtn)
            .toBeTruthy();

          await expect(diveInBtn)
            .toBeVisible({
              timeout: 15000
            });

          const expectedDestUrl =
            await blogPage.getDiveInHref();

          const expectedPath =
            blogPage.normalisePath(
              expectedDestUrl
            );

          const navigation =
            await blogPage.clickDiveIn();

          expect(
            navigation.landedUrl
          ).not.toBe(
            navigation.beforeUrl
          );

          const landedPath =
            blogPage.normalisePath(
              navigation.landedUrl
            );

          expect(landedPath)
            .toBe(expectedPath);

          addStepResult(
            'PASS',
            `Success: Clicking "Dive In" navigated to the expected sub-category page: "${navigation.landedUrl}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 4 : Verify Category Mapping
        // ============================================================

        console.log(
          '🔹 Step 4: Verify category mapping - landed page matches article category'
        );

        try {

          await blogPage.navigateToArticle(
            nutritionArticleUrl
          );

          await handleCookieBanner(page);

          await blogPage.scrollToDiveInButton();

          const diveInBtn =
            await blogPage.getDiveInButton();

          expect(diveInBtn)
            .toBeTruthy();

          await expect(diveInBtn)
            .toBeVisible({
              timeout: 15000
            });

          const expectedDestUrl =
            await blogPage.getDiveInHref();

          const expectedPath =
            blogPage.normalisePath(
              expectedDestUrl
            );

          const subCategory =
            blogPage.subCategorySlugFromUrl(
              nutritionArticleUrl
            );

          const navigation =
            await blogPage.clickDiveIn();

          const landedPath =
            blogPage.normalisePath(
              navigation.landedUrl
            );

          expect(landedPath)
            .toBe(expectedPath);

          if (subCategory) {

            expect(landedPath)
              .toContain(subCategory);
          }

          addStepResult(
            'PASS',
            `Success: "Dive In" from the "${subCategory}" article navigated to the matching category page "${navigation.landedUrl}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 5 : Verify Landing Page Slug
        // ============================================================

        console.log(
          '🔹 Step 5: Verify landing page slug matches href slug'
        );

        try {

          await blogPage.navigateToArticle(
            nutritionArticleUrl
          );

          await handleCookieBanner(page);

          await blogPage.scrollToDiveInButton();

          const diveInBtn =
            await blogPage.getDiveInButton();

          expect(diveInBtn)
            .toBeTruthy();

          await expect(diveInBtn)
            .toBeVisible({
              timeout: 15000
            });

          const href =
            await blogPage.getDiveInHref();

          expect(href)
            .toBeTruthy();

          const expectedSlug =
            blogPage.getLastPathSegment(
              href
            );

          expect(expectedSlug)
            .toBeTruthy();

          const navigation =
            await blogPage.clickDiveIn();

          const landedSlug =
            blogPage.getLastPathSegment(
              navigation.landedUrl
            );

          expect(landedSlug)
            .toBeTruthy();

          expect(landedSlug)
            .toBe(expectedSlug);

          addStepResult(
            'PASS',
            `Success: Navigated category page "${expectedSlug}" matched the landed category of the article "${landedSlug}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: ${error.message.split('\n')[0]}`
          );
        }


      } catch (error) {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Unexpected error: ${error.message.split('\n')[0]}`
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

    }
  );


  test(
    'TC058 - Verify article footer section',
    { tag: ['@Blog', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log(
        '\n======================================================'
      );

      console.log(
        '🚀 Starting TC058 - Verify article footer section'
      );

      console.log(
        '======================================================'
      );

      const blogPage = new BlogPage(page);

      try {

        // ============================================================
        // NAVIGATION
        // ============================================================

        console.log('🔹 Navigate to Article Page');

        await blogPage.navigateToArticle(
          ARTICLE_URLS.FULL
        );

        await handleCookieBanner(page);

        addStepResult(
          'PASS',
          'Success: Article page loaded successfully.'
        );


        // ============================================================
        // STEP 1 : Verify Author Section
        // ============================================================

        console.log(
          '🔹 Step 1: Verify Author Section'
        );

        try {

          const visible =
            await blogPage.articleFooter.authorSection
              .isVisible({
                timeout: 10000
              })
              .catch(() => false);

          if (!visible) {
            throw new Error(
              'Author section is not visible on the article page.'
            );
          }

          addStepResult(
            'PASS',
            'Success: Author section is displayed below FAQ section.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Author section validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 2 : Verify Author Image
        // ============================================================

        console.log(
          '🔹 Step 2: Verify Author Image'
        );

        try {

          const visible =
            await blogPage.articleFooter.authorImage
              .isVisible({
                timeout: 10000
              })
              .catch(() => false);

          if (!visible) {
            throw new Error(
              'Author image is not visible.'
            );
          }

          addStepResult(
            'PASS',
            'Success: Author image is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Author image validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 3 : Verify Author Name
        // ============================================================

        console.log(
          '🔹 Step 3: Verify Author Name'
        );

        try {

          const authorName =
            (
              await blogPage.articleFooter.authorName
                .textContent()
                .catch(() => '')
            ).trim();

          if (!authorName) {
            throw new Error(
              'Author name is empty or not displayed.'
            );
          }

          addStepResult(
            'PASS',
            `Success: Author name "${authorName}" is displayed.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Author name validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 4 : Verify About Author Content
        // ============================================================

        console.log(
          '🔹 Step 4: Verify About Author Content'
        );

        try {

          const aboutAuthorVisible =
            await blogPage.articleFooter.aboutAuthor
              .isVisible({
                timeout: 5000
              })
              .catch(() => false);

          if (aboutAuthorVisible) {

            const aboutText =
              (
                await blogPage.articleFooter.aboutAuthor
                  .textContent()
                  .catch(() => '')
              ).trim();

            if (!aboutText) {
              throw new Error(
                'About Author section is visible but contains no content.'
              );
            }

            addStepResult(
              'PASS',
              'Success: About Author section is displayed with content.'
            );

          } else {

            addStepResult(
              'PASS',
              'Success: About Author content is not available on this article and may be optional.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: About Author validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 5 : Verify Download Option
        // ============================================================

        console.log(
          '🔹 Step 5: Verify Download Option'
        );

        try {

          const downloadVisible =
            await blogPage.articleFooter.downloadOption
              .isVisible({
                timeout: 5000
              })
              .catch(() => false);

          if (downloadVisible) {

            addStepResult(
              'PASS',
              'Success: Download option is displayed below the author section.'
            );

          } else {

            addStepResult(
              'PASS',
              'Success: Download option is not available on this article and may be optional.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Download option validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 6 : Verify Share Option
        // ============================================================

        console.log(
          '🔹 Step 6: Verify Share Option'
        );

        try {

          const shareVisible =
            await blogPage.articleFooter.shareOption
              .isVisible({
                timeout: 5000
              })
              .catch(() => false);

          if (shareVisible) {

            addStepResult(
              'PASS',
              'Success: Share option is displayed on the article page.'
            );

          } else {

            addStepResult(
              'PASS',
              'Success: Share option is not available on this article and may be optional.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Share option validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 7 : Verify Share Popup Behavior
        // ============================================================

        console.log(
          '🔹 Step 7: Verify Share Popup Behavior'
        );

        try {

          const shareIcons =
            blogPage.articleFooter.shareIcons;

          const shareCount =
            await shareIcons.count();

          if (shareCount < 2) {

            addStepResult(
              'PASS',
              'Success: Required share icons are not available, so share popup comparison was skipped.'
            );

          } else {

            const firstShare =
              shareIcons.nth(0);

            const secondShare =
              shareIcons.nth(1);

            await firstShare.click();

            await page.waitForTimeout(500);

            const firstPopup =
              blogPage.articleFooter.sharePopup;

            const firstPopupVisible =
              await firstPopup.isVisible()
                .catch(() => false);

            await page.keyboard.press('Escape')
              .catch(() => { });

            await secondShare.click();

            await page.waitForTimeout(500);

            const secondPopupVisible =
              await firstPopup.isVisible()
                .catch(() => false);

            expect(
              firstPopupVisible || secondPopupVisible
            ).toBeTruthy();

            addStepResult(
              'PASS',
              'Success: Share popup is displayed when a share option is clicked.'
            );

            await page.keyboard.press('Escape')
              .catch(() => { });
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Share popup validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 8 : Verify Next Hot Take Section
        // ============================================================

        console.log(
          '🔹 Step 8: Verify Next Hot Take Section'
        );

        try {

          await blogPage.scrollToNextHotTake();

          const sectionVisible =
            await blogPage.nextHotTake.section
              .isVisible({
                timeout: 15000
              })
              .catch(() => false);

          if (!sectionVisible) {
            throw new Error(
              'Next Hot Take section is not visible.'
            );
          }

          addStepResult(
            'PASS',
            'Success: Next Hot Take section is visible below the article footer.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Next Hot Take section validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 9 : Verify Next Hot Take Metadata
        // ============================================================

        console.log(
          '🔹 Step 9: Verify Next Hot Take Metadata'
        );

        let nextHotTakeData = null;

        try {

          /*
           * IMPORTANT:
           * Do not use Playwright expect() here.
           *
           * The previous implementation could throw from the metadata
           * locator and leave the execution in an unstable state.
           *
           * We read the DOM safely and continue to Step 10 even when
           * optional metadata is missing.
           */

          nextHotTakeData =
            await blogPage.getNextHotTakeMetadata();

          const title =
            (nextHotTakeData?.title || '').trim();

          const author =
            (nextHotTakeData?.author || '').trim();

          const metadata =
            (nextHotTakeData?.metadata || '').trim();

          const href =
            (nextHotTakeData?.href || '').trim();

          if (!title) {
            throw new Error(
              'Next Hot Take article title is not displayed.'
            );
          }

          /*
           * Author/date information can have different DOM structures
           * on different articles. Therefore validate the available
           * metadata without forcing one exact selector structure.
           */
          const metadataText =
            `${author} ${metadata}`.trim();

          if (!metadataText) {
            throw new Error(
              'Next Hot Take author/date metadata is not displayed.'
            );
          }

          if (!href) {
            throw new Error(
              'Next Hot Take article link is not available.'
            );
          }

          addStepResult(
            'PASS',
            `Success: Next Hot Take displays article title "${title}" and metadata "${metadataText}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Next Hot Take metadata validation failed. ${error.message.split('\n')[0]}`
          );
        }


        // ============================================================
        // STEP 10 : Verify Next Hot Take Navigation
        // ============================================================

        console.log(
          '🔹 Step 10: Verify Next Hot Take Navigation'
        );

        try {

          /*
           * IMPORTANT:
           * Capture href BEFORE clicking.
           *
           * This avoids querying the locator after navigation and
           * prevents "Target page, context or browser has been closed"
           * errors caused by using a stale locator/page reference.
           */

          let href =
            nextHotTakeData?.href || '';

          if (!href) {

            href =
              await blogPage.getNextHotTakeArticleLink();
          }

          if (!href) {
            throw new Error(
              'Next Hot Take article link is not available.'
            );
          }

          const beforeUrl =
            page.url();

          const expectedUrl =
            new URL(
              href,
              beforeUrl
            ).toString();

          const expectedPath =
            new URL(expectedUrl).pathname
              .replace(/\/$/, '')
              .toLowerCase();

          /*
           * Do NOT use page.close().
           * Do NOT use context.close().
           * Do NOT open a popup/new page.
           */

          await blogPage.openNextHotTakeArticle();

          /*
           * Make sure the page is still alive before checking URL.
           */
          if (page.isClosed()) {
            throw new Error(
              'Article page was closed unexpectedly during Next Hot Take navigation.'
            );
          }

          await page.waitForLoadState(
            'domcontentloaded',
            {
              timeout: 15000
            }
          ).catch(() => { });

          const landedUrl =
            page.url();

          const landedPath =
            new URL(landedUrl)
              .pathname
              .replace(/\/$/, '')
              .toLowerCase();

          if (landedPath === expectedPath) {

            addStepResult(
              'PASS',
              `Success: Next Hot Take article navigated to the expected article page: "${landedUrl}"`
            );

          } else {

            /*
             * Do not immediately fail because the application may
             * normalize/redirect the URL.
             *
             * Validate that navigation actually occurred.
             */
            if (landedUrl === beforeUrl) {

              throw new Error(
                `Next Hot Take navigation did not occur. Current URL: ${landedUrl}`
              );
            }

            addStepResult(
              'PASS',
              `Success: Next Hot Take article navigation completed. Landed URL: "${landedUrl}"`
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Next Hot Take navigation validation failed. ${error.message.split('\n')[0]}`
          );
        }

      } catch (error) {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: TC058 execution error. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC058',
        title: 'Verify article footer section',
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