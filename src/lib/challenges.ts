export type Challenge = {
  id: string;
  label: string;
  solution: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "reading-and-skill-levels",
    label: "Students at different reading levels, some below grade",
    solution:
      "We assess actual reading level first, not grade level, then teach sounds to words to sentences to paragraphs. Since learners are often at different points in that journey, we start with mixed groups and, after the midline assessment, regroup by level with a stronger learner leading each group, so teaching stays targeted for everyone.",
  },
  {
    id: "materials-and-prep-time",
    label: "Not enough materials or time to prepare lessons",
    solution:
      "A full kit is provided: session guides, videos, flashcards, assessment tools, and a handbook. Content is ready-to-teach, so tutors deliver rather than build lesson plans — this works even for tutors with only basic English competency.",
  },
  {
    id: "hesitant-to-speak",
    label: "Students hesitant to speak or make mistakes",
    solution:
      "Speaking builds gradually from Module 1, starting with self-introduction and family/school topics, well before becoming the full focus in Module 3.",
  },
  {
    id: "no-progress-tracking",
    label: "No way to track progress",
    solution:
      "Baseline, midline, and endline assessments show exactly how far each learner has moved.",
  },
  {
    id: "large-class-sizes",
    label: "Large class sizes",
    solution:
      "Small-group structure (25-30 classroom, 8-12 community) plus level grouping keeps attention personal.",
  },
  {
    id: "engagement-between-sessions",
    label: "Keeping kids engaged and attending regularly",
    solution:
      "Workbook games (spot-the-difference, crosswords) plus a practice website keep learners engaged between sessions.",
  },
];

// Which activity proves which kind of challenge, for routing the taste
// experience on fellow/2. Content/skill challenges get content-based proof
// (the game, or dialogue in the reveal); structural/logistics challenges get
// a fact-reveal about the mechanism itself instead, since a reading passage
// can't prove how a classroom gets split into groups.
const FACT_CHALLENGE_IDS = [
  "materials-and-prep-time",
  "no-progress-tracking",
  "large-class-sizes",
  "engagement-between-sessions",
];

export type ActivityPlan =
  | { kind: "game" }
  | { kind: "reveal" }
  | { kind: "facts"; challengeIds: string[] };

// Priority when a pick spans more than one type: reading-and-skill-levels
// (game) beats hesitant-to-speak (reveal) beats the structural set (facts).
// No pick at all defaults to the game, same as before.
export function selectActivity(challengeIds: string[]): ActivityPlan {
  if (challengeIds.length === 0 || challengeIds.includes("reading-and-skill-levels")) {
    return { kind: "game" };
  }
  if (challengeIds.includes("hesitant-to-speak")) {
    return { kind: "reveal" };
  }
  return {
    kind: "facts",
    challengeIds: FACT_CHALLENGE_IDS.filter((id) => challengeIds.includes(id)),
  };
}

export const STEP1_STORAGE_KEY = "step-by-step-english.fellow.step1-challenges";

// Set to true once PraDigi sign off on the solution copy above.
export const CONTENT_REVIEWED = false;
