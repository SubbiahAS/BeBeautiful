// utils/attachExpectedResults.js
//
// Global Playwright fixture that reads expectedResults from raw-results.json
// after each test and attaches them as a Monocart annotation.
// This is what makes the "Expected Results" column appear in the Monocart report.

const { test: base } = require('@playwright/test');
const fs   = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../reports/raw-results.json');

/**
 * Read the latest entry for this test from raw-results.json and
 * attach its expectedResults array as a Monocart annotation.
 */
const test = base.extend({
  // Auto-fixture: runs for every test automatically
  _attachExpected: [async ({}, use, testInfo) => {
    await use();   // run the test first

    // After test: find matching entry in raw-results.json
    if (!fs.existsSync(reportPath)) return;

    let results = [];
    try {
      results = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    } catch {
      return;
    }

    // Match by test title (TC ID is in the title)
    const tcMatch = testInfo.title.match(/TC\d+/i);
    const tcId    = tcMatch ? tcMatch[0].toUpperCase() : null;

    const entry = results
      .slice()
      .reverse()
      .find(r => {
        if (tcId && (r.testId || '').toUpperCase() === tcId) return true;
        const scenario = (r.scenario || r.title || '').toLowerCase();
        return testInfo.title.toLowerCase().includes(scenario.substring(0, 20));
      });

    if (!entry || !Array.isArray(entry.expectedResults)) return;

    // Attach as Monocart annotation — key must match column id
    testInfo.annotations.push({
      type:  'expectedResults',
      description: JSON.stringify(entry.expectedResults),
    });

  }, { auto: true }],
});

module.exports = { test };