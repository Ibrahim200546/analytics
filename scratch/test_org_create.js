const puppeteer = require('c:/Users/user/Desktop/1/exchange-rates/frontend/node_modules/puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\0bbdb25d-2db0-4b39-9699-67808b5ef307';

(async () => {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push({ text: msg.text(), location: msg.location() });
        }
    });
    page.on('pageerror', err => {
        pageErrors.push(err.toString());
    });
    page.on('requestfailed', req => {
        if (req.failure()?.errorText !== 'net::ERR_ABORTED') {
            failedRequests.push({ url: req.url(), error: req.failure()?.errorText });
        }
    });

    console.log('1. Logging in...');
    await page.goto('https://ismi-analytics.vercel.app/login/jwt', { waitUntil: 'networkidle2' });
    await page.type('input[name="username"]', 'admin@ismi.kz', { delay: 20 });
    await page.type('input[name="password"]', '12345', { delay: 20 });

    const submitBtn = await page.$('button[type="submit"]');
    await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(e => console.log('Nav:', e.message)),
        submitBtn.click()
    ]);

    await new Promise(r => setTimeout(r, 2000));

    console.log('2. Navigating to /admin/organizations/create...');
    await page.goto('https://ismi-analytics.vercel.app/admin/organizations/create', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    console.log('3. Filling form inputs...');
    const inputs = await page.$$('form input, .card input, input');
    console.log('Found inputs count:', inputs.length);
    if (inputs.length >= 2) {
        await inputs[0].click();
        await inputs[0].type('ТОО Новая Аналитика', { delay: 20 });
        await inputs[1].click();
        const testBin = String(Date.now()).slice(-12);
        await inputs[1].type(testBin, { delay: 20 });
    }

    console.log('4. Clicking [Создать] button...');
    const buttons = await page.$$('button');
    for (const b of buttons) {
        const text = await page.evaluate(el => el.innerText.trim(), b);
        if (text === 'Создать') {
            console.log('Found and clicking [Создать] button');
            await b.click();
            await new Promise(r => setTimeout(r, 4000));
            break;
        }
    }

    console.log('Current URL after submit:', page.url());
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '10_organization_created.png') });

    await browser.close();

    console.log('\n=== TEST RESULTS ===');
    console.log('Console errors:', consoleErrors.length);
    if (consoleErrors.length) console.log(JSON.stringify(consoleErrors, null, 2));
    console.log('Page errors:', pageErrors.length);
    if (pageErrors.length) console.log(JSON.stringify(pageErrors, null, 2));
    console.log('Failed requests:', failedRequests.length);
    if (failedRequests.length) console.log(JSON.stringify(failedRequests, null, 2));
})();
