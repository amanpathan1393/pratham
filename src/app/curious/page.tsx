"use client";

import Link from "next/link";
import { useState } from "react";
import { ComprehensionActivity } from "@/components/ComprehensionActivity";

export default function CuriousPage() {
  const [isCorrect, setIsCorrect] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() === "") return;
    // TODO: wire to database once storage is set up.
    setEmailSubmitted(true);
  }

  return (
    <main className="flex min-h-dvh flex-1 flex-col bg-zinc-50 px-6 py-8 dark:bg-black">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-500 dark:text-zinc-400"
      >
        ← Back
      </Link>

      <div className="mt-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          See it in action
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Try this quick example from a Step by Step English lesson.
        </p>
      </div>

      <div className="mt-6">
        <ComprehensionActivity onCorrect={() => setIsCorrect(true)} />
      </div>

      {isCorrect && (
        <div className="mt-6 rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Want to see how this could fit your classroom?
          </h2>

          <Link
            href="/fellow"
            className="mt-4 flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-6 py-4 text-lg font-semibold text-white transition active:scale-[0.98] dark:bg-zinc-50 dark:text-zinc-900"
          >
            Yes, I&apos;m a Fellow
          </Link>

          {!showEmailForm && !emailSubmitted && (
            <button
              type="button"
              onClick={() => setShowEmailForm(true)}
              className="mt-3 text-sm font-medium text-zinc-500 underline dark:text-zinc-400"
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
                className="rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
              />
              <button
                type="submit"
                disabled={email.trim() === ""}
                className="w-full rounded-2xl border-2 border-zinc-900 px-6 py-3 text-base font-semibold text-zinc-900 transition disabled:cursor-not-allowed disabled:border-zinc-300 disabled:text-zinc-400 dark:border-zinc-50 dark:text-zinc-50 dark:disabled:border-zinc-800 dark:disabled:text-zinc-600"
              >
                Send
              </button>
            </form>
          )}

          {emailSubmitted && (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Thanks — we&apos;ll be in touch.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
