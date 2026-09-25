// Shared by the public flow and the back room, so what a visitor picked and
// what the back room reports can never drift apart.

export const CHALLENGES = [
  {
    id: "cpa-fit",
    text: "The concrete, pictorial and abstract approach doesn't fit every concept, and it's hard to find examples students can relate to.",
    short: "Concrete-pictorial-abstract doesn't fit every concept",
  },
  {
    id: "language",
    text: "Digital resources are often only in English, when students would grasp a concept better in a language they speak, like Hindi or Marathi.",
    short: "Resources not in students' language",
  },
  {
    id: "lesson-fit",
    text: "It's hard to find resources that actually fit the lesson plan I'm teaching.",
    short: "Hard to find resources that fit the lesson plan",
  },
  {
    id: "crisp",
    text: "It's hard to find resources that are crisp, short and engaging.",
    short: "Hard to find crisp, engaging resources",
  },
  {
    id: "rote",
    text: "Many videos and digital resources lean towards rote learning and don't give students a taste of inquiry-based learning.",
    short: "Resources lean towards rote learning",
  },
] as const;

export const SUBJECTS = [
  { id: "science", label: "Science", emphasis: "Explore energy, environment, and health concepts hands-on" },
  { id: "maths", label: "Maths", emphasis: "Make abstract concepts concrete through inquiry" },
  {
    id: "both",
    label: "Both",
    emphasis:
      "Explore energy, environment, and health concepts hands-on, and make abstract concepts concrete through inquiry",
  },
] as const;

export const GRADES = ["6", "7", "8", "9", "10"] as const;

export const STUDENT_COUNTS = ["5-20", "20-40", "40-60", "60+"] as const;

export const NEXT_STEPS = [
  "I'd like to try this resource in my classroom",
  "I want to explore inquiry-based learning and bring it into my classroom",
  "Just keep me updated",
] as const;
