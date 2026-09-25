"use client";

import Link from "next/link";
import { useState } from "react";
import { Screen } from "../_components/Screen";

// Deliberately generic. These are classroom realities, not problems this
// page claims to solve one-to-one, so the supporting lines describe the
// situation and never mention Experimento.
// DRAFT COPY: the four headings are agreed; the supporting lines are ours.
// Ask Chinmay/Jagdeep to review before the event.
const REALITIES = [
  {
    title: "STEM often stays stuck in rote memorization",
    detail: "Facts get repeated back for the exam, while the reasoning behind them is easy to skip.",
  },
  {
    title: "Textbooks explain concepts learners never get to touch or test themselves",
    detail: "A diagram on a page is not the same as watching an idea behave in front of you.",
  },
  {
    title: "One pace for the whole classroom, whatever level each student is actually at",
    detail: "In one room, some learners are ahead and some are catching up, on the same lesson.",
  },
  {
    title: "Limited access to hands-on materials or lab equipment",
    detail: "Where equipment is scarce, experiments can end up being described rather than done.",
  },
];

export default function ChallengesPage() {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [everTapped, setEverTapped] = useState(false);

  function toggle(i: number) {
    setEverTapped(true);
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <Screen stage={2}>
      <header className="exp-fade-up">
        <h1 className="text-3xl leading-tight font-bold tracking-tight">
          Some realities of STEM teaching
        </h1>
        <p className="exp-muted mt-2 text-base">
          Tap any that sound familiar. Nothing to score, just a read-through.
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {REALITIES.map((item, i) => {
          const isOpen = open.has(i);
          return (
            <li
              key={item.title}
              className="exp-fade-up"
              style={{ animationDelay: `${120 + i * 110}ms` }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="exp-card w-full cursor-pointer px-4 py-4 text-left transition-colors"
                style={isOpen ? { borderColor: "var(--exp-blue)", background: "#f3f6ff" } : {}}
              >
                <span className="flex items-start gap-3">
                  <span
                    className="exp-mono mt-0.5 text-xs font-medium"
                    style={{ color: "var(--exp-blue)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-base leading-snug font-bold">{item.title}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none font-bold transition-transform duration-200"
                    style={{
                      color: "var(--exp-blue)",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </span>
                {isOpen && (
                  <span className="exp-reveal exp-muted mt-3 block pl-8 text-[15px] leading-snug">
                    {item.detail}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {everTapped && (
        <Link
          href="/experimento/about?from=fellow"
          className="exp-btn exp-btn-primary exp-fade-up"
        >
          Continue
        </Link>
      )}
    </Screen>
  );
}
