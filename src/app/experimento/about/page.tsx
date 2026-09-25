"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ProgrammeFacts } from "../_components/ProgrammeFacts";
import { Screen } from "../_components/Screen";
import { parseOrigin } from "../_components/origin";

// The one line that changes with the toggle. Nothing else on the page does.
const EMPHASIS = {
  science: "Explore energy, environment, and health concepts hands-on",
  maths: "Make abstract concepts concrete through inquiry",
} as const;

type Subject = keyof typeof EMPHASIS;

function AboutInner() {
  const from = parseOrigin(useSearchParams().get("from"));
  const [subject, setSubject] = useState<Subject>("science");

  return (
    <Screen stage={3}>
      <header className="exp-fade-up">
        <h1 className="text-3xl leading-tight font-bold tracking-tight">What is Experimento?</h1>
        <p className="exp-muted mt-2 text-base">
          A library of open educational resources for Grades 6-10, built around inquiry and
          hands-on learning.
        </p>
      </header>

      <section className="exp-fade-up" style={{ animationDelay: "100ms" }}>
        <p className="exp-mono mb-2 text-xs font-medium">I teach</p>
        <div className="exp-toggle" role="group" aria-label="What do you teach?">
          <button
            type="button"
            aria-pressed={subject === "science"}
            onClick={() => setSubject("science")}
          >
            Science
          </button>
          <button
            type="button"
            aria-pressed={subject === "maths"}
            onClick={() => setSubject("maths")}
          >
            Maths
          </button>
        </div>
        <p
          key={subject}
          aria-live="polite"
          className="exp-reveal mt-3 rounded-md border-l-4 bg-white px-4 py-3 text-lg leading-snug font-bold"
          style={{ borderColor: "var(--exp-blue)" }}
        >
          {EMPHASIS[subject]}
        </p>
      </section>

      <div className="exp-fade-up" style={{ animationDelay: "200ms" }}>
        <ProgrammeFacts />
      </div>

      <Link
        href={`/experimento/capture?from=${from}`}
        className="exp-btn exp-btn-primary exp-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        Continue
      </Link>
    </Screen>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutInner />
    </Suspense>
  );
}
