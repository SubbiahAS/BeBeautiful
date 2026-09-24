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
    'TC008 - Verify cart icon on global navbar when it has items in it',
    { tag: ['@Cart', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;
      let expectedProducts = [];
      let totalExpectedCount = 0;

      console.log('\n======================================================');
      console.log('🚀 Starting TC008 - Verify cart icon on global navbar when it has items in it');
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

        addStepResult('PASS', 'Success: Homepage loaded successfully');

        // ============================================================
        // PRE-CONDITION : Add 3 Lakme Products To Cart
        // ============================================================

        console.log('🔹 Precondition: Add 3 Lakme Products To Cart');

        try {

          expectedProducts = await homePage.addLakmeProductsToCart(3, [1, 1, 1]);
          totalExpectedCount = expectedProducts.reduce((sum, p) => sum + p.quantity, 0);

          console.log('   Expected products added:', JSON.stringify(expectedProducts, null, 2));
          console.log(`   Total expected SKU quantity: ${totalExpectedCount}`);

          addStepResult(
            'PASS',
            'Success: Three Lakme products added to cart successfully'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unable to add Lakme products to cart: ${error.message}`
          );
        }

        // ============================================================
        // STEP 2a : Verify Cart Icon Visibility
        // Expected: Cart icon is displayed on the global navigation bar
        // ============================================================

        console.log('🔹 Step 2a: Verify Cart Icon Visibility');

        await page.waitForTimeout(2000);

        const cartVisible =
          await homePage.cartIcon.isVisible().catch(() => false);

        if (cartVisible) {

          addStepResult(
            'PASS',
            'Success: Cart icon is displayed on global navigation bar'
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Cart icon is not displayed on global navigation bar'
          );
        }

        // ============================================================
        // STEP 2b : Verify Cart Icon Position
        // Expected: Cart icon is at correct position (right of profile, right of search)
        // ============================================================

        console.log('🔹 Step 2b: Verify Cart Icon Position');

        try {

          const searchBox = await homePage.searchIcon.boundingBox();
          const profileBox = await homePage.profileIcon.boundingBox();
          const cartBox = await homePage.cartIcon.boundingBox();

          const positionValid =
            cartBox &&
            profileBox &&
            searchBox &&
            cartBox.x > profileBox.x &&
            profileBox.x > searchBox.x;

          if (positionValid) {

            addStepResult(
              'PASS',
              'Success: Cart icon is displayed at correct position on global navigation bar (right of profile icon, right of search icon)'
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              'Failed: Cart icon position is incorrect — expected: search → profile → cart (left to right)'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unable to verify cart icon position: ${error.message}`
          );
        }

        // ============================================================
        // STEP 2c : Verify Cart Badge Count Matches SKUs Added (EXACT)
        // Expected: Cart icon displays exact count of SKUs added
        // ============================================================

        console.log('🔹 Step 2c: Verify Cart Badge SKU Count (exact match)');

        await page.waitForTimeout(2000);

        const badgeVisible =
          await homePage.cart.badge
            .isVisible()
            .catch(() => false);

        let skuCount = 0;

        if (badgeVisible) {

          const badgeText =
            await homePage.cart.badge
              .textContent()
              .catch(() => '0');

          skuCount = parseInt(badgeText.trim()) || 0;

          console.log(`   Cart badge count: ${skuCount} (expected exactly: ${totalExpectedCount})`);

          if (skuCount === totalExpectedCount) {

            addStepResult(
              'PASS',
              `Success: Cart icon displays correct SKU count of ${skuCount}, matching exactly the ${totalExpectedCount} SKUs added`
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Expected cart count to be exactly ${totalExpectedCount} but found ${skuCount}`
            );
          }

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Cart count badge is not visible on the cart icon'
          );
        }

        // ============================================================
        // STEP 3 : Click Cart Icon — Verify Cart Slider Opens
        // Expected: Clicking on the cart icon opens the cart slider
        // ============================================================

        console.log('🔹 Step 3: Click Cart Icon and Verify Slider Opens');

        await homePage.cartIcon.click();
        await page.waitForTimeout(3000);

        const cartOpened = await homePage.isCartSliderOpened();

        if (cartOpened) {

          addStepResult(
            'PASS',
            'Success: Clicking on the cart icon opens the cart slider successfully'
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Clicking on the cart icon did not open the cart slider'
          );
        }

        // ============================================================
        // STEP 4 : Verify Cart Slider Mandatory Elements
        // ============================================================

        console.log('🔹 Step 4: Verify Cart Slider Mandatory Elements');

        const titleVisible =
          await homePage.cart.title.isVisible().catch(() => false);

        const titleText =
          await homePage.cart.title.textContent().catch(() => '');

        console.log(`   Cart title text: "${titleText.trim()}"`);

        const closeVisible =
          await homePage.cart.closeButton.isVisible().catch(() => false);

        if (titleVisible && closeVisible) {

          addStepResult(
            'PASS',
            `Success: Cart slider displays mandatory elements: title ("${titleText.trim()}") and close button`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Cart slider missing elements — title: ${titleVisible}, close button: ${closeVisible}`
          );
        }

        // ============================================================
        // STEP 5a : Verify Correct SKUs Are Displayed in Cart (EXACT NAME MATCH)
        // ============================================================

        console.log('🔹 Step 5a: Verify Correct SKUs Displayed in Cart (name-matched against added products)');

        const cartItemCount = await homePage.cart.itemCards.count();
        console.log(`   Cart item count in slider: ${cartItemCount}`);

        let matchResult = { cartItems: [], results: [], allMatched: false };

        if (cartItemCount === expectedProducts.length) {

          matchResult = await homePage.verifyCartMatchesAddedProducts(expectedProducts);

          matchResult.results.forEach((r) => {
            console.log(
              `   Expected: "${r.expectedName}" (qty ${r.expectedQty}) → ` +
              `${r.matched ? `Matched: "${r.actualName}" (qty ${r.actualQty})` : 'NOT FOUND in cart'}`
            );
          });

          const namesMatched = matchResult.results.every((r) => r.matched);

          if (namesMatched) {

            addStepResult(
              'PASS',
              `Success: Correct SKUs are displayed in the cart — all ${expectedProducts.length} added products (` +
              `${expectedProducts.map((p) => p.name).join(', ')}) were found in the cart slider`
            );

          } else {

            testFailed = true;

            const missing = matchResult.results
              .filter((r) => !r.matched)
              .map((r) => r.expectedName)
              .join(', ');

            addStepResult(
              'FAIL',
              `Failed: The following added products were not found in the cart slider: ${missing}`
            );
          }

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Expected exactly ${expectedProducts.length} SKUs in cart slider but found ${cartItemCount}`
          );
        }

        // ============================================================
        // STEP 5b : Verify Product Quantity in Cart Matches Selected Quantity
        // (compares each product's ACTUAL selected quantity vs displayed quantity)
        // ============================================================

        console.log('🔹 Step 5b: Verify Product Quantity in Cart Matches Selected Quantity');

        if (matchResult.results.length > 0) {

          const quantityMismatches = matchResult.results.filter(
            (r) => r.matched && r.actualQty !== r.expectedQty
          );

          matchResult.results.forEach((r) => {
            if (r.matched) {
              console.log(`   "${r.expectedName}" → expected qty: ${r.expectedQty}, actual qty in cart: ${r.actualQty}`);
            }
          });

          if (quantityMismatches.length === 0 && matchResult.results.every((r) => r.matched)) {

            addStepResult(
              'PASS',
              `Success: Product quantity displayed in cart matches the quantity selected by the user for all ${matchResult.results.length} products`
            );

          } else {

            testFailed = true;

            const mismatchDetails = quantityMismatches
              .map((r) => `"${r.expectedName}" expected ${r.expectedQty} but found ${r.actualQty}`)
              .join('; ');

            addStepResult(
              'FAIL',
              `Failed: Quantity mismatch in cart — ${mismatchDetails || 'one or more products missing from cart'}`
            );
          }

        } else {

          const quantitySelectorVisible =
            await homePage.cart.quantitySelector.first().isVisible().catch(() => false);

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Unable to verify quantities — no matched cart items available (quantity selector visible: ${quantitySelectorVisible})`
          );
        }

        // ============================================================
        // STEP 5c-i : Verify Product Name in Cart
        // ============================================================

        console.log('🔹 Step 5c-i: Verify Product Name');

        const productNameVisible =
          await homePage.cart.productName.first().isVisible().catch(() => false);

        if (productNameVisible) {

          const productNameText =
            await homePage.cart.productName.first().textContent().catch(() => '');

          console.log(`   Product name: ${productNameText.trim()}`);

          addStepResult(
            'PASS',
            `Success: Product name is displayed in cart: "${productNameText.trim()}"`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Product name is not displayed in the cart slider'
          );
        }

        // ============================================================
        // STEP 5c-ii : Verify Product Image in Cart
        // ============================================================

        console.log('🔹 Step 5c-ii: Verify Product Image');

        const productImageVisible =
          await homePage.cart.productImage.first().isVisible().catch(() => false);

        if (productImageVisible) {
          addStepResult('PASS', 'Success: Product image is displayed in the cart slider');
        } else {
          testFailed = true;
          addStepResult('FAIL', 'Failed: Product image is not displayed in the cart slider');
        }

        // ============================================================
        // STEP 5c-iii : Verify Product Price in Cart
        // ============================================================

        console.log('🔹 Step 5c-iii: Verify Product Price');

        const productPriceVisible =
          await homePage.cart.productPrice.first().isVisible().catch(() => false);

        if (productPriceVisible) {

          const priceText =
            await homePage.cart.productPrice.first().textContent().catch(() => '');

          console.log(`   Product price: ${priceText.trim()}`);

          addStepResult(
            'PASS',
            `Success: Product price is displayed in cart: "${priceText.trim()}"`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            'Failed: Product price is not displayed in the cart slider'
          );
        }

        // ============================================================
        // STEP 5c-iv : Verify Discount (if applicable)
        // ============================================================

        console.log('🔹 Step 5c-iv: Verify Discount (if applicable)');

        const discountVisible =
          await homePage.cart.productDiscount.first().isVisible().catch(() => false);

        if (discountVisible) {

          const discountText =
            await homePage.cart.productDiscount.first().textContent().catch(() => '');

          console.log(`   Discount: ${discountText.trim()}`);

          addStepResult(
            'PASS',
            `Success: Discount is displayed in cart: "${discountText.trim()}"`
          );

        } else {

          addStepResult(
            'PASS',
            'Success: Discount section is not applicable for these products (no strike-through/discount price displayed)'
          );
        }

        // ============================================================
        // STEP 5c-v : Verify Quantity Selector in Cart
        // ============================================================

        console.log('🔹 Step 5c-v: Verify Quantity Selector');

        const quantityVisible =
          await homePage.cart.quantitySelector.first().isVisible().catch(() => false);

        if (quantityVisible) {
          addStepResult('PASS', 'Success: Quantity selector is displayed for each cart item');
        } else {
          testFailed = true;
          addStepResult('FAIL', 'Failed: Quantity selector is not displayed in the cart slider');
        }

        // ============================================================
        // STEP 5c-vi : Verify Delete/Remove Icon in Cart
        // ============================================================

        console.log('🔹 Step 5c-vi: Verify Delete/Remove Icon');

        const removeCount = await homePage.cart.removeIcon.count();
        console.log(`   Remove icon count: ${removeCount}`);

        if (removeCount > 0) {
          addStepResult('PASS', 'Success: Delete/Remove icon is displayed for each cart item');
        } else {
          testFailed = true;
          addStepResult('FAIL', 'Failed: Delete/Remove icon is not displayed in the cart slider');
        }

        // ============================================================
        // STEP 6 : Verify Cart Item Count Matches SKUs Added (EXACT)
        // Expected: Cart icon count = exact number of SKUs added by the user
        // ============================================================

        console.log('🔹 Step 6: Verify Cart Item Count Matches SKUs Added (exact match)');

        const finalBadgeText =
          await homePage.cart.badge
            .textContent()
            .catch(() => '0');

        const finalSkuCount = parseInt(finalBadgeText.trim()) || 0;

        console.log(`   Final cart badge count: ${finalSkuCount} (expected exactly: ${totalExpectedCount})`);

        if (finalSkuCount === totalExpectedCount) {

          addStepResult(
            'PASS',
            `Success: Cart icon correctly displays count of ${finalSkuCount}, matching exactly the number of SKUs added to cart`
          );

        } else {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Cart icon count ${finalSkuCount} does not match expected exact count of ${totalExpectedCount} SKUs added`
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
        testCaseId: 'TC008',
        title: 'Verify cart icon on global navbar when it has items in it',
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