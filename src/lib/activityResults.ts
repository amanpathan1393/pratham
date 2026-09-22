import { supabase } from "@/lib/supabase";

export type ActivityResultInsert = {
  path: "fellow" | "curious";
  kind: string;
  result: "won" | "timeout" | "completed";
};

export async function insertActivityResult(entry: ActivityResultInsert) {
  const { error } = await supabase.from("activity_results").insert(entry);
  if (error) throw error;
}
