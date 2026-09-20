"use client";

import { useState } from "react";

const ACTIVITY = {
  passage:
    "Riya found a small bird under a tree. It could not fly. She carefully picked it up and took it to her mother.",
  prompt: "Why did Riya take the bird to her mother?",
  options: [
    "She wanted to play with it.",
    "The bird could not fly.",
    "She wanted to keep it.",
  ],
  correct: "The bird could not fly.",
};

export function ComprehensionActivity({
  onCorrect,
}: {
  onCorrect?: () => void;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const isCorrect = answer === ACTIVITY.correct;

  function handleSelect(option: string) {
    setAnswer(option);
    if (option === ACTIVITY.correct) {
      onCorrect?.();
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-zinc-900 shadow-lg">
      <div className="flex items-center gap-1.5 bg-zinc-800 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 font-mono text-xs text-zinc-400">
          Comprehension Bot
        </span>
      </div>

      <div className="p-5 font-mono">
        <p className="text-xs uppercase tracking-wide text-zinc-500">Read</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-100">
          {ACTIVITY.passage}
        </p>

        <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500">
          Question
        </p>
        <p className="mt-1 text-sm font-semibold text-zinc-50">
          {ACTIVITY.prompt}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          {ACTIVITY.options.map((option) => {
            const isSelectedOption = answer === option;
            const showCorrect = isCorrect && option === ACTIVITY.correct;
            const showWrong = isSelectedOption && !isCorrect;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={isCorrect}
                className={`rounded-lg border px-4 py-3 text-left text-sm transition ${
                  showCorrect
                    ? "border-green-500 bg-green-500/10 text-green-300"
                    : showWrong
                      ? "border-red-500 bg-red-500/10 text-red-300"
                      : "border-zinc-700 bg-zinc-800 text-zinc-100 active:scale-[0.98]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answer && !isCorrect && (
          <p className="mt-3 text-sm text-red-300">Not quite — try again.</p>
        )}

        {isCorrect && (
          <div className="mt-4 border-t border-zinc-700 pt-4">
            <p className="text-sm leading-relaxed text-zinc-100">
              You just experienced one small part of a Step by Step English
              lesson. The programme combines practice, interaction and
              feedback to help learners build English skills.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
