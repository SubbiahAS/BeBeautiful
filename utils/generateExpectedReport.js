// utils/generateExpectedReport.js
//
// Run this AFTER your playwright tests to generate a standalone
// Expected Results HTML report from raw-results.json.
//
// Usage:  node utils/generateExpectedReport.js
// Add to package.json scripts:
//   "report:expected": "node utils/generateExpectedReport.js"

const fs   = require('fs');
const path = require('path');

const inputPath  = path.join(__dirname, '../reports/raw-results.json');
const outputPath = path.join(__dirname, '../reports/expected-results-report.html');

// Read raw-results.json
let results = [];
try {
  results = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
} catch (e) {
  console.error('❌ Could not read raw-results.json:', e.message);
  process.exit(1);
}

// ── Badge HTML ────────────────────────────────────────────────────────────────
function badge(status) {
  const s = (status || 'N/A').toUpperCase();
  const map = {
    PASS: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
    FAIL: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
    SKIP: { bg: '#fff3cd', color: '#856404', border: '#ffeeba' },
    'N/A': { bg: '#e9ecef', color: '#495057', border: '#dee2e6' },
  };
  const st = map[s] || map['N/A'];
  return `<span style="
    background:${st.bg};color:${st.color};border:1px solid ${st.border};
    font-weight:700;font-size:11px;padding:2px 8px;border-radius:4px;
    white-space:nowrap;display:inline-block;min-width:40px;text-align:center;">
    ${s}
  </span>`;
}

// ── Summary counts ────────────────────────────────────────────────────────────
const total   = results.length;
const passed  = results.filter(r => (r.status || '').toUpperCase() === 'PASS').length;
const failed  = results.filter(r => (r.status || '').toUpperCase() === 'FAIL').length;
const skipped = results.filter(r => (r.status || '').toUpperCase() === 'SKIP').length;
const now     = new Date().toLocaleString();

// ── Build test rows ───────────────────────────────────────────────────────────
function buildRows() {
  return results.map((r, idx) => {
    const overallStatus = (r.status || 'N/A').toUpperCase();
    const rowBg = overallStatus === 'FAIL' ? '#fff5f5'
                : overallStatus === 'SKIP' ? '#fffdf0'
                : '#ffffff';

    const expectedRows = Array.isArray(r.expectedResults) && r.expectedResults.length > 0
      ? r.expectedResults.map(e => `
          <div style="display:flex;align-items:flex-start;gap:10px;
            padding:6px 4px;border-bottom:1px solid #f0f0f0;font-size:13px;line-height:1.5;">
            ${badge(e.status)}
            <span style="color:#333;">${e.point || ''}</span>
          </div>`).join('')
      : `<div style="color:#999;font-size:13px;padding:6px 0;">No expected results recorded.</div>`;

    return `
      <tr style="background:${rowBg};border-bottom:2px solid #e0e0e0;">
        <td style="padding:12px 16px;font-weight:600;color:#333;vertical-align:top;
          border-right:1px solid #e0e0e0;white-space:nowrap;">${idx + 1}</td>
        <td style="padding:12px 16px;vertical-align:top;border-right:1px solid #e0e0e0;">
          <div style="font-weight:600;color:#1a1a2e;font-size:13px;">${r.testId || '—'}</div>
          <div style="color:#666;font-size:12px;margin-top:3px;">${r.module || ''}</div>
        </td>
        <td style="padding:12px 16px;vertical-align:top;border-right:1px solid #e0e0e0;
          font-size:13px;color:#333;max-width:280px;">${r.scenario || '—'}</td>
        <td style="padding:12px 16px;vertical-align:top;border-right:1px solid #e0e0e0;">
          ${badge(overallStatus)}
        </td>
        <td style="padding:12px 16px;vertical-align:top;">
          <div>${expectedRows}</div>
        </td>
      </tr>`;
  }).join('');
}

// ── Full HTML ─────────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BEBE Expected Results Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f4f6f9; color: #333; }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: white; padding: 28px 40px; }
    .header h1 { font-size: 24px; font-weight: 600; margin-bottom: 6px; }
    .header p  { font-size: 13px; opacity: 0.7; }
    .summary { display: flex; gap: 16px; padding: 24px 40px; flex-wrap: wrap; }
    .card { background: white; border-radius: 10px; padding: 18px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08); min-width: 130px; text-align: center; }
    .card .num  { font-size: 32px; font-weight: 700; }
    .card .lbl  { font-size: 12px; color: #888; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    .num.total  { color: #1a1a2e; }
    .num.pass   { color: #155724; }
    .num.fail   { color: #721c24; }
    .num.skip   { color: #856404; }
    .table-wrap { margin: 0 40px 40px; background: white;
      border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1a1a2e; color: white; }
    thead th { padding: 14px 16px; text-align: left; font-size: 12px;
      font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
    tbody tr:hover { background: #f8f9ff !important; }
    .footer { text-align: center; padding: 20px; color: #aaa; font-size: 12px; }
  </style>
</head>
<body>

  <div class="header">
    <h1>🧪 BEBE Test Execution — Expected Results Report</h1>
    <p>Generated: ${now} &nbsp;|&nbsp; Total Tests: ${total}</p>
  </div>

  <div class="summary">
    <div class="card"><div class="num total">${total}</div><div class="lbl">Total</div></div>
    <div class="card"><div class="num pass">${passed}</div><div class="lbl">Passed</div></div>
    <div class="card"><div class="num fail">${failed}</div><div class="lbl">Failed</div></div>
    <div class="card"><div class="num skip">${skipped}</div><div class="lbl">Skipped</div></div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th style="width:50px">#</th>
          <th style="width:120px">Test ID</th>
          <th style="width:260px">Scenario</th>
          <th style="width:90px">Status</th>
          <th>Expected Results (Step by Step)</th>
        </tr>
      </thead>
      <tbody>
        ${buildRows()}
      </tbody>
    </table>
  </div>

  <div class="footer">BEBE Sanity Automation · Expected Results Report</div>

</body>
</html>`;

fs.writeFileSync(outputPath, html, 'utf8');
console.log('✅ Expected Results Report generated:');
console.log('   ' + outputPath);
console.log('\n   Open in browser: reports/expected-results-report.html');