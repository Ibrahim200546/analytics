import NextAuth, {type DefaultSession} from "next-auth";
import User from "@/apiTypes/App/Entity/User";
import supabaseProvider from "@dexodus/next-auth-jwt-provider-bundle/src/resources/auth/supabaseProvider";
import { createClient } from "@supabase/supabase-js";

declare module "next-auth" {
    interface Session {
        user: {
            token: string,
            refresh_token?: string,
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

async function refreshSupabaseToken(refreshToken: string): Promise<{ access_token: string; refresh_token: string; expires_at: number } | null> {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znxpazaraxtnnixgdbbd.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_9YQ-e-rmBN_vM4WfgdxJKw_OtBXp7ij';
        const supabase = createClient(supabaseUrl, supabaseKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });
        const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
        if (error || !data.session) return null;
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at ?? (Math.floor(Date.now() / 1000) + 3600),
        };
    } catch {
        return null;
    }
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    secret: authSecret,
    trustHost: true,
    cookies: {
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
            // Refresh Supabase token if expired or about to expire (within 5 min)
            const tokenData = config.token as Record<string, unknown>;
            const expiresAt = tokenData.expires_at as number | undefined;
            const refreshToken = tokenData.refresh_token as string | undefined;
            const now = Math.floor(Date.now() / 1000);
            if (refreshToken && expiresAt && expiresAt - now < 300) {
                const refreshed = await refreshSupabaseToken(refreshToken);
                if (refreshed) {
                    tokenData.token = refreshed.access_token;
                    tokenData.refresh_token = refreshed.refresh_token;
                    tokenData.expires_at = refreshed.expires_at;
                }
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

