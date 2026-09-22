"use client";

import { useEffect, useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { SpotTheDifference } from "@/components/SpotTheDifference";
import { WhichIsLater } from "@/components/WhichIsLater";
import { RegroupClass } from "@/components/RegroupClass";
import { KitReveal } from "@/components/KitReveal";
import { SpeakingLadder } from "@/components/SpeakingLadder";
import { insertGameResult } from "@/lib/gameResults";
import { CHALLENGES } from "@/lib/challenges";

export const GAME_PLAYED_KEY = "step-by-step-english.taste.game-played";

// Must stay in sync with the order of CHALLENGES in lib/challenges.ts — this
// is also the priority order used when two challenges were picked.
export const CHALLENGE_ORDER = [
  "reading-and-skill-levels",
  "hesitant-to-speak",
  "materials-and-prep-time",
  "no-progress-tracking",
  "large-class-sizes",
  "engagement-between-sessions",
] as const;

type ChallengeId = (typeof CHALLENGE_ORDER)[number];

const WHITE_PAINT = "This is a box of white paint.";
const RAJ_REEMA =
  "Just then, Reema entered the room. ‘There is a lizard on my desk!’ Raj said. ‘Don’t worry, I will help you,’ Reema said.";

const BEFORE_TEXT: Record<ChallengeId, string> = {
  "reading-and-skill-levels": WHITE_PAINT,
  "hesitant-to-speak": WHITE_PAINT,
  "materials-and-prep-time": "Building every lesson from scratch.",
  "no-progress-tracking": "No way to know if it's working.",
  "large-class-sizes": "One pace for the whole room.",
  "engagement-between-sessions": "Interest fades once the session ends.",
};

type InteractiveKind =
  | "game"
  | "kit-reveal"
  | "which-is-later"
  | "regroup"
  | "spot-the-difference"
  | "speaking-ladder";

// Every one of the 6 paths gets a hands-on moment between its before and
// after panels — the thing itself, not a description of it.
const INTERACTIVE_FOR: Record<ChallengeId, InteractiveKind> = {
  "reading-and-skill-levels": "game",
  "hesitant-to-speak": "speaking-ladder",
  "materials-and-prep-time": "kit-reveal",
  "no-progress-tracking": "which-is-later",
  "large-class-sizes": "regroup",
  "engagement-between-sessions": "spot-the-difference",
};

const INTERACTIVE_LABEL: Record<InteractiveKind, string> = {
  game: "What daily practice looks like",
  "kit-reveal": "Try it yourself",
  "which-is-later": "Try it yourself",
  regroup: "Try it yourself",
  "spot-the-difference": "Try it yourself",
  "speaking-ladder": "Try it yourself",
};

/**
 * Renders every picked challenge's before/after proof path, stacked. Tracks
 * completion per path and fires onComplete once all of them are done.
 */
export function ChallengeProofList({
  challengeIds,
  path,
  gamePlayed,
  onComplete,
}: {
  challengeIds: string[];
  path: "fellow" | "curious";
  gamePlayed: boolean;
  onComplete?: () => void;
}) {
  const known = new Set<string>(CHALLENGE_ORDER);
  let orderedKnown = CHALLENGE_ORDER.filter((id) => challengeIds.includes(id));
  const unknownIds = challengeIds.filter((id) => !known.has(id));

  // reading-and-skill-levels and hesitant-to-speak render the identical
  // before/after story by design (same day1/month9 proof). Showing both
  // paths back to back just repeats the same quoted lines twice, which
  // reads as broken rather than as two different proofs — so when both are
  // picked, show that story once.
  if (
    orderedKnown.includes("reading-and-skill-levels") &&
    orderedKnown.includes("hesitant-to-speak")
  ) {
    orderedKnown = orderedKnown.filter((id) => id !== "hesitant-to-speak");
  }

  if (unknownIds.length > 0 && typeof console !== "undefined") {
    console.error(
      `ChallengeProofList: unrecognized challenge id(s), no proof content exists for: ${unknownIds.join(", ")}`,
    );
  }

  const [doneIds, setDoneIds] = useState<Set<ChallengeId>>(new Set());

  useEffect(() => {
    if (orderedKnown.length > 0 && doneIds.size >= orderedKnown.length) {
      onComplete?.();
    }
    // Deliberately re-runs only when the done set changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneIds]);

  return (
    <div className="flex flex-col gap-6">
      {unknownIds.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Unknown challenge id{unknownIds.length > 1 ? "s" : ""}: {unknownIds.join(", ")}. This
          is a bug — no proof content exists for it.
        </div>
      )}
      {orderedKnown.map((id, i) => (
        <ChallengePath
          key={id}
          id={id}
          path={path}
          skipGame={gamePlayed}
          accent={i % 2 === 0 ? "teal" : "gold"}
          onDone={() => setDoneIds((prev) => new Set(prev).add(id))}
        />
      ))}
    </div>
  );
}

const ACCENT = {
  teal: { dot: "bg-teal", border: "border-teal/25", label: "text-teal" },
  gold: { dot: "bg-gold", border: "border-gold/40", label: "text-gold" },
} as const;

function ChallengePath({
  id,
  path,
  skipGame,
  accent,
  onDone,
}: {
  id: ChallengeId;
  path: "fellow" | "curious";
  skipGame: boolean;
  accent: keyof typeof ACCENT;
  onDone: () => void;
}) {
  const interactiveKind = INTERACTIVE_FOR[id];
  const isGamePath = interactiveKind === "game";
  const [afterShown, setAfterShown] = useState(!interactiveKind || (isGamePath && skipGame));
  const label = CHALLENGES.find((c) => c.id === id)?.label ?? id;
  const a = ACCENT[accent];

  useEffect(() => {
    if (afterShown) onDone();
    // Only meant to fire once, based on the state this mounted with.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGameComplete(result: "won" | "timeout") {
    try {
      sessionStorage.setItem(GAME_PLAYED_KEY, "true");
    } catch {
      // sessionStorage can be unavailable (e.g. private mode); not critical.
    }
    // Best-effort analytics ping; never blocks the UI on failure.
    insertGameResult({ path, result }).catch(() => {});
    setAfterShown(true);
    onDone();
  }

  function handleInteractionDone() {
    setAfterShown(true);
    onDone();
  }

  return (
    <div className={`rounded-2xl border-2 ${a.border} bg-[#fdfcfa] p-4 sm:p-5`}>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
        <p className={`text-xs font-bold tracking-wide uppercase ${a.label}`}>{label}</p>
      </div>

      <div className="flex flex-col gap-3">
        <TextPanel tone="before">{BEFORE_TEXT[id]}</TextPanel>

        {interactiveKind && (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
              {INTERACTIVE_LABEL[interactiveKind]}
            </p>
            {interactiveKind === "game" && <FastestFingerGame onComplete={handleGameComplete} />}
            {interactiveKind === "kit-reveal" && <KitReveal onComplete={handleInteractionDone} />}
            {interactiveKind === "which-is-later" && (
              <WhichIsLater onComplete={handleInteractionDone} />
            )}
            {interactiveKind === "regroup" && <RegroupClass onComplete={handleInteractionDone} />}
            {interactiveKind === "spot-the-difference" && (
              <SpotTheDifference onComplete={handleInteractionDone} />
            )}
            {interactiveKind === "speaking-ladder" && (
              <SpeakingLadder onComplete={handleInteractionDone} />
            )}
          </div>
        )}

        {afterShown && <AfterPanel id={id} />}

        {afterShown && isGamePath && (
          <div className="animate-fade-in-up rounded-xl bg-gold/10 p-5 text-center shadow-sm">
            <p className="leading-relaxed text-primary">
              One pilot took learners with strong reading skills from{" "}
              <span className="font-bold">12% to 80%</span>, and cut the lowest reading band
              from <span className="font-bold">63% to 7%</span>.
            </p>
            <p className="mt-1 text-sm text-secondary">(539 learners)</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AfterPanel({ id }: { id: ChallengeId }) {
  switch (id) {
    case "reading-and-skill-levels":
    case "hesitant-to-speak":
      return <TextPanel tone="after">{RAJ_REEMA}</TextPanel>;
    case "materials-and-prep-time":
      return (
        <TextPanel tone="after">
          Every session shows up ready — nothing built from scratch, nothing missing.
        </TextPanel>
      );
    case "no-progress-tracking":
      return (
        <Panel tone="after">
          <Timeline points={["Baseline", "Midline", "Endline"]} />
          <p className="mt-3 text-sm text-primary">
            Each stage is a real assessment — so growth shows up as data, not a guess.
          </p>
        </Panel>
      );
    case "large-class-sizes":
      return (
        <TextPanel tone="after">
          Regrouped by level after midline. 25-30 in a classroom, 8-12 in a community group.
        </TextPanel>
      );
    case "engagement-between-sessions":
      return (
        <TextPanel tone="after">
          That&apos;s a real workbook game — plus a practice website, so it doesn&apos;t stop
          when the session ends.
        </TextPanel>
      );
  }
}

function Panel({ tone, children }: { tone: "before" | "after"; children: React.ReactNode }) {
  return (
    <div
      className="animate-fade-in-up rounded-xl p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
      style={{ background: tone === "before" ? "#EFEBE3" : "#F5E6C8" }}
    >
      <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
        {tone === "before" ? "Before" : "After"}
      </p>
      <div className="mt-2 text-primary">{children}</div>
    </div>
  );
}

function TextPanel({ tone, children }: { tone: "before" | "after"; children: React.ReactNode }) {
  return (
    <Panel tone={tone}>
      <p className="leading-relaxed">&ldquo;{children}&rdquo;</p>
    </Panel>
  );
}

const BAR_HEIGHTS = [22, 42, 64];

function Timeline({ points }: { points: string[] }) {
  return (
    <div className="flex items-end gap-4">
      {points.map((point, i) => (
        <div key={point} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-16 w-full items-end justify-center">
            <div
              className="w-8 origin-bottom animate-grow-up rounded-t-md bg-teal"
              style={{
                height: `${BAR_HEIGHTS[i] ?? BAR_HEIGHTS[BAR_HEIGHTS.length - 1]}px`,
                animationDelay: `${i * 200 + 150}ms`,
              }}
            />
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-[11px] font-bold text-white">
            {i + 1}
          </span>
          <span className="text-xs font-semibold text-secondary">{point}</span>
        </div>
      ))}
    </div>
  );
}

