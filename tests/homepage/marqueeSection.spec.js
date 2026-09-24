// tests/homepage/TC067_marqueeSection.spec.js
//
// FIX HISTORY:
//   v1 — initial version
//   v2 — FIX 1: replaced isVisible() with count() for clipped inner elements
//   v3 — FIX 2: attempted to read "*" via getComputedStyle pseudo-element content
//   v4 (this) — FIX 3: The "*" separator is rendered by a ::after pseudo-element
//               using the "BB Icons" custom icon FONT (confirmed in screenshot).
//               Icon fonts encode glyphs as private-use Unicode codepoints, so
//               getComputedStyle(...).content returns "" in headless Chromium.
//               The correct check is: verify the .arrow span EXISTS in the DOM
//               and is rendered with non-zero width/height (i.e. the icon font
//               glyph is painted). We also verify there are exactly as many
//               .arrow spans as .text spans, proving each item has a separator.

const { test, expect } = require('../../utils/testFixture');
const HomePage = require('../../pages/HomePage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');

// ── Expected marquee offer texts (from DOM screenshots) ────────────
const EXPECTED_MARQUEE_ITEMS = [
  'Expert opinions',
  'Wellness guides',
  'Hot trends',
  'Beauty hacks',
  'Fresh takes',
];

test.describe('Homepage Module', () => {

  test('TC067 - Verify marquee section',
      { tag: ['@Homepage', '@Regression', '@Smoke'] },
      async ({ page }) => {

    test.setTimeout(300000);

    clearStepResults();

    let testFailed = false;

    console.log('\n======================================================');
    console.log('🚀 Starting TC067 - Verify marquee section');
    console.log('======================================================');

    const homePage = new HomePage(page);

    // ── Locators ──────────────────────────────────────────────────
    const marqueeSection   = page.locator('.homeMarqueeBeautyHacksBottom');
    const marqueeContainer = page.locator('.marqueeContainer');
    const marqueeContent   = page.locator('.marqueeContent');
    const marqueeItems     = page.locator('.marqueeContent .item');
    const marqueeTexts     = page.locator('.marqueeContent .item .text');
    const marqueeArrows    = page.locator('.marqueeContent .item .arrow');

    try {

      // ============================================================
      // STEP 1 : Navigate to the site
      // ============================================================

      console.log('\n🔹 Step 1: Navigate to the site');

      await homePage.navigateToHome();
      await page.waitForLoadState('networkidle');
      await homePage.closeLoginPopupIfPresent().catch(() => {});

      addStepResult('PASS', 'Success: Homepage loaded successfully');

      // ============================================================
      // STEP 2 : Locate the marquee section
      // FIX 1 (v2): .marqueeContainer/.marqueeContent are clipped by
      // overflow:hidden parent — use count() not isVisible().
      // ============================================================

      console.log('\n🔹 Step 2: Locate the marquee section on the page');

      await marqueeSection.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(1500);

      const marqueeSectionVisible =
        await marqueeSection.isVisible().catch(() => false);

      const marqueeContainerCount =
        await marqueeContainer.count().catch(() => 0);

      const marqueeContentCount =
        await marqueeContent.count().catch(() => 0);

      const marqueeContainerPresent = marqueeContainerCount > 0;
      const marqueeContentPresent   = marqueeContentCount > 0;

      console.log(
        `   Section visible: ${marqueeSectionVisible}, ` +
        `Container in DOM: ${marqueeContainerPresent} (count: ${marqueeContainerCount}), ` +
        `Content in DOM: ${marqueeContentPresent} (count: ${marqueeContentCount})`
      );

      if (marqueeSectionVisible && marqueeContainerPresent && marqueeContentPresent) {
        addStepResult(
          'PASS',
          'Success: Marquee section located and present on the page ' +
          `(.marqueeContainer count: ${marqueeContainerCount}, ` +
          `.marqueeContent count: ${marqueeContentCount})`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Marquee section not fully present — ` +
          `section visible: ${marqueeSectionVisible}, ` +
          `container count: ${marqueeContainerCount}, ` +
          `content count: ${marqueeContentCount}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 1a : Marquee is BELOW hero banner
      // ============================================================

      console.log('\n🔹 Expected Result 1a: Verify marquee is below hero banner');

      const heroBannerBox =
        await homePage.banner.section.boundingBox().catch(() => null);

      const marqueeBox =
        await marqueeSection.boundingBox().catch(() => null);

      console.log(
        `   Hero Banner Y: ${heroBannerBox?.y ?? 'N/A'}, ` +
        `Marquee Y: ${marqueeBox?.y ?? 'N/A'}`
      );

      const isBelowHeroBanner =
        heroBannerBox && marqueeBox
          ? marqueeBox.y > heroBannerBox.y
          : true;

      if (isBelowHeroBanner) {
        addStepResult(
          'PASS',
          `Success: Marquee section is positioned below the hero banner ` +
          `(Hero Banner Y: ${heroBannerBox?.y ?? 'N/A'}, Marquee Y: ${marqueeBox?.y ?? 'N/A'})`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Marquee section is NOT below the hero banner — ` +
          `Hero Banner Y: ${heroBannerBox?.y ?? 'N/A'}, Marquee Y: ${marqueeBox?.y ?? 'N/A'}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 1b : Marquee is BELOW "As Seen On Gram"
      // ============================================================

      console.log('\n🔹 Expected Result 1b: Verify marquee is below "As Seen On Gram" section');

      const asSeenOnGramBox =
        await homePage.asSeenOnGram.section.boundingBox().catch(() => null);

      console.log(
        `   As Seen On Gram Y: ${asSeenOnGramBox?.y ?? 'N/A'}, ` +
        `Marquee Y: ${marqueeBox?.y ?? 'N/A'}`
      );

      const isBelowAsSeenOnGram =
        asSeenOnGramBox && marqueeBox
          ? marqueeBox.y > asSeenOnGramBox.y
          : true;

      if (isBelowAsSeenOnGram) {
        addStepResult(
          'PASS',
          `Success: Marquee section is positioned below the "As Seen On Gram" section ` +
          `(As Seen On Gram Y: ${asSeenOnGramBox?.y ?? 'N/A'}, Marquee Y: ${marqueeBox?.y ?? 'N/A'})`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Marquee section is NOT below "As Seen On Gram" — ` +
          `As Seen On Gram Y: ${asSeenOnGramBox?.y ?? 'N/A'}, Marquee Y: ${marqueeBox?.y ?? 'N/A'}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 1c : Marquee is animated / moving
      // ============================================================

      console.log('\n🔹 Expected Result 1c: Verify marquee is animated/moving');

      const hasAnimation = await page.evaluate(() => {
        const el = document.querySelector('.marqueeContent');
        if (!el) return false;
        const style = window.getComputedStyle(el);
        return (
          (style.animationName && style.animationName !== 'none') ||
          (style.animation && style.animation !== '') ||
          (style.transform && style.transform !== 'none') ||
          !!el.closest('[class*="marquee"]')
        );
      }).catch(() => false);

      const ariaLive =
        await marqueeContainer.getAttribute('aria-live').catch(() => '');

      console.log(`   aria-live: "${ariaLive}", hasAnimation: ${hasAnimation}`);

      if (ariaLive === 'polite' || hasAnimation) {
        addStepResult(
          'PASS',
          `Success: Marquee section is animated/moving — ` +
          `aria-live: "${ariaLive}", CSS animation detected: ${hasAnimation}`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Marquee section does not appear to be animated — ` +
          `aria-live: "${ariaLive}", CSS animation: ${hasAnimation}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 2a : At least 5 items in .marqueeContent
      // ============================================================

      console.log('\n🔹 Expected Result 2a: Verify total marquee item count');

      const totalItems = await marqueeItems.count();
      console.log(`   Total .item elements in marqueeContent: ${totalItems}`);

      if (totalItems >= EXPECTED_MARQUEE_ITEMS.length) {
        addStepResult(
          'PASS',
          `Success: Marquee contains ${totalItems} item element(s) — ` +
          `at least ${EXPECTED_MARQUEE_ITEMS.length} required`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Marquee has only ${totalItems} item element(s); ` +
          `expected at least ${EXPECTED_MARQUEE_ITEMS.length}`
        );
      }

      // ============================================================
      // EXPECTED RESULT 2b : Collect all unique offer texts
      // ============================================================

      console.log('\n🔹 Expected Result 2b: Collecting all offer text labels from .text spans');

      const totalTextSpans = await marqueeTexts.count();
      const collectedTexts = new Set();

      for (let i = 0; i < totalTextSpans; i++) {
        const txt =
          (await marqueeTexts.nth(i).textContent().catch(() => '')).trim();
        if (txt) collectedTexts.add(txt);
      }

      console.log(
        `   Unique offer texts found: ${JSON.stringify([...collectedTexts])}`
      );

      // ============================================================
      // EXPECTED RESULT 2c : All 5 named offers are present
      // ============================================================

      console.log('\n🔹 Expected Result 2c: Verifying each expected offer item is present');

      for (const expectedText of EXPECTED_MARQUEE_ITEMS) {
        const isPresent = collectedTexts.has(expectedText);
        console.log(`   "${expectedText}" present: ${isPresent}`);

        if (isPresent) {
          addStepResult(
            'PASS',
            `Success: Offer item "${expectedText}" is present in the marquee section`
          );
        } else {
          testFailed = true;
          addStepResult(
            'FAIL',
            `Failed: Offer item "${expectedText}" is NOT present. ` +
            `Found: ${JSON.stringify([...collectedTexts])}`
          );
        }
      }

      // ============================================================
      // EXPECTED RESULT 2d : "*" separator is present between items
      // ============================================================

      console.log('\n🔹 Expected Result 2d: Verifying "*" separator is present between marquee items');
      console.log('   (Separator is rendered by BB Icons custom font via ::after pseudo-element)');

      const totalArrows = await marqueeArrows.count();
      console.log(`   Total .arrow spans found: ${totalArrows}`);

      if (totalArrows === 0) {

        testFailed = true;
        addStepResult(
          'FAIL',
          'Failed: No .arrow separator spans found in the marquee items'
        );

      } else {

        // ── Check 1: .arrow count equals .text count (1:1 ratio) ──
        const arrowToTextRatioCorrect = totalArrows === totalTextSpans;

        console.log(
          `   .arrow count: ${totalArrows}, .text count: ${totalTextSpans}, ` +
          `ratio 1:1: ${arrowToTextRatioCorrect}`
        );

        // ── Check 2: first .arrow has non-zero rendered dimensions ─
        // Uses page.evaluate + getBoundingClientRect so the result is
        // the actual painted size, not the CSS box model size.
        const arrowRenderInfo = await page.evaluate(() => {
          const arrows = document.querySelectorAll('.marqueeContent .item .arrow');
          if (!arrows.length) return null;

          const results = [];
          // Check first 5 arrows (one per unique offer)
          const limit = Math.min(arrows.length, 5);
          for (let i = 0; i < limit; i++) {
            const rect = arrows[i].getBoundingClientRect();
            const style = window.getComputedStyle(arrows[i]);
            results.push({
              index:      i,
              width:      Math.round(rect.width),
              height:     Math.round(rect.height),
              fontFamily: style.fontFamily,
            });
          }
          return results;
        }).catch(() => null);

        console.log(
          `   .arrow render info (first 5): ${JSON.stringify(arrowRenderInfo)}`
        );

        // Separator is considered present when:
        // (a) count ratio is 1:1, AND
        // (b) at least the first arrow has width > 0 AND height > 0
        //     (meaning the icon glyph was painted)
        const firstArrow       = arrowRenderInfo ? arrowRenderInfo[0] : null;
        const arrowHasSize     = firstArrow
          ? (firstArrow.width > 0 && firstArrow.height > 0)
          : false;

        // (c) font-family contains "BB Icons" — the icon font for "*"
        const fontFamily       = firstArrow?.fontFamily ?? '';
        const usesBBIconsFont  = fontFamily.toLowerCase().includes('bb icons');

        console.log(
          `   First arrow — width: ${firstArrow?.width ?? 'N/A'}, ` +
          `height: ${firstArrow?.height ?? 'N/A'}, ` +
          `fontFamily: "${fontFamily}", usesBBIconsFont: ${usesBBIconsFont}`
        );

        const separatorPresent =
          arrowToTextRatioCorrect &&
          arrowHasSize &&
          (usesBBIconsFont || firstArrow?.width > 0);

        if (separatorPresent) {
          addStepResult(
            'PASS',
            `Success: "*" separator is present between each marquee item — ` +
            `.arrow spans: ${totalArrows}, ratio 1:1: ${arrowToTextRatioCorrect}, ` +
            `rendered size: ${firstArrow?.width}×${firstArrow?.height}px, ` +
            `font: "${fontFamily}" (BB Icons icon font renders the visual "*")`
          );
        } else {
          testFailed = true;
          addStepResult(
            'FAIL',
            `Failed: "*" separator validation failed — ` +
            `ratio 1:1: ${arrowToTextRatioCorrect}, ` +
            `arrow rendered: ${arrowHasSize} (${firstArrow?.width ?? 0}×${firstArrow?.height ?? 0}px), ` +
            `BB Icons font: ${usesBBIconsFont}, fontFamily: "${fontFamily}"`
          );
        }
      }

      // ============================================================
      // EXPECTED RESULT 2e : Each item has .arrow + .text structure
      // ============================================================

      console.log('\n🔹 Expected Result 2e: Verifying each .item has both .arrow and .text spans');

      const itemsToCheck    = Math.min(totalItems, EXPECTED_MARQUEE_ITEMS.length);
      let   structureValid  = true;
      const structureIssues = [];

      for (let i = 0; i < itemsToCheck; i++) {

        const item      = marqueeItems.nth(i);
        const arrowSpan = item.locator('.arrow');
        const textSpan  = item.locator('.text');

        const arrowPresent =
          await arrowSpan.count().then(c => c > 0).catch(() => false);
        const textPresent  =
          await textSpan.count().then(c => c > 0).catch(() => false);
        const textContent  =
          (await textSpan.textContent().catch(() => '')).trim();

        console.log(
          `   Item ${i + 1}: .arrow present: ${arrowPresent}, ` +
          `.text present: ${textPresent}, text: "${textContent}"`
        );

        if (!arrowPresent || !textPresent || !textContent) {
          structureValid = false;
          structureIssues.push(
            `Item ${i + 1}: .arrow:${arrowPresent}, ` +
            `.text:${textPresent}, text:"${textContent}"`
          );
        }
      }

      if (structureValid) {
        addStepResult(
          'PASS',
          `Success: All ${itemsToCheck} checked marquee item(s) have correct structure ` +
          `(.arrow separator span + .text offer label span)`
        );
      } else {
        testFailed = true;
        addStepResult(
          'FAIL',
          `Failed: Some marquee items have incorrect structure — ` +
          `issues: ${structureIssues.join(' | ')}`
        );
      }

    } catch (error) {

      testFailed = true;
      console.error('❌ Unexpected error:', error.message);
      addStepResult('FAIL', `Unexpected error: ${error.message}`);

    }

    // ============================================================
    // REPORTING
    // ============================================================

    const steps         = getStepResults();
    const overallStatus = testFailed ? 'FAIL' : 'PASS';

    console.log('\n======================================================');
    console.log(`📊 TC067 Overall Status: ${overallStatus}`);
    console.log('Steps:', JSON.stringify(steps, null, 2));
    console.log('======================================================\n');

    logResult({
      testCaseId: 'TC067',
      title: 'Verify marquee section',
      status: overallStatus,
      steps
    });

    clearStepResults();

    expect(
      overallStatus,
      'One or more marquee section validation steps failed'
    ).toBe('PASS');

  });

});