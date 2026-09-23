"use client";

import { useState } from "react";
import { playDing } from "@/lib/sound";

const WHITE_PAINT = "This is a box of white paint.";
const RAJ_REEMA =
  "Just then, Reema entered the room. ‘There is a lizard on my desk!’ Raj said. ‘Don’t worry, I will help you,’ Reema said.";

export function ProgressReveal({ onComplete }: { onComplete?: () => void }) {
  const [revealed, setRevealed] = useState(false);

  function handleReveal() {
    if (revealed) return;
    setRevealed(true);
    playDing();
    // Brief pause so the reveal is readable before the path advances.
    setTimeout(() => onComplete?.(), 700);
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-primary">Same student, nine months apart.</p>

      <div className="mt-4 rounded-lg bg-[#f4f2ec] p-3">
        <p className="text-xs font-bold tracking-wide text-secondary uppercase">Day 1</p>
        <p className="mt-1 text-sm text-primary">&ldquo;{WHITE_PAINT}&rdquo;</p>
      </div>

      {!revealed ? (
        <button
          type="button"
          onClick={handleReveal}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-teal px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          See Month 9 →
        </button>
      ) : (
        <div className="mt-3 animate-fade-in-up rounded-lg bg-gold/15 p-3">
          <p className="text-xs font-bold tracking-wide text-secondary uppercase">Month 9</p>
          <p className="mt-1 text-sm text-primary">&ldquo;{RAJ_REEMA}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
