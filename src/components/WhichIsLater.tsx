"use client";

import { useState } from "react";

const WHITE_PAINT = "This is a box of white paint.";
const RAJ_REEMA =
  "Just then, Reema entered the room. ‘There is a lizard on my desk!’ Raj said. ‘Don’t worry, I will help you,’ Reema said.";

const CORRECT: "A" | "B" = "B";

export function WhichIsLater({ onComplete }: { onComplete?: () => void }) {
  const [picked, setPicked] = useState<"A" | "B" | null>(null);

  function handlePick(choice: "A" | "B") {
    if (picked) return;
    setPicked(choice);
    // Brief pause so the reveal is readable before the path advances.
    setTimeout(() => onComplete?.(), 900);
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-primary">
        Same student. Which one is nine months later?
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(["A", "B"] as const).map((choice) => {
          const shown = picked !== null;
          const isCorrect = choice === CORRECT;
          const isPicked = picked === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => handlePick(choice)}
              disabled={shown}
              className={`flex flex-col gap-2 rounded-lg p-4 text-left shadow-sm transition-all duration-200 active:scale-[0.98] ${
                shown && isCorrect
                  ? "animate-pop-in bg-gold/15"
                  : shown && isPicked
                    ? "animate-shake bg-red-100"
                    : "bg-[#f4f2ec] hover:-translate-y-0.5 hover:bg-teal/10"
              }`}
            >
              <span className="text-xs font-bold tracking-wide text-secondary uppercase">
                {choice}
              </span>
              <span className="text-sm text-primary">
                &ldquo;{choice === "A" ? WHITE_PAINT : RAJ_REEMA}&rdquo;
              </span>
            </button>
          );
        })}
      </div>
      {picked && (
        <p className="mt-4 animate-fade-in-up text-sm text-secondary">
          B is Month 9 — same student, further into the story.
        </p>
      )}
    </div>
  );
}
