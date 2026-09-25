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
