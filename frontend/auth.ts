import NextAuth, {type DefaultSession} from "next-auth";
import User from "@/apiTypes/App/Entity/User";
import jwtProvider from "@dexodus/next-auth-jwt-provider-bundle/src/resources/auth/jwtProvider";

declare module "next-auth" {
    interface Session {
        user: {
            token: string,
        } & User & DefaultSession["user"]
    }
}

const authSecret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!authSecret) {
    throw new Error("AUTH_SECRET or NEXTAUTH_SECRET must be configured");
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    secret: authSecret,
    trustHost: process.env.AUTH_TRUST_HOST === "true" || process.env.VERCEL === "1",
    session: {
        strategy: "jwt",
        maxAge: 2678400,
    },
    providers: [
        jwtProvider,
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
    },
});
