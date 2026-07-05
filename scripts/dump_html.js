const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://vnexpress.net/the-thao/world-cup-2026/lich-thi-dau', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait for the specific container or just wait a bit
  await page.waitForTimeout(10000); // 10 seconds for everything to load

  const html = await page.content();
  fs.writeFileSync('vnexpress_full.html', html);
  console.log('Saved to vnexpress_full.html');
  
  await browser.close();
})();
