"use client";

import Link from "next/link";
import { useState } from "react";
import { ComprehensionActivity } from "@/components/ComprehensionActivity";
import { insertSubmission } from "@/lib/submissions";

export default function CuriousPage() {
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() === "" || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await insertSubmission({ path: "curious", email });
      setEmailSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-8">
      <Link href="/" className="text-sm font-semibold text-navy/70">
        ← Back
      </Link>

      <div className="mt-8 text-center">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-navy">
          See it in action
        </h1>
        <p className="mt-2 text-navy/70">
          Try this quick example from a Step by Step English lesson.
        </p>
      </div>

      <div className="mt-6">
        <ComprehensionActivity onCorrect={() => setIsCorrect(true)} />
      </div>

      {isCorrect && (
        <div className="mt-6 rounded-2xl bg-pastel-lavender p-5 text-center">
          <h2 className="font-heading text-lg font-bold text-navy">
            Want to see how this could fit your classroom?
          </h2>

          <Link
            href="/fellow"
            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-gold px-6 py-4 text-lg font-bold text-navy shadow-sm transition active:scale-[0.98]"
          >
            Yes, I&apos;m a Fellow
          </Link>

          {!showEmailForm && !emailSubmitted && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="mt-3 text-sm font-semibold text-navy/70 underline"
            >
              Just leave your email
            </button>
          )}

          {showEmailForm && !emailSubmitted && (
            <form
              onSubmit={handleEmailSubmit}
              className="mt-4 flex flex-col gap-3"
            >
              <input
                type="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 border-navy/15 bg-white px-4 py-3 text-base text-navy outline-none transition focus:border-navy"
              />
              <button
                type="submit"
                disabled={email.trim() === "" || isSubmitting}
                className="w-full rounded-2xl border-2 border-navy px-6 py-3 text-base font-bold text-navy transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-navy/20 disabled:text-navy/40"
              >
                {isSubmitting ? "Sending…" : "Send"}
              </button>
              {submitError && (
                <p className="text-sm font-medium text-red-600">
                  Something went wrong, try again.
                </p>
              )}
            </form>
          )}

          {emailSubmitted && (
            <p className="mt-4 text-sm text-navy/70">
              Thanks — we&apos;ll be in touch.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
