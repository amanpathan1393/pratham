"use client";

import { useState, type ComponentType } from "react";
import { playChime } from "@/lib/sound";
import { Choice } from "./Choice";

// The five stages are the 5E inquiry cycle. NOTE: the brief said "the FI
// methodology"; we read that as "5E". If the programme's own model is named
// differently, change STAGES (and the copy on the try page) only.
const STAGES = ["Engage", "Explore", "Explain", "Elaborate", "Evaluate"] as const;
type Stage = (typeof STAGES)[number];

type SceneProps = { predicted: string | null; onDone: () => void };

type PredictStep = {
  kind: "predict";
  stage: Stage;
  prompt: string;
  options: string[];
  answer: number;
  reveal?: string;
};
type CheckStep = {
  kind: "check";
  stage: Stage;
  prompt: string;
  options: string[];
  answer: number;
  right: string;
  hint: string;
};
type ExploreStep = {
  kind: "explore";
  stage: Stage;
  prompt: string;
  Scene: ComponentType<SceneProps>;
};
export type InquiryStep = PredictStep | CheckStep | ExploreStep;

/* ------------------------------ Science scene ------------------------------ */

// Distance is proportional to height (constant friction on the floor), so
// doubling the ramp height doubles the roll. Idealised, and labelled as such.
const RAMPS = [
  { label: "Low ramp", h: 14, cm: 40 },
  { label: "Medium ramp", h: 28, cm: 80 },
  { label: "High ramp", h: 42, cm: 120 },
];

function RampScene({ predicted, onDone }: SceneProps) {
  const [rolled, setRolled] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function roll() {
    if (rolled) return;
    setRolled(true);
    setTimeout(() => {
      setShowResult(true);
      onDone();
    }, 1700);
  }

  return (
    <div className="flex flex-col gap-3">
      {RAMPS.map((r) => (
        <div key={r.label} className="flex items-center gap-2">
          <span className="w-[68px] shrink-0 text-xs font-semibold">{r.label}</span>
          <div className="pub-lane">
            <svg
              className="absolute bottom-0 left-0"
              width="44"
              height="52"
              viewBox="0 0 44 52"
              aria-hidden="true"
            >
              <polygon
                points={`0,${52 - r.h} 44,52 0,52`}
                fill="#fdf3d6"
                stroke="#181717"
                strokeWidth="1.5"
              />
            </svg>
            <span
              className="pub-ball"
              style={{
                left: rolled ? `calc(44px + (100% - 64px) * ${r.cm / 120})` : "2px",
                top: rolled ? 34 : 52 - r.h - 16,
                transition: "left 1.4s cubic-bezier(.25,.6,.35,1) .25s, top .35s ease-in",
              }}
            />
            {rolled && (
              <span
                className="pub-fade-up absolute top-0 right-0 text-xs font-bold"
                style={{ animationDelay: "1.5s" }}
              >
                {r.cm} cm
              </span>
            )}
          </div>
        </div>
      ))}
      {!rolled && (
        <button type="button" className="pub-btn pub-btn-quiet" onClick={roll}>
          Roll a ball down each ramp
        </button>
      )}
      {showResult && (
        <p className="pub-notice pub-fade-up" data-tone="info">
          {predicted ? `You predicted "${predicted}". ` : ""}
          The high ramp sent the ball farthest, 120 cm. (An idealised model.)
        </p>
      )}
    </div>
  );
}

/* ------------------------------- Maths scene ------------------------------- */

const LAYER_COLORS = [
  "#f7be36",
  "#44bb97",
  "#ff318c",
  "#007acc",
  "#f7be36",
  "#44bb97",
  "#ff318c",
  "#007acc",
];
const MAX_LAYERS = 8;

function OddScene({ predicted, onDone }: SceneProps) {
  const [n, setN] = useState(0);

  function add() {
    if (n >= MAX_LAYERS) return;
    const next = n + 1;
    setN(next);
    if (next === 4) onDone();
  }

  const odds = Array.from({ length: n }, (_, i) => 2 * i + 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-auto w-full max-w-[220px]" style={{ minHeight: 24 }}>
        {n > 0 && (
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
            {Array.from({ length: n * n }, (_, k) => {
              const r = Math.floor(k / n);
              const c = k % n;
              const layer = Math.max(r, c);
              return (
                <span
                  key={`${r}-${c}`}
                  className={`pub-cell ${layer === n - 1 ? "pub-pop" : ""}`}
                  style={{ background: LAYER_COLORS[layer] }}
                />
              );
            })}
          </div>
        )}
      </div>
      <p className="text-center text-sm font-semibold">
        {n === 0 ? "Tap to add the first odd number" : `${odds.join(" + ")} = ${n * n}`}
      </p>
      {n > 0 && (
        <p className="pub-muted text-center text-xs">
          {n} × {n} square
        </p>
      )}
      <button
        type="button"
        className="pub-btn pub-btn-quiet"
        onClick={add}
        disabled={n >= MAX_LAYERS}
      >
        {n >= MAX_LAYERS ? "That's 8 layers" : `Add the next odd number (${2 * n + 1})`}
      </button>
      {n >= 4 && (
        <p className="pub-notice pub-fade-up" data-tone="info">
          {predicted ? `You predicted ${predicted}. ` : ""}
          The first four odd numbers add up to 16.
        </p>
      )}
    </div>
  );
}

/* ------------------------------- Experiments ------------------------------- */

export const EXPERIMENTS: Record<"science" | "maths", InquiryStep[]> = {
  science: [
    {
      kind: "predict",
      stage: "Engage",
      prompt:
        "A ball rolls down a ramp and keeps going across the floor. Which ramp do you think sends it farthest?",
      options: ["The low ramp", "The medium ramp", "The high ramp"],
      answer: 2,
    },
    {
      kind: "explore",
      stage: "Explore",
      prompt: "Let's find out.",
      Scene: RampScene,
    },
    {
      kind: "check",
      stage: "Explain",
      prompt: "What pattern do you see?",
      options: [
        "The higher the ramp, the farther it rolls",
        "Height makes no difference",
        "The lower the ramp, the farther it rolls",
      ],
      answer: 0,
      right:
        "Yes. A higher ramp gives the ball more speed at the bottom, so it travels farther.",
      hint: "Look at the three distances again.",
    },
    {
      kind: "predict",
      stage: "Elaborate",
      prompt: "What if we use a heavier ball on the same ramp?",
      options: ["It rolls farther", "About the same distance", "It rolls less far"],
      answer: 1,
      reveal:
        "On the same ramp and floor, a heavier ball rolls about the same distance. Weight is not what changes it.",
    },
    {
      kind: "check",
      stage: "Evaluate",
      prompt: "To make the ball roll about twice as far, what would you change?",
      options: [
        "Double the height of the ramp",
        "Use a ball twice as heavy",
        "Use a smaller ball",
      ],
      answer: 0,
      right:
        "Right. Going from the low ramp to the medium ramp doubled the height, and the distance doubled too, from 40 cm to 80 cm.",
      hint: "Think about what changed the distance in the Explore step.",
    },
  ],
  maths: [
    {
      kind: "predict",
      stage: "Engage",
      prompt: "Add the first four odd numbers: 1 + 3 + 5 + 7. What do you think you get?",
      options: ["12", "16", "20"],
      answer: 1,
    },
    {
      kind: "explore",
      stage: "Explore",
      prompt: "Build it. Each tap adds the next odd number as a new layer.",
      Scene: OddScene,
    },
    {
      kind: "check",
      stage: "Explain",
      prompt: "What pattern do you notice in the totals?",
      options: [
        "Every total is a square number: 1, 4, 9, 16...",
        "Every total is an even number",
        "The total doubles each time",
      ],
      answer: 0,
      right: "Yes. Adding the next odd number always completes a bigger square.",
      hint: "Look at the shape the layers make.",
    },
    {
      kind: "predict",
      stage: "Elaborate",
      prompt: "What would the first 10 odd numbers add up to?",
      options: ["55", "100", "20"],
      answer: 1,
      reveal: "It's 10 × 10 = 100. Ten layers make a 10 by 10 square.",
    },
    {
      kind: "check",
      stage: "Evaluate",
      prompt: "1 + 3 + 5 + 7 + 9 + 11 = ?",
      options: ["30", "36", "42"],
      answer: 1,
      right: "Right. Six layers make a 6 × 6 square, so the total is 36.",
      hint: "How many odd numbers are being added? That is the side of the square.",
    },
  ],
};

/* --------------------------------- Player ---------------------------------- */

export function InquiryPlayer({
  steps,
  onFinish,
}: {
  steps: InquiryStep[];
  onFinish: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [tried, setTried] = useState(false);
  const [exploreDone, setExploreDone] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const canAdvance = step.kind === "explore" ? exploreDone : picked !== null;
  const currentStage = finished ? STAGES.length : STAGES.indexOf(step.stage);

  function pickPredict(i: number) {
    if (picked !== null || step.kind !== "predict") return;
    setPicked(i);
    if (index === 0) setPrediction(step.options[i]);
  }

  function pickCheck(i: number) {
    if (picked !== null || step.kind !== "check") return;
    if (i === step.answer) {
      setPicked(i);
      playChime();
    } else {
      setWrong(i);
      setTried(true);
      setTimeout(() => setWrong(null), 500);
    }
  }

  function next() {
    if (isLast) {
      playChime();
      setFinished(true);
      onFinish();
      return;
    }
    setIndex(index + 1);
    setPicked(null);
    setWrong(null);
    setTried(false);
    setExploreDone(false);
  }

  const Scene = step.kind === "explore" ? step.Scene : null;

  return (
    <div className="pub-card flex flex-col gap-4 p-4">
      <ol className="pub-stages" aria-label="Inquiry cycle">
        {STAGES.map((s, i) => (
          <li
            key={s}
            data-done={i < currentStage}
            data-current={!finished && i === currentStage}
            aria-current={!finished && i === currentStage ? "step" : undefined}
          >
            {s}
          </li>
        ))}
      </ol>

      {finished ? (
        <div className="pub-pop py-3 text-center">
          <p className="text-lg font-bold">That&apos;s inquiry in action</p>
          <p className="pub-muted mt-2 text-[15px] leading-snug">
            You predicted, tested, explained, stretched the idea, and checked it. Experimento&apos;s
            resources are built to be inquiry-based and hands-on.
          </p>
        </div>
      ) : (
        <div key={index} className="pub-fade-up flex flex-col gap-3">
          <p className="text-[17px] leading-snug font-semibold">{step.prompt}</p>

          {step.kind === "predict" && (
            <>
              <div className="flex flex-col gap-2" role="radiogroup" aria-label="Your prediction">
                {step.options.map((o, i) => (
                  <Choice
                    key={o}
                    label={o}
                    selected={picked === i}
                    disabled={picked !== null}
                    state={picked !== null && step.reveal && i === step.answer ? "right" : undefined}
                    onSelect={() => pickPredict(i)}
                  />
                ))}
              </div>
              {picked !== null && step.reveal && (
                <p className="pub-notice pub-fade-up" data-tone="good">
                  {picked === step.answer ? "Nice, you predicted it. " : "Good try. "}
                  {step.reveal}
                </p>
              )}
            </>
          )}

          {step.kind === "check" && (
            <>
              <div className="flex flex-col gap-2" role="radiogroup" aria-label="Answer">
                {step.options.map((o, i) => (
                  <Choice
                    key={o}
                    label={o}
                    selected={picked === i}
                    disabled={picked !== null}
                    state={picked === i ? "right" : wrong === i ? "wrong" : undefined}
                    onSelect={() => pickCheck(i)}
                  />
                ))}
              </div>
              {picked !== null ? (
                <p className="pub-notice pub-fade-up" data-tone="good">
                  {step.right}
                </p>
              ) : (
                tried && (
                  <p className="pub-notice pub-fade-up" data-tone="hint">
                    Not quite. {step.hint}
                  </p>
                )
              )}
            </>
          )}

          {Scene && <Scene predicted={prediction} onDone={() => setExploreDone(true)} />}

          {canAdvance && (
            <button type="button" className="pub-btn pub-fade-up" onClick={next}>
              {isLast ? "Finish" : "Next"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
