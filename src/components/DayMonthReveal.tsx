"use client";

import { useEffect, useState } from "react";

export function DayMonthReveal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex flex-col gap-3 transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div
          className="flex-1 rounded-xl p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: "#EFEBE3" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            Day 1
          </p>
          <p className="mt-2 text-primary">
            &quot;This is a box of white paint.&quot;
          </p>
        </div>

        <div
          className="flex-1 rounded-xl p-4 shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
          style={{ background: "#F5E6C8" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
            Month 9
          </p>
          <p className="mt-2 text-primary">
            &quot;Just then, Reema entered the room. &apos;There is a lizard
            on my desk!&apos; Raj said. &apos;Don&apos;t worry, I will help
            you,&apos; Reema said.&quot;
          </p>
        </div>
      </div>

      <p className="text-center font-semibold text-primary">
        Same student. Nine months apart.
      </p>
      <p className="text-center text-xs text-muted">
        From Step by Step English, Module 3, Session 10.
      </p>
    </div>
  );
}
