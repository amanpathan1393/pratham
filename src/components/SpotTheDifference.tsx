"use client";

import { useEffect, useRef, useState } from "react";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { playChime } from "@/lib/sound";

const COUNT = 6;
const TIME_SECONDS = 8;
// A real "-at" word family, same phonics pattern as the CAT game's own
// at/ap/an columns — the odd word breaks the rhyme, not just the shape.
const FAMILY_WORDS = ["CAT", "BAT", "HAT", "MAT", "SAT"];
const ODD_WORD = "CAP";

export function SpotTheDifference({
  onComplete,
}: {
  onComplete?: (result: "won" | "timeout") => void;
}) {
  // Picked client-side only: Math.random() during the initial render would
  // produce a different value on the server than on the client's hydration
  // pass, causing a hydration mismatch (the two renders would show the odd
  // word in different cells).
  const [oddIndex, setOddIndex] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOddIndex(Math.floor(Math.random() * COUNT));
  }, []);
  const words = FAMILY_WORDS.slice();
  words.splice(oddIndex ?? 0, 0, ODD_WORD);
  const [secondsLeft, setSecondsLeft] = useState(TIME_SECONDS);
  const [won, setWon] = useState(false);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Don't start the countdown until the card has actually scrolled fully
  // into view — otherwise the timer burns down (and can time out) while
  // the visitor is still scrolling toward it.
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

  // Derived rather than its own state, same reasoning as FastestFingerGame's
  // status: avoids setting it imperatively from inside the timer effect.
  const status: "waiting" | "playing" | "won" | "timeout" = won
    ? "won"
    : secondsLeft <= 0
      ? "timeout"
      : !hasBeenVisible
        ? "waiting"
        : "playing";

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
    if (wrongIndex === null) return;
    const timer = setTimeout(() => setWrongIndex(null), 320);
    return () => clearTimeout(timer);
  }, [wrongIndex]);

  function handleTap(i: number) {
    if (status !== "playing") return;
    if (i === oddIndex) {
      setWon(true);
      playChime();
    } else {
      setWrongIndex(i);
    }
  }

  const isRevealed = status === "won" || status === "timeout";
  const cellsDisabled = status !== "playing";

  return (
    <div ref={containerRef} className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <p className="text-base font-semibold text-primary">Spot the flashcard that&apos;s different.</p>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
            status === "playing" && secondsLeft <= 2
              ? "animate-gentle-pulse border-gold text-gold"
              : "border-teal text-teal"
          }`}
        >
          {status === "playing" || status === "waiting" ? (
            secondsLeft
          ) : status === "won" ? (
            <CheckIcon />
          ) : (
            "…"
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: COUNT }).map((_, i) => {
          const isOdd = i === oddIndex;
          const isWinningTap = won && isOdd;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              disabled={cellsDisabled}
              className={`relative flex h-16 items-center justify-center rounded-lg border-2 shadow-sm transition-all duration-200 active:scale-[0.97] ${
                wrongIndex === i
                  ? "animate-shake border-red-200 bg-red-100"
                  : isWinningTap
                    ? "animate-pop-in border-gold bg-gold text-white shadow-md"
                    : isOdd && isRevealed
                      ? "animate-pop-in border-gold bg-gold/20"
                      : "border-border bg-[#f4f2ec] hover:-translate-y-0.5 hover:border-teal/30 hover:bg-teal/10"
              }`}
            >
              <span
                className={`text-lg font-bold tracking-wide ${
                  isWinningTap ? "text-white" : isOdd && isRevealed ? "text-gold" : "text-primary"
                }`}
              >
                {words[i]}
              </span>
              {isWinningTap && <ConfettiBurst />}
            </button>
          );
        })}
      </div>

      {isRevealed && (
        <p className="mt-4 animate-fade-in-up text-sm text-secondary">
          {status === "won"
            ? `Spotted it — cat, bat, hat, mat, sat all rhyme. "${ODD_WORD}" doesn't.`
            : `"${ODD_WORD}" breaks the rhyme — everything else ends in "-at".`}
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
