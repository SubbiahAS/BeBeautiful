const { test, expect } = require('../../utils/testFixture');
const HomePage    = require('../../pages/HomePage');
const ProductPage = require('../../pages/ProductPage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');

// ── Known PDP fallback (product with "Add to Cart" enabled) ───────────────────
// Confirmed from screenshot: Lakme Sun Expert page shows quantity + Add to Cart
const FALLBACK_PDP = '/products/lakme-sun-expert-dry-matte-fluid-spf-50-pa-sunscreen-with-1-niacinamide-ceramide';

test.describe('Product Module', () => {

  test('TC028 - Verify that "add to cart" functionality from PDP',
      { tag: ['@Cart', '@Regression', '@Smoke'] },
      async ({ page }) => {

    test.setTimeout(300000);

    clearStepResults();

    let testFailed = false;

    // ── SAFE HELPERS ─────────────────────────────────────────
    // Bounded so no single call can hang past the test's 300s budget,
    // and guarded against an already-closed page.
    const safeWaitForLoad = async (state = 'networkidle', timeout = 15000) => {
      if (page.isClosed()) return;
      await page.waitForLoadState(state, { timeout }).catch(() => {});
    };

    const safeTimeout = async (ms) => {
      if (page.isClosed()) return;
      await page.waitForTimeout(ms).catch(() => {});
    };

    const safeGoto = async (url, options = { waitUntil: 'domcontentloaded', timeout: 30000 }) => {
      if (page.isClosed()) return false;
      return page.goto(url, options).then(() => true).catch(() => false);
    };
    // ─────────────────────────────────────────────────────────

    console.log('\n======================================================');
    console.log('🚀 Starting TC028 - Verify "Add to Cart" functionality from PDP');
    console.log('======================================================');

    const homePage    = new HomePage(page);
    const productPage = new ProductPage(page);

    // Will store the PDP URL so we can navigate back to it later
    let pdpUrl = '';

    try {

      // ============================================================
      // STEP 1 : Navigate to the site homepage
      // ============================================================

      console.log('🔹 Step 1: Navigate to the site homepage');

      await homePage.navigateToHome();
      await safeWaitForLoad();
      await homePage.closeLoginPopupIfPresent();

      addStepResult('PASS', 'Success:Homepage loaded successfully');

      // ============================================================
      // STEP 2 : Navigate to any product detail page (PDP)
      // ============================================================

      console.log('🔹 Step 2: Navigate to a product detail page');

      pdpUrl = await productPage.navigateToAnyProductPage(homePage, 'Lakme');

      console.log(`   PDP URL: ${pdpUrl}`);

      if (pdpUrl.includes('/products/')) {

        addStepResult('PASS', `Success: Navigated to product detail page — URL: ${pdpUrl}`);

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Navigation did not reach a product page. Current URL: ${pdpUrl}`
        );
      }

      if (testFailed) throw new Error('Could not reach a PDP. Aborting TC028.');

      // ============================================================
      // STEP 3 : Verify default product quantity is set to 1
      // Expected Result 1: By default, product quantity on PDP = 1
      // ============================================================

      console.log('🔹 Step 3: Verify default product quantity is set to 1');

      const qtyControlVisible = await productPage.isQuantityControlVisible();

      console.log(`   Quantity control visible: ${qtyControlVisible}`);

      if (!qtyControlVisible) {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: Quantity control (.update-quantity) is not visible on the PDP'
        );

      } else {

        const defaultQty = await productPage.getQuantityValue();

        console.log(`   Default quantity value: ${defaultQty}`);

        if (defaultQty === 1) {

          addStepResult(
            'PASS',
            `Success: Default product quantity on PDP is correctly set to 1 (displayed: "${defaultQty}")`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Default product quantity is ${defaultQty}, expected 1`
          );
        }
      }

      // ============================================================
      // STEP 4 : Click "Add to Cart" with default quantity (1)
      // Expected Result 2: Product added successfully with default qty
      // Expected Result 4: "Product added to cart" success message +
      //                     "Go to Cart" link are displayed
      // ============================================================

      console.log('🔹 Step 4: Click "Add to Cart" button with default quantity (1)');

      await productPage.clickAddToCart();

      // ── Expected Result 4a: success message ──
      const popupVisible   = await productPage.isSuccessPopupVisible();
      const popupText      = await productPage.getSuccessPopupText();
      const goToCartVisible = await productPage.isGoToCartLinkVisible();

      console.log(`   Popup visible     : ${popupVisible}`);
      console.log(`   Popup text        : "${popupText}"`);
      console.log(`   Go to Cart visible: ${goToCartVisible}`);

      if (popupVisible && popupText.toLowerCase().includes('product added to cart')) {

        addStepResult(
          'PASS',
          `Success: "Product added to cart" success message is displayed "${popupText}"`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: "Product added to cart" message not shown. Popup visible: ${popupVisible}, Text: "${popupText}"`
        );
      }

      // ── Expected Result 4b: "Go to Cart" link ──
      if (goToCartVisible) {

        addStepResult(
          'PASS',
          'Success: "Go to Cart" link is visible inside the success popup'
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: "Go to Cart" link is NOT visible inside the success popup'
        );
      }

      // ============================================================
      // STEP 5 : Click "Go to Cart" and verify cart item quantity = 1
      // Expected Result 3: Product quantity in cart = 1 for default add
      // ============================================================

      console.log('🔹 Step 5: Click "Go to Cart" and verify quantity in cart = 1');

      await productPage.clickGoToCart();

      const cartOpen = await productPage.isCartSidebarOpen();

      console.log(`   Cart sidebar open: ${cartOpen}`);

      if (!cartOpen) {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: Cart sidebar did not open after clicking "Go to Cart"'
        );

      } else {

        addStepResult('PASS', 'Success: Cart sidebar opened successfully after clicking "Go to Cart"');

        const itemCount = await productPage.getCartItemCount();

        console.log(`   Cart item count: ${itemCount}`);

        if (itemCount === 0) {

          testFailed = true;

          addStepResult('FAIL', 'Failed: Cart sidebar is open but contains no items');

        } else {

          const cartQty1   = await productPage.getCartItemQuantity(0);
          const cartName1  = await productPage.getCartItemName(0);

          console.log(`   Cart item[0] name     : "${cartName1}"`);
          console.log(`   Cart item[0] quantity : ${cartQty1}`);

          if (cartQty1 === 1) {

            addStepResult(
              'PASS',
              `Success: Product quantity in cart is correctly 1 after default add-to-cart — "${cartName1}" ×${cartQty1}`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Product quantity in cart is ${cartQty1}, expected 1 — "${cartName1}"`
            );
          }
        }
      }

      // ============================================================
      // STEP 6 : Clear the cart, close sidebar, and navigate back to
      //          the same PDP
      // ============================================================

      console.log('🔹 Step 6: Clear cart, close sidebar, and go back to same PDP');

      // Clear cart so the subsequent add-to-cart step starts from 0
      await productPage.clearCart();
      await productPage.closeCartSidebar();

      // ✅ FIXED: goto now bounded via safeGoto, and the follow-up
      // waitForLoadState('networkidle') that previously hung for the full
      // test timeout is now bounded to 15s and never throws.
      const navigatedBack = await safeGoto(pdpUrl);

      if (!navigatedBack) {
        console.log(`   ⚠️ safeGoto failed to reach ${pdpUrl}, retrying once...`);
        await safeGoto(pdpUrl);
      }

      await safeWaitForLoad();
      await safeTimeout(2000);
      await homePage.closeLoginPopupIfPresent().catch(() => {});

      const backOnPdp = !page.isClosed() && page.url().includes('/products/');

      console.log(`   Back on PDP: ${backOnPdp} — URL: ${page.isClosed() ? 'N/A (page closed)' : page.url()}`);

      if (backOnPdp) {

        addStepResult(
          'PASS',
          `Success: Navigated back to the same product detail page — URL: ${page.url()}`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Could not navigate back to the PDP. Current URL: ${page.isClosed() ? 'N/A (page closed)' : page.url()}`
        );
      }

      // ============================================================
      // STEP 7 : Increase product quantity to 2 using "+" control
      // ============================================================

      console.log('🔹 Step 7: Increase product quantity to 2 using "+" control');

      const qtyVisibleAgain = !page.isClosed() && await productPage.isQuantityControlVisible();

      if (!qtyVisibleAgain) {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: Quantity control is not visible after returning to the PDP'
        );

      } else {

        // Confirm starting qty is still 1 (page reloads fresh)
        const qtyBeforeIncrease = await productPage.getQuantityValue();
        console.log(`   Quantity before increase: ${qtyBeforeIncrease}`);

        await productPage.increaseQuantity(1);

        const qtyAfterIncrease = await productPage.getQuantityValue();
        console.log(`   Quantity after  increase: ${qtyAfterIncrease}`);

        if (qtyAfterIncrease === 2) {

          addStepResult(
            'PASS',
            `Success: Product quantity successfully increased to 2 on the PDP (was ${qtyBeforeIncrease}, now ${qtyAfterIncrease})`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Product quantity after clicking "+" is ${qtyAfterIncrease}, expected 2`
          );
        }
      }

      // ============================================================
      // STEP 8 : Click "Add to Cart" with quantity = 2
      // Expected Result 5: Product added successfully with qty 2
      // Expected Result 4 (recheck): success message + "Go to Cart" shown
      // ============================================================

      console.log('🔹 Step 8: Click "Add to Cart" with quantity set to 2');

      await productPage.clickAddToCart();

      const popup2Visible    = await productPage.isSuccessPopupVisible();
      const popup2Text       = await productPage.getSuccessPopupText();
      const goToCart2Visible = await productPage.isGoToCartLinkVisible();

      console.log(`   Popup visible     : ${popup2Visible}`);
      console.log(`   Popup text        : "${popup2Text}"`);
      console.log(`   Go to Cart visible: ${goToCart2Visible}`);

      if (popup2Visible && popup2Text.toLowerCase().includes('product added to cart')) {

        addStepResult(
          'PASS',
          `Success: "Product added to cart" success message is displayed after adding qty 2 — "${popup2Text}"`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Success message not shown after adding qty 2. Popup visible: ${popup2Visible}, Text: "${popup2Text}"`
        );
      }

      if (goToCart2Visible) {

        addStepResult(
          'PASS',
          'Success: "Go to Cart" link is visible in the success popup after adding qty 2'
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: "Go to Cart" link is NOT visible in the success popup after adding qty 2'
        );
      }

      // ============================================================
      // STEP 9 : Click "Go to Cart" and verify cart item quantity = 2
      // Expected Result 6: Cart quantity matches updated PDP quantity (2)
      // ============================================================

      console.log('🔹 Step 9: Click "Go to Cart" and verify quantity in cart = 2');

      await productPage.clickGoToCart();

      const cart2Open = await productPage.isCartSidebarOpen();

      console.log(`   Cart sidebar open: ${cart2Open}`);

      if (!cart2Open) {

        testFailed = true;

        addStepResult(
          'FAIL',
          'Failed: Cart sidebar did not open after clicking "Go to Cart" (qty 2 scenario)'
        );

      } else {

        addStepResult(
          'PASS',
          'Success: Cart sidebar opened successfully after clicking "Go to Cart" (qty 2 scenario)'
        );

        const itemCount2 = await productPage.getCartItemCount();

        console.log(`   Cart item count: ${itemCount2}`);

        if (itemCount2 === 0) {

          testFailed = true;

          addStepResult('FAIL', 'Failed: Cart sidebar is open but contains no items (qty 2 scenario)');

        } else {

          const cartQty2  = await productPage.getCartItemQuantity(0);
          const cartName2 = await productPage.getCartItemName(0);

          console.log(`   Cart item[0] name     : "${cartName2}"`);
          console.log(`   Cart item[0] quantity : ${cartQty2}`);

          if (cartQty2 === 2) {

            addStepResult(
              'PASS',
              `Success: Product quantity in cart matches the updated PDP quantity (2) — "${cartName2}" ×${cartQty2}`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Cart quantity is ${cartQty2}, expected 2 — "${cartName2}". Cart quantity does not match the quantity selected on the PDP.`
            );
          }
        }
      }

    } catch (error) {

      if (!testFailed) {
        testFailed = true;
        addStepResult('FAIL', `Unexpected error during TC028: ${error.message}`);
      }

      console.error('❌ Unexpected error:', error.message);
    }

    // ============================================================
    // REPORTING — monocart / logResult
    // ============================================================

    const steps         = getStepResults();
    const overallStatus = testFailed ? 'FAIL' : 'PASS';

    console.log('\n======================================================');
    console.log(`TC028 Overall Status : ${overallStatus}`);
    console.log('Steps:', JSON.stringify(steps, null, 2));
    console.log('======================================================\n');

    logResult({
      testCaseId : 'TC028',
      title      : 'Verify that "add to cart" functionality from pdp',
      status     : overallStatus,
      steps
    });

    clearStepResults();

    expect(
      overallStatus,
      'One or more Add-to-Cart validation steps failed — see step log above for details'
    ).toBe('PASS');

  });

});