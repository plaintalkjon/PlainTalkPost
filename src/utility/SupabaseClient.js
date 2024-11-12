// src/utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key are required.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
});

export default supabase;