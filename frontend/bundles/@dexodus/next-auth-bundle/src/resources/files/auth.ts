import NextAuth, { type DefaultSession } from "next-auth"
import User from "@/apiTypes/App/Entity/User";
/*>jsel
foreach (parameters["@dexodus.next-auth.providers"] as providerName => provider) {
    writeln("import ", providerName, " from \"", provider.path, "\";");
}
*/

declare module "next-auth" {
    interface Session {
        user: {
            token: string,
        } & User & DefaultSession["user"]
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        maxAge: 2678400 // 31 день * 24 часа * 60 минут * 60 секунд
    },
    providers: [
/*>jsel
foreach (parameters["@dexodus.next-auth.providers"] as providerName => provider) {
    writeln("        ", providerName, ",");
}
*/
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
