"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CHALLENGES, STEP1_STORAGE_KEY } from "@/lib/challenges";
import { listRowClass } from "@/lib/theme";
import { StepDots } from "@/components/StepDots";

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
      <Link
        href="/"
        className="inline-block py-3.5 text-sm font-semibold text-secondary"
      >
        ← Back
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <StepDots total={TOTAL_STEPS} current={CURRENT_STEP} />
        <p className="text-sm font-semibold text-secondary">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          What&apos;s happening in your classroom?
        </h1>
        <p className="mt-2 text-secondary">Pick up to 2.</p>
      </div>

      <div className="mt-6 flex flex-1 flex-col border-b-[1.5px] border-border">
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
              className={listRowClass({ selected: isSelected, disabled: isDisabled })}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                  isSelected ? "border-teal bg-teal" : "border-border"
                }`}
              >
                {isSelected && <CheckIcon />}
              </span>
              <span>{challenge.label}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={selected.length === 0}
        className="mt-8 flex h-14 w-full items-center justify-center rounded-lg bg-teal text-base font-bold text-white transition active:scale-[0.98] disabled:bg-inactive disabled:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2"
      >
        Next
      </button>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
