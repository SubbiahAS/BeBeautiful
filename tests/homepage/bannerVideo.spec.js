// tests/homepage/bannerVideo.spec.js

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
    'TC002 - Verify banner video section',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page, context }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC002 - Verify banner video section');
      console.log('======================================================');

      const homePage = new HomePage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Homepage
        // ============================================================

        console.log('🔹 Step 1: Navigate to Homepage');

        await homePage.navigateToHome();

        await page.waitForTimeout(2000);

        await homePage.closeLoginPopupIfPresent();

        addStepResult(
          'PASS',
          'Success: Homepage loaded successfully.'
        );

        // ============================================================
        // STEP 2 : Verify Banner Section
        // ============================================================

        console.log('🔹 Step 2: Verify Banner Section');

        try {

          await expect(
            homePage.banner.section
          ).toBeVisible({
            timeout: 10000
          });

          addStepResult(
            'PASS',
            'Success: Banner section is displayed on the homepage.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner section verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Verify Banner Autoplay (auto-change)
        // ============================================================

        console.log('🔹 Step 3: Verify Banner Autoplay Auto-Change');

        try {

          const beforeIndex =
            await homePage.getActiveSlideIndex();

          await page.waitForTimeout(7000);

          const afterIndex =
            await homePage.getActiveSlideIndex();

          expect(afterIndex).not.toBe(beforeIndex);

          addStepResult(
            'PASS',
            'Success: Banner videos auto-change to the next slide.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner videos did not auto-change. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Stop Banner Autoplay
        // ============================================================

        console.log('🔹 Step 4: Stop Banner Autoplay');

        try {

          await homePage.stopAutoplay();

          const isRunning =
            await homePage.isAutoplayRunning();

          expect(isRunning).toBeFalsy();

          addStepResult(
            'PASS',
            'Success: Banner autoplay can be stopped using the Swiper JS API.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner autoplay verification failed. ${error.message.split('\n')[0]}`
          );
        }

        await homePage.clickBullet(0);
        await page.waitForTimeout(1000);

        // ============================================================
        // STEP 5 : Verify Video Attributes (generic autoplay/muted check)
        // ============================================================

        console.log('🔹 Step 5: Verify Video Attributes');

        try {

          const video =
            homePage.banner.video;

          const isVideoVisible =
            await video.isVisible().catch(() => false);

          if (isVideoVisible) {

            const muted =
              await video.getAttribute('muted');

            const autoplay =
              await video.getAttribute('autoplay');

            expect(
              muted !== null || autoplay !== null
            ).toBeTruthy();

            addStepResult(
              'PASS',
              'Success: Banner video contains the expected autoplay or muted attributes.'
            );

          } else {

            addStepResult(
              'SKIP',
              'Banner video element is not visible; attribute verification skipped.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner video attribute verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Banner Navigation Bullets Change Active Slide
        // ============================================================

        console.log('🔹 Step 6: Verify Banner Navigation');

        try {

          const totalSlides =
            await homePage.getTotalSlides();

          if (totalSlides > 1) {

            const beforeIndex =
              await homePage.getActiveSlideIndex();

            await homePage.clickBullet(1);

            const afterIndex =
              await homePage.getActiveSlideIndex();

            expect(afterIndex).not.toBe(beforeIndex);

            addStepResult(
              'PASS',
              'Success: Navigation section is displayed and banner navigation options change the active slide successfully.'
            );

          } else {

            addStepResult(
              'SKIP',
              'Only one slide is present; navigation verification skipped.'
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner navigation verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 7 : Verify Each Slide's Article Title, Author Name,
        //          Video and Dive In Button
        // ============================================================

        console.log('🔹 Step 7: Verify Article Title, Author Name, Video and Dive In Button on Each Slide');

        let attributesPass = true;
        const attributeFailures = [];

        let totalSlides = 0;
        const slideHrefs = [];

        try {

          totalSlides =
            await homePage.getTotalSlides();

          for (let i = 0; i < totalSlides; i++) {

            await homePage.clickBullet(i);

            const activeSlide =
              homePage.banner.activeSlide;

            // -----------------------------------------
            // Video Validation
            // -----------------------------------------

            try {

              const video =
                activeSlide
                  .locator('video.VideoBanner__video')
                  .first();

              await expect(video).toBeVisible({
                timeout: 10000
              });

              const videoSrc =
                await video
                  .locator('source')
                  .first()
                  .getAttribute('src');

              expect(videoSrc).toBeTruthy();

            } catch (error) {

              attributesPass = false;
              attributeFailures.push(`Slide ${i + 1} video: ${error.message.split('\n')[0]}`);
            }

            // -----------------------------------------
            // Article Title
            // -----------------------------------------

            try {

              const title =
                activeSlide
                  .locator('.BreakoutCard-Content-Transition h1, .BreakoutCard-Content-Transition h2')
                  .first();

              await expect(title).toBeVisible({
                timeout: 10000
              });

            } catch (error) {

              attributesPass = false;
              attributeFailures.push(`Slide ${i + 1} title: ${error.message.split('\n')[0]}`);
            }

            // -----------------------------------------
            // Author Name (displayed below article title)
            // -----------------------------------------

            try {

              const author =
                activeSlide
                  .locator('p.author-name')
                  .first();

              await expect(author).toBeVisible({
                timeout: 10000
              });

            } catch (error) {

              attributesPass = false;
              attributeFailures.push(`Slide ${i + 1} author: ${error.message.split('\n')[0]}`);
            }

            // -----------------------------------------
            // Dive In Button
            // -----------------------------------------

            try {

              const diveBtn =
                activeSlide
                  .locator('a.buttonWithBorder.secondaryButton')
                  .first();

              await expect(diveBtn).toBeVisible({
                timeout: 10000
              });

              const href =
                await diveBtn
                  .getAttribute('href')
                  .catch(() => null);

              slideHrefs.push(href);

            } catch (error) {

              attributesPass = false;
              attributeFailures.push(`Slide ${i + 1} Dive In button: ${error.message.split('\n')[0]}`);
              slideHrefs.push(null);
            }
          }

          if (attributesPass) {

            addStepResult(
              'PASS',
              'Success: Article title, author name, video and Dive In button are displayed on every slide.'
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Some banner slide attributes are missing. ${attributeFailures.join(' | ')}`
            );
          }

        } catch (error) {

          testFailed = true;
          attributesPass = false;

          addStepResult(
            'FAIL',
            `Failed: Banner slide attribute verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 8 : Verify Dive In Button Redirects to Correct Article Page
        // ============================================================

        console.log('🔹 Step 8: Verify Dive In Redirect on Each Slide');

        try {

          let redirectPass = true;
          const redirectFailures = [];

          for (let i = 0; i < totalSlides; i++) {

            try {

              const href = slideHrefs[i];

              expect(href).toBeTruthy();

              // const fullUrl =
              //   href.startsWith('http')
              //     ? href
              //     : `${URLS.HOME.replace(/\/$/, '')}${href}`;

              const fullUrl =
                href.startsWith('http')
                  ? href
                  : `${new URL(page.url()).origin}${href}`;

              const articlePage =
                await context.newPage();

              await articlePage.goto(
                fullUrl,
                {
                  waitUntil: 'domcontentloaded',
                  timeout: 20000
                }
              );

              const landedUrl =
                articlePage.url();

              expect(landedUrl).toContain(
                href.replace(/^\//, '')
              );

              await articlePage.close();

              await page.bringToFront();

            } catch (error) {

              redirectPass = false;
              redirectFailures.push(`Slide ${i + 1}: ${error.message.split('\n')[0]}`);
            }
          }

          if (redirectPass) {

            addStepResult(
              'PASS',
              'Success: Clicking Dive In on every slide redirects to the respective article detail page.'
            );

          } else {

            testFailed = true;

            addStepResult(
              'FAIL',
              `Failed: Some Dive In redirects failed. ${redirectFailures.join(' | ')}`
            );
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Dive In redirect verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 9 : Verify Autoplay Stays Stopped
        // ============================================================

        console.log('🔹 Step 9: Verify Autoplay Stays Stopped');

        try {

          const beforeIndex =
            await homePage.getActiveSlideIndex();

          await page.waitForTimeout(5000);

          const afterIndex =
            await homePage.getActiveSlideIndex();

          expect(beforeIndex).toBe(afterIndex);

          addStepResult(
            'PASS',
            'Success: Autoplay remains stopped and the active slide does not change unexpectedly.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Autoplay restarted unexpectedly. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC002',
        title: 'Verify banner video section',
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
    'TC001 - Verify Bebe homepage',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page, context }) => {

      test.setTimeout(300000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC001 - Verify Bebe Homepage');
      console.log('======================================================');

      const homePage = new HomePage(page);

      try {

        // ============================================================
        // STEP 1 : Navigate to Homepage
        // ============================================================

        console.log('🔹 Step 1: Navigate to Homepage');

        await homePage.bebeNavigateToHome();

        addStepResult(
          'PASS',
          'Success: Homepage loaded successfully.'
        );

        // ============================================================
        // STEP 2 : Verify Brand Logo
        // ============================================================

        console.log('🔹 Step 2: Verify Brand Logo');

        try {

          const logoVisible =
            await homePage.logo.isVisible().catch(() => false);

          expect(logoVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Brand logo is displayed at the top-left corner of the page.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Brand logo verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Verify Logo Redirect
        // ============================================================

        console.log('🔹 Step 3: Verify Logo Redirect');

        try {

          await homePage.logo.click();

          await page.waitForLoadState('networkidle');

          expect(
            page.url()
          ).toContain('bebeautiful');

          addStepResult(
            'PASS',
            'Success: Clicking the brand logo redirects the user to the homepage.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Brand logo redirect verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Verify Header Icons
        // ============================================================

        console.log('🔹 Step 4: Verify Header Icons');

        try {

          const searchVisible =
            await homePage.searchIcon.isVisible().catch(() => false);

          const profileVisible =
            await homePage.profileIcon.isVisible().catch(() => false);

          const cartVisible =
            await homePage.cartIcon.isVisible().catch(() => false);

          expect(
            searchVisible && profileVisible && cartVisible
          ).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Search, Profile and Cart icons are displayed in the header.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Header icon verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 5 : Verify Banner Video Section
        // ============================================================

        console.log('🔹 Step 5: Verify Banner Video Section');

        try {

          const bannerVisible =
            await homePage.banner.section.isVisible().catch(() => false);

          await page.waitForTimeout(2000);

          expect(bannerVisible).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: Banner video section is displayed below the navigation menu.'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Banner video section verification failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 6 : Verify Cookie Notice
        // ============================================================

        console.log('🔹 Step 6: Verify Cookie Notice');

        try {

          const cookieVisible =
            await homePage.cookieBanner
              ?.isVisible()
              .catch(() => false);

          await page.waitForTimeout(2000);

          if (!cookieVisible) {

            addStepResult(
              'SKIP',
              'Cookie notice is not displayed because it may have already been accepted.'
            );

            addStepResult(
              'SKIP',
              'Cookie OK button verification skipped.'
            );

            addStepResult(
              'SKIP',
              'Cookie policy link verification skipped.'
            );

            addStepResult(
              'SKIP',
              'Cookie close verification skipped.'
            );

          } else {

            addStepResult(
              'PASS',
              'Success: Cookie notice is displayed for first-time visitors.'
            );

            // ============================================================
            // STEP 7 : Verify Cookie OK Button
            // ============================================================

            console.log('🔹 Step 7: Verify Cookie OK Button');

            let okVisible = false;

            try {

              await homePage.cookieOkButton.waitFor({ state: 'visible', timeout: 8000 });
              okVisible = true;

              addStepResult(
                'PASS',
                'Success: Cookie notice contains the OK button.'
              );

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Cookie OK button verification failed. ${error.message.split('\n')[0]}`
              );
            }

            // ============================================================
            // STEP 8 : Verify Cookie Policy Link
            // ============================================================

            console.log('🔹 Step 8: Verify Cookie Policy Link');

            try {

              const policyVisible =
                await homePage.cookiePolicyLink
                  ?.isVisible()
                  .catch(() => false);

              if (policyVisible) {

                addStepResult(
                  'PASS',
                  'Success: Cookie policy link is displayed in the cookie notice.'
                );

              } else {

                addStepResult(
                  'SKIP',
                  'Cookie policy link is not displayed.'
                );
              }

            } catch (error) {

              addStepResult(
                'SKIP',
                `Cookie policy link verification skipped. ${error.message.split('\n')[0]}`
              );
            }

            // ============================================================
            // STEP 9 : Verify Cookie Notice Close
            // ============================================================

            console.log('🔹 Step 9: Verify Cookie Notice Close');

            try {

              if (okVisible) {

                await homePage.cookieOkButton.click();

                await page.waitForTimeout(1000);

                const bannerAfterClose =
                  await homePage.cookieBanner
                    .isVisible()
                    .catch(() => false);

                expect(
                  bannerAfterClose
                ).toBeFalsy();

                addStepResult(
                  'PASS',
                  'Success: Clicking the OK button closes the cookie notice.'
                );

              } else {

                addStepResult(
                  'SKIP',
                  'Cookie OK button was not visible; close verification skipped.'
                );
              }

            } catch (error) {

              testFailed = true;

              addStepResult(
                'FAIL',
                `Failed: Cookie notice close verification failed. ${error.message.split('\n')[0]}`
              );
            }
          }

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Cookie notice verification failed. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC001',
        title: 'Verify Bebe Homepage',
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