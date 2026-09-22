"use client";

import { useEffect, useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { DayMonthReveal } from "@/components/DayMonthReveal";
import { FactSequence } from "@/components/FactReveal";
import { insertGameResult } from "@/lib/gameResults";
import type { ActivityPlan } from "@/lib/challenges";

export const GAME_PLAYED_KEY = "step-by-step-english.taste.game-played";

export function TasteExperience({
  onComplete,
  plan = { kind: "game" },
  path,
}: {
  onComplete?: () => void;
  plan?: ActivityPlan;
  path: "fellow" | "curious";
}) {
  const [gameDone, setGameDone] = useState(plan.kind === "reveal");

  useEffect(() => {
    if (plan.kind === "reveal") {
      onComplete?.();
    }
    // Only meant to fire once, based on the plan this mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGameComplete(result: "won" | "timeout") {
    try {
      sessionStorage.setItem(GAME_PLAYED_KEY, "true");
    } catch {
      // sessionStorage can be unavailable (e.g. private mode); not critical.
    }
    // Best-effort analytics ping; never blocks the UI on failure.
    insertGameResult({ path, result }).catch(() => {});
    setGameDone(true);
    onComplete?.();
  }

  if (plan.kind === "facts") {
    return <FactSequence challengeIds={plan.challengeIds} onComplete={onComplete} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {plan.kind === "game" && <FastestFingerGame onComplete={handleGameComplete} />}
      {gameDone && <DayMonthReveal />}
    </div>
  );
}
