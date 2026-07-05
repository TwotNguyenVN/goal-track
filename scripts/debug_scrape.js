const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://vnexpress.net/the-thao/world-cup-2026/lich-thi-dau', { waitUntil: 'networkidle', timeout: 60000 });
  
  try {
    await page.waitForSelector('#wc26-full', { timeout: 15000 });
    // dump the inner HTML of the widget
    const html = await page.$eval('#wc26-full', el => el.innerHTML);
    fs.writeFileSync('debug_widget.html', html);
    console.log('Widget HTML saved to debug_widget.html');
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();
