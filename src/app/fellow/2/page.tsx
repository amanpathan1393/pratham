"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CHALLENGES,
  CONTENT_REVIEWED,
  STEP1_STORAGE_KEY,
  selectActivity,
  type ActivityPlan,
  type Challenge,
} from "@/lib/challenges";
import { TasteExperience, GAME_PLAYED_KEY } from "@/components/TasteExperience";
import { StepDots } from "@/components/StepDots";
import { ctaClass } from "@/lib/theme";

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
    plan: ActivityPlan;
  }>({ loaded: false, matchedChallenges: [], plan: { kind: "game" } });
  const [tasteComplete, setTasteComplete] = useState(false);
  const { loaded, matchedChallenges, plan } = step1Selection;

  useEffect(() => {
    let ids: string[] = [];
    let gamePlayed = false;
    try {
      const raw = sessionStorage.getItem(STEP1_STORAGE_KEY);
      if (raw) ids = JSON.parse(raw);
      gamePlayed = sessionStorage.getItem(GAME_PLAYED_KEY) === "true";
    } catch {
      ids = [];
    }
    let plan = selectActivity(ids);
    // Never replay the game if it was already played (e.g. via /curious
    // first) — fall back to the reveal instead of the fact-reveals, since
    // that's the closest "already proven" equivalent to the game.
    if (gamePlayed && plan.kind === "game") {
      plan = { kind: "reveal" };
    }
    // sessionStorage only exists client-side, so this one-time read has to
    // happen post-mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep1Selection({
      loaded: true,
      matchedChallenges: CHALLENGES.filter((c) => ids.includes(c.id)),
      plan,
    });
  }, []);

  function handleNext() {
    if (!tasteComplete) return;
    router.push("/fellow/3");
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link
        href="/fellow"
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

      <div className="mt-8 animate-fade-in-up text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          How Step by Step English helps
        </h1>
        {SHOW_DRAFT_TAG && (
          <span className="mt-3 inline-block rounded-full bg-inactive px-3 py-1 text-xs font-bold text-secondary">
            Draft copy — pending review
          </span>
        )}
      </div>

      {loaded && matchedChallenges.length === 0 ? (
        <div className="mt-6 rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-secondary">
            We couldn&apos;t find your answers from step 1.
          </p>
          <Link
            href="/fellow"
            className="mt-2 inline-block py-3.5 text-sm font-semibold text-teal underline"
          >
            Start over
          </Link>
        </div>
      ) : (
        <div
          className="mt-6 flex animate-fade-in-up flex-col gap-3"
          style={{ animationDelay: "100ms" }}
        >
          {matchedChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-sm font-semibold text-secondary">
                {challenge.label}
              </p>
              <p className="mt-2 leading-relaxed text-primary">
                {challenge.solution}
              </p>
            </div>
          ))}
        </div>
      )}

      {loaded && (
        <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <TasteExperience
            path="fellow"
            plan={plan}
            onComplete={() => setTasteComplete(true)}
          />
        </div>
      )}

      {tasteComplete && (
        <div className="mt-6 animate-fade-in-up rounded-xl bg-gold/10 p-5 text-center shadow-sm">
          <p className="leading-relaxed text-primary">
            One pilot took learners with strong reading skills from{" "}
            <span className="font-bold">12% to 80%</span>, and cut the lowest
            reading band from <span className="font-bold">63% to 7%</span>.
          </p>
          <p className="mt-1 text-sm text-secondary">(539 learners)</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleNext}
        disabled={!tasteComplete}
        className={`mt-8 ${ctaClass}`}
      >
        Next
      </button>
    </main>
  );
}
