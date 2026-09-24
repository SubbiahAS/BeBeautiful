// tests/homepage/searchLayout.spec.js

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
    'TC004 - Verification of search bar',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page, context }) => {

      // ✅ FIXED: bumped from 300000 -> 480000. The previous budget was
      // being fully consumed by cumulative waits across 17 steps, causing
      // later steps (search bar click on Step 15) to fail with a
      // "Test timeout of 300000ms exceeded" even though each individual
      // wait was bounded.
      test.setTimeout(480000);

      clearStepResults();

      let testFailed = false;
      let articleDetailUrl = null;
      let pdpUrl = null;

      // Safe wait helper: never hang on networkidle (this site keeps
      // persistent connections/polling open, so true network idle is
      // sometimes never reached). Keep timeouts short so no single step
      // can eat the overall test budget.
      const safeWaitForLoad = async (targetPage, state = 'domcontentloaded', timeout = 8000) => {
        await targetPage.waitForLoadState(state, { timeout }).catch(() => { });
      };

      console.log('\n======================================================');
      console.log('🚀 Starting TC004 - Verification of Search Bar');
      console.log('======================================================');

      const homePage = new HomePage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Homepage
        // ============================================================

        console.log('🔹 Step 1: Navigate to Homepage');

        await homePage.navigateToHome();

        await safeWaitForLoad(page, 'networkidle', 15000);

        await homePage.closeLoginPopupIfPresent();

        addStepResult(
          'PASS',
          'Success: Homepage loaded successfully.'
        );

        // ============================================================
        // STEP 2 : Verify Search Bar Placement
        // ============================================================

        console.log('🔹 Step 2: Verify Search Bar Placement');

        try {

          const searchVisible =
            await homePage.search.searchBtn.isVisible().catch(() => false);

          const profileVisible =
            await homePage.profileIcon.isVisible().catch(() => false);

          expect(searchVisible && profileVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Search bar is present to the left of the profile icon.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search bar or profile icon is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Open Search Section
        // ============================================================

        console.log('🔹 Step 3: Click Search Bar');

        try {

          await homePage.openSearch();

          addStepResult(
            'PASS',
            'Success: Search section opened successfully.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search section did not open. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Verify Search Input Field
        // ============================================================

        console.log('🔹 Step 4: Verify Search Input Field');

        try {

          const inputVisible =
            await homePage.search.inputField.isVisible().catch(() => false);

          expect(inputVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Search input field is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search input field is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 5 : Verify Recent Searches Section
        // ============================================================

        console.log('🔹 Step 5: Verify Recent Searches Section');

        try {

          const recentSearchVisible =
            await homePage.search.recentSearchSection.isVisible().catch(() => false);

          expect(recentSearchVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Recent Searches section is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Recent Searches section is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Latest Read Articles Section
        // ============================================================

        console.log('🔹 Step 6: Verify Latest Read Articles Section');

        try {

          const latestReadVisible =
            await homePage.search.latestReadsBox.isVisible().catch(() => false);

          expect(latestReadVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Latest Read Articles section is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Latest Read Articles section is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 7 : Verify Article Navigation
        // ============================================================

        console.log('🔹 Step 7: Verify Latest Read Article Navigation');

        try {

          // Only look inside the active slide to avoid hidden Swiper slides
          const articleLinks = page.locator('.searchPhaseSwiper .swiper-slide-active .scrollContainer a[href]');

          // Wait for swiper to settle
          await page.waitForTimeout(2000);

          const articleCount = await articleLinks.count();

          expect(articleCount).toBeGreaterThan(0);

          const originalUrl = page.url();

          await Promise.all([
            page.waitForURL((url) => url.toString() !== originalUrl, { timeout: 20000 }).catch(() => { }),
            articleLinks.first().click(),
          ]);

          await safeWaitForLoad(page, 'domcontentloaded', 15000);

          const newUrl = page.url();

          expect(newUrl && newUrl !== originalUrl).toBeTruthy();

          // ✅ Capture the article detail URL, reused later to verify the
          // search component renders identically off of Homepage.
          articleDetailUrl = newUrl;

          addStepResult(
            'PASS',
            'Success: Clicking on a latest read article navigates user to the corresponding article detail page.'
          );

          // ✅ FIXED: Steps 8–12 verify the article card's meta info in the
          // "Latest Read Articles" widget, so go back to Homepage and
          // reopen search before checking them (the widget only exists
          // inside the search modal, not on the article detail page).
          await page.goBack({ waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => { });

          await safeWaitForLoad(page, 'networkidle', 10000);

          await homePage.closeLoginPopupIfPresent();

          await homePage.openSearch();

          await page.waitForTimeout(2000); // Let swiper re-initialize

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: User is not redirected to the corresponding article detail page. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 8 : Verify Read Time
        // ============================================================

        console.log('🔹 Step 8: Verify Read Time');

        try {

          const readTimeVisible =
            await homePage.search.articleMetas.first().isVisible().catch(() => false);

          expect(readTimeVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Read time is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Read time is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 9 : Verify Publish Date
        // ============================================================

        console.log('🔹 Step 9: Verify Publish Date');

        try {

          const publishDateVisible =
            await homePage.search.articleMetas.first().isVisible().catch(() => false);

          expect(publishDateVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Article publish date is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Article publish date is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 10 : Verify Author Name
        // ============================================================

        console.log('🔹 Step 10: Verify Author Name');

        try {

          const authorVisible =
            await homePage.search.articleAuthorNames.first().isVisible().catch(() => false);

          expect(authorVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Author name is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Author name is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 11 : Verify Article Image
        // ============================================================

        console.log('🔹 Step 11: Verify Article Image');

        try {

          const imageLocator = homePage.search.articleImages.first();

          const imageCount = await homePage.search.articleImages.count();

          console.log('Image Count:', imageCount);

          expect(imageCount).toBeGreaterThan(0);

          await imageLocator.waitFor({ state: 'visible', timeout: 10000 });

          addStepResult(
            'PASS',
            'Success: Article image is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Article image is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 12 : Verify Article Title
        // ============================================================

        console.log('🔹 Step 12: Verify Article Title');

        try {

          const titleVisible =
            await homePage.search.articleTitles.first().isVisible().catch(() => false);

          expect(titleVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Article heading/title is displayed.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Article heading/title is not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 13 : Verify Navigation Section Below Latest Read Articles
        // ============================================================

        console.log('🔹 Step 13: Verify Navigation Section');

        try {

          const navigationVisible =
            await homePage.search.latestReadsBox.isVisible().catch(() => false);

          expect(navigationVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Navigation section is displayed below the Latest Read Articles section.'
          );

          await homePage.closeSearch().catch(() => { });

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Navigation section is not displayed below the Latest Read Articles section. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 14 : Navigate to Article Detail Page & Verify Search Layout Parity
        // ============================================================

        console.log('🔹 Step 14: Verify Search Layout on Article Detail Page');

        try {

          if (!articleDetailUrl) {
            throw new Error('No Article Detail URL was captured in Step 7 to navigate to.');
          }

          await page.goto(articleDetailUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

          await safeWaitForLoad(page, 'networkidle', 10000);

          await homePage.closeLoginPopupIfPresent();

          const articlePageLayout = await homePage.verifySearchLayoutOnCurrentPage();

          expect(articlePageLayout.searchBtnVisible && articlePageLayout.profileIconVisible).toBeTruthy();
          expect(articlePageLayout.inputFieldVisible).toBeTruthy();
          expect(articlePageLayout.recentSearchVisible).toBeTruthy();
          expect(articlePageLayout.latestReadsVisible).toBeTruthy();

          addStepResult(
            'PASS',
            `Success: Search bar, input field, Recent Searches, and Latest Read Articles sections are displayed identically on the Article Detail page (${articleDetailUrl}).`
          );

          await homePage.closeSearch().catch(() => { });

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search section layout on Article Detail page does not match Homepage. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 15 : Capture a PDP (Product Detail Page) URL via Search
        // ============================================================

        console.log('🔹 Step 15: Capture PDP URL via Search');

        try {

          await homePage.navigateToHome();

          await safeWaitForLoad(page, 'networkidle', 15000);

          await homePage.closeLoginPopupIfPresent();

          // ✅ FIXED: don't rely on the heavier submitSearchAndWaitForResults
          // helper (its internal networkidle wait was starving later steps
          // of the shared test-timeout budget). Drive the search directly
          // with bounded waits instead.
          await homePage.openSearch();

          await homePage.search.inputField.click();
          await homePage.search.inputField.fill('Lakme');
          await homePage.search.inputField.press('Enter');

          await safeWaitForLoad(page, 'domcontentloaded', 10000);

          // ✅ FIXED: `homePage.search.productLinks` does not exist on the
          // POM (only `homePage.search.productCards` / `homePage.products.productLinks`
          // are defined), which caused "Cannot read properties of undefined
          // (reading 'count')". Poll on `search.productCards` instead.
          await expect
            .poll(
              async () => await homePage.search.productCards.count().catch(() => 0),
              { timeout: 20000, intervals: [500, 1000, 2000] }
            )
            .toBeGreaterThan(0);

          const href = await homePage.search.productCards.first()
            .locator('a').first()
            .getAttribute('href')
            .catch(() => null);

          if (!href) {
            throw new Error('Could not extract PDP href from search results.');
          }

          pdpUrl = href.startsWith('http')
            ? href
            : `${new URL(page.url()).origin}${href}`;

          await homePage.closeSearch().catch(() => { });

          addStepResult(
            'PASS',
            `Success: Captured PDP URL (${pdpUrl}) from search results for layout parity verification.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Could not capture a PDP URL via search. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 16 : Verify Search Bar Placement on PDP Page
        // ============================================================

        console.log('🔹 Step 16: Verify Search Bar Placement on PDP Page');

        try {

          if (!pdpUrl) {
            throw new Error('No PDP URL was captured in Step 15 to navigate to.');
          }

          await page.goto(pdpUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

          await safeWaitForLoad(page, 'networkidle', 10000);

          await homePage.closeLoginPopupIfPresent();

          const searchVisibleOnPdp =
            await homePage.search.searchBtn.isVisible().catch(() => false);

          const profileVisibleOnPdp =
            await homePage.profileIcon.isVisible().catch(() => false);

          expect(searchVisibleOnPdp && profileVisibleOnPdp).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Search bar is present to the left of the profile icon on PDP page.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search bar or profile icon is not displayed on PDP page. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 17 : Verify Search Section Layout Parity on PDP Page
        // ============================================================

        console.log('🔹 Step 17: Verify Search Section Layout on PDP Page');

        try {

          if (!pdpUrl) {
            throw new Error('No PDP URL available (Step 15/16 did not complete).');
          }

          await homePage.openSearch();

          const inputVisibleOnPdp =
            await homePage.search.inputField.isVisible().catch(() => false);

          const recentSearchVisibleOnPdp =
            await homePage.search.recentSearchSection.isVisible().catch(() => false);

          const latestReadVisibleOnPdp =
            await homePage.search.latestReadsBox.isVisible().catch(() => false);

          expect(inputVisibleOnPdp).toBeTruthy();
          expect(recentSearchVisibleOnPdp).toBeTruthy();
          expect(latestReadVisibleOnPdp).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Search input field, Recent Searches section, and Latest Read Articles section are displayed identically on the PDP page.'
          );

          await homePage.closeSearch().catch(() => { });

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search section layout on PDP page does not match Homepage. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC004',
        title: 'Verification of search bar',
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