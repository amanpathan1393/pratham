"use client";

import { useEffect, useState } from "react";

const ITEMS = ["Session guide", "Activity video", "TLM", "Assessment tool", "Handbook"];

export function KitReveal({ onComplete }: { onComplete?: () => void }) {
  const [started, setStarted] = useState(false);
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (checkedCount >= ITEMS.length) {
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCheckedCount((c) => c + 1), 220);
    return () => clearTimeout(t);
  }, [started, checkedCount, onComplete]);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-base font-semibold text-primary">Today&apos;s session, one tap away.</p>

      {!started ? (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-4 flex h-11 items-center justify-center rounded-lg bg-teal px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Tap for today&apos;s session
        </button>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {ITEMS.map((item, i) => {
            const isChecked = i < checkedCount;
            return (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 ${
                  isChecked ? "animate-fade-in-up bg-teal/10" : "bg-[#f4f2ec] opacity-40"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                    isChecked ? "border-teal bg-teal text-white" : "border-border text-transparent"
                  }`}
                >
                  <CheckIcon />
                </span>
                <span className="text-sm font-semibold text-primary">{item}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
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
