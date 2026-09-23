"use client";

import { useState } from "react";
import { playDing } from "@/lib/sound";

const GROUPS = [
  { label: "Level 1", count: 6, dot: "bg-red-400", bg: "bg-red-50" },
  { label: "Level 2", count: 7, dot: "bg-gold", bg: "bg-gold/10" },
  { label: "Level 3", count: 5, dot: "bg-green-500", bg: "bg-green-50" },
];

const TOTAL = GROUPS.reduce((sum, g) => sum + g.count, 0);

export function RegroupClass({ onComplete }: { onComplete?: () => void }) {
  const [regrouped, setRegrouped] = useState(false);

  function handleRegroup() {
    if (regrouped) return;
    setRegrouped(true);
    playDing();
    setTimeout(() => onComplete?.(), 700);
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-primary">
        {regrouped ? "Regrouped by level." : "One class. One pace."}
      </p>

      {!regrouped ? (
        <>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span key={i} className="h-4 w-4 rounded-full bg-[#d8d3c8]" />
            ))}
          </div>
          <button
            type="button"
            onClick={handleRegroup}
            className="mt-4 flex h-11 items-center justify-center rounded-lg bg-teal px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Regroup by level
          </button>
        </>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {GROUPS.map((g, gi) => (
            <div
              key={g.label}
              className={`animate-pop-in rounded-lg ${g.bg} p-3 text-center`}
              style={{ animationDelay: `${gi * 120}ms` }}
            >
              <div className="flex flex-wrap justify-center gap-1">
                {Array.from({ length: g.count }).map((_, i) => (
                  <span key={i} className={`h-3 w-3 rounded-full ${g.dot}`} />
                ))}
              </div>
              <p className="mt-2 text-xs font-semibold text-secondary">{g.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
