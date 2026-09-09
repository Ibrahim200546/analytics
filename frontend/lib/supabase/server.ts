import {createClient} from "@supabase/supabase-js";
import {getSupabaseConfig} from "./config";

/**
 * Server-only client used for password authentication and server-rendered reads.
 * It deliberately uses the public anon key: authorization is enforced by RLS.
 */
export const createSupabaseServerClient = (token?: string) => {
    const {url, anonKey} = getSupabaseConfig();

    return createClient(url, anonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        global: token ? {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        } : undefined,
    });
};

