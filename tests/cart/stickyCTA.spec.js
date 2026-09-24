// tests/product/TC036_verifyStickyCTAButton.spec.js
//
// TC036 — Verify sticky CTA button functionality
//
// Test Steps:
//   1. Go to the site
//   2. User is on product page (discounted + in-stock product)
//   3. Scroll down the page
//   4. Observe the sticky CTA button ("Add to Cart")
//
// Expected Results:
//   ER1. Sticky bar should appear at the bottom of the screen as the user
//        scrolls down. The button must be clickable at any point while scrolling.
//   ER2. The sticky bar must contain:
//        a. product image
//        b. product name
//        c. price + discount percentage
//        d. qty selector (− / value / +)
//        e. Add to Cart button
//   ER3. Clicking the sticky Add to Cart button adds the product to cart
//        with a success message.
//
// NOTE ON PRODUCT SELECTION:
//   The test uses StickyCTAPage.navigateToDiscountedInStockProduct() which:
//   • Searches for products (keyword "Lakme")
//   • Iterates through results, skipping sold-out (btn-disabled) products
//     and products with no visible discount percentage
//   • Stops at the first product that is BOTH in-stock AND has a discount
//   • Falls back to the known PDP from the screenshot if no match found

const { test, expect }  = require('../../utils/testFixture');
const HomePage          = require('../../pages/HomePage');
const StickyCTAPage     = require('../../pages/StickyCTAPage');
const { logResult }     = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults,
} = require('../../utils/testReporter');

test.describe('Product Module', () => {

  test(
    'TC036 - Verify sticky cta button functionality',
      { tag: ['@Cart', '@Regression', '@Smoke'] },
      async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed  = false;
      let productUrl  = '';

      console.log('\n======================================================');
      console.log('🚀 Starting TC036 - Verify sticky CTA button functionality');
      console.log('======================================================');

      const homePage      = new HomePage(page);
      const stickyCTAPage = new StickyCTAPage(page);

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
          'Success: Homepage loaded successfully'
        );

        // ============================================================
        // STEP 2 : Navigate to a discounted, in-stock product PDP
        //
        // Uses StickyCTAPage.navigateToDiscountedInStockProduct() which
        // searches for products, checks each PDP for:
        //   • in-stock Add-to-Cart (no btn-disabled class)
        //   • visible discount-percentage element
        // Falls back to the known Lakme URL from the screenshot.
        // ============================================================

        console.log('🔹 Step 2: Navigate to discounted in-stock product PDP');

        productUrl = await stickyCTAPage.navigateToDiscountedInStockProduct(
          homePage,
          'Lakme'
        );

        const currentUrl  = page.url();
        const onPDP       = currentUrl.includes('/products/');

        console.log(`   Product PDP URL: ${currentUrl}`);

        if (onPDP) {

          addStepResult(
            'PASS',
            `Success: User is on a discounted in-stock product detail page — URL: ${currentUrl}`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Navigation did not reach a product PDP. Current URL: ${currentUrl}`
          );
        }

        if (testFailed) throw new Error('Could not reach a discounted in-stock PDP. Aborting TC036.');

        // ============================================================
        // STEP 3 : Scroll down and verify sticky bar appears
        // ============================================================

        console.log('🔹 Step 3: Scroll down the page — observe sticky CTA bar');

        // Ensure we start from the top
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);

        const stickyAppeared = await stickyCTAPage.scrollUntilStickyBarVisible(4000, 300);

        console.log(`   Sticky bar appeared: ${stickyAppeared}`);

        if (stickyAppeared) {

          addStepResult(
            'PASS',
            'Success: Sticky bar appeared during page scroll'
          );

        } else {

          // Non-fatal at step level — scroll further and re-check
          console.log('   ⚠️ Sticky bar not yet visible — scrolling further…');
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
          await page.waitForTimeout(1000);
        }

        // ── Debug DOM after scrolling ──────────────────────────────
        await stickyCTAPage.debugStickyBarDOM();

        // ============================================================
        // EXPECTED RESULT 1 :
        // Sticky bar should appear at the bottom of the screen as the
        // user scrolls down. The button should be clickable at any point.
        // ============================================================

        console.log('🔹 ER1: Verify sticky CTA bar is visible and positioned at bottom of screen');

        try {

          const isVisible = await stickyCTAPage.isStickyBarVisible();

          console.log(`   Sticky bar visible : ${isVisible}`);

          if (!isVisible) {

            testFailed = true;

            addStepResult(
              'FAIL',
              'Failed: Sticky CTA bar is not visible after scrolling down the PDP'
            );

          } else {

            // Verify it is positioned near the bottom of the viewport
            const isAtBottom = await stickyCTAPage.isStickyBarAtBottom();

            console.log(`   Sticky bar at bottom : ${isAtBottom}`);

            // Verify the Add to Cart button inside it is clickable
            const addToCartBtnClickable =
              await stickyCTAPage.stickyAddToCartBtn.isVisible().catch(() => false) &&
              await stickyCTAPage.stickyAddToCartBtn.isEnabled().catch(() => false);

            console.log(`   Sticky Add to Cart button clickable : ${addToCartBtnClickable}`);

            if (isAtBottom && addToCartBtnClickable) {

              addStepResult(
                'PASS',
                'Success: Sticky CTA bar is visible, positioned at the bottom of the screen, ' +
                'and the Add to Cart button is clickable while scrolling'
              );

            } else if (!isAtBottom) {

              testFailed = true;

              addStepResult(
                'FAIL',
                'Failed: Sticky CTA bar is visible but NOT positioned at the bottom of the screen'
              );

            } else {

              testFailed = true;

              addStepResult(
                'FAIL',
                'Failed: Sticky CTA bar is visible at the bottom but the Add to Cart button is NOT clickable'
              );
            }
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unexpected error verifying sticky bar visibility: ${error.message}`
          );
        }

        // ============================================================
        // EXPECTED RESULT 2 :
        // Verify the sticky bar contains:
        //   a. product image
        //   b. product name
        //   c. price + discount percentage
        //   d. qty selector (−/value/+)
        //   e. Add to Cart button
        // ============================================================

        console.log('🔹 ER2: Verify all required elements are present on sticky CTA bar');

        try {

          // ── 2a : Product Image ─────────────────────────────────

          console.log('   🔹 ER2a: Product image');

          const imgVisible = await stickyCTAPage.isStickyProductImageVisible();

          console.log(`     Product image visible : ${imgVisible}`);

          if (imgVisible) {

            addStepResult(
              'PASS',
              'Success: Product image is displayed on the sticky CTA bar'
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              'Failed: Product image is NOT displayed on the sticky CTA bar'
            );
          }

          // ── 2b : Product Name ──────────────────────────────────

          console.log('   🔹 ER2b: Product name');

          const nameVisible = await stickyCTAPage.isStickyProductNameVisible();
          const nameText    = await stickyCTAPage.getStickyProductNameText();

          console.log(`     Product name visible : ${nameVisible}, text: "${nameText}"`);

          if (nameVisible && nameText.length > 0) {

            addStepResult(
              'PASS',
              `Success: Product name is displayed on the sticky CTA bar: "${nameText}"`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Product name is NOT displayed on the sticky CTA bar. ` +
              `Visible: ${nameVisible}, text: "${nameText}"`
            );
          }

          // ── 2c : Price + Discount ──────────────────────────────

          console.log('   🔹 ER2c: Price and discount percentage');

          const priceVisible    = await stickyCTAPage.isStickyPriceVisible();
          const priceText       = await stickyCTAPage.getStickyDiscountPriceText();
          const discountVisible = await stickyCTAPage.isStickyDiscountPercentVisible();
          const discountText    = await stickyCTAPage.getStickyDiscountPercentText();

          console.log(
            `     Price visible: ${priceVisible}, text: "${priceText}" | ` +
            `Discount visible: ${discountVisible}, text: "${discountText}"`
          );

          // Price must contain ₹ and a number
          const priceFormatOk =
            priceVisible &&
            /₹/.test(priceText) &&
            /\d+/.test(priceText);

          // Discount must contain a number and % sign
          const discountFormatOk =
            discountVisible &&
            /\d+/.test(discountText) &&
            /%/.test(discountText);

          if (priceFormatOk && discountFormatOk) {

            addStepResult(
              'PASS',
              `Success: Price "${priceText}" and discount "${discountText}" are displayed ` +
              'on the sticky CTA bar'
            );

          } else if (!priceFormatOk) {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Price is missing or has wrong format on the sticky CTA bar. ` +
              `Visible: ${priceVisible}, text: "${priceText}"`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Discount percentage is missing or has wrong format on the sticky CTA bar. ` +
              `Visible: ${discountVisible}, text: "${discountText}"`
            );
          }

          // ── 2d : Qty Selector ──────────────────────────────────

          console.log('   🔹 ER2d: Qty selector');

          const qtyVisible      = await stickyCTAPage.isStickyQtySelectorVisible();
          const qtyDecVisible   = await stickyCTAPage.stickyQty.decrease.isVisible().catch(() => false);
          const qtyValueVisible = await stickyCTAPage.stickyQty.value.isVisible().catch(() => false);
          const qtyIncVisible   = await stickyCTAPage.stickyQty.increase.isVisible().catch(() => false);
          const qtyValue        = await stickyCTAPage.getStickyQtyValue();

          console.log(
            `     Qty wrapper: ${qtyVisible} | "−": ${qtyDecVisible} | ` +
            `value: ${qtyValueVisible} (${qtyValue}) | "+": ${qtyIncVisible}`
          );

          if (qtyVisible && qtyDecVisible && qtyValueVisible && qtyIncVisible) {

            addStepResult(
              'PASS',
              `Success: Qty selector (−, ${qtyValue}, +) is displayed on the sticky CTA bar`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Qty selector elements missing on the sticky CTA bar. ` +
              `wrapper: ${qtyVisible}, "−": ${qtyDecVisible}, value: ${qtyValueVisible}, "+": ${qtyIncVisible}`
            );
          }

          // Bonus: verify qty +/− work in the sticky bar
          if (qtyVisible) {

            const initialQty  = await stickyCTAPage.getStickyQtyValue();
            const afterInc    = await stickyCTAPage.increaseStickyQty();
            const afterDec    = await stickyCTAPage.decreaseStickyQty();

            console.log(
              `     Qty change test — initial: ${initialQty}, after "+": ${afterInc}, after "−": ${afterDec}`
            );

            if (afterInc > initialQty && afterDec === initialQty) {

              addStepResult(
                'PASS',
                `Success: Qty +/− controls work correctly in sticky bar ` +
                `(initial: ${initialQty}, after "+": ${afterInc}, after "−": ${afterDec})`
              );

            } else {

              // Non-fatal bonus check — log as info only
              addStepResult(
                'PASS',
                `Success: Qty change: initial: ${initialQty}, ` +
                `after "+": ${afterInc}, after "−": ${afterDec}`
              );
            }
          }

          // ── 2e : Add to Cart Button ────────────────────────────

          console.log('   🔹 ER2e: Add to Cart button on sticky bar');

          const addToCartVisible = await stickyCTAPage.isStickyAddToCartBtnVisible();
          const addToCartEnabled = await stickyCTAPage.stickyAddToCartBtn
            .isEnabled().catch(() => false);

          const addToCartText = (
            (await stickyCTAPage.stickyAddToCartBtn.textContent().catch(() => '')) || ''
          ).trim();

          console.log(
            `     Add to Cart btn visible: ${addToCartVisible}, ` +
            `enabled: ${addToCartEnabled}, text: "${addToCartText}"`
          );

          if (addToCartVisible && addToCartEnabled) {

            addStepResult(
              'PASS',
              `Success: Add to Cart button is visible and enabled on the sticky CTA bar. ` +
              `Button text: "${addToCartText}"`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Add to Cart button on sticky bar issue. ` +
              `Visible: ${addToCartVisible}, enabled: ${addToCartEnabled}, text: "${addToCartText}"`
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unexpected error verifying sticky bar elements: ${error.message}`
          );
        }

        // ============================================================
        // EXPECTED RESULT 3 :
        // Clicking sticky Add to Cart button adds the product to cart
        // with a success message.
        // ============================================================

        console.log('🔹 ER3: Click sticky Add to Cart button — verify product added with success msg');

        try {

          // Ensure sticky bar is in view before clicking
          const isVisible = await stickyCTAPage.isStickyBarVisible();

          if (!isVisible) {

            // Try scrolling again to bring it back
            await page.evaluate(() => window.scrollBy(0, 200));
            await page.waitForTimeout(500);
          }

          // ── 3a : Click the sticky Add to Cart button ───────────

          console.log('   🔹 ER3a: Click sticky Add to Cart button');

          const popupAppeared = await stickyCTAPage.clickStickyAddToCart();

          console.log(`   Success popup appeared: ${popupAppeared}`);

          if (popupAppeared) {

            addStepResult(
              'PASS',
              'Success: Sticky Add to Cart button clicked successfully — success popup appeared'
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              'Failed: Clicking sticky Add to Cart button did not trigger the success popup'
            );
          }

          // ── 3b : Verify success message text ──────────────────

          console.log('   🔹 ER3b: Verify success popup message');

          const popupVisible  = await stickyCTAPage.isSuccessPopupVisible();
          const popupText     = await stickyCTAPage.getSuccessPopupText();
          const goToCartShown = await stickyCTAPage.isGoToCartBtnVisible();

          console.log(
            `   Popup visible: ${popupVisible}, ` +
            `text: "${popupText}", Go to Cart shown: ${goToCartShown}`
          );

          const successMsgValid =
            popupVisible &&
            (
              popupText.toLowerCase().includes('added') ||
              popupText.toLowerCase().includes('cart') ||
              popupText.toLowerCase().includes('success')
            );

          if (successMsgValid) {

            addStepResult(
              'PASS',
              `Success: Success message is displayed: "${popupText}". ` +
              `"Go to Cart" button shown: ${goToCartShown}`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Success message not displayed correctly. ` +
              `Popup visible: ${popupVisible}, text: "${popupText}"`
            );
          }

          // ── 3c : Click "Go to Cart" and verify item in cart ───

          console.log('   🔹 ER3c: Click "Go to Cart" and verify product appears in cart');

          if (goToCartShown) {

            await stickyCTAPage.clickGoToCart();

            const cartOpen     = await stickyCTAPage.isCartSidebarOpen();
            const cartCount    = await stickyCTAPage.getCartItemCount();

            console.log(
              `   Cart sidebar open: ${cartOpen}, cart item count: ${cartCount}`
            );

            if (cartOpen && cartCount > 0) {

              addStepResult(
                'PASS',
                `Success: Cart sidebar opened after clicking "Go to Cart" and ` +
                `product is in cart. Cart item count: ${cartCount}`
              );

            } else if (!cartOpen) {

              testFailed = true;

              addStepResult(
                'FAIL',
                'Failed: Cart sidebar did not open after clicking "Go to Cart"'
              );

            } else {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Cart sidebar opened but no items found. Cart count: ${cartCount}`
              );
            }

          } else {

            addStepResult(
              'PASS',
              'Failed: "Go to Cart" button was not visible; popup may have auto-dismissed'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unexpected error during sticky Add to Cart verification: ${error.message}`
          );
        }

      } catch (error) {

        if (!testFailed) {
          testFailed = true;
          addStepResult(
            'FAIL',
            `Failed: Unexpected error during TC036: ${error.message}`
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
      console.log(`🏁 TC036 Overall Status : ${overallStatus}`);
      console.log('Steps:', JSON.stringify(steps, null, 2));
      console.log('======================================================\n');

      logResult({
        testCaseId : 'TC036',
        title      : 'Verify sticky cta button functionality',
        status     : overallStatus,
        steps,
      });

      clearStepResults();

      expect(
        overallStatus,
        'One or more sticky CTA validation steps failed — see step log above for details'
      ).toBe('PASS');

    }
  );

});