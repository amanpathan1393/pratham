import type { Origin } from "@/lib/experimento/leads";

// Which entry path the visitor took, carried through the flow as ?from= so
// the capture form can record it. Anything unrecognised falls back to
// "curious" rather than trusting arbitrary query-string input.
export function parseOrigin(value: string | null): Origin {
  return value === "fellow" || value === "ngo" ? value : "curious";
}
