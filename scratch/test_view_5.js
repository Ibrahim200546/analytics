const puppeteer = require('c:/Users/user/Desktop/1/exchange-rates/frontend/node_modules/puppeteer');
const path = require('path');
const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0bbdb25d-2db0-4b39-9699-67808b5ef307';

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto('https://ismi-analytics.vercel.app/login/jwt', { waitUntil: 'networkidle2' });
    await page.type('input[name="username"]', 'admin@ismi.kz', { delay: 10 });
    await page.type('input[name="password"]', '12345', { delay: 10 });
    const submitBtn = await page.$('button[type="submit"]');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
        submitBtn.click()
    ]);

    await page.goto('https://ismi-analytics.vercel.app/admin/organizations/view/5', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 4000));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '11_new_org_view.png') });

    const cardTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.card, [class*="Card"]')).map(c => c.innerText.slice(0, 50));
    });
    console.log('Card snippets on view/5:', cardTitles);
    await browser.close();
})();
