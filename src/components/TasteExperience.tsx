"use client";

import { useEffect, useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { DayMonthReveal } from "@/components/DayMonthReveal";

export const GAME_PLAYED_KEY = "step-by-step-english.taste.game-played";

export function TasteExperience({
  onComplete,
  skipGame = false,
}: {
  onComplete?: () => void;
  skipGame?: boolean;
}) {
  const [gameDone, setGameDone] = useState(skipGame);

  useEffect(() => {
    if (skipGame) {
      onComplete?.();
    }
    // Only meant to fire once, based on the skipGame value this mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGameComplete() {
    try {
      sessionStorage.setItem(GAME_PLAYED_KEY, "true");
    } catch {
      // sessionStorage can be unavailable (e.g. private mode); not critical.
    }
    setGameDone(true);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      {!skipGame && <FastestFingerGame onComplete={handleGameComplete} />}
      {gameDone && <DayMonthReveal />}
    </div>
  );
}
