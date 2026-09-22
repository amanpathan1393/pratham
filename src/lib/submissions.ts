import { supabase } from "@/lib/supabase";

export type SubmissionInsert = {
  path: "fellow" | "ngo" | "curious";
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
  challenges?: string[] | null;
  student_count?: string | null;
  grades_taught?: string | null;
  next_step?: string | null;
  ngo_org?: string | null;
  ngo_location?: string | null;
  ngo_audience?: string | null;
  ngo_settings?: string[] | null;
  ngo_explore?: string[] | null;
};

export async function insertSubmission(submission: SubmissionInsert) {
  const { error } = await supabase.from("submissions").insert(submission);
  if (error) throw error;
}
