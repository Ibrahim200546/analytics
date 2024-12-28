import NextAuth, { type DefaultSession } from "next-auth"
import User from "@/apiTypes/App/Entity/User";
import jwtProvider from "@dexodus/next-auth-jwt-provider-bundle/src/resources/auth/jwtProvider";


declare module "next-auth" {
    interface Session {
        user: {
            token: string,
        } & User & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    session: {
        maxAge: 2678400 // 31 день * 24 часа * 60 минут * 60 секунд
    },
    providers: [
        jwtProvider,
    ],
    callbacks: {
        async jwt(config) {
            if (config.trigger === 'signIn') {
                config.token = {...config.user, ...config.token};
            }
            return config.token
        },
        async session(config) {
            // @ts-ignore
            config.session.user = {...config.session.user, ...config.token}
            return config.session
        }
    },
})
