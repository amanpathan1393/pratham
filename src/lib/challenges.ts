export type Challenge = {
  id: string;
  label: string;
  solution: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "reading-below-grade",
    label: "Students reading below grade level",
    solution:
      "We assess actual reading level first, not grade level, then teach sounds to words to sentences to paragraphs. Most learners read real sentences by day 4-5.",
  },
  {
    id: "skill-gaps",
    label: "Big skill gaps within the same classroom",
    solution:
      "Start with mixed groups. After midline, regroup by level with a stronger learner leading each group.",
  },
  {
    id: "materials",
    label: "Not enough teaching materials or resources",
    solution:
      "Full kit provided: session guides, videos, flashcards, assessment tools, handbook.",
  },
  {
    id: "prep-time",
    label: "Little time to prepare lessons",
    solution:
      "Content is ready-to-teach. Tutors deliver, they don't build lesson plans. Works even for tutors with only basic English competency.",
  },
  {
    id: "speaking-hesitant",
    label: "Students hesitant to speak or make mistakes in English",
    solution:
      "Speaking builds gradually from Module 1, starting with self-introduction and family/school topics, well before becoming the full focus in Module 3.",
  },
  {
    id: "attendance",
    label: "Irregular attendance or high dropout",
    solution:
      "Workbook games (spot-the-difference, crosswords) plus a practice website keep learners engaged between sessions.",
  },
  {
    id: "tracking",
    label: "No way to track each student's progress",
    solution:
      "Baseline, midline, and endline assessments show exactly how far each learner has moved.",
  },
  {
    id: "class-size",
    label: "Large class sizes, hard to give individual attention",
    solution:
      "Small-group structure (25-30 classroom, 8-12 community) plus level grouping keeps attention personal.",
  },
  {
    id: "lack-of-exposure",
    label: "Not enough exposure to English outside class",
    solution:
      "Practice website and digital flashcards give learners a way to engage with English between sessions, not just during them.",
  },
  {
    id: "no-english-speaker",
    label: "No natural English speaker nearby",
    solution:
      "Doesn't depend on tutor fluency. The structured, phonic method lets a tutor with only basic English competency teach correctly using the TLM, not personal English skill.",
  },
];

export const STEP1_STORAGE_KEY = "step-by-step-english.fellow.step1-challenges";

// Set to true once Pratham/PraDigi sign off on the solution copy above.
export const CONTENT_REVIEWED = false;
