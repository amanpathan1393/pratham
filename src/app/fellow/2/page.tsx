"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CHALLENGES,
  CONTENT_REVIEWED,
  STEP1_STORAGE_KEY,
  type Challenge,
} from "@/lib/challenges";
import { ComprehensionActivity } from "@/components/ComprehensionActivity";

const TOTAL_STEPS = 3;
const CURRENT_STEP = 2;

// Vercel sets this at build time; it's unset for local `next dev` and for a
// plain local production build, so the tag defaults to visible everywhere
// except an actual Vercel production deployment.
const SHOW_DRAFT_TAG =
  !CONTENT_REVIEWED && process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

export default function FellowStepTwo() {
  const router = useRouter();
  const [step1Selection, setStep1Selection] = useState<{
    loaded: boolean;
    matchedChallenges: Challenge[];
  }>({ loaded: false, matchedChallenges: [] });
  const [isCorrect, setIsCorrect] = useState(false);
  const { loaded, matchedChallenges } = step1Selection;

  useEffect(() => {
    let ids: string[] = [];
    try {
      const raw = sessionStorage.getItem(STEP1_STORAGE_KEY);
      if (raw) ids = JSON.parse(raw);
    } catch {
      ids = [];
    }
    // sessionStorage only exists client-side, so this one-time read has to
    // happen post-mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep1Selection({
      loaded: true,
      matchedChallenges: CHALLENGES.filter((c) => ids.includes(c.id)),
    });
  }, []);

  function handleNext() {
    if (!isCorrect) return;
    router.push("/fellow/3");
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-zinc-50 px-6 py-8 dark:bg-black">
      <Link
        href="/fellow"
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
          How Step by Step English helps
        </h1>
        {SHOW_DRAFT_TAG && (
          <span className="mt-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Draft copy — pending review
          </span>
        )}
      </div>

      {loaded && matchedChallenges.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">
            We couldn&apos;t find your answers from step 1.
          </p>
          <Link
            href="/fellow"
            className="mt-2 inline-block text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
          >
            Start over
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {matchedChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800"
            >
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {challenge.label}
              </p>
              <p className="mt-2 leading-relaxed text-zinc-900 dark:text-zinc-50">
                {challenge.solution}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <ComprehensionActivity onCorrect={() => setIsCorrect(true)} />
      </div>

      {isCorrect && (
        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <p className="leading-relaxed text-zinc-900 dark:text-zinc-50">
            One pilot took learners with strong reading skills from{" "}
            <span className="font-bold">12% to 80%</span>, and cut the lowest
            reading band from <span className="font-bold">63% to 7%</span>.
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            (539 learners)
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={!isCorrect}
        className="mt-8 w-full rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
      >
        Next
      </button>
    </main>
  );
}
