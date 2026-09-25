import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service role key, which bypasses RLS, so it must
// only ever be imported from a server component (the back room). Never
// prefix these env vars with NEXT_PUBLIC_.
export function getExperimentoAdmin() {
  const url = process.env.NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL;
  const key = process.env.EXPERIMENTO_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL or EXPERIMENTO_SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
