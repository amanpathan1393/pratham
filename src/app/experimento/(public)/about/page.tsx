"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProgrammeFacts } from "../../_components/ProgrammeFacts";
import { PubScreen } from "../../_components/PubScreen";
import { parseOrigin, progressFor } from "../../_components/origin";

function AboutInner() {
  const from = parseOrigin(useSearchParams().get("from"));
  // Fellows tell us about their classroom next; curious visitors go straight
  // to the interactive.
  const next = from === "fellow" ? "classroom" : "try";

  return (
    <PubScreen progress={progressFor(from, "about")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          What is <span className="pub-mark-line">Experimento</span>?
        </h1>
        <p className="pub-muted mt-2 text-base">
          A library of open educational resources for Grades 6-10, built around inquiry and
          hands-on learning.
        </p>
      </header>

      <div className="pub-fade-up" style={{ animationDelay: "100ms" }}>
        <ProgrammeFacts />
      </div>

      <Link
        href={`/experimento/${next}?from=${from}`}
        className="pub-btn pub-fade-up"
        style={{ animationDelay: "200ms" }}
      >
        Continue
      </Link>
    </PubScreen>
  );
}

export default function AboutPage() {
  return (
    <Suspense fallback={null}>
      <AboutInner />
    </Suspense>
  );
}
