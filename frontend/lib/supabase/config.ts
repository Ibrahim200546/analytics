const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://znxpazaraxtnnixgdbbd.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_9YQ-e-rmBN_vM4WfgdxJKw_OtBXp7ij";

export const isSupabaseConfigured = (): boolean => Boolean(supabaseUrl && supabaseAnonKey);

export const getSupabaseConfig = (): {url: string; anonKey: string} => {
    return {url: supabaseUrl, anonKey: supabaseAnonKey};
};

