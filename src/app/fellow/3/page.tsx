"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STEP1_STORAGE_KEY } from "@/lib/challenges";
import { insertSubmission } from "@/lib/submissions";
import { listRowClass } from "@/lib/theme";
import { Honeypot } from "@/components/Honeypot";
import { StepDots } from "@/components/StepDots";

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
  const [honeypot, setHoneypot] = useState("");

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
    if (honeypot.trim() !== "") {
      // Likely a bot: pretend success without writing to the database.
      setSubmitted(true);
      return;
    }
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
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Thanks!
        </h1>
        <p className="max-w-sm text-secondary">
          We&apos;ll follow up with resources for what you picked.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block py-3.5 text-sm font-semibold text-teal underline"
        >
          Back to start
        </Link>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link
        href="/fellow/2"
        className="inline-block py-3.5 text-sm font-semibold text-secondary"
      >
        ← Back
      </Link>

      <div className="mt-6 flex items-center gap-3">
        <StepDots total={TOTAL_STEPS} current={CURRENT_STEP} />
        <p className="text-sm font-semibold text-secondary">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Just a few details
        </h1>
        <p className="mt-2 text-secondary">
          So we can follow up with the right resources.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Honeypot value={honeypot} onChange={setHoneypot} />

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
          <legend className="text-sm font-semibold text-primary">
            What would help most right now?
          </legend>
          <div className="mt-2 flex flex-col border-b-[1.5px] border-border">
            {HELP_OPTIONS.map((option) => {
              const isSelected = form.helpChoice === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => update("helpChoice", option)}
                  aria-pressed={isSelected}
                  className={listRowClass({ selected: isSelected })}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                      isSelected ? "border-teal bg-teal" : "border-border"
                    }`}
                  >
                    {isSelected && <CheckIcon />}
                  </span>
                  <span>{option}</span>
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
          className="mt-2 flex h-14 w-full items-center justify-center rounded-lg bg-teal text-base font-bold text-white transition active:scale-[0.98] disabled:bg-inactive disabled:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "h-14 rounded-lg border-[1.5px] border-border bg-transparent px-4 text-base text-primary outline-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2";

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
      <span className="text-sm font-semibold text-primary">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
