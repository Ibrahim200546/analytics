import NextAuth, {type DefaultSession} from "next-auth";
import User from "@/apiTypes/App/Entity/User";
import supabaseProvider from "@dexodus/next-auth-jwt-provider-bundle/src/resources/auth/supabaseProvider";

declare module "next-auth" {
    interface Session {
        user: {
            token: string,
        } & User & DefaultSession["user"]
    }
}

if (!process.env.AUTH_URL && !process.env.NEXTAUTH_URL) {
    if (process.env.NODE_ENV === "production") {
        process.env.AUTH_URL = "https://ismi-analytics.vercel.app";
        process.env.NEXTAUTH_URL = "https://ismi-analytics.vercel.app";
    }
}

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "ismi-secret-jwt-fallback-key-2026-production-safe-32char";

export const {handlers, signIn, signOut, auth} = NextAuth({
    secret: authSecret,
    trustHost: true,
    cookies: {
        // A new name avoids trying to decrypt sessions issued before the secret was rotated.
        sessionToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}authjs.session-token.v2`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 2678400,
    },
    providers: [
        supabaseProvider,
    ],
    callbacks: {
        async jwt(config) {
            if (config.trigger === "signIn") {
                config.token = {...config.user, ...config.token};
            }
            return config.token;
        },
        async session(config) {
            config.session.user = {
                ...config.session.user,
                ...config.token,
            } as typeof config.session.user;
            return config.session;
        },
        async redirect({ url, baseUrl }) {
            const canonicalBase = process.env.NODE_ENV === "production" ? "https://ismi-analytics.vercel.app" : baseUrl;
            if (url.startsWith("/")) {
                return `${canonicalBase}${url}`;
            }
            try {
                const parsed = new URL(url);
                if (parsed.hostname.includes("ismi-analytics.vercel.app") || parsed.hostname.includes("localhost")) {
                    return url;
                }
            } catch {}
            return `${canonicalBase}/admin`;
        },
    },
});
