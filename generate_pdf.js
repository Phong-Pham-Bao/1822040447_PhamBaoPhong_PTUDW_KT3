const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
  const htmlPath = path.join(__dirname, 'docs', 'bao_cao.html');
  const pdfPath = path.join(__dirname, 'BaoCao_1822040447_PhamBaoPhong_PTUDW_KT3.pdf');

  console.log('Dang doc file HTML:', htmlPath);
  console.log('Khoi dong trinh bien dich PDF qua Chrome headless...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0'
  });

  console.log('Dang xuat file PDF theo tieu chuan A4...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="font-family: Arial, sans-serif; font-size: 8.5px; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 15mm;">
        <span>Báo cáo KT3: Kết Hợp React & Node.js — SV: Phạm Bảo Phong (1822040447)</span>
        <span>Trang <span class="pageNumber"></span> / <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();
  console.log('Xuat PDF thanh cong tai:', pdfPath);
}

generatePDF().catch((err) => {
  console.error('Loi tao PDF:', err);
  process.exit(1);
});
