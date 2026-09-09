import {CredentialsSignin} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {createSupabaseServerClient} from "@/lib/supabase/server";

export class AuthenticationServiceUnavailable extends CredentialsSignin {
    code = "service_unavailable";
}

const getRoles = (metadata: unknown): string[] => {
    if (!metadata || typeof metadata !== "object") {
        return ["ROLE_USER"];
    }

    const roles = (metadata as {roles?: unknown}).roles;

    return Array.isArray(roles) && roles.every((role) => typeof role === "string")
        ? [...new Set(["ROLE_USER", ...roles])]
        : ["ROLE_USER"];
};

const supabaseProvider = Credentials({
    async authorize(credentials) {
        const email = typeof credentials?.login === "string" ? credentials.login.trim() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
            return null;
        }

        try {
            const supabase = createSupabaseServerClient();
            const {data, error} = await supabase.auth.signInWithPassword({email, password});

            if (error || !data.user || !data.session) {
                return null;
            }

            const metadata = {...data.user.app_metadata, ...data.user.user_metadata};

            return {
                id: data.user.id,
                email: data.user.email ?? email,
                name: typeof metadata.full_name === "string" ? metadata.full_name : data.user.email ?? email,
                roles: getRoles(metadata),
                token: data.session.access_token,
            };
        } catch (error) {
            console.error("Supabase authorization request failed", error);
            throw new AuthenticationServiceUnavailable();
        }
    },
});

export default supabaseProvider;
