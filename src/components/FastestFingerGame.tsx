"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const ROWS = ["s", "t", "p", "n", "c"] as const;
const COLS = ["at", "ap", "an"] as const;
const TOTAL_SECONDS = 18;
const ROUND_COUNT = 3;
const CORRECT_FLASH_MS = 450;

// This mirrors the actual classroom "Steps for FFF" activity: call out a
// letter/word, learner finds it, then say what's above/below/left/right of
// it — not just "find one fixed target."
type Direction = "above" | "below" | "left" | "right";
type Round = {
  fromRow: number;
  fromCol: number;
  direction: Direction;
  targetRow: number;
  targetCol: number;
};

const DIRECTION_LABEL: Record<Direction, string> = {
  above: "above",
  below: "below",
  left: "to the left of",
  right: "to the right of",
};

function randomRound(): Round {
  const fromRow = Math.floor(Math.random() * ROWS.length);
  const fromCol = Math.floor(Math.random() * COLS.length);
  const options: Direction[] = [];
  if (fromRow > 0) options.push("above");
  if (fromRow < ROWS.length - 1) options.push("below");
  if (fromCol > 0) options.push("left");
  if (fromCol < COLS.length - 1) options.push("right");
  const direction = options[Math.floor(Math.random() * options.length)];
  let targetRow = fromRow;
  let targetCol = fromCol;
  if (direction === "above") targetRow -= 1;
  else if (direction === "below") targetRow += 1;
  else if (direction === "left") targetCol -= 1;
  else targetCol += 1;
  return { fromRow, fromCol, direction, targetRow, targetCol };
}

type GameResult = "won" | "timeout";
type Status = "waiting" | "playing" | "won" | "timeout";

export function FastestFingerGame({
  onComplete,
}: {
  onComplete?: (result: GameResult) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  // Generated client-side only, post-mount: Math.random() during the
  // initial render would produce a different value on the server than on
  // the client's hydration pass, causing a hydration mismatch (same issue
  // fixed earlier in SpotTheDifference).
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [shakeCell, setShakeCell] = useState<string | null>(null);
  const [correctCell, setCorrectCell] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRounds(Array.from({ length: ROUND_COUNT }, randomRound));
  }, []);

  const allDone = rounds !== null && roundIndex >= rounds.length;
  const status: Status = allDone
    ? "won"
    : secondsLeft <= 0
      ? "timeout"
      : !hasBeenVisible || rounds === null
        ? "waiting"
        : "playing";

  // Don't start the countdown until the game has actually scrolled into
  // view — otherwise the timer burns down while the visitor is still
  // reading the content above it on fellow/2.
  useEffect(() => {
    if (hasBeenVisible) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasBeenVisible(true);
      },
      { threshold: 1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasBeenVisible]);

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

  useEffect(() => {
    if (!correctCell) return;
    const timer = setTimeout(() => {
      setCorrectCell(null);
      setRoundIndex((i) => i + 1);
    }, CORRECT_FLASH_MS);
    return () => clearTimeout(timer);
  }, [correctCell]);

  const currentRound = rounds && !allDone ? rounds[roundIndex] : null;
  const fromWord = currentRound ? ROWS[currentRound.fromRow] + COLS[currentRound.fromCol] : null;

  function handleTap(rowIndex: number, colIndex: number) {
    if (status !== "playing" || !currentRound || correctCell) return;
    const word = ROWS[rowIndex] + COLS[colIndex];
    if (rowIndex === currentRound.targetRow && colIndex === currentRound.targetCol) {
      setCorrectCell(word);
    } else {
      setShakeCell(word);
    }
  }

  const isRevealed = status === "won" || status === "timeout";
  const cellsDisabled = status !== "playing" || !!correctCell;

  return (
    <div ref={containerRef} className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-primary">
          {status === "won" ? (
            "All 3 found — fast fingers!"
          ) : status === "timeout" ? (
            "Time's up — here's the last one."
          ) : currentRound && fromWord ? (
            <>
              Tap the word{" "}
              <span className="text-teal">{DIRECTION_LABEL[currentRound.direction]}</span>{" "}
              &ldquo;{fromWord}&rdquo;.
            </>
          ) : (
            "Get ready…"
          )}
        </p>
        <CountdownRing secondsLeft={secondsLeft} total={TOTAL_SECONDS} status={status} />
      </div>

      {rounds && !isRevealed && (
        <p className="mt-1 text-xs font-semibold tracking-wide text-secondary uppercase">
          Round {roundIndex + 1} of {ROUND_COUNT}
        </p>
      )}

      <div
        className="relative mt-3 grid gap-1.5"
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

        {ROWS.map((row, rowIndex) => (
          <Fragment key={row}>
            <div className="flex items-center justify-center text-sm font-semibold text-secondary">
              {row}
            </div>
            {COLS.map((col, colIndex) => {
              const word = row + col;
              const isFrom =
                !!currentRound &&
                rowIndex === currentRound.fromRow &&
                colIndex === currentRound.fromCol;
              const isTarget =
                !!currentRound &&
                rowIndex === currentRound.targetRow &&
                colIndex === currentRound.targetCol;
              const showFinalAnswer = status === "timeout" && isTarget;
              const isWinningCell = correctCell === word;

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => handleTap(rowIndex, colIndex)}
                  disabled={cellsDisabled}
                  className={`relative flex min-h-11 items-center justify-center gap-1 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 ${
                    shakeCell === word ? "animate-shake" : ""
                  } ${
                    shakeCell === word
                      ? "bg-red-100 text-red-600"
                      : isWinningCell
                        ? "animate-pop-in bg-gold text-white shadow-md"
                        : showFinalAnswer
                          ? "bg-teal/10 text-teal shadow-none"
                          : isFrom && (status === "playing" || status === "waiting")
                            ? "animate-gentle-pulse bg-teal text-white shadow-md"
                            : status === "playing" || status === "waiting"
                              ? "bg-[#f4f2ec] text-primary hover:-translate-y-0.5 hover:bg-teal/10 hover:shadow-md"
                              : "bg-inactive text-muted shadow-none"
                  }`}
                >
                  {word}
                  {showFinalAnswer && <CheckIcon />}
                  {isWinningCell && <ConfettiBurst />}
                </button>
              );
            })}
          </Fragment>
        ))}
      </div>

      {isRevealed && (
        <p className="mt-4 animate-fade-in-up text-sm text-secondary">
          This is a real Module 1 activity: call a word, learners find it, then say what&apos;s
          above, below, left or right of it — fast, confident navigation of the page.
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
  const progress = status === "playing" ? secondsLeft / total : status === "timeout" ? 0 : 1;
  const isUrgent = status === "playing" && secondsLeft <= 3;

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
        {status === "won" ? <CheckIcon /> : status === "timeout" ? 0 : secondsLeft}
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
