const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const normalizedFile = path.join(__dirname, '../reports/normalized-results.json');
const rawFile = path.join(__dirname, '../reports/raw-results.json');
const reportFile = path.join(__dirname, '../reports/custom-report.html');
const excelFile = path.join(__dirname, '../reports/custom-report.xlsx');

const inputFile = fs.existsSync(normalizedFile) ? normalizedFile : rawFile;

function excelSafeText(text = '') {
	return String(text)
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/&nbsp;/gi, ' ');
}

if (!fs.existsSync(inputFile)) {
	console.log('❌ Input results file not found');
	process.exit(1);
}

const results = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

function getVerifiedGroups(test) {
	return Array.isArray(test.verifiedActualResults) && test.verifiedActualResults.length > 0
		? test.verifiedActualResults
		: null;
}

function flattenVerifiedLogs(test) {
	const groups = getVerifiedGroups(test) || [];
	return groups.flatMap((group) => group.verifiedExecutionLogs || []);
}

function deriveFinalStatus(test) {
	const verifiedLogs = flattenVerifiedLogs(test);
	if (verifiedLogs.length > 0) {
		const hasFail = verifiedLogs.some((r) => r.status === 'FAIL');
		const hasSkip = !hasFail && verifiedLogs.every((r) => r.status === 'SKIP');
		return hasFail ? 'FAIL' : hasSkip ? 'SKIP' : 'PASS';
	}

	const rawResults = test.results || [];
	const hasFail = rawResults.some((r) => r.status === 'FAIL');
	const hasSkip = !hasFail && rawResults.every((r) => r.status === 'SKIP');
	return hasFail ? 'FAIL' : hasSkip ? 'SKIP' : 'PASS';
}

function renderVerifiedGroupHtml(group) {
	const headers = [];
	if (group.outputMode === 'summary') {
		const summaryText = group.summary || group.requirement || '';
		const status = (group.verifiedExecutionLogs || []).some((r) => r.status === 'FAIL')
			? 'FAIL'
			: (group.verifiedExecutionLogs || []).every((r) => r.status === 'SKIP')
			? 'SKIP'
			: 'PASS';
		return `<div><strong>${summaryText}</strong> [${status}]</div>`;
	}

	const lines = (group.verifiedExecutionLogs || []).map((result) => {
		const detail = (result.details || '').trim();
	
		if (result.status === 'PASS') {
			return `${result.expectedStep} - [PASS]`;
		}
	
		return detail
			? `${result.expectedStep} - ${detail} - [${result.status}]`
			: `${result.expectedStep} - [${result.status}]`;
	});
	const missingLines = [];
	return `<div><strong>${group.requirement || ''}</strong><br>${[...lines, ...missingLines].join('<br>')}</div>`;
}

function renderVerifiedActualHtml(test) {
	const groups = getVerifiedGroups(test);
	if (!groups) {
		return null;
	}
	return groups.map(renderVerifiedGroupHtml).join('<br><br>');
}

function renderVerifiedActualText(test) {
	const groups = getVerifiedGroups(test);
	if (!groups) {
		return null;
	}
	return groups.map((group) => {
		if (group.outputMode === 'summary') {
			const summaryText = group.summary || group.requirement || '';
			const status = (group.verifiedExecutionLogs || []).some((r) => r.status === 'FAIL')
				? 'FAIL'
				: (group.verifiedExecutionLogs || []).every((r) => r.status === 'SKIP')
				? 'SKIP'
				: 'PASS';
			return `${summaryText} [${status}]`;
		}

		const lines = (group.verifiedExecutionLogs || []).map((result) => {
			const detail = (result.details || '').trim();
		
			if (result.status === 'PASS') {
				return `${result.expectedStep} - [PASS]`;
			}
		
			return detail
				? `${result.expectedStep} - ${detail} - [${result.status}]`
				: `${result.expectedStep} - [${result.status}]`;
		});
		const missingLines = [];
		return `${group.requirement || ''}\n${[...lines, ...missingLines].join('\n')}`;
	}).join('\n\n');
}

const computed = results.map((test) => {
	const finalStatus = deriveFinalStatus(test);
	const verifiedHtml = renderVerifiedActualHtml(test);
	const verifiedText = renderVerifiedActualText(test);

	const actualResultHtml = verifiedHtml || (test.results || []).map((result) => {
		const detail = (result.details || '').trim();
		return detail
			? `${result.step} - ${detail} - [${result.status}]`
			: `${result.step} - [${result.status}]`;
	}).join('\n');

	const actualResultText = verifiedText || (test.results || []).map((result) => {
		const detail = (result.details || '').trim();
		return detail
			? `${result.step} - ${detail} - [${result.status}]`
			: `${result.step} - [${result.status}]`;
	}).join('\n\n');

	return { test, finalStatus, actualResultHtml, actualResultText };
});

const total = computed.length;
const passed = computed.filter((c) => c.finalStatus === 'PASS').length;
const failed = computed.filter((c) => c.finalStatus === 'FAIL').length;
const skipped = computed.filter((c) => c.finalStatus === 'SKIP').length;
const passRate = total > 0 ? ((passed / total) * 100).toFixed(2) : '0.00';

const moduleMap = {};
computed.forEach(({ test, finalStatus }) => {
	const mod = test.module || 'Unknown';
	if (!moduleMap[mod]) moduleMap[mod] = { passed: 0, total: 0 };
	moduleMap[mod].total++;
	if (finalStatus === 'PASS') moduleMap[mod].passed++;
});

const moduleNames = Object.keys(moduleMap);
const maxModLen = Math.max(...moduleNames.map((m) => m.length), 0);
const moduleLines = moduleNames
	.map((m) => `${m.padEnd(maxModLen)} : ${moduleMap[m].passed}/${moduleMap[m].total}`)
	.join('\n');

const divider = '\u2501'.repeat(42);
const terminalSummary = [
	'',
	divider,
	'',
	'Custom Report Summary',
	'',
	`${'Total Tests'.padEnd(12)}: ${total}`,
	`${'Passed'.padEnd(12)}: ${passed}`,
	`${'Failed'.padEnd(12)}: ${failed}`,
	`${'Skipped'.padEnd(12)}: ${skipped}`,
	`${'Pass Rate'.padEnd(12)}: ${passRate}%`,
	'',
	moduleLines,
	'',
	divider,
	'',
].join('\n');

let tableRows = '';

computed.forEach(({ test, finalStatus, actualResultHtml }) => {
	tableRows += `
    <tr>
      <td>${test.testId}</td>
      <td>${test.module}</td>
      <td>${test.scenario}</td>
      <td>${test.steps}</td>
      <td>${test.expected}</td>
      <td>${test.priority}</td>
      <td class="${finalStatus}">${finalStatus}</td>
      <td class="pre-line">${actualResultHtml}</td>
    </tr>
  `;
});

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>BeBeautiful Automation Report</title>
<style>
body {
  margin: 0;
  padding: 20px;
  background: #f5f5f5;
  font-family: Arial;
}
.header {
  background: #111b3a;
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
}
.report-time {
  text-align: center;
  margin: 10px;
  color: #666;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
th {
  background: #111b3a;
  color: white;
  padding: 12px;
  border: 1px solid #ddd;
}
td {
  padding: 12px;
  border: 1px solid #ddd;
  vertical-align: top;
  font-size: 14px;
}
.pre-line {
  white-space: pre-line;
}
.PASS {
  background: #d4edda;
  color: green;
  font-weight: bold;
  text-align: center;
}
.FAIL {
  background: #f8d7da;
  color: red;
  font-weight: bold;
  text-align: center;
}
.SKIP {
  background: #fff3cd;
  color: #856404;
  font-weight: bold;
  text-align: center;
}
</style>
</head>
<body>
<div class="header">BeBeautiful — P0 Automation Test Execution Report</div>
<div class="report-time">Report Generated: ${new Date().toLocaleString()}</div>
<table>
<tr>
  <th>Test ID</th>
  <th>Module</th>
  <th>Test Scenario</th>
  <th>Test Steps</th>
  <th>Expected Result</th>
  <th>Priority</th>
  <th>Status</th>
  <th>Actual Result</th>
</tr>
${tableRows}
</table>
</body>
</html>`;

fs.writeFileSync(reportFile, html);

async function generateExcel() {
	const wb = new ExcelJS.Workbook();
	wb.creator = 'BeBeautiful Automation Suite';
	wb.created = new Date();

	const ws = wb.addWorksheet('Test Report', {
		properties: { tabColor: { argb: 'FF111B3A' } },
	});

	ws.columns = [
		{ header: 'Test ID', key: 'testId', width: 10 },
		{ header: 'Module', key: 'module', width: 16 },
		{ header: 'Test Scenario', key: 'scenario', width: 36 },
		{ header: 'Test Steps', key: 'steps', width: 44 },
		{ header: 'Expected Result', key: 'expected', width: 44 },
		{ header: 'Priority', key: 'priority', width: 10 },
		{ header: 'Status', key: 'status', width: 10 },
		{ header: 'Actual Result', key: 'actual', width: 52 },
	];

	const headerRow = ws.getRow(1);
	headerRow.eachCell((cell) => {
		cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, name: 'Arial', size: 10 };
		cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111B3A' } };
		cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
		cell.border = {
			top: { style: 'thin' },
			bottom: { style: 'thin' },
			left: { style: 'thin' },
			right: { style: 'thin' },
		};
	});
	headerRow.height = 28;

	ws.autoFilter = {
		from: { row: 1, column: 1 },
		to: { row: 1, column: ws.columns.length },
	};

	const ALT_ROW = 'FFF8F9FA';
	const WHITE = 'FFFFFFFF';

	computed.forEach(({ test, finalStatus, actualResultText }, idx) => {
		const row = ws.addRow({
			testId: test.testId,
			module: test.module,
			scenario: excelSafeText(test.scenario),
			steps: excelSafeText(test.steps),
			expected: excelSafeText(test.expected),
			priority: test.priority,
			status: finalStatus,
			actual: excelSafeText(actualResultText),
		});
		row.eachCell((cell, colNumber) => {
			cell.alignment = { wrapText: true, vertical: 'top' };
			cell.border = {
				top: { style: 'thin' },
				bottom: { style: 'thin' },
				left: { style: 'thin' },
				right: { style: 'thin' },
			};
			if (colNumber === 8) {
				cell.alignment = { wrapText: true, vertical: 'top' };
			}
		});

		const fillColor = idx % 2 === 0 ? WHITE : ALT_ROW;
		row.eachCell((cell) => {
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
		});

		const statusStyle = {
			PASS: { bg: 'FFD4EDDA', fg: 'FF155724' },
			FAIL: { bg: 'FFF8D7DA', fg: 'FF721C24' },
			SKIP: { bg: 'FFFFF3CD', fg: 'FF856404' },
		}[finalStatus] || { bg: 'FFFFFFFF', fg: 'FF000000' };

		const statusCell = row.getCell('status');
		statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: statusStyle.bg } };
		statusCell.font = { color: { argb: statusStyle.fg }, bold: true };
	});

	ws.getColumn('steps').alignment = { wrapText: true };
	ws.getColumn('expected').alignment = { wrapText: true };
	ws.getColumn('actual').alignment = { wrapText: true };

	await wb.xlsx.writeFile(excelFile);
}

fs.writeFileSync(reportFile, html);
console.log(`HTML report generated at ${reportFile}`);

generateExcel().then(() => {
	console.log(`Excel report generated at ${excelFile}`);
}).catch((err) => {
	console.log(`❌ Excel generation failed: ${err.message}`);
	process.exit(1);
});
