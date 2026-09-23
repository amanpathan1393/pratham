"use client";

import { useState } from "react";
import { playDing } from "@/lib/sound";

const STAGES = [
  { module: "Module 1", prompt: "Hi, I’m Meera." },
  { module: "Module 2", prompt: "This is my brother. He is ten." },
  { module: "Module 3", prompt: "I liked your story — can you tell me more?" },
];

export function SpeakingLadder({ onComplete }: { onComplete?: () => void }) {
  const [revealedCount, setRevealedCount] = useState(0);

  function handleNext() {
    if (revealedCount >= STAGES.length) return;
    const next = revealedCount + 1;
    setRevealedCount(next);
    playDing();
    if (next >= STAGES.length) {
      setTimeout(() => onComplete?.(), 700);
    }
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-primary">Speaking builds one step at a time.</p>

      <div className="mt-4 flex flex-col gap-2">
        {STAGES.map((stage, i) => {
          const revealed = i < revealedCount;
          return (
            <div
              key={stage.module}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                revealed ? "animate-fade-in-up bg-teal/10" : "bg-[#f4f2ec]"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  revealed ? "bg-teal text-white" : "bg-inactive text-muted"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
                  {stage.module}
                </p>
                {revealed ? (
                  <p className="text-sm text-primary">&ldquo;{stage.prompt}&rdquo;</p>
                ) : (
                  <p className="text-sm text-muted">&middot;&middot;&middot;</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {revealedCount < STAGES.length && (
        <button
          type="button"
          onClick={handleNext}
          className="mt-4 flex h-11 items-center justify-center rounded-lg bg-teal px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {revealedCount === 0 ? "Start with Module 1" : "Next stage"}
        </button>
      )}
    </div>
  );
}
