"use client";

import { useEffect, useState, type ComponentType } from "react";
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

/* ------------------------------ Fractions scene ----------------------------- */

const PARTS = [2, 3, 4, 6, 8];

// Every bar is the same whole. Tapping one cuts it into equal parts and
// shrinks the shaded piece to show a single part, so the learner can see
// (and compare) how the size of one part changes as the cuts increase.
function FractionScene({ predicted, onDone }: SceneProps) {
  const [cut, setCut] = useState<number[]>([]);

  function doCut(d: number) {
    setCut((prev) => (prev.includes(d) ? prev : [...prev, d]));
  }

  // Three different bars cut is enough to compare and move on.
  const enough = cut.length >= 3;
  useEffect(() => {
    if (enough) onDone();
  }, [enough, onDone]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span className="w-[62px] shrink-0 text-xs font-semibold">1 whole</span>
        <div className="pub-frac" aria-hidden="true">
          <span className="pub-frac-piece" style={{ width: "100%" }} />
        </div>
        <span className="w-9 shrink-0" />
      </div>
      {PARTS.map((d) => {
        const isCut = cut.includes(d);
        return (
          <div key={d} className="flex items-center gap-2">
            <span className="w-[62px] shrink-0 text-xs font-semibold">{d} parts</span>
            <button
              type="button"
              className="pub-frac"
              onClick={() => doCut(d)}
              aria-label={
                isCut ? `One of ${d} equal parts is shaded` : `Cut the whole into ${d} equal parts`
              }
            >
              <span className="pub-frac-piece" style={{ width: isCut ? `${100 / d}%` : "100%" }} />
              {Array.from({ length: d - 1 }, (_, k) => (
                <span
                  key={k}
                  className="pub-frac-line"
                  style={{ left: `${((k + 1) / d) * 100}%`, opacity: isCut ? 1 : 0 }}
                />
              ))}
              {!isCut && <span className="pub-frac-hint">Tap to cut into {d} equal parts</span>}
            </button>
            <span className="w-9 shrink-0 text-xs font-bold">
              {isCut && <span className="pub-fade-up">1/{d}</span>}
            </span>
          </div>
        );
      })}
      {enough && (
        <p className="pub-notice pub-fade-up" data-tone="info">
          {predicted ? `You predicted "${predicted}". ` : ""}
          Compare the shaded pieces. The whole stays the same size, but the more parts we cut it
          into, the smaller each part gets.
        </p>
      )}
    </div>
  );
}

/* ------------------------------ Circuit scene ------------------------------ */

const OBJECTS = [
  { id: "coin", label: "Coin", color: "#c9a227", conducts: true },
  { id: "key", label: "Iron key", color: "#8a8f98", conducts: true },
  { id: "foil", label: "Aluminium foil", color: "#cfd3d8", conducts: true },
  { id: "eraser", label: "Rubber eraser", color: "#ff8fb3", conducts: false },
  { id: "ruler", label: "Plastic ruler", color: "#5ec2ff", conducts: false },
  { id: "stick", label: "Wooden stick", color: "#b98a5b", conducts: false },
];

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

// A battery and a bulb joined by wire, with a gap in the loop. Whatever the
// learner drops into the gap either completes the circuit (bulb lights) or
// doesn't. Empty gap = open circuit = no light.
function CircuitScene({ onDone }: SceneProps) {
  const [current, setCurrent] = useState<string | null>(null);
  const [tested, setTested] = useState<string[]>([]);

  const obj = OBJECTS.find((o) => o.id === current) ?? null;
  const lit = !!obj?.conducts;

  function place(id: string) {
    setCurrent(id);
    setTested((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  const enough = tested.length >= 4;
  useEffect(() => {
    if (enough) onDone();
  }, [enough, onDone]);

  const litObjects = OBJECTS.filter((o) => tested.includes(o.id) && o.conducts);
  const darkObjects = OBJECTS.filter((o) => tested.includes(o.id) && !o.conducts);

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox="0 0 300 150"
        className="w-full"
        role="img"
        aria-label={
          obj
            ? `Circuit with ${obj.label} in the gap. The bulb is ${lit ? "on" : "off"}.`
            : "Circuit with an empty gap. The bulb is off."
        }
      >
        <g fill="none" stroke="#181717" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M31 55 V30 H269 V52" />
          <path d="M269 107 V125 H185" />
          <path d="M115 125 H31 V95" />
        </g>
        {lit && (
          <path
            className="pub-flow"
            d="M31 55 V30 H269 V52 M269 107 V125 H31 V95"
            fill="none"
            stroke="#f7be36"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 9"
          />
        )}

        <rect x="19" y="55" width="24" height="40" rx="3" fill="#181717" />
        <rect x="26" y="50" width="10" height="6" rx="1" fill="#181717" />
        <text x="31" y="80" fontSize="15" fontWeight="700" fill="#f7be36" textAnchor="middle">
          +
        </text>

        {lit && <circle cx="269" cy="77" r="34" fill="#f7be36" className="pub-glow" />}
        {lit &&
          RAYS.map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const x = (r: number) => (269 + r * Math.sin(rad)).toFixed(1);
            const y = (r: number) => (77 - r * Math.cos(rad)).toFixed(1);
            return (
              <line
                key={deg}
                x1={x(27)}
                y1={y(27)}
                x2={x(36)}
                y2={y(36)}
                stroke="#f7be36"
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
        <circle
          cx="269"
          cy="77"
          r="22"
          fill={lit ? "#f7be36" : "#fff"}
          stroke="#181717"
          strokeWidth="3"
        />
        <path
          d="M261 90 V80 L265 72 L269 80 L273 72 L277 80 V90"
          fill="none"
          stroke="#181717"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect x="259" y="99" width="20" height="8" rx="2" fill="#181717" />

        <circle cx="115" cy="125" r="4" fill="#181717" />
        <circle cx="185" cy="125" r="4" fill="#181717" />
        {obj ? (
          <g>
            <rect x="112" y="117" width="76" height="16" rx="4" fill={obj.color} stroke="#181717" strokeWidth="2" />
            <text x="150" y="106" fontSize="11" fontWeight="600" textAnchor="middle" fill="#181717">
              {obj.label}
            </text>
          </g>
        ) : (
          <text x="150" y="112" fontSize="11" fontWeight="600" textAnchor="middle" fill="#6b7280">
            gap
          </text>
        )}
      </svg>

      <p className="pub-notice" data-tone={obj ? (lit ? "good" : "hint") : "info"}>
        {obj
          ? lit
            ? `${obj.label}: the bulb lights.`
            : `${obj.label}: no light.`
          : "The loop has a gap, so the bulb is off. Put an object in the gap."}
      </p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Objects to test">
        {OBJECTS.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={current === o.id}
            onClick={() => place(o.id)}
            className="pub-pill"
          >
            <span
              className="mr-2 inline-block h-3 w-3 rounded-full"
              style={{ background: o.color, border: "1.5px solid #181717" }}
              aria-hidden="true"
            />
            {o.label}
          </button>
        ))}
        <button type="button" className="pub-pill" onClick={() => setCurrent(null)}>
          Empty gap
        </button>
      </div>

      {tested.length > 0 && (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="pub-card p-3">
            <p className="pub-eyebrow mb-1">Lit the bulb</p>
            <p className="font-medium">{litObjects.length ? litObjects.map((o) => o.label).join(", ") : "None yet"}</p>
          </div>
          <div className="pub-card p-3">
            <p className="pub-eyebrow mb-1">Did not</p>
            <p className="font-medium">{darkObjects.length ? darkObjects.map((o) => o.label).join(", ") : "None yet"}</p>
          </div>
        </div>
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

/* --------------------------------- Topics ---------------------------------- */

export type TopicId = "circuits" | "ramp" | "fractions" | "odd-numbers";

export type Topic = {
  id: TopicId;
  subject: "science" | "maths";
  title: string;
  blurb: string;
  steps: InquiryStep[];
};

export const TOPICS: Topic[] = [
  {
    id: "circuits",
    subject: "science",
    title: "Light a bulb",
    blurb: "Which materials let electricity flow?",
    steps: [
      {
        kind: "predict",
        stage: "Engage",
        prompt: "A battery, a bulb and some wire. Which set-up lights the bulb?",
        options: [
          "Wire from the battery to the bulb, with the other end left open",
          "Wire that makes a complete loop from the battery, through the bulb, and back",
          "A bulb placed next to the battery, with no wire",
        ],
        answer: 1,
      },
      {
        kind: "explore",
        stage: "Explore",
        prompt:
          "This loop has a gap. Put different objects in the gap and watch the bulb. Try at least four.",
        Scene: CircuitScene,
      },
      {
        kind: "check",
        stage: "Explain",
        prompt: "What do the objects that lit the bulb have in common?",
        options: ["They are all metals", "They are all heavy", "They are all hard"],
        answer: 0,
        right:
          "Yes. Metals let electricity flow through them. Rubber, plastic and wood did not, so the bulb stayed off.",
        hint: "Compare the aluminium foil, which is light, with the wooden stick, which is hard.",
      },
      {
        kind: "predict",
        stage: "Elaborate",
        prompt: "Electric wires are covered in plastic. Why?",
        options: [
          "Metal carries the electricity, and plastic keeps it in and keeps us safe",
          "So the wire looks nicer",
          "So the wire is heavier",
        ],
        answer: 0,
        reveal:
          "The metal inside carries the electricity. The plastic covering does not, so it keeps us safe.",
      },
      {
        kind: "check",
        stage: "Evaluate",
        prompt: "You are making a switch. Which handle is safest to touch?",
        options: ["A rubber handle", "A steel handle", "A copper handle"],
        answer: 0,
        right: "Right. Rubber does not let electricity through, so it protects your hand.",
        hint: "Which material kept the bulb off?",
      },
    ],
  },
  {
    id: "ramp",
    subject: "science",
    title: "Roll a ball",
    blurb: "Does the height of a ramp change how far a ball rolls?",
    steps: [
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
  },
  {
    id: "fractions",
    subject: "maths",
    title: "Cut a whole",
    blurb: "Is a third bigger than a quarter?",
    steps: [
      {
        kind: "predict",
        stage: "Engage",
        prompt:
          "Two rotis of the same size. One is shared equally among 3 friends, the other among 4 friends. Who gets the bigger piece?",
        options: ["Each of the 3 friends", "Each of the 4 friends", "Both get the same"],
        answer: 0,
      },
      {
        kind: "explore",
        stage: "Explore",
        prompt: "Cut the same whole into more and more equal parts. Tap at least three bars and compare the shaded piece.",
        Scene: FractionScene,
      },
      {
        kind: "check",
        stage: "Explain",
        prompt: "What pattern do you see?",
        options: [
          "More equal parts means each part is smaller",
          "More equal parts means each part is bigger",
          "The size of a part doesn't change",
        ],
        answer: 0,
        right:
          "Yes. The whole stays the same size, so cutting it into more equal parts makes each part smaller. That's why 1/3 is bigger than 1/4.",
        hint: "Compare the shaded piece in the 2 parts bar with the one in the 8 parts bar.",
      },
      {
        kind: "predict",
        stage: "Elaborate",
        prompt: "Which is bigger, 3/8 or 1/2?",
        options: ["3/8", "1/2", "They are equal"],
        answer: 1,
        reveal:
          "1/2 is the same as 4/8, which is more than 3/8. Half of the bar is longer than three eighths of it.",
      },
      {
        kind: "check",
        stage: "Evaluate",
        prompt: "Which is the biggest piece?",
        options: ["1/8", "1/5", "1/3"],
        answer: 2,
        right:
          "Right. Thirds are the biggest here, because the whole is cut into the fewest parts.",
        hint: "Which whole is cut into the fewest equal parts?",
      },
    ],
  },
  {
    id: "odd-numbers",
    subject: "maths",
    title: "Build squares",
    blurb: "What do odd numbers add up to?",
    steps: [
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
  },
];

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
