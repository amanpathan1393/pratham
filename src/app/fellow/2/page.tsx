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
import { pastelClass } from "@/lib/theme";

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
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link href="/fellow" className="text-sm font-semibold text-navy/70">
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
          How Step by Step English helps
        </h1>
        {SHOW_DRAFT_TAG && (
          <span className="mt-3 inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">
            Draft copy — pending review
          </span>
        )}
      </div>

      {loaded && matchedChallenges.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-pastel-sky p-5 text-center">
          <p className="text-navy/70">
            We couldn&apos;t find your answers from step 1.
          </p>
          <Link
            href="/fellow"
            className="mt-2 inline-block text-sm font-semibold text-navy underline"
          >
            Start over
          </Link>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {matchedChallenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className={`rounded-2xl ${pastelClass(index)} p-5`}
            >
              <p className="text-sm font-bold text-navy/60">
                {challenge.label}
              </p>
              <p className="mt-2 leading-relaxed text-navy">
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
        <div className="mt-6 rounded-2xl bg-pastel-lavender p-5 text-center">
          <p className="leading-relaxed text-navy">
            One pilot took learners with strong reading skills from{" "}
            <span className="font-bold">12% to 80%</span>, and cut the lowest
            reading band from <span className="font-bold">63% to 7%</span>.
          </p>
          <p className="mt-1 text-sm text-navy/60">(539 learners)</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={!isCorrect}
        className="mt-8 w-full rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-navy shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-navy/10 disabled:text-navy/40 disabled:shadow-none"
      >
        Next
      </button>
    </main>
  );
}
