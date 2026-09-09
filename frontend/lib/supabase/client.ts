"use client";

import {createClient} from "@supabase/supabase-js";
import {getSupabaseConfig, isSupabaseConfigured} from "./config";

let client: ReturnType<typeof createClient> | undefined;

export const getSupabaseBrowserClient = () => {
    if (!isSupabaseConfigured()) return undefined;
    client ??= (() => {
        const {url, anonKey} = getSupabaseConfig();
        return createClient(url, anonKey);
    })();
    return client;
};
