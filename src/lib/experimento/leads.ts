import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Origin = "fellow" | "ngo" | "curious";

export type LeadBase = {
  path: Origin;
  next_step: string;
  name: string;
  email: string;
  phone: string | null;
};

// Only sent for the Fellow path. These columns were added after launch, see
// supabase/experimento-schema.sql.
export type LeadExtras = {
  subject: string | null;
  grades: string[] | null;
  student_count: string | null;
  challenges: string[] | null;
};

export type LeadInsert = LeadBase & Partial<LeadExtras>;

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

// PostgREST: unknown column in the schema cache. Postgres: undefined_column.
function isMissingColumn(error: { code?: string }) {
  return error.code === "PGRST204" || error.code === "42703";
}

export async function insertLead(lead: LeadInsert) {
  const db = getClient();
  const { error } = await db.from("leads").insert(lead);
  if (!error) return;

  // If the extra columns haven't been added to the table yet, save the lead
  // with the original columns rather than losing it.
  if (isMissingColumn(error)) {
    const { path, next_step, name, email, phone } = lead;
    const retry = await db.from("leads").insert({ path, next_step, name, email, phone });
    if (!retry.error) return;
    throw retry.error;
  }
  throw error;
}
