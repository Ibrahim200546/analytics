import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    trustHost: true,
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/admin');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/admin', nextUrl));
            }
            return true;
        },
    },
    providers: [],
    session: {
        maxAge: 2678400 // 31 день * 24 часа * 60 минут * 60 секунд
    },
} satisfies NextAuthConfig;
