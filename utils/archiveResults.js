const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../reports');
const rawFilePath = path.join(reportsDir, 'raw-results.json');
const historyDir = path.join(reportsDir, 'history');

function getTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

if (!fs.existsSync(rawFilePath)) {
    console.warn('⚠️ raw-results.json not found. Archive skipped.');
    process.exit(0);
}

if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
}

const timestamp = getTimestamp();
let archiveFileName = `raw-results-${timestamp}.json`;
let archiveFilePath = path.join(historyDir, archiveFileName);
let attempt = 1;

while (fs.existsSync(archiveFilePath)) {
    attempt += 1;
    archiveFileName = `raw-results-${timestamp}-${attempt}.json`;
    archiveFilePath = path.join(historyDir, archiveFileName);
}

fs.copyFileSync(rawFilePath, archiveFilePath, fs.constants.COPYFILE_EXCL);
console.log('📦 Raw results archived:', archiveFilePath);
