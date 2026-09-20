"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STEP1_STORAGE_KEY } from "@/lib/challenges";
import { insertSubmission } from "@/lib/submissions";
import { pastelClass } from "@/lib/theme";

const TOTAL_STEPS = 3;
const CURRENT_STEP = 3;

const HELP_OPTIONS = [
  "Try it in my classroom",
  "Explore it outside my classroom",
  "Talk to the team first",
  "Just send me resources",
] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  helpChoice: string | null;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  helpChoice: null,
};

export default function FellowStepThree() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [challengeIds, setChallengeIds] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STEP1_STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChallengeIds(raw ? JSON.parse(raw) : []);
    } catch {
      setChallengeIds([]);
    }
  }, []);

  const isValid =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.helpChoice !== null;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await insertSubmission({
        path: "fellow",
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        challenges: challengeIds,
        next_step: form.helpChoice,
      });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          Thanks!
        </h1>
        <p className="max-w-sm text-navy/70">
          We&apos;ll follow up with resources for what you picked.
        </p>
        <Link
          href="/"
          className="mt-4 text-sm font-semibold text-navy underline"
        >
          Back to start
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link href="/fellow/2" className="text-sm font-semibold text-navy/70">
        ← Back
      </Link>

      <div className="mt-6">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step <= CURRENT_STEP ? "bg-gold" : "bg-navy/10"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-navy/60">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          Just a few details
        </h1>
        <p className="mt-2 text-navy/70">
          So we can follow up with the right resources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Email" required>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className={inputClass}
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-semibold text-navy">
            What would help most right now?
          </legend>
          <div className="mt-2 flex flex-col gap-2.5">
            {HELP_OPTIONS.map((option, index) => {
              const isSelected = form.helpChoice === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => update("helpChoice", option)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border-2 px-5 py-3.5 text-left text-base font-bold transition active:scale-[0.98] ${
                    isSelected
                      ? "border-navy bg-gold text-navy"
                      : `border-transparent ${pastelClass(index)} text-navy`
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        {submitError && (
          <p className="text-sm font-medium text-red-600">
            Something went wrong, try again.
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-2 w-full rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-navy shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-navy/10 disabled:text-navy/40 disabled:shadow-none"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "rounded-xl border-2 border-navy/15 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-navy";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-navy">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
