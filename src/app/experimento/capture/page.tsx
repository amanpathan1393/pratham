"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { insertLead } from "@/lib/experimento/leads";
import { Screen } from "../_components/Screen";
import { parseOrigin } from "../_components/origin";

const NEXT_STEPS = [
  "I'd like to try this resource in my classroom",
  "I want to explore inquiry-based learning and bring it into my classroom",
  "Just keep me updated",
];

function CaptureInner() {
  const from = parseOrigin(useSearchParams().get("from"));
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
      <Screen stage={4} showBack={false}>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <span
            className="exp-fade-up flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "var(--exp-blue)" }}
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
              <path
                className="exp-draw"
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="#fff"
                strokeWidth="2.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1
            className="exp-fade-up text-3xl leading-tight font-bold tracking-tight"
            style={{ animationDelay: "100ms" }}
          >
            Thanks! We&apos;ll be in touch with what&apos;s next.
          </h1>
          <Link
            href="/experimento"
            className="exp-fade-up inline-flex min-h-11 items-center px-3 text-sm font-bold underline"
            style={{ animationDelay: "200ms" }}
          >
            Back to start
          </Link>
        </div>
      </Screen>
    );
  }

  return (
    <Screen stage={4}>
      <header className="exp-fade-up">
        <h1 className="text-3xl leading-tight font-bold tracking-tight">
          What would you like to do next?
        </h1>
      </header>

      <form
        onSubmit={handleSubmit}
        className="exp-fade-up flex flex-col gap-5"
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

        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">What would you like to do next?</legend>
          {NEXT_STEPS.map((option) => (
            <label key={option} className="relative block">
              <input
                type="radio"
                name="next_step"
                value={option}
                checked={nextStep === option}
                onChange={() => setNextStep(option)}
                className="exp-option-input"
              />
              <span className="exp-card exp-option-box">
                <span className="exp-option-dot" aria-hidden="true" />
                <span>{option}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold">
            Name <span style={{ color: "var(--exp-blue)" }}>*</span>
          </span>
          <input
            className="exp-input"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold">
            Email <span style={{ color: "var(--exp-blue)" }}>*</span>
          </span>
          <input
            className="exp-input"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-bold">
            Phone <span className="exp-muted font-normal">(optional)</span>
          </span>
          <input
            className="exp-input"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        {submitError && (
          <p role="alert" className="text-sm font-bold" style={{ color: "#b42318" }}>
            Something went wrong, try again.
          </p>
        )}

        <button type="submit" disabled={!isValid || isSubmitting} className="exp-btn exp-btn-primary">
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </Screen>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={null}>
      <CaptureInner />
    </Suspense>
  );
}
