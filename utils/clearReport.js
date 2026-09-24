// utils/clearReport.js

const fs = require('fs');

const path = require('path');

const reportPath = path.join(
  __dirname,
  '../reports/raw-results.json'
);

fs.writeFileSync(
  reportPath,
  JSON.stringify([], null, 2)
);

console.log(
  '✅ Old report cleared'
);