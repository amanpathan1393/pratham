"use client";

import { useCallback, useSyncExternalStore } from "react";

// What the visitor has told us so far, kept for the length of the visit so
// the capture form can save it. sessionStorage when available, in memory
// otherwise (private mode), so a blocked storage never breaks the flow.
export type Answers = {
  challenges: string[];
  subject: "science" | "maths" | "both" | null;
  grades: string[];
  studentCount: string | null;
};

const EMPTY: Answers = { challenges: [], subject: null, grades: [], studentCount: null };
const KEY = "experimento.answers";

let memoryRaw: string | null = null;
let cache: { raw: string | null; value: Answers } = { raw: null, value: EMPTY };
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return sessionStorage.getItem(KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

function writeRaw(raw: string) {
  memoryRaw = raw;
  try {
    sessionStorage.setItem(KEY, raw);
  } catch {
    // Storage unavailable; memoryRaw still holds it for this page load.
  }
}

function getSnapshot(): Answers {
  const raw = readRaw();
  if (raw === cache.raw) return cache.value;
  let value = EMPTY;
  try {
    if (raw) value = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAnswers() {
  const answers = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  const update = useCallback((change: Partial<Answers> | ((current: Answers) => Partial<Answers>)) => {
    const current = getSnapshot();
    const patch = typeof change === "function" ? change(current) : change;
    writeRaw(JSON.stringify({ ...current, ...patch }));
    listeners.forEach((l) => l());
  }, []);
  return { answers, update };
}
