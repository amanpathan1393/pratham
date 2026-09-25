"use client";

import { useRouter } from "next/navigation";

const STAGES = ["Start", "Context", "Programme", "Connect"] as const;

// The one recurring device: a measurement ruler that marks where the visitor
// is. Every screen shows it, whichever path they took.
function Ruler({ stage }: { stage: 1 | 2 | 3 | 4 }) {
  return (
    <ol className="exp-ruler" aria-label={`Step ${stage} of 4: ${STAGES[stage - 1]}`}>
      {STAGES.map((label, i) => (
        <li
          key={label}
          data-done={i + 1 < stage}
          data-current={i + 1 === stage}
          aria-current={i + 1 === stage ? "step" : undefined}
        >
          {label}
        </li>
      ))}
    </ol>
  );
}

export function Screen({
  stage,
  showBack = true,
  children,
}: {
  stage: 1 | 2 | 3 | 4;
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
      <div className="flex min-h-11 items-center justify-between">
        {showBack ? (
          <button
            type="button"
            onClick={goBack}
            className="-ml-2 min-h-11 cursor-pointer px-2 text-sm font-bold"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <span className="exp-mono exp-muted text-[11px]">Experimento India</span>
      </div>
      <Ruler stage={stage} />
      {children}
    </main>
  );
}
