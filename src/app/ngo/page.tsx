"use client";

import Link from "next/link";
import { useState } from "react";
import { insertSubmission } from "@/lib/submissions";
import { pastelClass } from "@/lib/theme";

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
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          Thanks!
        </h1>
        <p className="max-w-sm text-navy/70">
          We&apos;ll be in touch about partnering with your organisation.
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
      <Link href="/" className="text-sm font-semibold text-navy/70">
        ← Back
      </Link>

      <div className="mt-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          Partner with us
        </h1>
        <p className="mt-2 leading-relaxed text-navy/70">
          Step by Step English gives your team everything needed to run a
          structured English programme, without building it from scratch.
        </p>

        <ul className="mt-4 flex flex-col gap-2.5">
          {CHECKLIST.map((item, index) => (
            <li
              key={item}
              className={`flex items-center gap-3 rounded-2xl ${pastelClass(
                index,
              )} px-4 py-3.5`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-navy">
                ✓
              </span>
              <span className="font-semibold text-navy">{item}</span>
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
          <legend className="text-sm font-semibold text-navy">
            Where you&apos;re hoping to use the programme
          </legend>
          <div className="mt-2 flex flex-col gap-2.5">
            {SETTING_OPTIONS.map((option, index) => (
              <Checkbox
                key={option}
                label={option}
                checked={form.settings.includes(option)}
                onChange={() => toggleInGroup("settings", option)}
                colorClass={pastelClass(index)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-navy">
            What you&apos;d like to explore
          </legend>
          <div className="mt-2 flex flex-col gap-2.5">
            {INTEREST_OPTIONS.map((option, index) => (
              <Checkbox
                key={option}
                label={option}
                checked={form.interests.includes(option)}
                onChange={() => toggleInGroup("interests", option)}
                colorClass={pastelClass(index)}
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

function Checkbox({
  label,
  checked,
  onChange,
  colorClass,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  colorClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left font-bold transition active:scale-[0.98] ${
        checked
          ? "border-navy bg-gold text-navy"
          : `border-transparent ${colorClass} text-navy`
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? "border-navy bg-navy" : "border-navy/30 bg-white"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  );
}
