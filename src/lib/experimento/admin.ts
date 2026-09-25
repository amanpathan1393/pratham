import { createClient } from "@supabase/supabase-js";

// Server-only. Uses the service role (secret) key, which bypasses RLS, so it
// must only ever be imported from a server component (the back room). Never
// prefix these env vars with NEXT_PUBLIC_.
export function getExperimentoAdmin() {
  const url = process.env.NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL;
  const key = process.env.EXPERIMENTO_SUPABASE_SERVICE_ROLE_KEY;
  // Name exactly which one is missing, so a misconfigured deploy is obvious.
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL (the Supabase project URL).");
  }
  if (!key) {
    throw new Error(
      "Missing EXPERIMENTO_SUPABASE_SERVICE_ROLE_KEY. Add it in Vercel (Production), then redeploy.",
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
