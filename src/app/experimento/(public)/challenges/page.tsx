"use client";

import Link from "next/link";
import { CHALLENGES } from "@/lib/experimento/content";
import { useAnswers } from "../../_components/answers";
import { Choice } from "../../_components/Choice";
import { progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";

export default function ChallengesPage() {
  const { answers, update } = useAnswers();

  function toggle(id: string) {
    update((cur) => ({
      challenges: cur.challenges.includes(id)
        ? cur.challenges.filter((c) => c !== id)
        : [...cur.challenges, id],
    }));
  }

  return (
    <PubScreen progress={progressFor("fellow", "challenges")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          Have you faced <span className="pub-mark-line">these</span> in your classroom?
        </h1>
        <p className="pub-muted mt-2 text-base">
          Often found in science and maths classrooms. Tap the ones that sound like you.
        </p>
      </header>

      <div className="flex flex-col gap-3" role="group" aria-label="Classroom situations">
        {CHALLENGES.map((c, i) => (
          <div key={c.id} className="pub-fade-up" style={{ animationDelay: `${100 + i * 90}ms` }}>
            <Choice
              mode="multi"
              label={c.text}
              selected={answers.challenges.includes(c.id)}
              onSelect={() => toggle(c.id)}
            />
          </div>
        ))}
      </div>

      {answers.challenges.length > 0 && (
        <Link href="/experimento/about?from=fellow" className="pub-btn pub-fade-up">
          Continue
        </Link>
      )}
    </PubScreen>
  );
}
