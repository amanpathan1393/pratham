"use client";

import { useEffect, useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { insertGameResult } from "@/lib/gameResults";

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
      {orderedKnown.map((id) => (
        <ChallengePath
          key={id}
          id={id}
          path={path}
          skipGame={gamePlayed}
          onDone={() => setDoneIds((prev) => new Set(prev).add(id))}
        />
      ))}
    </div>
  );
}

function ChallengePath({
  id,
  path,
  skipGame,
  onDone,
}: {
  id: ChallengeId;
  path: "fellow" | "curious";
  skipGame: boolean;
  onDone: () => void;
}) {
  const isGamePath = id === "reading-and-skill-levels";
  const [afterShown, setAfterShown] = useState(!isGamePath || skipGame);

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

  return (
    <div className="flex flex-col gap-3">
      <TextPanel tone="before">{BEFORE_TEXT[id]}</TextPanel>

      {isGamePath && !afterShown && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-wide text-secondary uppercase">
            What daily practice looks like
          </p>
          <FastestFingerGame onComplete={handleGameComplete} />
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
  );
}

function AfterPanel({ id }: { id: ChallengeId }) {
  switch (id) {
    case "reading-and-skill-levels":
    case "hesitant-to-speak":
      return <TextPanel tone="after">{RAJ_REEMA}</TextPanel>;
    case "materials-and-prep-time":
      return (
        <Panel tone="after">
          <IconRow
            items={[
              { icon: <DocumentIcon />, label: "Session guides" },
              { icon: <PlayIcon />, label: "Activity videos" },
              { icon: <BlocksIcon />, label: "TLMs" },
              { icon: <ChecklistIcon />, label: "Assessment tools" },
              { icon: <BookIcon />, label: "Handbook" },
            ]}
          />
        </Panel>
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
          Workbook games and a practice website keep them coming back.
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

function IconRow({ items }: { items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-[84px] flex-1 flex-col items-center gap-2 rounded-lg bg-white/60 px-3 py-3 text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-teal">
            {item.icon}
          </span>
          <span className="text-xs font-semibold text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
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

function iconProps() {
  return {
    viewBox: "0 0 24 24",
    className: "h-4.5 w-4.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
}

function DocumentIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5z" />
    </svg>
  );
}

function BlocksIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="4" y="4" width="7" height="7" rx="1.2" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" />
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M5 4h14v16H5z" />
      <path d="M8.5 10l1.5 1.5L13 8.5M8.5 16h7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 5.5C4 4.7 4.7 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H12v16h6.5a1.5 1.5 0 0 0 1.5-1.5z" />
    </svg>
  );
}
