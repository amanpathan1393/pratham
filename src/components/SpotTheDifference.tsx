"use client";

import { useEffect, useState } from "react";

const COUNT = 6;
const TIME_SECONDS = 8;
const MATCH_WORD = "CAT";
const ODD_WORD = "BAT";

export function SpotTheDifference({ onComplete }: { onComplete?: () => void }) {
  const [oddIndex] = useState(() => Math.floor(Math.random() * COUNT));
  const [secondsLeft, setSecondsLeft] = useState(TIME_SECONDS);
  const [won, setWon] = useState(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  // Derived rather than its own state, same reasoning as FastestFingerGame's
  // status: avoids setting it imperatively from inside the timer effect.
  const status: "playing" | "won" | "timeout" = won ? "won" : secondsLeft <= 0 ? "timeout" : "playing";

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  useEffect(() => {
    if (status === "won" || status === "timeout") {
      onComplete?.();
    }
    // Only fire once, the moment the round ends either way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (wrongIndex === null) return;
    const timer = setTimeout(() => setWrongIndex(null), 320);
    return () => clearTimeout(timer);
  }, [wrongIndex]);

  function handleTap(i: number) {
    if (status !== "playing") return;
    if (i === oddIndex) {
      setWon(true);
    } else {
      setWrongIndex(i);
    }
  }

  const revealed = status !== "playing";

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-primary">Spot the flashcard that&apos;s different.</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
            status === "playing" && secondsLeft <= 2
              ? "animate-gentle-pulse border-gold text-gold"
              : "border-teal text-teal"
          }`}
        >
          {status === "playing" ? secondsLeft : status === "won" ? <CheckIcon /> : "…"}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: COUNT }).map((_, i) => {
          const isOdd = i === oddIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              disabled={revealed}
              className={`flex h-16 items-center justify-center rounded-lg border-2 shadow-sm transition-all duration-200 active:scale-[0.97] ${
                wrongIndex === i
                  ? "animate-shake border-red-200 bg-red-100"
                  : isOdd && revealed
                    ? "animate-pop-in border-gold bg-gold/20"
                    : "border-border bg-[#f4f2ec] hover:-translate-y-0.5 hover:border-teal/30 hover:bg-teal/10"
              }`}
            >
              <span
                className={`text-lg font-bold tracking-wide ${
                  isOdd && revealed ? "text-gold" : "text-primary"
                }`}
              >
                {isOdd ? ODD_WORD : MATCH_WORD}
              </span>
            </button>
          );
        })}
      </div>

      {revealed && (
        <p className="mt-4 animate-fade-in-up text-sm text-secondary">
          {status === "won"
            ? "Spotted it — same muscle every flashcard round builds: read the whole word, not just the shape."
            : `That one said "${ODD_WORD}", not "${MATCH_WORD}". Small differences, real attention.`}
        </p>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
