"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STEP1_STORAGE_KEY } from "@/lib/challenges";

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire to database once storage is set up.
    const submission = { ...form, challengeIds };
    void submission;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center dark:bg-black">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Thanks!
        </h1>
        <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
          We&apos;ll follow up with resources for what you picked.
        </p>
        <Link
          href="/"
          className="mt-4 text-sm font-medium text-zinc-900 underline dark:text-zinc-50"
        >
          Back to start
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-zinc-50 px-6 py-8 dark:bg-black">
      <Link
        href="/fellow/2"
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>

      <div className="mt-6">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full ${
                step <= CURRENT_STEP
                  ? "bg-zinc-900 dark:bg-zinc-50"
                  : "bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Step {CURRENT_STEP} of {TOTAL_STEPS}
        </p>
      </div>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Just a few details
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
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
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            What would help most right now?
          </legend>
          <div className="mt-2 flex flex-col gap-2.5">
            {HELP_OPTIONS.map((option) => {
              const isSelected = form.helpChoice === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => update("helpChoice", option)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border-2 px-5 py-3.5 text-left text-base font-semibold transition active:scale-[0.98] ${
                    isSelected
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!isValid}
          className="mt-2 w-full rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-zinc-900 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

const inputClass =
  "rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50";

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
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children}
    </label>
  );
}
