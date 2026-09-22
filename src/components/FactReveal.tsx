"use client";

import { useEffect, useState } from "react";
import { CHALLENGES } from "@/lib/challenges";

type FactId =
  | "materials-and-prep-time"
  | "no-progress-tracking"
  | "large-class-sizes"
  | "engagement-between-sessions";

export function FactSequence({
  challengeIds,
  onComplete,
}: {
  challengeIds: string[];
  onComplete?: () => void;
}) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (revealedCount > 0 && revealedCount >= challengeIds.length) {
      onComplete?.();
    }
  }, [revealedCount, challengeIds.length, onComplete]);

  // Show every already-revealed card (they stay put, back to back) plus one
  // more live card to tap next.
  const visibleIds = challengeIds.slice(0, revealedCount + 1);

  return (
    <div className="flex flex-col gap-4">
      {visibleIds.map((id, i) => (
        <FactReveal
          key={id}
          challengeId={id as FactId}
          initiallyRevealed={i < revealedCount}
          onRevealed={() => setRevealedCount((c) => Math.max(c, i + 1))}
        />
      ))}
    </div>
  );
}

function FactReveal({
  challengeId,
  initiallyRevealed = false,
  onRevealed,
}: {
  challengeId: FactId;
  initiallyRevealed?: boolean;
  onRevealed?: () => void;
}) {
  const [revealed, setRevealed] = useState(initiallyRevealed);
  const label = CHALLENGES.find((c) => c.id === challengeId)?.label ?? "";
  const content = FACTS[challengeId];

  useEffect(() => {
    if (revealed) onRevealed?.();
    // Only meant to fire once, the moment this card is tapped open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="flex w-full animate-fade-in-up items-center justify-between gap-3 rounded-xl bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
      >
        <span>
          <span className="block text-sm font-semibold text-secondary">{label}</span>
          <span className="mt-1 block text-base font-bold text-primary">
            Tap to see how it works
          </span>
        </span>
        <span className="flex h-10 w-10 shrink-0 animate-gentle-pulse items-center justify-center rounded-full bg-teal/10 text-teal">
          <ArrowIcon />
        </span>
      </button>
    );
  }

  return (
    <div className="animate-fade-in-up rounded-xl bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-secondary">{label}</p>
      <div className="mt-4">{content.render()}</div>
      <p className="mt-4 text-sm font-semibold text-primary">{content.caption}</p>
    </div>
  );
}

const FACTS: Record<FactId, { caption: string; render: () => React.ReactNode }> = {
  "materials-and-prep-time": {
    caption: "Everything is ready before you walk in.",
    render: () => (
      <IconRow
        items={[
          { icon: <DocumentIcon />, label: "Session guides" },
          { icon: <PlayIcon />, label: "Activity videos" },
          { icon: <BlocksIcon />, label: "TLMs" },
          { icon: <ChecklistIcon />, label: "Assessment tools" },
          { icon: <BookIcon />, label: "Handbook" },
        ]}
      />
    ),
  },
  "no-progress-tracking": {
    caption: "See exactly how far each learner moves.",
    render: () => <Timeline points={["Baseline", "Midline", "Endline"]} />,
  },
  "large-class-sizes": {
    caption: "Regrouped by level after midline.",
    render: () => (
      <GroupPair
        groups={[
          { size: "25–30", label: "in a classroom" },
          { size: "8–12", label: "in a community group" },
        ]}
      />
    ),
  },
  "engagement-between-sessions": {
    caption: "Something to look forward to, even outside class.",
    render: () => (
      <IconRow
        items={[
          { icon: <GameIcon />, label: "Workbook games" },
          { icon: <GlobeIcon />, label: "Practice website" },
        ]}
      />
    ),
  },
};

function IconRow({ items }: { items: { icon: React.ReactNode; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex min-w-[84px] flex-1 flex-col items-center gap-2 rounded-lg bg-teal/5 px-3 py-3 text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-teal">
            {item.icon}
          </span>
          <span className="text-xs font-semibold text-secondary">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function Timeline({ points }: { points: string[] }) {
  return (
    <div className="flex items-center">
      {points.map((point, i) => (
        <div key={point} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-xs font-semibold text-secondary">{point}</span>
          </div>
          {i < points.length - 1 && <div className="mx-2 h-[2px] flex-1 bg-teal/20" />}
        </div>
      ))}
    </div>
  );
}

function GroupPair({ groups }: { groups: { size: string; label: string }[] }) {
  return (
    <div className="flex gap-3">
      {groups.map((g) => (
        <div
          key={g.label}
          className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-teal/5 px-3 py-4 text-center"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal/10 text-teal">
            <GroupIcon />
          </span>
          <span className="text-sm font-bold text-primary">{g.size}</span>
          <span className="text-xs font-semibold text-secondary">{g.label}</span>
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

function GroupIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="9" cy="9" r="3" />
      <circle cx="17" cy="10" r="2.4" />
      <path d="M4 20c0-3 2.5-5 5-5s5 2 5 5M14.5 20c0-2.3-1.2-4-3-4.7" />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M8 9V7a2 2 0 1 1 4 0v.5h1A2.5 2.5 0 0 1 15.5 10v1h.5a2 2 0 1 1 0 4h-.5v1A2.5 2.5 0 0 1 13 18.5h-1V18a2 2 0 1 0-4 0v.5H7A2.5 2.5 0 0 1 4.5 16v-1H4a2 2 0 1 1 0-4h.5v-1A2.5 2.5 0 0 1 7 7.5h1V9z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9S9.5 5.5 12 3z" />
    </svg>
  );
}
