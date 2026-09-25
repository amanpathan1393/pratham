"use client";

import Link from "next/link";
import { GRADES, STUDENT_COUNTS, SUBJECTS } from "@/lib/experimento/content";
import { useAnswers } from "../../_components/answers";
import { Choice } from "../../_components/Choice";
import { progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";

export default function ClassroomPage() {
  const { answers, update } = useAnswers();
  const subject = SUBJECTS.find((s) => s.id === answers.subject);
  const complete =
    answers.subject !== null && answers.grades.length > 0 && answers.studentCount !== null;

  function toggleGrade(grade: string) {
    update((cur) => ({
      grades: cur.grades.includes(grade)
        ? cur.grades.filter((g) => g !== grade)
        : [...cur.grades, grade],
    }));
  }

  return (
    <PubScreen progress={progressFor("fellow", "classroom")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          Tell us about your <span className="pub-mark-line">classroom</span>
        </h1>
      </header>

      <section className="pub-fade-up" style={{ animationDelay: "80ms" }}>
        <p className="pub-eyebrow mb-2">I teach</p>
        <div className="flex gap-2" role="radiogroup" aria-label="Subject">
          {SUBJECTS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={answers.subject === s.id}
              onClick={() => update({ subject: s.id })}
              className="pub-pill flex-1"
            >
              {s.label}
            </button>
          ))}
        </div>
        {subject && (
          <p key={subject.id} className="pub-notice pub-pop mt-3" data-tone="info">
            {subject.emphasis}
          </p>
        )}
      </section>

      <section className="pub-fade-up" style={{ animationDelay: "160ms" }}>
        <p className="pub-eyebrow mb-1">Which grades do you teach?</p>
        <p className="pub-muted mb-2 text-sm">Pick all that apply.</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Grades taught">
          {GRADES.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={answers.grades.includes(g)}
              onClick={() => toggleGrade(g)}
              className="pub-pill"
            >
              Grade {g}
            </button>
          ))}
        </div>
      </section>

      <section className="pub-fade-up" style={{ animationDelay: "240ms" }}>
        <p className="pub-eyebrow mb-2">How many students do you teach?</p>
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Number of students">
          {STUDENT_COUNTS.map((count) => (
            <Choice
              key={count}
              label={count}
              selected={answers.studentCount === count}
              onSelect={() => update({ studentCount: count })}
            />
          ))}
        </div>
      </section>

      {complete ? (
        <Link href="/experimento/try?from=fellow" className="pub-btn pub-fade-up">
          Continue
        </Link>
      ) : (
        <button type="button" className="pub-btn" disabled>
          Continue
        </button>
      )}
    </PubScreen>
  );
}
