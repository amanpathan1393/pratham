"use client";

import Link from "next/link";
import { useState } from "react";
import { FastestFingerGame } from "@/components/FastestFingerGame";
import { SpotTheDifference } from "@/components/SpotTheDifference";
import { RegroupClass } from "@/components/RegroupClass";
import { markKindPlayed, ACCENT } from "@/components/ChallengeProof";
import { insertActivityResult } from "@/lib/activityResults";
import { insertSubmission } from "@/lib/submissions";
import { Honeypot } from "@/components/Honeypot";
import { ctaClass } from "@/lib/theme";

type SampleKind = "game" | "spot-the-difference" | "regroup";

export default function CuriousPage() {
  const [doneKinds, setDoneKinds] = useState<Set<SampleKind>>(new Set());
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const tasteStarted = doneKinds.size > 0;

  function markDone(kind: SampleKind) {
    markKindPlayed(kind);
    setDoneKinds((prev) => new Set(prev).add(kind));
  }

  function handleGameComplete(result: "won" | "timeout") {
    // Best-effort analytics ping; never blocks the UI on failure.
    insertActivityResult({ path: "curious", kind: "game", result }).catch(() => {});
    markDone("game");
  }

  function handleSpotTheDifferenceComplete(result: "won" | "timeout") {
    insertActivityResult({ path: "curious", kind: "spot-the-difference", result }).catch(
      () => {},
    );
    markDone("spot-the-difference");
  }

  function handleRegroupComplete() {
    insertActivityResult({ path: "curious", kind: "regroup", result: "completed" }).catch(
      () => {},
    );
    markDone("regroup");
  }

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
          Step by Step English is a structured English programme TFI Fellows run in their own
          classrooms. Try a few of the real activities learners actually use below.
        </p>
      </div>

      <div
        className="mt-6 flex animate-fade-in-up flex-col gap-6"
        style={{ animationDelay: "100ms" }}
      >
        <ActivityCard
          accent="teal"
          label="Fastest Finger First"
          caption="What daily reading practice looks like"
        >
          <FastestFingerGame onComplete={handleGameComplete} />
        </ActivityCard>

        <ActivityCard
          accent="gold"
          label="Spot the difference"
          caption="A real workbook game, word-family style"
        >
          <SpotTheDifference onComplete={handleSpotTheDifferenceComplete} />
        </ActivityCard>

        <ActivityCard
          accent="teal"
          label="Regroup by level"
          caption="How one classroom becomes small groups"
        >
          <RegroupClass onComplete={handleRegroupComplete} />
        </ActivityCard>
      </div>

      {tasteStarted && (
        <div className="mt-6 animate-fade-in-up rounded-xl bg-gold/10 p-5 text-center shadow-sm">
          <h2 className="text-lg font-bold text-primary">
            Want to see how this could fit your classroom?
          </h2>
          <p className="mt-1 text-sm text-secondary">
            Leave your email and we&apos;ll follow up.
          </p>

          {!showEmailForm && !emailSubmitted && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className={`mt-4 ${ctaClass}`}
            >
              Leave your email
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

function ActivityCard({
  accent,
  label,
  caption,
  children,
}: {
  accent: keyof typeof ACCENT;
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  const a = ACCENT[accent];
  return (
    <div className={`rounded-2xl border-2 ${a.border} bg-[#fdfcfa] p-4 sm:p-5`}>
      <div className="mb-1 flex items-center gap-2">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
        <p className={`text-xs font-bold tracking-wide uppercase ${a.label}`}>{label}</p>
      </div>
      <p className="mb-3 text-xs font-semibold tracking-wide text-secondary uppercase">
        {caption}
      </p>
      {children}
    </div>
  );
}
