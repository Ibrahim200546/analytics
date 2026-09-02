import {NextRequest, NextResponse} from "next/server";
import puppeteer from "puppeteer";
import {auth} from "@/auth";

export const runtime = "nodejs";

const getAllowedHosts = (): Set<string> => new Set(
    (process.env.PARSER_ALLOWED_HOSTS || "")
        .split(",")
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean),
);

const parseTargetUrl = (value: string | null): URL => {
    if (!value) {
        throw new Error("Query parameter 'url' is required");
    }

    let target: URL;
    try {
        target = new URL(value);
    } catch {
        throw new Error("Invalid target URL");
    }
    const allowedHosts = getAllowedHosts();

    if (!["http:", "https:"].includes(target.protocol)) {
        throw new Error("Only HTTP and HTTPS targets are supported");
    }

    if (allowedHosts.size === 0 || !allowedHosts.has(target.hostname.toLowerCase())) {
        throw new Error("The requested host is not allowed");
    }

    return target;
};

async function getRenderedPage(url: URL) {
    const username = process.env.PARSER_USERNAME;
    const password = process.env.PARSER_PASSWORD;

    if (!username || !password) {
        throw new Error("PARSER_USERNAME and PARSER_PASSWORD must be configured");
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: process.env.PUPPETEER_NO_SANDBOX === "true"
            ? ["--no-sandbox", "--disable-setuid-sandbox"]
            : [],
    });
    const page = await browser.newPage();

    try {
        page.setDefaultNavigationTimeout(15000);
        await page.goto(url.href, {waitUntil: "networkidle2"});
        await page.waitForSelector('input[name="username"]', {timeout: 10000});
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForNavigation({waitUntil: "networkidle0", timeout: 15000}).catch(() => undefined);

        return {
            status: "ok",
            html: await page.content(),
        };
    } finally {
        await browser.close();
    }
}

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const target = parseTargetUrl(request.nextUrl.searchParams.get("url"));
        return NextResponse.json(await getRenderedPage(target));
    } catch (error) {
        const message = error instanceof Error ? error.message : "Parser request failed";
        const clientError = message.includes("required")
            || message.includes("supported")
            || message.includes("allowed")
            || message.includes("Invalid target");

        return NextResponse.json(
            {error: message},
            {status: clientError ? 400 : 502},
        );
    }
}
