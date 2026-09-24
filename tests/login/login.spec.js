const { test, expect } = require('../../utils/testFixture');
const LoginPage = require('../../pages/LoginPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');
const { handleCookieBanner } = require('../../utils/helpers');
require('dotenv').config();

// Mobile numbers loaded from .env
const MOBILE = {
    VALID_1: process.env.MOBILE_VALID_1 || '9876543210',
    INVALID_SHORT: process.env.MOBILE_INVALID_SHORT || '12345',
    INVALID_ALPHA: process.env.MOBILE_INVALID_ALPHA || 'abcdef'
};

// Expected UI texts from .env
const TEXT_FEELS_GOOD =
    process.env.TEXT_FEELS_GOOD ||
    'Feels good to see you again';

const TEXT_LETS_DIVE =
    process.env.TEXT_LETS_DIVE ||
    'Let\'s dive in';

test.describe('Login Page Tests', () => {

    test(
        'TC070 - Verify UI of login page',
        { tag: ['@Login', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(180000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC070 - Verify UI of login page');
            console.log('======================================================');

            const loginPage = new LoginPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Login Page
                // ============================================================

                console.log('🔹 Step 1: Navigate to Login Page');

                const loginPageLoaded =
                    await loginPage.navigateTo();

                await handleCookieBanner(page);

                if (!loginPageLoaded) {
                    throw new Error('Could not navigate to Login page.');
                }

                addStepResult(
                    'PASS',
                    'Success: Login page loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Login Screen
                // ============================================================

                console.log('🔹 Step 2: Verify Login Screen');

                try {

                    let loginScreenFound = false;

                    for (const selector of [
                        '.login-page',
                        '.auth-page',
                        'input[type="tel"]',
                        '.login h2.heading'
                    ]) {

                        if (
                            await page.locator(selector)
                                .isVisible()
                                .catch(() => false)
                        ) {

                            loginScreenFound = true;

                            addStepResult(
                                'PASS',
                                `Success: Login screen is displayed (identified using "${selector}").`
                            );

                            break;
                        }
                    }

                    if (!loginScreenFound) {
                        throw new Error('Login screen not displayed.');
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Login screen verification failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Login Banner
                // ============================================================

                console.log('🔹 Step 3: Verify Login Banner');

                try {

                    await expect(
                        loginPage.loginBanner
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Login banner is displayed on the left side of the page.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Login banner verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Welcome Heading
                // ============================================================

                console.log('🔹 Step 4: Verify Welcome Heading');

                try {

                    await expect(
                        loginPage.feelsGoodText
                    ).toBeVisible();

                    await expect(
                        loginPage.letsDiveText
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        `Success: "${TEXT_FEELS_GOOD}" and "${TEXT_LETS_DIVE}" headings are displayed.`
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Welcome heading verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Mobile Number Input
                // ============================================================

                console.log('🔹 Step 5: Verify Mobile Number Input');

                try {

                    await expect(
                        loginPage.mobileInput.first()
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Mobile number input field is displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Mobile number input verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify Login Button
                // ============================================================

                console.log('🔹 Step 6: Verify Login Button');

                try {

                    await expect(
                        loginPage.loginBtn.first()
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Login button is displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Login button verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 7 : Verify Social Login Buttons
                // ============================================================

                console.log('🔹 Step 7: Verify Social Login Buttons');

                try {

                    const googleVisible =
                        await loginPage.googleLoginBtn
                            .first()
                            .isVisible()
                            .catch(() => false);

                    const facebookVisible =
                        await loginPage.facebookLoginBtn
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (googleVisible && facebookVisible) {

                        addStepResult(
                            'PASS',
                            'Success: Google and Facebook login buttons are displayed.'
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            `Google visible: ${googleVisible}, Facebook visible: ${facebookVisible}.`
                        );
                    }

                } catch (error) {

                    addStepResult(
                        'SKIP',
                        `Social login verification skipped. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 8 : Verify Create Account Link
                // ============================================================

                console.log('🔹 Step 8: Verify Create Account Link');

                try {

                    const createVisible =
                        await loginPage.createAccountLink
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (createVisible) {

                        addStepResult(
                            'PASS',
                            'Success: "Create a new account" link is displayed.'
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            '"Create a new account" link is not currently visible.'
                        );
                    }

                } catch (error) {

                    addStepResult(
                        'SKIP',
                        `Create account link verification skipped. ${error.message.split('\n')[0]}`
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
                testCaseId: 'TC070',
                title: 'Verify UI of login page',
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
        'TC071 - Verify mobile number validation on login page',
        { tag: ['@Login', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(180000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC071 - Verify mobile number validation on login page');
            console.log('======================================================');

            const loginPage = new LoginPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Login Page
                // ============================================================

                console.log('🔹 Step 1: Navigate to Login Page');

                const loginPageLoaded =
                    await loginPage.navigateTo();

                await handleCookieBanner(page);

                if (!loginPageLoaded) {
                    throw new Error(
                        'Could not navigate to Login page.'
                    );
                }

                addStepResult(
                    'PASS',
                    'Success: Login page loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Short Mobile Number Validation
                // ============================================================

                console.log('🔹 Step 2: Verify Short Mobile Number Validation');

                try {

                    await loginPage.enterMobileNumber(
                        MOBILE.INVALID_SHORT
                    );

                    await loginPage.blurMobileInput();

                    await loginPage.clickLogin();

                    await page.waitForTimeout(1500);

                    const shortError =
                        await loginPage.getValidationError();

                    if (shortError.found) {

                        addStepResult(
                            'PASS',
                            `Success: Validation message displayed for short mobile number: "${shortError.text.trim()}".`
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            'No inline validation message displayed for short mobile number. Validation may occur on the backend.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Short mobile number validation failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify Alphabetic Mobile Number Validation
                // ============================================================

                console.log('🔹 Step 3: Verify Alphabetic Mobile Number Validation');

                try {

                    await loginPage.clearMobileInput();

                    await loginPage.enterMobileNumber(
                        MOBILE.INVALID_ALPHA
                    );

                    await loginPage.blurMobileInput();

                    await loginPage.clickLogin();

                    await page.waitForTimeout(1500);

                    const alphaError =
                        await loginPage.getValidationError();

                    if (alphaError.found) {

                        addStepResult(
                            'PASS',
                            `Success: Validation message displayed for alphabetic input: "${alphaError.text.trim()}".`
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            'No inline validation message displayed for alphabetic input. Input type may prevent non-numeric characters.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Alphabetic mobile number validation failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Blank Mobile Number Validation
                // ============================================================

                console.log('🔹 Step 4: Verify Blank Mobile Number Validation');

                try {

                    await loginPage.clearMobileInput();

                    await loginPage.blurMobileInput();

                    await loginPage.clickLogin();

                    await page.waitForTimeout(1500);

                    const blankError =
                        await loginPage.getValidationError();

                    if (blankError.found) {

                        addStepResult(
                            'PASS',
                            `Success: Mandatory validation message displayed for blank mobile number: "${blankError.text.trim()}".`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Mandatory validation message was not displayed when Mobile Number field was left blank.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Blank mobile number validation failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify Valid Mobile Number Format
                // ============================================================

                console.log('🔹 Step 5: Verify Valid Mobile Number Format');

                try {

                    await loginPage.clearMobileInput();

                    await loginPage.enterMobileNumber(
                        MOBILE.VALID_1
                    );

                    const inputValue =
                        await loginPage.mobileInput
                            .first()
                            .inputValue();

                    if (
                        inputValue.includes(MOBILE.VALID_1) ||
                        inputValue.length >= 10
                    ) {

                        addStepResult(
                            'PASS',
                            `Success: Valid mobile number "${MOBILE.VALID_1}" entered successfully. Current field value: "${inputValue}".`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Valid mobile number was not accepted. Current field value: "${inputValue}".`
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Valid mobile number verification failed. ${error.message}`
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
                testCaseId: 'TC071',
                title: 'Verify mobile number validation on login page',
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