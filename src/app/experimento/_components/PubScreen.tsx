"use client";

import { useRouter } from "next/navigation";

export function PubScreen({
  progress,
  showBack = true,
  children,
}: {
  progress?: { step: number; total: number };
  showBack?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/experimento");
  }

  return (
    <main className="flex flex-1 flex-col gap-6">
      <div>
        <div className="flex min-h-11 items-center justify-between">
          {showBack ? (
            <button
              type="button"
              onClick={goBack}
              className="-ml-2 min-h-11 cursor-pointer px-2 text-sm font-semibold"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {progress && (
            <span className="pub-muted text-xs font-medium">
              Step {progress.step} of {progress.total}
            </span>
          )}
        </div>
        {progress && (
          <div
            className="pub-progress mt-1"
            role="progressbar"
            aria-label={`Step ${progress.step} of ${progress.total}`}
            aria-valuemin={1}
            aria-valuemax={progress.total}
            aria-valuenow={progress.step}
          >
            <span style={{ width: `${(progress.step / progress.total) * 100}%` }} />
          </div>
        )}
      </div>
      {children}
    </main>
  );
}
