import {NextRequest} from "next/server";
const puppeteer = require("puppeteer");

async function getRenderedPage(url) {
    // Запускаем браузер
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    try {
        // Открываем страницу
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Получаем HTML содержимое
        return await page.content();
    } catch (error) {
        console.error('Error fetching rendered page:', error);
        return null;
    } finally {
        // Закрываем браузер
        await browser.close();
    }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');
    const renderedHTML = await getRenderedPage(url);

    return Response.json({html: renderedHTML});
}
