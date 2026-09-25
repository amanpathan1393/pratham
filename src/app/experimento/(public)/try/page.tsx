"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { SUBJECTS } from "@/lib/experimento/content";
import { useAnswers } from "../../_components/answers";
import { EXPERIMENTS, InquiryPlayer } from "../../_components/InquiryPlayer";
import { parseOrigin, progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";
import type { Origin } from "@/lib/experimento/leads";

type Subject = "science" | "maths";

// Owns the finished state so switching subject (which remounts this via its
// key) starts a fresh run.
function Session({ subject, from }: { subject: Subject; from: Origin }) {
  const [finished, setFinished] = useState(false);
  return (
    <>
      <InquiryPlayer steps={EXPERIMENTS[subject]} onFinish={() => setFinished(true)} />
      {finished ? (
        <Link href={`/experimento/capture?from=${from}`} className="pub-btn pub-fade-up">
          Continue
        </Link>
      ) : (
        <Link
          href={`/experimento/capture?from=${from}`}
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
  const [tab, setTab] = useState<Subject | null>(null);
  const subject: Subject = tab ?? answers.subject ?? "science";

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

      <div className="flex gap-2" role="radiogroup" aria-label="Subject">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={subject === s.id}
            onClick={() => setTab(s.id)}
            className="pub-pill flex-1"
          >
            {s.label}
          </button>
        ))}
      </div>

      <Session key={subject} subject={subject} from={from} />
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
