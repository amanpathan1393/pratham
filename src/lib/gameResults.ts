import { supabase } from "@/lib/supabase";

export type GameResultInsert = {
  path: "fellow" | "curious";
  result: "won" | "timeout";
};

export async function insertGameResult(result: GameResultInsert) {
  const { error } = await supabase.from("game_results").insert(result);
  if (error) throw error;
}
