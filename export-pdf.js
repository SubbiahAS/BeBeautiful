const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:3000', {
    waitUntil: 'networkidle'
  });

  await page.pdf({
    path: 'allure-report.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      bottom: '20px',
      left: '20px',
      right: '20px'
    }
  });

  console.log('✅ PDF generated: allure-report.pdf');
  await browser.close();
})();