const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => Boolean(supabaseUrl && supabaseAnonKey);

export const getSupabaseConfig = (): {url: string; anonKey: string} => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }

    return {url: supabaseUrl, anonKey: supabaseAnonKey};
};
