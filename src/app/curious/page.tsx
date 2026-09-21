"use client";

import Link from "next/link";
import { useState } from "react";
import { TasteExperience } from "@/components/TasteExperience";
import { insertSubmission } from "@/lib/submissions";
import { Honeypot } from "@/components/Honeypot";
import { ctaClass } from "@/lib/theme";

export default function CuriousPage() {
  const [tasteComplete, setTasteComplete] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() === "" || isSubmitting) return;
    if (honeypot.trim() !== "") {
      // Likely a bot: pretend success without writing to the database.
      setEmailSubmitted(true);
      return;
    }
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
      <Link
        href="/"
        className="inline-block py-3.5 text-sm font-semibold text-secondary"
      >
        ← Back
      </Link>

      <div className="mt-8 animate-fade-in-up text-center">
        <h1 className="text-2xl font-bold tracking-tight text-primary">
          See it in action
        </h1>
        <p className="mt-2 text-secondary">
          Try this quick example from a Step by Step English lesson.
        </p>
      </div>

      <div className="mt-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <TasteExperience onComplete={() => setTasteComplete(true)} />
      </div>

      {tasteComplete && (
        <div className="mt-6 animate-fade-in-up rounded-xl bg-gold/10 p-5 text-center shadow-sm">
          <h2 className="text-lg font-bold text-primary">
            Want to see how this could fit your classroom?
          </h2>

          <Link href="/fellow" className={`mt-4 ${ctaClass}`}>
            Yes, I&apos;m a Fellow
          </Link>

          {!showEmailForm && !emailSubmitted && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="mt-3 inline-block py-3.5 text-sm font-semibold text-secondary underline"
            >
              Just leave your email
            </button>
          )}

          {showEmailForm && !emailSubmitted && (
            <form
              onSubmit={handleEmailSubmit}
              className="mt-4 flex flex-col gap-3"
            >
              <Honeypot value={honeypot} onChange={setHoneypot} />
              <input
                type="email"
                required
                autoFocus
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-lg border-[1.5px] border-border bg-transparent px-4 text-base text-primary outline-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2"
              />
              <button
                type="submit"
                disabled={email.trim() === "" || isSubmitting}
                className="flex h-14 w-full items-center justify-center rounded-lg border-[1.5px] border-teal text-base font-bold text-teal transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-border disabled:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2"
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
            <p className="mt-4 text-sm text-secondary">
              Thanks — we&apos;ll be in touch.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
