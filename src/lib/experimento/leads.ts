import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Origin = "fellow" | "ngo" | "curious";

export type LeadInsert = {
  path: Origin;
  next_step: string;
  name: string;
  email: string;
  phone: string | null;
};

// Deliberately separate from src/lib/supabase.ts: Experimento has its own
// Supabase project and credentials, and nothing here should ever touch the
// English site's database. Created lazily (not at import) so a missing env
// var can't break the build or any page that doesn't submit the form.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_EXPERIMENTO_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL or NEXT_PUBLIC_EXPERIMENTO_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  client ??= createClient(url, key);
  return client;
}

export async function insertLead(lead: LeadInsert) {
  const { error } = await getClient().from("leads").insert(lead);
  if (error) throw error;
}
