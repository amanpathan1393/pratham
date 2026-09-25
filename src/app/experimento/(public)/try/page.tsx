"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useAnswers } from "../../_components/answers";
import { Choice } from "../../_components/Choice";
import { InquiryPlayer, TOPICS, type Topic } from "../../_components/InquiryPlayer";
import { parseOrigin, progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";
import type { Origin } from "@/lib/experimento/leads";

type Subject = "science" | "maths";

const LABEL: Record<Subject, string> = { science: "Science", maths: "Maths" };

// Owns the finished state so choosing another inquiry (which remounts this
// via its key) starts a fresh run.
function Session({
  topic,
  from,
  onAnother,
}: {
  topic: Topic;
  from: Origin;
  onAnother: () => void;
}) {
  const [finished, setFinished] = useState(false);
  const capture = `/experimento/capture?from=${from}`;
  return (
    <>
      <InquiryPlayer steps={topic.steps} onFinish={() => setFinished(true)} />
      {finished ? (
        <div className="pub-fade-up flex flex-col gap-3">
          <Link href={capture} className="pub-btn">
            Continue
          </Link>
          <button type="button" className="pub-btn pub-btn-quiet" onClick={onAnother}>
            Try another inquiry
          </button>
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
  const [chosenSubject, setChosenSubject] = useState<Subject | null>(null);
  const [topicId, setTopicId] = useState<string | null>(null);

  // Someone who teaches one subject goes straight to its inquiries. Those
  // who teach both (and curious visitors, who haven't told us) pick a
  // subject first.
  const fixed: Subject | null =
    answers.subject === "science" || answers.subject === "maths" ? answers.subject : null;
  const subject = fixed ?? chosenSubject;
  const topics = subject ? TOPICS.filter((t) => t.subject === subject) : [];
  const topic = topics.find((t) => t.id === topicId) ?? null;

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

      {fixed === null && (
        <section>
          <p className="pub-eyebrow mb-2">
            {answers.subject === "both"
              ? "You teach both. Which would you like to explore?"
              : "Which would you like to explore?"}
          </p>
          <div className="flex gap-2" role="radiogroup" aria-label="Subject">
            {(Object.keys(LABEL) as Subject[]).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={subject === s}
                onClick={() => {
                  setChosenSubject(s);
                  setTopicId(null);
                }}
                className="pub-pill flex-1"
              >
                {LABEL[s]}
              </button>
            ))}
          </div>
        </section>
      )}

      {subject && (
        <section>
          <p className="pub-eyebrow mb-2">Pick an inquiry</p>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Inquiry">
            {topics.map((t) => (
              <Choice
                key={t.id}
                label={t.title}
                hint={t.blurb}
                selected={topicId === t.id}
                onSelect={() => setTopicId(t.id)}
              />
            ))}
          </div>
        </section>
      )}

      {topic ? (
        <Session key={topic.id} topic={topic} from={from} onAnother={() => setTopicId(null)} />
      ) : (
        <Link
          href={`/experimento/capture?from=${from}`}
          className="pub-muted inline-flex min-h-11 items-center justify-center text-sm font-semibold underline"
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
