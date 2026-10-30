const puppeteer = require('puppeteer-core');
const path = require('path');

async function captureLoading() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    defaultViewport: { width: 1200, height: 850 }
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await page.click('.btn-outline');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1000));

  // Emulate network latency to capture loading spinner
  const client = await page.target().createCDPSession();
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 2000,
    downloadThroughput: 50 * 1024,
    uploadThroughput: 50 * 1024
  });

  page.click('.header-actions .btn-secondary');
  await new Promise((r) => setTimeout(r, 150));

  const outPath = path.join(__dirname, 'screenshots', '05_trang_thai_loading.png');
  await page.screenshot({ path: outPath });
  console.log('Loading state captured successfully at:', outPath);
  await browser.close();
}

captureLoading().catch(console.error);
