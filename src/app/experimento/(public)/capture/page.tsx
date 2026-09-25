"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { NEXT_STEPS } from "@/lib/experimento/content";
import { insertLead } from "@/lib/experimento/leads";
import { useAnswers } from "../../_components/answers";
import { Choice } from "../../_components/Choice";
import { parseOrigin, progressFor } from "../../_components/origin";
import { PubScreen } from "../../_components/PubScreen";

function CaptureInner() {
  const from = parseOrigin(useSearchParams().get("from"));
  const { answers } = useAnswers();
  const [nextStep, setNextStep] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = nextStep !== null && name.trim() !== "" && email.trim() !== "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting || nextStep === null) return;
    if (honeypot.trim() !== "") {
      // Likely a bot: pretend success without writing anything.
      setSubmitted(true);
      return;
    }
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await insertLead({
        path: from,
        next_step: nextStep,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        // Classroom answers only exist on the Fellow path; other paths must
        // never pick up stale answers from an earlier run in the same visit.
        ...(from === "fellow"
          ? {
              subject: answers.subject,
              grades: answers.grades.length ? answers.grades : null,
              student_count: answers.studentCount,
              challenges: answers.challenges.length ? answers.challenges : null,
            }
          : {}),
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Experimento lead submit failed", err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <PubScreen showBack={false}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span
            className="pub-pop flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--pub-gold)" }}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
              <path
                className="pub-draw"
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#181717"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1
            className="pub-fade-up text-[28px] leading-tight font-bold tracking-tight"
            style={{ animationDelay: "100ms" }}
          >
            Thanks! We&apos;ll be in touch with what&apos;s next.
          </h1>
          <Link
            href="/experimento"
            className="pub-fade-up inline-flex min-h-11 items-center px-3 text-sm font-semibold underline"
            style={{ animationDelay: "200ms" }}
          >
            Back to start
          </Link>
        </div>
      </PubScreen>
    );
  }

  return (
    <PubScreen progress={progressFor(from, "capture")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          What would you like to <span className="pub-mark-line">do next</span>?
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="pub-fade-up flex flex-col gap-5"
        style={{ animationDelay: "100ms" }}
      >
        {/* Spam trap: out of layout and tab order. Real visitors never see
            it; a bot that fills every input gets silently dropped. */}
        <div
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}
        >
          <label htmlFor="exp-company-url">Company website</label>
          <input
            id="exp-company-url"
            name="company_url"
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col gap-2" role="radiogroup" aria-label="What would you like to do next?">
          {NEXT_STEPS.map((option) => (
            <Choice
              key={option}
              label={option}
              selected={nextStep === option}
              onSelect={() => setNextStep(option)}
            />
          ))}
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            Name <span aria-hidden="true">*</span>
          </span>
          <input
            className="pub-input"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            Email <span aria-hidden="true">*</span>
          </span>
          <input
            className="pub-input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold">
            Phone <span className="pub-muted font-normal">(optional)</span>
          </span>
          <input
            className="pub-input"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {submitError && (
          <p role="alert" className="text-sm font-semibold" style={{ color: "#b42318" }}>
            Something went wrong, try again.
          </p>
        )}

        <button type="submit" disabled={!isValid || isSubmitting} className="pub-btn">
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </PubScreen>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={null}>
      <CaptureInner />
    </Suspense>
  );
}
