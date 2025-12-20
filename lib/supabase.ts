import { createClient } from '@supabase/supabase-js';

/**
 * We use placeholders to prevent the Supabase client from throwing an error 
 * during the initial module load if environment variables aren't set yet.
 */
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Export a helper to check if the app is actually connected to a real Supabase instance.
 */
export const isSupabaseConfigured = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
