"use client";

import { Fragment, useEffect, useState } from "react";

const ROWS = ["s", "t", "p", "n", "c"] as const;
const COLS = ["at", "ap", "an"] as const;
const TARGET_ROW = "c";
const TARGET_COL = "at";
const COUNTDOWN_SECONDS = 5;

type Status = "playing" | "won" | "timeout";

export function FastestFingerGame({ onComplete }: { onComplete?: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [won, setWon] = useState(false);

  // Derived rather than its own state: avoids setting it imperatively from
  // inside the timer effect below.
  const status: Status = won ? "won" : secondsLeft <= 0 ? "timeout" : "playing";

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  useEffect(() => {
    if (status !== "playing") {
      onComplete?.();
    }
    // Only fire once, the moment the round ends either way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function handleTap(row: string, col: string) {
    if (status !== "playing") return;
    if (row === TARGET_ROW && col === TARGET_COL) {
      setWon(true);
    }
  }

  const isRevealed = status !== "playing";

  return (
    <div className="rounded-lg border-[1.5px] border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-primary">
          Tap <span className="text-teal">CAT</span> before time runs out.
        </p>
        <CountdownRing
          secondsLeft={secondsLeft}
          total={COUNTDOWN_SECONDS}
          active={status === "playing"}
        />
      </div>

      <div
        className="mt-4 grid gap-1.5"
        style={{ gridTemplateColumns: `32px repeat(${COLS.length}, 1fr)` }}
      >
        <div />
        {COLS.map((col) => (
          <div
            key={`col-${col}`}
            className="flex items-center justify-center text-sm font-semibold text-secondary"
          >
            {col}
          </div>
        ))}

        {ROWS.map((row) => (
          <Fragment key={row}>
            <div className="flex items-center justify-center text-sm font-semibold text-secondary">
              {row}
            </div>
            {COLS.map((col) => {
              const word = row + col;
              const isTarget = row === TARGET_ROW && col === TARGET_COL;
              const showAnswer = isRevealed && isTarget;

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleTap(row, col)}
                  disabled={isRevealed}
                  className={`flex min-h-11 items-center justify-center gap-1 rounded-md border-[1.5px] text-sm font-semibold transition active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 ${
                    showAnswer
                      ? "border-teal bg-teal/10 text-teal"
                      : isRevealed
                        ? "border-border text-muted"
                        : "border-border text-primary"
                  }`}
                >
                  {word}
                  {showAnswer && <CheckIcon />}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      {isRevealed && (
        <p className="mt-4 text-sm text-secondary">
          This is a real Module 1 activity. Kids do this every session to
          build word-recognition speed.
        </p>
      )}
    </div>
  );
}

function CountdownRing({
  secondsLeft,
  total,
  active,
}: {
  secondsLeft: number;
  total: number;
  active: boolean;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = active ? secondsLeft / total : 0;

  return (
    <div className="relative h-12 w-12 shrink-0">
      <svg viewBox="0 0 48 48" className="h-12 w-12 -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#E8E3DA"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="#1A7F74"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
        {active ? secondsLeft : "0"}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
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
