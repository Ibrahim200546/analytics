import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import {NextResponse} from "next/server";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

// export function middleware(request: Request) {
//     const requestHeaders = new Headers(request.headers);
//     const url = request.url.replace(/^.*\/\/[^\/]+/, '');
//
//     requestHeaders.set('x-url', url);
//
//     return NextResponse.next({
//         request: {
//             headers: requestHeaders,
//         }
//     });
// }
