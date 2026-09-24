// tests/cart/TC030_soldOutProducts.spec.js

const { test, expect }  = require('../../utils/testFixture');
const HomePage          = require('../../pages/HomePage');
const SoldOutPage       = require('../../pages/SoldOutPage');
const { logResult }     = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults,
} = require('../../utils/testReporter');

test.describe('Product Module', () => {

  test(
    'TC030 - Verify that the "sold out" status disables the purchase button when the product is unavailable',
      { tag: ['@Cart', '@Regression', '@Smoke'] },
      async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed    = false;
      let soldOutPdpUrl = '';

      console.log('\n======================================================');
      console.log('🚀 Starting TC030 - Verify "Sold Out" product disables Add to Cart');
      console.log('======================================================');

      const homePage    = new HomePage(page);
      const soldOutPage = new SoldOutPage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to the site homepage
        // ============================================================

        console.log('🔹 Step 1: Navigate to the site homepage');

        await homePage.navigateToHome();
        await page.waitForLoadState('networkidle');
        await homePage.closeLoginPopupIfPresent();

        addStepResult(
          'PASS',
          'Success: Homepage loaded successfully'
        );

        // ============================================================
        // STEP 2 : Navigate to product listing page
        //
        // Uses the fixed navigateToShopListingPage() which:
        //   1. Checks homePage.bePicks.letsDiveInButton href first —
        //      only clicks if it points to a shop/collection path
        //   2. Falls back to direct /shop-by-category navigation
        //   3. Falls back to /collections/all if needed
        // This completely avoids the viewport/banner-link error.
        // ============================================================

        console.log('🔹 Step 2: Navigate to product listing page');

        const shopPageUrl = await soldOutPage.navigateToShopListingPage(homePage);

        console.log(`   Shop page URL: ${shopPageUrl}`);

        const onShopPage =
          shopPageUrl.includes('/shop-by-category') ||
          shopPageUrl.includes('/collections/') ||
          shopPageUrl.includes('/products');

        if (onShopPage) {

          addStepResult(
            'PASS',
            `Success: Product listing page loaded successfully — URL: ${shopPageUrl}`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Could not reach a product listing page. Landed on: ${shopPageUrl}`
          );
        }

        if (testFailed) throw new Error('Unable to reach product listing page. Aborting TC030.');

        // ============================================================
        // STEP 3 : Scroll to load lazy products; find first sold-out card
        // ============================================================

        console.log('🔹 Step 3: Scroll to load products and find a sold-out item');

        const outOfStockHref = await soldOutPage.scrollAndFindOutOfStockProduct(6);

        const totalOosCards = await soldOutPage.countOutOfStockCards();

        console.log(`   Total Out-of-Stock cards found : ${totalOosCards}`);
        console.log(`   First Out-of-Stock href        : ${outOfStockHref}`);

        if (!outOfStockHref) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: No sold-out product (btn-disabled button) found on listing page: ${shopPageUrl}. ` +
            `Total disabled buttons detected: ${totalOosCards}. Cannot proceed with TC030.`
          );

        } else {

          addStepResult(
            'PASS',
            `Success: Sold-out product identified — ${totalOosCards} out-of-stock card(s) found. ` +
            `First sold-out product href: ${outOfStockHref}`
          );
        }

        if (testFailed) throw new Error('No sold-out product found. Aborting TC030.');

        // ============================================================
        // STEP 4 : Navigate to the sold-out product's PDP
        // ============================================================

        console.log('🔹 Step 4: Navigate to the sold-out product detail page');

        const origin   = new URL(page.url()).origin;
        soldOutPdpUrl  = outOfStockHref.startsWith('http')
          ? outOfStockHref
          : `${origin}${outOfStockHref}`;

        console.log(`   Navigating to sold-out PDP: ${soldOutPdpUrl}`);

        await soldOutPage.navigateToProductPage(soldOutPdpUrl);
        await homePage.closeLoginPopupIfPresent().catch(() => {});

        const currentUrl = page.url();

        if (currentUrl.includes('/products/')) {

          addStepResult(
            'PASS',
            `Success: User is on the sold-out product detail page — URL: ${currentUrl}`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Navigation did not reach a product page. Current URL: ${currentUrl}`
          );
        }

        if (testFailed) throw new Error('Could not reach the sold-out PDP. Aborting TC030.');

        // Debug: log all Add-to-Cart related DOM elements
        await soldOutPage.debugAddToCartDOM();

        // ============================================================
        // EXPECTED RESULT 1 :
        // For sold-out product, Add to Cart button should NOT be displayed.
        // ============================================================

        console.log('🔹 ER1: Verify static Add to Cart button is disabled / absent for sold-out product');

        const staticBtnStatus = await soldOutPage.verifyStaticAddToCartNotDisplayed();

        console.log(`   Static Add to Cart button status:`);
        console.log(`     count        : ${staticBtnStatus.count}`);
        console.log(`     notDisplayed : ${staticBtnStatus.notDisplayed}`);
        console.log(`     disabled     : ${staticBtnStatus.disabled}`);
        console.log(`     hidden       : ${staticBtnStatus.hidden}`);
        console.log(`     buttonText   : "${staticBtnStatus.buttonText}"`);

        if (staticBtnStatus.notDisplayed) {

          if (staticBtnStatus.count === 0) {

            addStepResult(
              'PASS',
              `Success: Add to Cart button is completely absent from the PDP for the sold-out product`
            );

          } else if (staticBtnStatus.disabled) {

            addStepResult(
              'PASS',
              `Success: Add to Cart button is present but disabled (btn-disabled) for the sold-out product. ` +
              `Button text: "${staticBtnStatus.buttonText}", count: ${staticBtnStatus.count}`
            );

          } else {

            addStepResult(
              'PASS',
              `Success: Add to Cart button is present but hidden for the sold-out product. ` +
              `Count: ${staticBtnStatus.count}`
            );
          }

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Add to Cart button is VISIBLE and ENABLED on the PDP for a sold-out product — ` +
            `it should be disabled or absent. ` +
            `Count: ${staticBtnStatus.count}, disabled: ${staticBtnStatus.disabled}, hidden: ${staticBtnStatus.hidden}, ` +
            `text: "${staticBtnStatus.buttonText}"`
          );
        }

        // ============================================================
        // EXPECTED RESULT 2 :
        // Sticky Add to Cart button should also NOT be displayed
        // for the sold-out product.
        // ============================================================

        console.log('🔹 ER2: Verify sticky Add to Cart button is also disabled / absent for sold-out product');

        const stickyBtnStatus = await soldOutPage.verifyStickyAddToCartNotDisplayed();

        console.log(`   Sticky Add to Cart button status:`);
        console.log(`     found    : ${stickyBtnStatus.found}`);
        console.log(`     disabled : ${stickyBtnStatus.disabled}`);
        console.log(`     hidden   : ${stickyBtnStatus.hidden}`);

        if (!stickyBtnStatus.found) {

          addStepResult(
            'PASS',
            `Success: Sticky Add to Cart button is not present on this PDP for the sold-out product`
          );

        } else if (stickyBtnStatus.disabled || stickyBtnStatus.hidden) {

          addStepResult(
            'PASS',
            `Success: Sticky Add to Cart button is ` +
            `${stickyBtnStatus.disabled ? 'disabled (btn-disabled)' : 'hidden'} ` +
            `for the sold-out product — sticky purchase is correctly blocked`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Sticky Add to Cart button is VISIBLE and ENABLED for the sold-out product — ` +
            `it should be disabled or absent. ` +
            `found: ${stickyBtnStatus.found}, disabled: ${stickyBtnStatus.disabled}, hidden: ${stickyBtnStatus.hidden}`
          );
        }

        // ============================================================
        // EXPECTED RESULT 3 :
        // Clicking quantity "+" / "−" controls should NOT perform any
        // operation (no-op) for the sold-out product.
        // ============================================================

        console.log('🔹 ER3: Verify quantity +/− controls are no-ops for sold-out product');

        const qtyResult = await soldOutPage.verifyQuantityControlsAreNoOp();

        console.log(`   Quantity control status:`);
        console.log(`     visible        : ${qtyResult.qtyControlVisible}`);
        console.log(`     initial qty    : ${qtyResult.initialQty}`);
        console.log(`     after "+"      : ${qtyResult.afterIncrease}`);
        console.log(`     after "−"      : ${qtyResult.afterDecrease}`);
        console.log(`     increase no-op : ${qtyResult.increaseNoOp}`);
        console.log(`     decrease no-op : ${qtyResult.decreaseNoOp}`);

        if (!qtyResult.qtyControlVisible) {

          addStepResult(
            'PASS',
            `Success: Quantity controls are not present on the sold-out PDP — ` +
            `increase/decrease operations cannot be performed (no-op by absence)`
          );

        } else if (qtyResult.increaseNoOp && qtyResult.decreaseNoOp) {

          addStepResult(
            'PASS',
            `Success: Quantity "+" and "−" controls correctly do not change the value ` +
            `on the sold-out PDP — ` +
            `initial: ${qtyResult.initialQty}, after "+": ${qtyResult.afterIncrease}, after "−": ${qtyResult.afterDecrease}`
          );

        } else if (!qtyResult.increaseNoOp && qtyResult.decreaseNoOp) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Quantity "+" changed the value on the sold-out PDP ` +
            `(${qtyResult.initialQty} → ${qtyResult.afterIncrease}) — it should be a no-op`
          );

        } else if (qtyResult.increaseNoOp && !qtyResult.decreaseNoOp) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Quantity "−" changed the value on the sold-out PDP ` +
            `(${qtyResult.initialQty} → ${qtyResult.afterDecrease}) — it should be a no-op`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Both "+" and "−" changed values on the sold-out PDP — ` +
            `initial: ${qtyResult.initialQty}, after "+": ${qtyResult.afterIncrease}, ` +
            `after "−": ${qtyResult.afterDecrease}. Both should be no-ops.`
          );
        }

        // ============================================================
        // SANITY CHECK : No "added to cart" popup should have appeared
        // ============================================================

        console.log('🔹 Sanity: Confirm no "Product added to cart" popup appeared');

        const popupVisible = await soldOutPage.successPopup.isVisible().catch(() => false);

        console.log(`   Success popup visible: ${popupVisible}`);

        if (!popupVisible) {

          addStepResult(
            'PASS',
            `Success: No "Product added to cart" popup appeared — ` +
            `the sold-out product was correctly not added to the cart`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: "Product added to cart" popup appeared for a sold-out product — ' +
            'product should NOT be addable to cart'
          );
        }

      } catch (error) {

        if (!testFailed) {
          testFailed = true;
          addStepResult(
            'FAIL',
            `Failed: Unexpected error during TC030: ${error.message}`
          );
        }

        console.error('❌ Unexpected error:', error.message);
      }

      // ============================================================
      // REPORTING — monocart / logResult
      // ============================================================

      const steps         = getStepResults();
      const overallStatus = testFailed ? 'FAIL' : 'PASS';

      console.log('\n======================================================');
      console.log(`🏁 TC030 Overall Status : ${overallStatus}`);
      console.log('Steps:', JSON.stringify(steps, null, 2));
      console.log('======================================================\n');

      logResult({
        testCaseId : 'TC030',
        title      : 'Verify that the "sold out" status disables the purchase button when the product is unavailable',
        status     : overallStatus,
        steps,
      });

      clearStepResults();

      expect(
        overallStatus,
        'One or more sold-out product validation steps failed — see step log above for details'
      ).toBe('PASS');

    }
  );

});