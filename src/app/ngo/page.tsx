"use client";

import Link from "next/link";
import { useState } from "react";

const CHECKLIST = [
  "Ready-to-use learning content",
  "Structured lesson plans",
  "Facilitator support and training",
  "Assessment and monitoring tools",
  "Scope for contextual adaptation",
];

const SETTING_OPTIONS = [
  "Schools",
  "Learning centres",
  "Community settings",
  "Other",
];

const INTEREST_OPTIONS = [
  "Explore the curriculum",
  "Understand implementation",
  "Discuss a pilot",
  "Explore a larger partnership",
  "Speak to the team",
];

type FormState = {
  orgName: string;
  yourName: string;
  role: string;
  location: string;
  audience: string;
  settings: string[];
  interests: string[];
  contact: string;
};

const INITIAL_FORM: FormState = {
  orgName: "",
  yourName: "",
  role: "",
  location: "",
  audience: "",
  settings: [],
  interests: [],
  contact: "",
};

export default function NgoPage() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    form.orgName.trim() !== "" &&
    form.yourName.trim() !== "" &&
    form.contact.trim() !== "";

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleInGroup(key: "settings" | "interests", value: string) {
    setForm((prev) => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    // TODO: wire to database once storage is set up.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-3 bg-zinc-50 px-6 text-center dark:bg-black">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Thanks!
        </h1>
        <p className="max-w-sm text-zinc-600 dark:text-zinc-400">
          We&apos;ll be in touch about partnering with your organisation.
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
        href="/"
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Partner with us
        </h1>
        <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
          Step by Step English gives your team everything needed to run a
          structured English programme, without building it from scratch.
        </p>

        <ul className="mt-4 flex flex-col gap-2">
          {CHECKLIST.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-zinc-900 dark:text-zinc-50"
            >
              <span className="mt-0.5 text-green-600 dark:text-green-400">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Field label="Organisation name" required>
          <input
            type="text"
            required
            value={form.orgName}
            onChange={(e) => update("orgName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Your name" required>
          <input
            type="text"
            required
            value={form.yourName}
            onChange={(e) => update("yourName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Your role">
          <input
            type="text"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Location">
          <input
            type="text"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Who do you work with?">
          <input
            type="text"
            placeholder="e.g. Grades 3-5, ages 8-11"
            value={form.audience}
            onChange={(e) => update("audience", e.target.value)}
            className={inputClass}
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Where you&apos;re hoping to use the programme
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {SETTING_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={form.settings.includes(option)}
                onChange={() => toggleInGroup("settings", option)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            What you&apos;d like to explore
          </legend>
          <div className="mt-2 flex flex-col gap-2">
            {INTEREST_OPTIONS.map((option) => (
              <Checkbox
                key={option}
                label={option}
                checked={form.interests.includes(option)}
                onChange={() => toggleInGroup("interests", option)}
              />
            ))}
          </div>
        </fieldset>

        <Field label="Email or phone" required>
          <input
            type="text"
            required
            value={form.contact}
            onChange={(e) => update("contact", e.target.value)}
            className={inputClass}
          />
        </Field>

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

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 transition active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 shrink-0 accent-zinc-900 dark:accent-zinc-50"
      />
      <span>{label}</span>
    </label>
  );
}
