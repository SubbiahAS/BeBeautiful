const { test, expect } = require('../../utils/testFixture');
const SignupPage = require('../../pages/SignupPage');
const { logResult } = require('../../utils/reportLogger');
const {
    addStepResult,
    getStepResults,
    clearStepResults
} = require('../../utils/testReporter');
const { handleCookieBanner } = require('../../utils/helpers');

// Mobile numbers from .env
const MOBILE = {
    VALID_UNREGISTERED: process.env.MOBILE_VALID_UNREGISTERED || '8568987761',
    REGISTERED: process.env.MOBILE_REGISTERED || '8099829431',
    INVALID_SHORT: process.env.MOBILE_INVALID_SHORT || '12345',
    INVALID_ALPHA: process.env.MOBILE_INVALID_ALPHA || 'abcdef',
    INVALID_SPECIAL: process.env.MOBILE_INVALID_SPECIAL || '!@#$%'
};

test.describe('SignUp Page Tests', () => {

    test(
        'TC074 - Verify signup page UI',
        { tag: ['@Signup', '@Regression', '@Smoke'] },
        async ({ page }) => {

            test.setTimeout(180000);

            clearStepResults();

            let testFailed = false;

            console.log('\n======================================================');
            console.log('🚀 Starting TC074 - Verify signup page UI');
            console.log('======================================================');

            const signupPage = new SignupPage(page);

            try {

                // ============================================================
                // STEP 1 : Navigate to Signup Page
                // ============================================================

                console.log('🔹 Step 1: Navigate to Signup Page');

                const signupLoaded =
                    await signupPage.navigateTo();

                await handleCookieBanner(page);

                if (!signupLoaded) {
                    throw new Error('Could not navigate to Signup page.');
                }

                addStepResult(
                    'PASS',
                    'Success: Signup page loaded successfully.'
                );

                // ============================================================
                // STEP 2 : Verify Signup Banner
                // ============================================================

                console.log('🔹 Step 2: Verify Signup Banner');

                try {

                    await expect(
                        signupPage.signupImage.first()
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Signup image/banner is displayed on the left side of the page.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Signup banner verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 3 : Verify "Let\'s get started" Heading
                // ============================================================

                console.log('🔹 Step 3: Verify "Let\'s get started" Heading');

                try {

                    await expect(
                        signupPage.letsGetStarted
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: "Let\'s get started" heading is displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: "Let's get started" heading verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 4 : Verify Welcome Text
                // ============================================================

                console.log('🔹 Step 4: Verify Welcome Text');

                try {

                    await expect(
                        signupPage.welcomeText
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Welcome text is displayed on the Signup page.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Welcome text verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 5 : Verify "Let's make this official" Text
                // ============================================================

                console.log('🔹 Step 5: Verify "Let\'s make this official" Text');

                try {

                    const officialVisible =
                        await signupPage.letsMakeOfficial
                            .isVisible()
                            .catch(() => false);

                    if (officialVisible) {

                        addStepResult(
                            'PASS',
                            'Success: "Let\'s make this official" text is displayed.'
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            '"Let\'s make this official" text is not currently visible.'
                        );
                    }

                } catch (error) {

                    addStepResult(
                        'SKIP',
                        `Official text verification skipped. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 6 : Verify Mobile Number Input
                // ============================================================

                console.log('🔹 Step 6: Verify Mobile Number Input');

                try {

                    await expect(
                        signupPage.mobileInput.first()
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
                // STEP 7 : Verify Sign Up Button
                // ============================================================

                console.log('🔹 Step 7: Verify Sign Up Button');

                try {

                    await expect(
                        signupPage.signupBtn.first()
                    ).toBeVisible();

                    addStepResult(
                        'PASS',
                        'Success: Sign Up button is displayed.'
                    );

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Sign Up button verification failed. ${error.message.split('\n')[0]}`
                    );
                }


                // ============================================================
                // STEP 8 : Verify Google Social Login
                // ============================================================

                console.log('🔹 Step 8: Verify Google Social Login');

                try {

                    const googleVisible =
                        await signupPage.googleLoginBtn
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (googleVisible) {

                        addStepResult(
                            'PASS',
                            'Success: Google social login option is displayed.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Google social login option is not displayed.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Google social login verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 9 : Verify Facebook Social Login
                // ============================================================

                console.log('🔹 Step 9: Verify Facebook Social Login');

                try {

                    const facebookVisible =
                        await signupPage.facebookLoginBtn
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (facebookVisible) {

                        addStepResult(
                            'PASS',
                            'Success: Facebook social login option is displayed.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Facebook social login option is not displayed.'
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Facebook social login verification failed. ${error.message.split('\n')[0]}`
                    );
                }

                // ============================================================
                // STEP 10 : Verify Login Link
                // ============================================================

                console.log('🔹 Step 10: Verify Login Link');

                try {

                    const loginVisible =
                        await signupPage.loginLink
                            .first()
                            .isVisible()
                            .catch(() => false);

                    if (loginVisible) {

                        addStepResult(
                            'PASS',
                            'Success: Login link is displayed on the Signup page.'
                        );

                    } else {

                        addStepResult(
                            'SKIP',
                            'Login link is not currently visible.'
                        );
                    }

                } catch (error) {

                    addStepResult(
                        'SKIP',
                        `Login link verification skipped. ${error.message.split('\n')[0]}`
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
                testCaseId: 'TC074',
                title: 'Verify signup page UI',
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

    // ==================== FIX: TC075 Test - Defensive Mobile Number Constants ====================

    test(
        'TC075 - Verify mobile number validation on signup page',
        {
            tag: [
                '@Signup',
                '@Regression',
                '@Smoke'
            ]
        },

        async ({ page }) => {

            test.setTimeout(240000);

            clearStepResults();

            let testFailed = false;

            console.log(
                '\n======================================================'
            );

            console.log(
                '🚀 Starting TC075 - Verify mobile number validation on signup page'
            );

            console.log(
                '======================================================'
            );

            const signupPage =
                new SignupPage(page);

            try {

                // ============================================================
                // STEP 1
                // ============================================================

                console.log(
                    '🔹 Step 1: Navigate to Signup Page'
                );

                const signupLoaded =
                    await signupPage.navigateTo();

                await handleCookieBanner(page);

                if (!signupLoaded) {
                    throw new Error(
                        'Could not navigate to Signup page.'
                    );
                }

                addStepResult(
                    'PASS',
                    'Success: Signup page loaded successfully.'
                );

                // ============================================================
                // STEP 2
                // ============================================================

                console.log(
                    '🔹 Step 2: Verify Alphabets are Rejected in Mobile Number Field'
                );

                try {

                    await signupPage.enterMobileNumber(
                        MOBILE.INVALID_ALPHA
                    );

                    const alphaValue =
                        await signupPage.getMobileInputValue();

                    if (
                        alphaValue === '' ||
                        !/[a-zA-Z]/.test(alphaValue)
                    ) {

                        addStepResult(
                            'PASS',
                            'Success: Alphabets are rejected — the Mobile Number field accepts only numeric values.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Alphabets were accepted in the Signup Mobile Number field. Value: "${alphaValue}".`
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
                // STEP 3
                // ============================================================

                console.log(
                    '🔹 Step 3: Verify Special Characters are Rejected in Mobile Number Field'
                );

                try {

                    await signupPage.enterMobileNumber(
                        MOBILE.INVALID_SPECIAL
                    );

                    const specialValue =
                        await signupPage.getMobileInputValue();

                    if (
                        specialValue === '' ||
                        !/[!@#$%]/.test(specialValue)
                    ) {

                        addStepResult(
                            'PASS',
                            'Success: Special characters are rejected in the Signup Mobile Number field.'
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Special characters were accepted in the Signup Mobile Number field. Value: "${specialValue}".`
                        );
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Special character mobile number validation failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 4
                // ============================================================

                console.log(
                    '🔹 Step 4: Verify Short Mobile Number Validation'
                );

                try {

                    await signupPage.enterMobileNumber(
                        MOBILE.INVALID_SHORT
                    );

                    await signupPage.blurMobileInput();

                    await signupPage.clickSignup();

                    const shortError =
                        await signupPage.getValidationError();

                    if (shortError.found) {

                        addStepResult(
                            'PASS',
                            `Success: Validation message displayed for invalid or incomplete mobile number: "${shortError.text.trim()}".`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: No validation error shown for incomplete mobile number (< 10 digits).'
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
                // STEP 6
                // ============================================================

                console.log(
                    '🔹 Step 6: Verify Registered Mobile Number Shows Account Already Exists'
                );

                let registeredMessageCaptured = '';

                try {

                    if (page.isClosed()) {
                        throw new Error(
                            'Page was closed before Step 6 could run.'
                        );
                    }

                    /*
                     * Always return to the actual Signup form.
                     *
                     * Do not rely on the previous OTP page state.
                     */
                    const onSignupForm =
                        await signupPage.ensureOnSignupForm();

                    if (!onSignupForm) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: Could not return to the Signup form to test the registered mobile number.'
                        );

                    } else {

                        await handleCookieBanner(page);

                        await signupPage.clearMobileNumber();

                        await signupPage.enterMobileNumber(
                            MOBILE.REGISTERED
                        );

                        const registeredInputValue =
                            await signupPage.getMobileInputValue();

                        if (
                            registeredInputValue !==
                            MOBILE.REGISTERED
                        ) {

                            throw new Error(
                                `Registered mobile number was not entered correctly. Expected "${MOBILE.REGISTERED}", received "${registeredInputValue}".`
                            );
                        }

                        await signupPage.blurMobileInput();

                        await page.waitForTimeout(500);

                        const beforeRegisteredText =
                            await signupPage.captureBodyText();

                        const clicked =
                            await signupPage.clickSignup();

                        if (!clicked) {
                            throw new Error(
                                'Signup button could not be clicked for registered mobile number.'
                            );
                        }

                        /*
                         * IMPORTANT:
                         *
                         * Do not immediately call isOnNextStep().
                         *
                         * The old implementation considered the mobile input
                         * disappearing as "next step", which caused a false
                         * failure when the application displayed an
                         * account-exists response.
                         *
                         * Wait for the actual response state instead.
                         */
                        const response =
                            await signupPage.waitForSignupResponse(15000);

                        if (
                            response.state === 'registered'
                        ) {

                            registeredMessageCaptured =
                                response.message.trim();

                            addStepResult(
                                'PASS',
                                `Success: Validation message displayed for registered mobile number "${MOBILE.REGISTERED}": "${registeredMessageCaptured}".`
                            );

                        } else {

                            /*
                             * Final body-text check in case the message appeared
                             * immediately after the polling window.
                             */
                            const bodyTextAfterClick =
                                await signupPage.captureBodyText();

                            const accountExistsPattern =
                                /already\s+(signed\s*up|registered|exists?)|account\s+(already\s+)?exists|mobile\s+(number\s+)?already\s+(registered|exists)|phone\s+(number\s+)?already\s+(registered|exists)/i;

                            const match =
                                bodyTextAfterClick.match(
                                    accountExistsPattern
                                );

                            if (match) {

                                const matchingLine =
                                    bodyTextAfterClick
                                        .split('\n')
                                        .map(line => line.trim())
                                        .find(line =>
                                            accountExistsPattern.test(line)
                                        );

                                registeredMessageCaptured =
                                    matchingLine || match[0];

                                addStepResult(
                                    'PASS',
                                    `Success: Validation message displayed for registered mobile number "${MOBILE.REGISTERED}": "${registeredMessageCaptured}".`
                                );

                            } else {

                                testFailed = true;

                                if (
                                    response.state === 'otp'
                                ) {

                                    addStepResult(
                                        'FAIL',
                                        `Failed: Registered mobile number "${MOBILE.REGISTERED}" proceeded to OTP verification instead of displaying an "Account Already Exists" validation message.`
                                    );

                                } else if (
                                    response.state === 'message'
                                ) {

                                    addStepResult(
                                        'FAIL',
                                        `Failed: A validation message was displayed for registered mobile number "${MOBILE.REGISTERED}", but it did not indicate that the account already exists. Message: "${response.message}".`
                                    );

                                } else {

                                    addStepResult(
                                        'FAIL',
                                        `Failed: No "Account Already Exists" validation message displayed for registered mobile number "${MOBILE.REGISTERED}".`
                                    );
                                }
                            }
                        }
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Registered mobile number validation failed. ${error.message}`
                    );
                }

                await page.waitForTimeout(3000);

                // ============================================================
                // STEP 7
                // ============================================================

                console.log(
                    '🔹 Step 7: Verify Signup Blocked for Registered Mobile Number'
                );

                try {

                    if (page.isClosed()) {
                        throw new Error(
                            'Page was closed before Step 7 could run.'
                        );
                    }

                    /*
                     * Correct rule:
                     *
                     * OTP screen = signup was NOT blocked.
                     * Signup form still visible = signup remains blocked.
                     * Account-exists message = signup remains blocked.
                     *
                     * Never treat "mobile input disappeared" alone as
                     * successful navigation.
                     */
                    const otpVisible =
                        await signupPage.isOtpStepVisible();

                    if (otpVisible) {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            'Failed: User was able to proceed to the OTP verification step despite using an already registered mobile number.'
                        );

                    } else {

                        const accountExists =
                            await signupPage.getAccountExistsError(
                                '',
                                3000
                            );

                        if (accountExists.found) {

                            if (!registeredMessageCaptured) {
                                registeredMessageCaptured =
                                    accountExists.text.trim();
                            }

                            addStepResult(
                                'PASS',
                                registeredMessageCaptured
                                    ? `Success: Signup was blocked for the already registered mobile number. Message shown: "${registeredMessageCaptured}".`
                                    : 'Success: Signup was blocked for the already registered mobile number.'
                            );

                        } else {

                            const signupFormVisible =
                                await signupPage.isSignupFormVisible();

                            if (signupFormVisible) {

                                addStepResult(
                                    'PASS',
                                    'Success: User was not allowed to proceed to OTP verification with an already registered mobile number.'
                                );

                            } else {

                                testFailed = true;

                                addStepResult(
                                    'FAIL',
                                    'Failed: User was not on the Signup form and no "Account Already Exists" message was detected after using the registered mobile number.'
                                );
                            }
                        }
                    }

                } catch (error) {

                    testFailed = true;

                    addStepResult(
                        'FAIL',
                        `Failed: Blocked-registered-number verification failed. ${error.message}`
                    );
                }

                // ============================================================
                // STEP 8
                // ============================================================

                console.log(
                    '🔹 Step 8: Verify Valid Unregistered Mobile Number'
                );

                try {

                    const onSignupForm =
                        await signupPage.ensureOnSignupForm();

                    if (!onSignupForm) {
                        throw new Error(
                            'Could not return to Signup form before testing valid unregistered mobile number.'
                        );
                    }

                    await signupPage.enterMobileNumber(
                        MOBILE.VALID_UNREGISTERED
                    );

                    const inputValue =
                        await signupPage.getMobileInputValue();

                    if (
                        inputValue ===
                        MOBILE.VALID_UNREGISTERED
                    ) {

                        addStepResult(
                            'PASS',
                            `Success: Valid mobile number "${MOBILE.VALID_UNREGISTERED}" entered successfully.`
                        );

                    } else {

                        testFailed = true;

                        addStepResult(
                            'FAIL',
                            `Failed: Valid mobile number was not accepted. Current field value: "${inputValue}".`
                        );
                    }

                    const beforeValidText =
                        await signupPage.captureBodyText();

                    await signupPage.blurMobileInput();

                    const validErr =
                        await signupPage.getValidationError(
                            beforeValidText
                        );

                    /*
                     * IMPORTANT:
                     *
                     * Do not use "return" here.
                     *
                     * A return exits the test callback before the reporting
                     * section executes. Playwright can therefore mark the
                     * test as passed while Monocart receives no Steps data.
                     *
                     * Keep the test flow inside the current callback so the
                     * final reporting section always executes.
                     */
                    if (validErr.found) {

                        const errorText =
                            validErr.text.trim();

                        if (
                            /already\s+(signed\s*up|registered|exists?)|already\s+signed\s*up/i.test(
                                errorText
                            )
                        ) {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Test data "${MOBILE.VALID_UNREGISTERED}" is already registered. Application displayed: "${errorText}".`
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                `Failed: Unexpected validation error shown for valid mobile number: "${errorText}".`
                            );
                        }

                    } else {

                        addStepResult(
                            'PASS',
                            'Success: No validation error shown for a valid 10-digit unregistered mobile number.'
                        );

                        const clicked =
                            await signupPage.clickSignup();

                        if (!clicked) {
                            throw new Error(
                                'Signup button could not be clicked for valid unregistered mobile number.'
                            );
                        }

                        const advancedToNextStep =
                            await signupPage.isOnNextStep(10000);

                        if (advancedToNextStep) {

                            addStepResult(
                                'PASS',
                                'Success: User was able to proceed to the next signup step (OTP verification) with a valid unregistered mobile number.'
                            );

                        } else {

                            testFailed = true;

                            addStepResult(
                                'FAIL',
                                'Failed: User was not able to proceed to the next signup step (OTP verification) with a valid unregistered mobile number.'
                            );
                        }
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
                testCaseId: 'TC075',
                title:
                    'Verify mobile number validation on signup page',
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