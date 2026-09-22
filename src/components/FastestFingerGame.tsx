"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const ROWS = ["s", "t", "p", "n", "c"] as const;
const COLS = ["at", "ap", "an"] as const;
const TARGET_ROW = "c";
const TARGET_COL = "at";
const COUNTDOWN_SECONDS = 10;

// Row/column indices of the target cell within the grid (0-based), used to
// place the guided-trace highlight bars via CSS Grid placement.
const TARGET_ROW_INDEX = ROWS.indexOf(TARGET_ROW);
const TARGET_COL_INDEX = COLS.indexOf(TARGET_COL);
// +2 on each: +1 for the header row/label column, +1 because CSS Grid lines
// are 1-indexed.
const TARGET_GRID_ROW = TARGET_ROW_INDEX + 2;
const TARGET_GRID_COL = TARGET_COL_INDEX + 2;

type TracePhase = "row-pulse" | "row-slide" | "col-slide" | "done";
type Status = "tracing" | "playing" | "won" | "timeout";

const ROW_PULSE_MS = 450;
const ROW_SLIDE_MS = 450;
const COL_SLIDE_MS = 350;

type GameResult = "won" | "timeout";

export function FastestFingerGame({
  onComplete,
}: {
  onComplete?: (result: GameResult) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [tracePhase, setTracePhase] = useState<TracePhase>("row-pulse");
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const [won, setWon] = useState(false);
  const [shakeCell, setShakeCell] = useState<string | null>(null);

  // Derived rather than its own state: avoids setting it imperatively from
  // inside the timer effect below.
  const status: Status =
    tracePhase !== "done"
      ? "tracing"
      : won
        ? "won"
        : secondsLeft <= 0
          ? "timeout"
          : "playing";

  // Don't start the trace (and therefore the countdown) until the game has
  // actually scrolled into view — otherwise the timer burns down while the
  // visitor is still reading the content above it on fellow/2.
  useEffect(() => {
    if (hasBeenVisible) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
        }
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBeenVisible]);

  // Play the guided trace once, automatically, before the countdown starts.
  useEffect(() => {
    if (!hasBeenVisible) return;
    if (tracePhase === "row-pulse") {
      const t = setTimeout(() => setTracePhase("row-slide"), ROW_PULSE_MS);
      return () => clearTimeout(t);
    }
    if (tracePhase === "row-slide") {
      const t = setTimeout(() => setTracePhase("col-slide"), ROW_SLIDE_MS);
      return () => clearTimeout(t);
    }
    if (tracePhase === "col-slide") {
      const t = setTimeout(() => setTracePhase("done"), COL_SLIDE_MS);
      return () => clearTimeout(t);
    }
  }, [tracePhase, hasBeenVisible]);

  useEffect(() => {
    if (status !== "playing") return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  useEffect(() => {
    if (status === "won" || status === "timeout") {
      onComplete?.(status);
    }
    // Only fire once, the moment the round ends either way.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (!shakeCell) return;
    const timer = setTimeout(() => setShakeCell(null), 320);
    return () => clearTimeout(timer);
  }, [shakeCell]);

  function handleTap(row: string, col: string) {
    if (status !== "playing") return;
    if (row === TARGET_ROW && col === TARGET_COL) {
      setWon(true);
    } else {
      setShakeCell(row + col);
    }
  }

  const isRevealed = status === "won" || status === "timeout";
  const cellsDisabled = status !== "playing";

  return (
    <div ref={containerRef} className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-primary">
          Tap <span className="text-teal">CAT</span> before time runs out.
        </p>
        <CountdownRing
          secondsLeft={secondsLeft}
          total={COUNTDOWN_SECONDS}
          status={status}
        />
      </div>

      <div
        className="relative mt-4 grid gap-1.5"
        style={{ gridTemplateColumns: `32px repeat(${COLS.length}, 1fr)` }}
      >
        {status === "tracing" && hasBeenVisible && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 rounded-md bg-teal/25 transition-transform ease-out"
              style={{
                gridRow: TARGET_GRID_ROW,
                gridColumn: `1 / ${TARGET_GRID_COL + 1}`,
                transformOrigin: "left",
                transform:
                  tracePhase === "row-pulse" ? "scaleX(0)" : "scaleX(1)",
                transitionDuration: `${ROW_SLIDE_MS}ms`,
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute z-10 rounded-md bg-teal/25 transition-transform ease-out"
              style={{
                gridColumn: TARGET_GRID_COL,
                gridRow: `1 / ${TARGET_GRID_ROW + 1}`,
                transformOrigin: "top",
                transform:
                  tracePhase === "col-slide" ? "scaleY(1)" : "scaleY(0)",
                transitionDuration: `${COL_SLIDE_MS}ms`,
              }}
            />
          </>
        )}

        <div />
        {COLS.map((col) => {
          const isTraceColActive =
            status === "tracing" &&
            hasBeenVisible &&
            col === TARGET_COL &&
            tracePhase === "col-slide";
          return (
            <div
              key={`col-${col}`}
              className={`flex items-center justify-center text-sm font-semibold transition-colors ${
                isTraceColActive ? "text-teal" : "text-secondary"
              }`}
            >
              {col}
            </div>
          );
        })}

        {ROWS.map((row) => {
          const isTraceRowActive =
            status === "tracing" && hasBeenVisible && row === TARGET_ROW;
          return (
            <Fragment key={row}>
              <div
                className={`flex items-center justify-center text-sm font-semibold transition-colors ${
                  isTraceRowActive
                    ? `text-teal ${tracePhase === "row-pulse" ? "animate-pop-in" : ""}`
                    : "text-secondary"
                }`}
              >
                {row}
              </div>
              {COLS.map((col) => {
                const word = row + col;
                const isTarget = row === TARGET_ROW && col === TARGET_COL;
                const showAnswer = isRevealed && isTarget;
                const isWinningCell = showAnswer && status === "won";
                const isTimeoutReveal = showAnswer && status === "timeout";
                const isInviting = isTarget && status === "playing";

                return (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleTap(row, col)}
                    disabled={cellsDisabled}
                    className={`relative flex min-h-11 items-center justify-center gap-1 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 ${
                      shakeCell === word ? "animate-shake" : ""
                    } ${isInviting ? "animate-gentle-pulse" : ""} ${
                      shakeCell === word
                        ? "bg-red-100 text-red-600"
                        : isWinningCell
                          ? "animate-pop-in bg-gold text-white shadow-md"
                          : isTimeoutReveal
                            ? "bg-teal/10 text-teal shadow-none"
                            : status === "playing" || status === "tracing"
                              ? "bg-[#f4f2ec] text-primary hover:-translate-y-0.5 hover:bg-teal/10 hover:shadow-md"
                              : "bg-inactive text-muted shadow-none"
                    }`}
                  >
                    {word}
                    {showAnswer && <CheckIcon />}
                    {isWinningCell && <ConfettiBurst />}
                  </button>
                );
              })}
            </Fragment>
          );
        })}
      </div>

      {isRevealed && (
        <p className="mt-4 animate-fade-in-up text-sm text-secondary">
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
  status,
}: {
  secondsLeft: number;
  total: number;
  status: Status;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress =
    status === "playing" ? secondsLeft / total : status === "tracing" ? 1 : 0;
  const displayValue =
    status === "tracing" ? total : status === "playing" ? secondsLeft : 0;
  const isUrgent = status === "playing" && secondsLeft <= 2;

  return (
    <div
      className={`relative h-12 w-12 shrink-0 rounded-full ${isUrgent ? "animate-gentle-pulse" : ""}`}
    >
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
          stroke={isUrgent ? "#F2B705" : "#1A7F74"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{
            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
        {displayValue}
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

const CONFETTI_PIECES = [
  { tx: "-18px", ty: "-22px", color: "#1A7F74", delay: "0ms" },
  { tx: "18px", ty: "-24px", color: "#F2B705", delay: "40ms" },
  { tx: "-24px", ty: "6px", color: "#F2B705", delay: "80ms" },
  { tx: "24px", ty: "8px", color: "#1A7F74", delay: "20ms" },
  { tx: "0px", ty: "-30px", color: "#F2B705", delay: "60ms" },
  { tx: "-10px", ty: "20px", color: "#1A7F74", delay: "100ms" },
];

function ConfettiBurst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, i) => (
        <span
          key={i}
          className="animate-confetti absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full"
          style={
            {
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              "--tx": piece.tx,
              "--ty": piece.ty,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
