const { defineConfig } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  testDir: './tests',

  outputDir: 'reports/test-results',

  fullyParallel: false,

  workers: 1,

  retries: 0,

  timeout: 60000,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'my-allure-results' }],

    ['monocart-reporter', {
      name: 'BEBE Test Execution Report',
      outputFile: 'reports/monocart-report/index.html',

      // ── visitor: runs per test item during report generation ──────────────
      // Monocart 2.11.2 captures console.log into test.logs[]
      // We parse our tagged line and build the expectedResults / stepsData
      // columns from it.
      visitor: (testItem) => {
        if (!Array.isArray(testItem.logs) || testItem.logs.length === 0) return;

        // Find the tagged log line written by reportLogger.js
        const taggedLog = testItem.logs.find(
          log => typeof log === 'string' && log.includes('##EXPECTED_RESULTS##')
        );

        if (!taggedLog) return;

        // Parse the JSON after the tag
        try {
          const jsonStr = taggedLog.split('##EXPECTED_RESULTS##')[1].trim();
          const parsed = JSON.parse(jsonStr);
          testItem.expectedResults = parsed;
          // Reused by the Steps column too (see note below on timestamps).
          testItem.stepsData = parsed;
        } catch {
          // ignore parse errors
        }
      },

      columns: (defaultColumns) => {
        const titleIdx = defaultColumns.findIndex(c => c.id === 'title');
        const insertAt = titleIdx !== -1 ? titleIdx + 1 : defaultColumns.length;

        // ──────────────────────────────────────────────────────────────────
        // IMPORTANT: monocart-reporter serializes every `formatter` function
        // to a string (Function.prototype.toString) and re-evaluates it in
        // the browser to render the report. That means a formatter can NEVER
        // reference anything from an outer closure (helper functions,
        // constants defined above, etc.) — those references simply don't
        // exist anymore once the function is re-created in the browser.
        //
        // This was the root cause of colors not showing: `statusBadge` and
        // `STATUS_PALETTE` were declared outside the formatter and then
        // assigned (`col.formatter = statusBadge`). Every formatter below is
        // now 100% self-contained — no outside references at all.
        // ──────────────────────────────────────────────────────────────────

        // Steps column: colored PASS/FAIL/SKIP badge + message + timestamp,
        // one row per step, styled like the Extent report.
        const stepsCol = {
          id: 'stepsData',
          name: 'Steps',
          width: 480,
          align: 'left',

          formatter: (value) => {
            if (!value) return '';

            let items = [];
            if (typeof value === 'string') {
              try { items = JSON.parse(value); } catch { return value; }
            } else if (Array.isArray(value)) {
              items = value;
            }

            if (!items.length) return '';

            const rows = items.map((e) => {
              const status = (e.status || 'N/A').toUpperCase();
              const palette = {
                PASS: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
                FAIL: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
                SKIP: { bg: '#fff3cd', color: '#856404', border: '#ffeeba' },
                'N/A': { bg: '#e9ecef', color: '#495057', border: '#dee2e6' },
              };
              const s = palette[status] || palette['N/A'];

              // Timestamp: prefer an explicit per-step timestamp if present
              // (added via reportLogger.js / testReporter.js), otherwise
              // fall back to the test's start time so the column still
              // renders something meaningful.
              let timeLabel = '';
              const rawTime = e.timestamp || e.time;
              if (rawTime) {
                const d = new Date(rawTime);
                if (!isNaN(d.getTime())) {
                  timeLabel = d.toLocaleTimeString('en-US', { hour12: false }) +
                    '.' + String(d.getMilliseconds()).padStart(3, '0');
                }
              }

              return `<div style="display:flex;align-items:flex-start;gap:8px;` +
                `padding:5px 2px;border-bottom:1px solid #f0f0f0;` +
                `font-size:12px;line-height:1.5;">` +
                `<span style="background:${s.bg};color:${s.color};` +
                `border:1px solid ${s.border};font-weight:700;font-size:10px;` +
                `padding:2px 6px;border-radius:4px;white-space:nowrap;` +
                `min-width:36px;text-align:center;margin-top:2px;flex-shrink:0;">${status}</span>` +
                (timeLabel
                  ? `<span style="color:#888;font-size:10px;white-space:nowrap;` +
                    `margin-top:3px;flex-shrink:0;font-family:monospace;">${timeLabel}</span>`
                  : '') +
                `<span style="color:#333;">${e.point || ''}</span></div>`;
            }).join('');

            return `<div style="padding:2px 0;">${rows}</div>`;
          },
        };

        const expectedResultsCol = {
          id:    'expectedResults',
          name:  'Expected Results',
          width: 480,
          align: 'left',

          formatter: (value) => {
            if (!value) return '';

            let items = [];
            if (typeof value === 'string') {
              try { items = JSON.parse(value); } catch { return value; }
            } else if (Array.isArray(value)) {
              items = value;
            }

            if (!items.length) return '';

            const rows = items.map(e => {
              const status = (e.status || 'N/A').toUpperCase();
              const palette = {
                PASS: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
                FAIL: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
                SKIP: { bg: '#fff3cd', color: '#856404', border: '#ffeeba' },
                'N/A': { bg: '#e9ecef', color: '#495057', border: '#dee2e6' },
              };
              const s = palette[status] || palette['N/A'];
              return `<div style="display:flex;align-items:flex-start;gap:8px;` +
                `padding:5px 2px;border-bottom:1px solid #f0f0f0;` +
                `font-size:12px;line-height:1.5;">` +
                `<span style="background:${s.bg};color:${s.color};` +
                `border:1px solid ${s.border};font-weight:700;font-size:10px;` +
                `padding:2px 6px;border-radius:4px;white-space:nowrap;` +
                `min-width:36px;text-align:center;margin-top:2px;flex-shrink:0;">${status}</span>` +
                `<span style="color:#333;">${e.point || ''}</span></div>`;
            }).join('');

            return `<div style="padding:2px 0;">${rows}</div>`;
          },
        };

        const cols = [...defaultColumns];
        cols.splice(insertAt, 0, stepsCol, expectedResultsCol);

        // Apply the same green/red/yellow/gray badge styling to the
        // built-in Status, Expected, and Outcome columns. Each formatter is
        // fully self-contained (see note above) — no shared helper function.
        ['status', 'expectedStatus', 'outcome'].forEach((colId) => {
          const col = cols.find(c => c.id === colId);
          if (col) {
            col.formatter = (value) => {
              if (!value) return '';
              const key = String(value).toUpperCase();
              const palette = {
                PASSED:      { bg: '#d4edda', color: '#155724', border: '#c3e6cb', label: 'PASS' },
                EXPECTED:    { bg: '#d4edda', color: '#155724', border: '#c3e6cb', label: 'PASS' },
                FAILED:      { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: 'FAIL' },
                UNEXPECTED:  { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: 'FAIL' },
                TIMEDOUT:    { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: 'FAIL' },
                INTERRUPTED: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb', label: 'FAIL' },
                FLAKY:       { bg: '#fff3cd', color: '#856404', border: '#ffeeba', label: 'FLAKY' },
                SKIPPED:     { bg: '#e9ecef', color: '#495057', border: '#dee2e6', label: 'SKIP' },
              };
              const s = palette[key] || { bg: '#e9ecef', color: '#495057', border: '#dee2e6', label: key };
              return `<span style="display:inline-block;background:${s.bg};color:${s.color};` +
                `border:1px solid ${s.border};font-weight:700;font-size:11px;` +
                `padding:3px 10px;border-radius:4px;white-space:nowrap;">${s.label}</span>`;
            };
          }
        });

        return cols;
      },

      summary: {
        passed:   true,
        failed:   true,
        skipped:  true,
        flaky:    true,
        duration: true,
      },

      trend: { n: 10 },
    }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://www.bebeautiful.in',
    headless: false,
    channel: 'chrome',
    viewport: { width: 1440, height: 810 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    launchOptions: {
      slowMo: 100,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-infobars',
      ],
    },
  },

  expect: {
    timeout: 10000,
  },
});