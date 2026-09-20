"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CHALLENGES, STEP1_STORAGE_KEY } from "@/lib/challenges";
import { pastelClass } from "@/lib/theme";

const MAX_SELECTIONS = 2;
const TOTAL_STEPS = 3;
const CURRENT_STEP = 1;

export default function FellowStepOne() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  const atMax = selected.length >= MAX_SELECTIONS;

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((c) => c !== id);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev;
      }
      return [...prev, id];
    });
  }

  function handleNext() {
    if (selected.length === 0) return;
    sessionStorage.setItem(STEP1_STORAGE_KEY, JSON.stringify(selected));
    router.push("/fellow/2");
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link href="/" className="text-sm font-semibold text-navy/70">
        ← Back
      </Link>

      <div className="mt-6">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step <= CURRENT_STEP ? "bg-gold" : "bg-navy/10"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-navy/60">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          What&apos;s happening in your classroom?
        </h1>
        <p className="mt-2 text-navy/70">Pick up to 2.</p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {CHALLENGES.map((challenge, index) => {
          const isSelected = selected.includes(challenge.id);
          const isDisabled = atMax && !isSelected;

          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => toggle(challenge.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={`rounded-2xl border-2 px-5 py-3.5 text-left text-base font-bold transition active:scale-[0.98] ${
                isSelected
                  ? "border-navy bg-gold text-navy"
                  : isDisabled
                    ? `border-transparent opacity-50 ${pastelClass(index)} text-navy/50`
                    : `border-transparent ${pastelClass(index)} text-navy`
              }`}
            >
              {challenge.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={selected.length === 0}
        className="mt-8 w-full rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-navy shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-navy/10 disabled:text-navy/40 disabled:shadow-none"
      >
        Next
      </button>
    </main>
  );
}
