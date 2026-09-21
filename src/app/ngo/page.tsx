"use client";

import Link from "next/link";
import { useState } from "react";
import { insertSubmission } from "@/lib/submissions";
import { ctaClass, listRowClass } from "@/lib/theme";
import { Honeypot } from "@/components/Honeypot";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [honeypot, setHoneypot] = useState("");

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
    const contact = form.contact.trim();
    const isEmail = contact.includes("@");
    try {
      await insertSubmission({
        path: "ngo",
        name: form.yourName,
        email: isEmail ? contact : null,
        phone: isEmail ? null : contact,
        role: form.role || null,
        ngo_org: form.orgName,
        ngo_location: form.location || null,
        ngo_audience: form.audience || null,
        ngo_settings: form.settings,
        ngo_explore: form.interests,
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
        <span className="animate-pop-in flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-teal">
          <BigCheckIcon />
        </span>
        <h1 className="animate-fade-in-up text-2xl font-bold tracking-tight text-primary">
          Thanks!
        </h1>
        <p className="max-w-sm text-secondary">
          We&apos;ll be in touch about partnering with your organisation.
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
        href="/"
        className="inline-block py-3.5 text-sm font-semibold text-secondary"
      >
        ← Back
      </Link>

      <div className="mt-6 animate-fade-in-up">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          Partner with us
        </h1>
        <p className="mt-2 leading-relaxed text-secondary">
          Step by Step English gives your team everything needed to run a
          structured English programme, without building it from scratch.
        </p>

        <ul className="mt-4 flex flex-col gap-3">
          {CHECKLIST.map((item, index) => (
            <li
              key={item}
              className="flex min-h-14 animate-fade-in-up items-center gap-3 rounded-xl bg-white px-4 py-4 shadow-sm"
              style={{ animationDelay: `${80 + index * 60}ms` }}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal text-white">
                <CheckIcon />
              </span>
              <span className="font-semibold text-primary">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <Honeypot value={honeypot} onChange={setHoneypot} />

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
          <legend className="text-sm font-semibold text-primary">
            Where you&apos;re hoping to use the programme
          </legend>
          <div className="mt-2 flex flex-col gap-3">
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
          <legend className="text-sm font-semibold text-primary">
            What you&apos;d like to explore
          </legend>
          <div className="mt-2 flex flex-col gap-3">
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

        {submitError && (
          <p className="text-sm font-medium text-red-600">
            Something went wrong, try again.
          </p>
        )}

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`mt-2 ${ctaClass}`}
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
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={listRowClass({ selected: checked })}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-[1.5px] text-teal transition-all duration-200 ${
          checked ? "animate-pop-in border-white bg-white" : "border-border"
        }`}
      >
        {checked && <CheckIcon />}
      </span>
      <span>{label}</span>
    </button>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
      <path
        d="M3 8l3.5 3.5L13 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BigCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
      <path
        d="M5 12l4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
