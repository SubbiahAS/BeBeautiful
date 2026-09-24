// tests/homepage/search.spec.js

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');

// Search keyword from .env (SEARCH_KEYWORD_SHAMPOO), with fallback
const SEARCH_KEYWORD = process.env.SEARCH_KEYWORD_SHAMPOO || 'shampoo';

test.describe('Homepage Module', () => {

  test(
    'TC005 - Verification of search bar with valid keyword',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page, context }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC005 - Verification of Search Bar with Valid Keyword');
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
        // STEP 2 : Open Search Modal
        // ============================================================

        console.log('🔹 Step 2: Open Search Modal');

        try {

          await expect(homePage.search.searchBtn).toBeVisible({ timeout: 15000 });

          await homePage.openSearch();

          await expect(homePage.search.modalOverlay).toBeVisible({ timeout: 15000 });

          await expect(homePage.search.inputField).toBeVisible({ timeout: 15000 });

          addStepResult(
            'PASS',
            'Success: Search modal and input field visible after clicking search icon.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search modal did not open. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Verify Default Search State (Recent Searches & Latest Reads)
        // ============================================================

        console.log('🔹 Step 3: Verify Default Search State');

        try {

          const articleCount = await homePage.verifyDefaultSearchState();

          addStepResult(
            'PASS',
            `Success: Recent Searches section is displayed below the search input and Latest Reads (${articleCount} article cards) visible by default.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Default search state not displayed correctly. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Type Keyword & Verify Suggestions Appear While Typing
        // ============================================================

        console.log('🔹 Step 4: Type Keyword & Verify Suggestions While Typing');

        // try {

        //   const suggestionCount = await homePage.verifySearchSuggestionsWhileTyping(SEARCH_KEYWORD);

        //   const inputValue = await homePage.search.inputField.inputValue();

        //   expect(inputValue).toBe(SEARCH_KEYWORD);

        //   addStepResult(
        //     'PASS',
        //     `Success: Keyword "${SEARCH_KEYWORD}" entered and ${suggestionCount} relevant search suggestion(s) displayed while typing.`
        //   );

        // } catch (error) {

        //   testFailed = true;

        //   addStepResult(
        //     'FAIL',
        //     `Failed: Search suggestions did not appear while typing. ${error.message.split('\n')[0]}`
        //   );
        // }

        try {
          await homePage.verifySearchSuggestionsWhileTyping(SEARCH_KEYWORD);

          const inputValue = await homePage.search.inputField.inputValue();

          expect(inputValue).toBe(SEARCH_KEYWORD);

          addStepResult(
            'PASS',
            `Success: Search keyword "${SEARCH_KEYWORD}" entered successfully and relevant search suggestions displayed while typing.`
          );

        } catch (error) {
          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search keyword "${SEARCH_KEYWORD}" could not be entered correctly. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 5 : Submit Search & Wait For Results
        // ============================================================

        console.log('🔹 Step 5: Submit Search & Wait For Results');

        try {

          await homePage.submitSearchAndWaitForResults(SEARCH_KEYWORD);

          addStepResult(
            'PASS',
            `Success: Search submitted for keyword "${SEARCH_KEYWORD}" and relevant results are loaded.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Could not submit search or results did not load. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Product Results & Mandatory Details
        // ============================================================

        console.log('🔹 Step 6: Verify Product Results');

        let pdpHref = null;

        try {

          const {
            productCount,
            titleText,
            priceText,
            discountText,
            pdpHref: href
          } = await homePage.verifyProductResultDetails();

          pdpHref = href;

          addStepResult(
            'PASS',
            `Success: ${productCount} products displayed | Name: "${titleText}" | Image | Price: ${priceText} | Discount: ${discountText} | Shop Now link present.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product results not displayed with mandatory details. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 7 : Verify Product Results Relevance To Searched Keyword
        // ============================================================

        console.log('🔹 Step 7: Verify Product Results Relevance');

        try {

          const matchCount = await homePage.verifyProductResultsRelevance(SEARCH_KEYWORD);

          addStepResult(
            'PASS',
            `Success: ${matchCount} sampled product result(s) relevant to keyword "${SEARCH_KEYWORD}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product results not relevant to keyword "${SEARCH_KEYWORD}". ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 8 : Verify Result Count
        // ============================================================

        console.log('🔹 Step 8: Verify Result Count');

        try {

          const resultText = await homePage.getSearchResultCount();

          addStepResult(
            'PASS',
            `Success: Result count displayed - "${resultText}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Result count not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 9 : Verify "Shop Now" Navigates to PDP
        // ============================================================

        console.log('🔹 Step 9: Verify Shop Now → PDP Navigation');

        try {

          const fullUrl = await homePage.verifyPdpNavigationFromHref(pdpHref, context);

          addStepResult(
            'PASS',
            `Success: "Shop Now" navigated to PDP - ${fullUrl}.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: "Shop Now" did not navigate to PDP. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 10 : Verify Articles Section in Search Results
        // ============================================================

        console.log('🔹 Step 10: Verify Articles Section in Search Results');

        try {

          await homePage.openArticlesTabInSearch();

          const articleCount = await homePage.verifyArticlesTabResults();

          addStepResult(
            'PASS',
            `Success: Articles section displayed alongside Products with ${articleCount} relevant articles and mandatory attributes.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Articles section not displayed correctly. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 11 : Verify Article Results Relevance To Searched Keyword
        // ============================================================

        console.log('🔹 Step 11: Verify Article Results Relevance');

        try {

          const matchCount = await homePage.verifyArticleResultsRelevance(SEARCH_KEYWORD);

          addStepResult(
            'PASS',
            `Success: ${matchCount} sampled article result(s) relevant to keyword "${SEARCH_KEYWORD}".`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Article results not relevant to keyword "${SEARCH_KEYWORD}". ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 12 : Clear Search & Verify Recent Searches
        // ============================================================

        console.log('🔹 Step 12: Clear Search & Verify Recent Searches');

        try {

          const recentCountAfter = await homePage.verifyRecentSearchAfterClear();

          addStepResult(
            'PASS',
            `Success: Search input cleared via clear icon and Recent Searches section visible (${recentCountAfter} items) below the search input.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Clear icon did not clear input or Recent Searches not displayed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 13 : Close Search
        // ============================================================

        console.log('🔹 Step 13: Close Search');

        try {

          await homePage.closeSearch();

          await expect(homePage.search.modalOverlay).toBeHidden({ timeout: 10000 });

          addStepResult(
            'PASS',
            'Success: Search modal closed successfully.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Search modal did not close. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC005',
        title: 'Verification of search bar with valid keyword',
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
    'TC006 - Verification of search bar with invalid keyword',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page, context }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC006 - Verification of Search Bar with Invalid Keyword');
      console.log('======================================================');

      const homePage = new HomePage(page);

      // Helper: check for no-result message and 0 result text
      const verifyNoResultUI = async (keyword) => {

        await page.waitForTimeout(2000);

        // Check for "No search result for" message
        const noResultMsg = page.locator(
          `text=/No (search )?result(s)? for/i, [class*="noResult"], [class*="no-result"], [class*="emptyResult"], [class*="empty-result"]`
        );

        const zeroResultText = page.locator(
          `text=/0 result/i`
        );

        const noResultVisible = await noResultMsg.first().isVisible().catch(() => false);
        const zeroResultVisible = await zeroResultText.first().isVisible().catch(() => false);

        return { noResultVisible, zeroResultVisible };
      };

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
        // STEP 2 : Enter Invalid Keyword and Verify No Result
        // ============================================================

        console.log('🔹 Step 2: Enter invalid keyword and verify no result');

        try {

          const invalidKeywords = ['laptop', 'chair', 'plants', 'cycle'];

          await homePage.openSearch();

          await page.waitForTimeout(1000);

          let invalidKeywordPassed = false;

          for (const keyword of invalidKeywords) {

            console.log(`   🔸 Testing invalid keyword: "${keyword}"`);

            // Clear field and type keyword
            await homePage.search.inputField.click();

            await homePage.search.inputField.fill('');

            await homePage.search.inputField.fill(keyword);

            await homePage.search.inputField.press('Enter');

            await page.waitForTimeout(2500);

            const { noResultVisible, zeroResultVisible } = await verifyNoResultUI(keyword);

            console.log(`      No result msg visible: ${noResultVisible}`);
            console.log(`      Zero result text visible: ${zeroResultVisible}`);

            if (noResultVisible || zeroResultVisible) {
              invalidKeywordPassed = true;
              console.log(`      ✅ No result UI shown for keyword: "${keyword}"`);
              break;
            }

            // Clear for next keyword
            const clearIconVisible = await homePage.search.clearIcon.isVisible().catch(() => false);

            if (clearIconVisible) {
              await homePage.search.clearIcon.click();
              await page.waitForTimeout(1000);
            }
          }

          expect(invalidKeywordPassed).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: No search result message is displayed for invalid keyword (e.g. laptop, chair, plants, cycle).'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: No search result message is NOT displayed for invalid keywords (laptop, chair, plants, cycle). ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Enter Special Characters and Verify No Result
        // ============================================================

        console.log('🔹 Step 3: Enter special characters and verify no result');

        try {

          const specialKeywords = ['&&)@', '9908', '###!', '@@@'];

          // Clear current input before starting special char tests
          const clearVisible = await homePage.search.clearIcon.isVisible().catch(() => false);

          if (clearVisible) {
            await homePage.search.clearIcon.click();
            await page.waitForTimeout(1000);
          }

          let specialKeywordPassed = false;
          let testedSpecialKeyword = '';

          for (const keyword of specialKeywords) {

            console.log(`   🔸 Testing special character keyword: "${keyword}"`);

            await homePage.search.inputField.click();

            await homePage.search.inputField.fill('');

            await homePage.search.inputField.fill(keyword);

            await homePage.search.inputField.press('Enter');

            await page.waitForTimeout(2500);

            const { noResultVisible, zeroResultVisible } = await verifyNoResultUI(keyword);

            console.log(`      No result msg visible: ${noResultVisible}`);
            console.log(`      Zero result text visible: ${zeroResultVisible}`);

            if (noResultVisible || zeroResultVisible) {
              specialKeywordPassed = true;
              testedSpecialKeyword = keyword;
              console.log(`      ✅ No result UI shown for special keyword: "${keyword}"`);
              break;
            }

            // Clear for next keyword
            const clearIconVisible = await homePage.search.clearIcon.isVisible().catch(() => false);

            if (clearIconVisible) {
              await homePage.search.clearIcon.click();
              await page.waitForTimeout(1000);
            }
          }

          expect(specialKeywordPassed).toBeTruthy();

          addStepResult(
            'PASS',
            `Success: No search result message is displayed for special characters (e.g. "${testedSpecialKeyword}") with 0 result text.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: No search result message is NOT displayed for special character keywords (&&)@, 9908, ###!, @@@). ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Leave Search Field Blank and Hit Enter
        // ============================================================

        console.log('🔹 Step 4: Leave search field blank and hit Enter');

        try {

          // Clear current input
          const clearIconForBlank = await homePage.search.clearIcon.isVisible().catch(() => false);

          if (clearIconForBlank) {
            await homePage.search.clearIcon.click();
            await page.waitForTimeout(1000);
          }

          // Ensure input is empty
          await homePage.search.inputField.click();

          await homePage.search.inputField.fill('');

          await homePage.search.inputField.press('Enter');

          await page.waitForTimeout(2500);

          // On blank submit — either modal stays open OR no result is shown
          // Check if search modal is still open (blank search = no navigation)
          const modalStillOpen = await homePage.search.modalOverlay
            .isVisible()
            .catch(() => false);

          const inputStillVisible = await homePage.search.inputField
            .isVisible()
            .catch(() => false);

          // Also check if any no-result UI appeared
          const noResultOnBlank = page.locator(
            `text=/No (search )?result(s)? for/i, [class*="noResult"], [class*="no-result"]`
          );

          const noResultOnBlankVisible = await noResultOnBlank.first().isVisible().catch(() => false);

          console.log(`   Modal still open: ${modalStillOpen}`);
          console.log(`   Input still visible: ${inputStillVisible}`);
          console.log(`   No result msg on blank: ${noResultOnBlankVisible}`);

          expect(
            modalStillOpen || inputStillVisible || noResultOnBlankVisible
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Leaving search field blank and pressing Enter does not navigate away — search modal remains open or shows no result message.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unexpected behaviour when search field is left blank and Enter is pressed. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC006',
        title: 'Verification of search bar with invalid keyword',
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