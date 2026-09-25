"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAnswers } from "../../_components/answers";
import { EXPERIMENTS, InquiryPlayer } from "../../_components/InquiryPlayer";
import { parseOrigin, progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";
import type { Origin } from "@/lib/experimento/leads";

type Subject = "science" | "maths";

const LABEL: Record<Subject, string> = { science: "Science", maths: "Maths" };
const OTHER: Record<Subject, Subject> = { science: "maths", maths: "science" };

// Owns the finished state so switching subject (which remounts this via its
// key) starts a fresh run.
function Session({
  subject,
  from,
  canSwitch,
  onSwitch,
}: {
  subject: Subject;
  from: Origin;
  canSwitch: boolean;
  onSwitch: (s: Subject) => void;
}) {
  const [finished, setFinished] = useState(false);
  const capture = `/experimento/capture?from=${from}`;
  return (
    <>
      <InquiryPlayer steps={EXPERIMENTS[subject]} onFinish={() => setFinished(true)} />
      {finished ? (
        <div className="pub-fade-up flex flex-col gap-3">
          <Link href={capture} className="pub-btn">
            Continue
          </Link>
          {canSwitch && (
            <button
              type="button"
              className="pub-btn pub-btn-quiet"
              onClick={() => onSwitch(OTHER[subject])}
            >
              Try the {LABEL[OTHER[subject]]} inquiry too
            </button>
          )}
        </div>
      ) : (
        <Link
          href={capture}
          className="pub-muted -mt-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold underline"
        >
          Skip to the next step
        </Link>
      )}
    </>
  );
}

function TryInner() {
  const from = parseOrigin(useSearchParams().get("from"));
  const { answers } = useAnswers();
  const [chosen, setChosen] = useState<Subject | null>(null);

  // Someone who teaches one subject goes straight to it. Those who teach
  // both (and curious visitors, who haven't told us) choose which to explore.
  const fixed: Subject | null =
    answers.subject === "science" || answers.subject === "maths" ? answers.subject : null;
  const subject = fixed ?? chosen;
  const canSwitch = fixed === null;

  return (
    <PubScreen progress={progressFor(from, "try")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          Try <span className="pub-mark-line">inquiry</span> for a minute
        </h1>
        <p className="pub-muted mt-2 text-base">
          Inquiry-based learning starts with a question, not an answer. Learners predict, explore,
          explain, and stretch what they find. This follows the 5E cycle.
        </p>
      </header>

      {canSwitch && (
        <section>
          <p className="pub-eyebrow mb-2">
            {answers.subject === "both"
              ? "You teach both. Which would you like to explore?"
              : "Which would you like to explore?"}
          </p>
          <div className="flex gap-2" role="radiogroup" aria-label="Inquiry to explore">
            {(Object.keys(LABEL) as Subject[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={subject === s}
                onClick={() => setChosen(s)}
                className="pub-pill flex-1"
              >
                {LABEL[s]}
              </button>
            ))}
          </div>
        </section>
      )}

      {subject ? (
        <Session
          key={subject}
          subject={subject}
          from={from}
          canSwitch={canSwitch}
          onSwitch={setChosen}
        />
      ) : (
        <Link
          href={`/experimento/capture?from=${from}`}
          className="pub-muted -mt-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold underline"
        >
          Skip to the next step
        </Link>
      )}
    </PubScreen>
  );
}

export default function TryPage() {
  return (
    <Suspense fallback={null}>
      <TryInner />
    </Suspense>
  );
}
