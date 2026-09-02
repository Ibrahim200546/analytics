import {NextRequest, NextResponse} from "next/server";
import instaTouch from "instatouch";
import {auth} from "@/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const username = request.nextUrl.searchParams.get("username")
        || process.env.INSTAGRAM_DEFAULT_USERNAME
        || "natgeo";
    const requestedCount = Number.parseInt(process.env.INSTAGRAM_MEDIA_COUNT || "10", 10);
    const count = Number.isFinite(requestedCount) && requestedCount > 0
        ? Math.min(requestedCount, 50)
        : 10;

    if (!/^[a-zA-Z0-9._]{1,30}$/.test(username)) {
        return NextResponse.json({error: "Invalid Instagram username"}, {status: 400});
    }

    try {
        const options = {
            count,
            mediaType: "all" as const,
            ...(process.env.INSTAGRAM_SESSION ? {session: process.env.INSTAGRAM_SESSION} : {}),
        };
        const user = await instaTouch.user(username, options);

        return NextResponse.json({user});
    } catch (error) {
        console.error("Instagram scraper failed", error instanceof Error ? error.message : error);
        return NextResponse.json({error: "Instagram request failed"}, {status: 502});
    }
}
