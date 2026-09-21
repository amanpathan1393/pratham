"use client";

import { useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { DayMonthReveal } from "@/components/DayMonthReveal";

export function TasteExperience({ onComplete }: { onComplete?: () => void }) {
  const [gameDone, setGameDone] = useState(false);

  function handleGameComplete() {
    setGameDone(true);
    onComplete?.();
  }

  return (
    <div className="flex flex-col gap-6">
      <FastestFingerGame onComplete={handleGameComplete} />
      {gameDone && <DayMonthReveal />}
    </div>
  );
}
