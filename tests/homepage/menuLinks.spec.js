// tests/homepage/menuLinks.spec.js

const { test, expect } = require('../../utils/testFixture');
const HeaderPage = require('../../pages/HeaderPage');
const { logResult } = require('../../utils/reportLogger');
const {
  addStepResult,
  getStepResults,
  clearStepResults
} = require('../../utils/testReporter');

async function goHome(page, headerPage) {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await expect(headerPage.container).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1500);
}

async function is404(page, capturedStatus) {
  if (capturedStatus !== null) return capturedStatus === 404;
  const title = (await page.title()).toLowerCase();
  return /\b404\b|page not found/.test(title);
}

async function clickAndCapture(page, locator) {
  let finalStatus = null;
  const onResponse = (response) => {
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('text/html')) finalStatus = response.status();
  };
  page.on('response', onResponse);
  await Promise.all([page.waitForLoadState('domcontentloaded'), locator.click({ force: true })]);
  await page.waitForTimeout(2000);
  page.off('response', onResponse);
  return finalStatus;
}

// Navigates directly to a URL (instead of hover + click) so submenu link
// checks don't require reloading the homepage and re-hovering for every link.
async function checkUrlStatus(page, url) {
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = response ? response.status() : null;
    const notFound = await is404(page, status);
    return !notFound;
  } catch (e) {
    return false;
  }
}

test.describe('Homepage Module', () => {

  test(
    'TC003 - Verify all navigation menu links load valid pages',
    { tag: ['@Homepage', '@Regression', '@Smoke'] },
    async ({ page }) => {

      test.setTimeout(900000);

      clearStepResults();

      let testFailed = false;

      console.log('\n======================================================');
      console.log('🚀 Starting TC003 - Verify all navigation menu links load valid pages');
      console.log('======================================================');

      const headerPage = new HeaderPage(page);

      let navCount = 0;

      try {

        // ============================================================
        // STEP 1 : Navigate to Homepage
        // ============================================================

        console.log('🔹 Step 1: Navigate to Homepage');

        await goHome(page, headerPage);

        addStepResult(
          'PASS',
          'Success: Homepage loaded successfully.'
        );

        // ============================================================
        // STEP 2 : Count Nav Items
        // ============================================================

        console.log('🔹 Step 2: Count Nav Items');

        try {

          navCount = await headerPage.navItems.count();

          expect(navCount).toBeGreaterThan(0);

          addStepResult(
            'PASS',
            `Success: Found ${navCount} navigation items in the header.`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: No navigation items found in the header. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 3 : Check Each Nav Link
        // ============================================================

        console.log('🔹 Step 3: Check Each Nav Link');

        try {

          let allLinksPass = true;

          const failedLinks = [];

          for (let i = 0; i < navCount; i++) {

            await goHome(page, headerPage);

            const navBtn = headerPage.navButtons.nth(i);

            const label = (await navBtn.textContent() || '').trim();

            try {

              const capturedStatus = await clickAndCapture(page, navBtn);

              const notFound = await is404(page, capturedStatus);

              if (notFound) {

                allLinksPass = false;

                failedLinks.push(`"${label}" → 404`);
              }

            } catch (e) {

              allLinksPass = false;

              failedLinks.push(`"${label}" → error: ${e.message.split('\n')[0]}`);
            }
          }

          expect(allLinksPass).toBeTruthy();

          addStepResult(
            'PASS',
            `Success: All ${navCount} nav links loaded valid pages (no 404s).`
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Some nav links failed. ${error.message.split('\n')[0]}`
          );
        }

        // ============================================================
        // STEP 4 : Submenu Check — hover every nav item, then navigate
        //          directly (page.goto) to every submenu link's href
        //          instead of reloading + re-hovering per link (fast)
        // ============================================================

        console.log('🔹 Step 4: Submenu Check (all nav items, all submenu links)');

        try {

          let allSubmenuLinksPass = true;

          const failedSubmenuLinks = [];

          let anySubmenuFound = false;

          for (let i = 0; i < navCount; i++) {

            await goHome(page, headerPage);

            const navItem = headerPage.navItems.nth(i);
            const navLabel = `Nav item #${i + 1}`;

            await navItem.scrollIntoViewIfNeeded().catch(() => {});
            await navItem.hover();
            await page.waitForTimeout(500);

            const allSubmenus = page.locator('.submenu-container');
            const submenuCount = await allSubmenus.count();

            for (let s = 0; s < submenuCount; s++) {
              const isVisible = await allSubmenus.nth(s).isVisible().catch(() => false);
              console.log(`  ${navLabel} submenu[${s}] visible: ${isVisible}`);
            }

            const visibleSubmenu = allSubmenus.filter({ visible: true }).first();

            const submenuVisible =
              await visibleSubmenu.isVisible({ timeout: 5000 }).catch(() => false);

            if (!submenuVisible) {
              console.log(`  ${navLabel} has no visible submenu — skipping link checks.`);
              continue;
            }

            anySubmenuFound = true;

            // Collect all submenu link hrefs while the submenu is still open,
            // so we don't need to re-hover for every single link.
            const hrefs = await visibleSubmenu
              .locator('a')
              .evaluateAll((els) => els.map((el) => el.href).filter(Boolean));

            const uniqueHrefs = [...new Set(hrefs)];

            console.log(`  ${navLabel} → ${uniqueHrefs.length} submenu link(s) found.`);

            for (const href of uniqueHrefs) {

              const ok = await checkUrlStatus(page, href);

              if (!ok) {
                allSubmenuLinksPass = false;
                failedSubmenuLinks.push(`"${navLabel}" → ${href} → 404`);
              }
            }
          }

          if (!anySubmenuFound) {
            throw new Error('No visible submenu found for any nav item');
          }

          expect(allSubmenuLinksPass, failedSubmenuLinks.join('; ')).toBeTruthy();

          addStepResult(
            'PASS',
            'Success: All submenus appeared on hover and all submenu links loaded valid pages (no 404s).'
          );

        } catch (error) {

          testFailed = true;

          addStepResult(
            'FAIL',
            `Failed: Submenu check failed. ${error.message.split('\n')[0]}`
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
        testCaseId: 'TC003',
        title: 'Verify all navigation menu links load valid pages',
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