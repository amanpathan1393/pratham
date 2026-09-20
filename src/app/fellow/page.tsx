"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CHALLENGES, STEP1_STORAGE_KEY } from "@/lib/challenges";

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
    <main className="flex min-h-dvh flex-1 flex-col bg-zinc-50 px-6 py-8 dark:bg-black">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>

      <div className="mt-6">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step <= CURRENT_STEP
                  ? "bg-zinc-900 dark:bg-zinc-50"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          What&apos;s happening in your classroom?
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Pick up to 2.</p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-2.5">
        {CHALLENGES.map((challenge) => {
          const isSelected = selected.includes(challenge.id);
          const isDisabled = atMax && !isSelected;

          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => toggle(challenge.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={`rounded-2xl border-2 px-5 py-3.5 text-left text-base font-semibold transition active:scale-[0.98] ${
                isSelected
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                  : isDisabled
                    ? "cursor-not-allowed border-zinc-200 bg-white text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600"
                    : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
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
        className="mt-8 w-full rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
      >
        Next
      </button>
    </main>
  );
}
