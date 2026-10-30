const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function runCapture() {
  const screenshotDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('Khoi dong Chrome headless...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1200,850'],
    defaultViewport: { width: 1200, height: 850 }
  });

  const page = await browser.newPage();

  // 1. Man hinh Trang dang nhap ban dau
  console.log('1. Chup anh Trang dang nhap ban dau...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: path.join(screenshotDir, '01_trang_dang_nhap.png') });

  // 2. Thu dang nhap sai de hien thi Loi 401
  console.log('2. Thu dang nhap sai...');
  await page.type('#email', 'admin@gmail.com');
  await page.type('#matKhau', 'sai_mat_khau');
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(screenshotDir, '02_loi_dang_nhap_401.png') });

  // 3. Dien dung tai khoan va dang nhap thanh cong -> Xem danh sach san pham
  console.log('3. Dang nhap thanh cong va tai san pham...');
  await page.click('.btn-outline'); // Nut Dien nhanh tai khoan admin
  await new Promise((r) => setTimeout(r, 400));
  await page.click('button[type="submit"]');
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotDir, '03_danh_sach_san_pham_thanh_cong.png') });

  // 4. Gia lap Token loi / 403 Forbidden
  console.log('4. Gia lap loi 403 Forbidden...');
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
  await page.click('button.btn-warning.btn-sm'); // Nut "Thu Token Loi"
  await new Promise((r) => setTimeout(r, 600));
  await page.click('.header-actions .btn-secondary'); // Nut "Tai lai du lieu"
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotDir, '04_loi_token_403.png') });

  console.log('Hoan tat chup anh man hinh!');
  await browser.close();
}

runCapture().catch((err) => {
  console.error('Loi chup anh:', err);
  process.exit(1);
});
