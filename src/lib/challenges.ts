export type Challenge = {
  id: string;
  label: string;
  solution: string;
};

// Order here is also the priority order used when picking which proof path
// appears first on fellow/2 if two challenges were selected — see
// CHALLENGE_ORDER in components/ChallengeProof.tsx, which must stay in sync
// with this order.
export const CHALLENGES: Challenge[] = [
  {
    id: "reading-and-skill-levels",
    label: "Students at different reading levels, some below grade",
    solution:
      "We assess actual reading level first, not grade level, then teach sounds to words to sentences to paragraphs. Since learners are often at different points in that journey, we start with mixed groups and, after the midline assessment, regroup by level with a stronger learner leading each group, so teaching stays targeted for everyone.",
  },
  {
    id: "hesitant-to-speak",
    label: "Students hesitant to speak or make mistakes",
    solution:
      "Speaking builds gradually from Module 1, starting with self-introduction and family/school topics, well before becoming the full focus in Module 3.",
  },
  {
    id: "materials-and-prep-time",
    label: "Not enough materials or time to prepare lessons",
    solution:
      "A full kit is provided: session guides, videos, flashcards, assessment tools, and a handbook. Content is ready-to-teach, so tutors deliver rather than build lesson plans — this works even for tutors with only basic English competency.",
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

export const STEP1_STORAGE_KEY = "step-by-step-english.fellow.step1-challenges";

// Set to true once PraDigi sign off on the solution copy above.
export const CONTENT_REVIEWED = false;
