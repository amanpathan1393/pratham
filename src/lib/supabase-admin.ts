import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

// service_role bypasses row level security — only ever call this from
// server components / route handlers, never from a "use client" file.
// Lazy so a missing env var only breaks the page that needs it (at
// request time), not the whole build.
export function getSupabaseAdmin(): SupabaseClient {
  if (client) return client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Check .env.local.",
    );
  }

  client = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return client;
}
