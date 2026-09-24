// tests/product/productDetail.spec.js

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const ProductPage = require('../../pages/ProductPage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');

test.describe('Product Module', () => {

  test('TC027 - Verify product detail on PDP.',
      { tag: ['@Cart', '@Regression', '@Smoke'] },
      async ({ page }) => {

    test.setTimeout(300000);

    clearStepResults();

    let testFailed = false;

    console.log('\n======================================================');
    console.log('🚀 Starting TC027 - Verify product detail on pdp.');
    console.log('======================================================');

    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);

    try {

      // ============================================================
      // STEP 1 : Go to the site
      // ============================================================

      console.log('🔹 Step 1: Go to the site');

      await homePage.navigateToHome();
      await page.waitForLoadState('networkidle');
      await homePage.closeLoginPopupIfPresent();

      addStepResult(
        'PASS',
        'Success: Homepage loaded successfully'
      );

      // ============================================================
      // STEP 2 : User is on product page
      // ============================================================

      console.log('🔹 Step 2: Navigate to a product page (PDP)');

      const pdpUrl = await productPage.navigateToAnyProductPage(homePage, 'Lakme');

      const onProductPage = await productPage.isOnProductPage();

      if (onProductPage) {

        addStepResult(
          'PASS',
          `Success: User landed on the Product Detail Page : ${pdpUrl}`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: User did not land on a Product Detail Page. Current URL : ${pdpUrl}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 1 :
      // The product name should be displayed below the brand name.
      // ============================================================

      console.log('🔹 Expected Result 1: Verify product name is displayed below brand name');

      const nameVsBrand = await productPage.verifyProductNameBelowBrandName();

      if (
        nameVsBrand.brandVisible &&
        nameVsBrand.nameVisible &&
        nameVsBrand.isBelow
      ) {

        addStepResult(
          'PASS',
          `Success: Product name "${nameVsBrand.nameText}" is displayed below brand name "${nameVsBrand.brandText}"`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Product name not correctly displayed below brand name - BrandVisible:${nameVsBrand.brandVisible}, NameVisible:${nameVsBrand.nameVisible}, IsBelow:${nameVsBrand.isBelow}, BrandText:"${nameVsBrand.brandText}", NameText:"${nameVsBrand.nameText}"`
        );
      }

      // ============================================================
      // EXPECTED RESULT 2 :
      // Verify size (Weight) of product is displayed.
      // ============================================================

      console.log('🔹 Expected Result 2: Verify size (Weight) of product is displayed');

      const sizeResult = await productPage.verifyProductSizeDisplayed();

      if (
        sizeResult.visible &&
        sizeResult.text &&
        sizeResult.hasWeightPattern
      ) {

        addStepResult(
          'PASS',
          `Success: Product size/weight is displayed correctly : "${sizeResult.text}"`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Product size/weight is not displayed as expected - Visible:${sizeResult.visible}, Text:"${sizeResult.text}", MatchesWeightPattern:${sizeResult.hasWeightPattern}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 3 :
      // Verify price of product is displayed as (Example: ₹ 799).
      // ============================================================

      console.log('🔹 Expected Result 3: Verify price of product is displayed in ₹ format');

      const priceResult = await productPage.verifyPriceFormat();

      if (
        priceResult.visible &&
        priceResult.isRupeeFormat
      ) {

        addStepResult(
          'PASS',
          `Success: Product price is displayed in the expected ₹ format : "${priceResult.text}"`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Product price is not displayed in the expected ₹ format - Visible:${priceResult.visible}, Text:"${priceResult.text}"`
        );
      }

      // ============================================================
      // EXPECTED RESULT 4 :
      // Discount percentage is present, followed by
      // '(incl. of all taxes)' text.
      // ============================================================

      console.log('🔹 Expected Result 4: Verify discount percentage and "(incl. of all taxes)" text');

      const discountTaxResult = await productPage.verifyDiscountAndTaxText();

      if (
        discountTaxResult.discountVisible &&
        discountTaxResult.hasDiscountPercentPattern &&
        discountTaxResult.taxVisible &&
        discountTaxResult.hasInclTaxPattern
      ) {

        addStepResult(
          'PASS',
          `Success: Discount percentage "${discountTaxResult.discountText}" and tax text "${discountTaxResult.taxText}" are displayed correctly`
        );

      } else {

        testFailed = true;

        addStepResult(
          'FAIL',
          `Failed: Discount percentage / tax text not displayed as expected - DiscountVisible:${discountTaxResult.discountVisible}, DiscountText:"${discountTaxResult.discountText}", TaxVisible:${discountTaxResult.taxVisible}, TaxText:"${discountTaxResult.taxText}"`
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
      testCaseId: 'TC027',
      title: 'Verify product detail on pdp.',
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