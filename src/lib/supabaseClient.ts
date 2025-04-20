// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_PUBLIC as string;

// Use a singleton pattern to avoid creating multiple clients
let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (!supabaseInstance) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                // Enable persisting session to localStorage
                persistSession: true,
                // Automatically refresh the token
                autoRefreshToken: true,
                // Detect session changes from other tabs/windows
                detectSessionInUrl: true, // Changed from false if using OAuth redirects
            },
        });
    }
    return supabaseInstance;
};

// Export the client directly if you prefer
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, { ... });