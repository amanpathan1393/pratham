import type { Origin } from "@/lib/experimento/leads";

// Which entry path the visitor took, carried through the flow as ?from= so
// the capture form can record it. Anything unrecognised falls back to
// "curious" rather than trusting arbitrary query-string input.
export function parseOrigin(value: string | null): Origin {
  return value === "fellow" || value === "ngo" ? value : "curious";
}

const FLOW: Record<Origin, string[]> = {
  fellow: ["challenges", "about", "classroom", "try", "capture"],
  curious: ["about", "try", "capture"],
  ngo: ["partner", "capture"],
};

// Position of a screen within the path the visitor is on, for the progress bar.
export function progressFor(origin: Origin, screen: string) {
  const flow = FLOW[origin];
  return { step: flow.indexOf(screen) + 1, total: flow.length };
}
