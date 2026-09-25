// Every line below comes from confirmed Experimento content; nothing here
// is embellished. Update in one place and both /about and /partner follow.
//
// RESOURCE COUNT: "400+" is from our own event note, as of 2026-09-25.
// Public press material from Mar 2026 says "250+". If Chinmay confirms a
// different number, change RESOURCE_COUNT only.
const RESOURCE_COUNT = "400+";

const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Kannada"];
const DOMAINS = ["Energy", "Environment", "Health", "Mathematics"];

const FORMATS = [
  "Activity videos",
  "Explanatory videos",
  "Audio",
  "Teacher lesson plans",
  "Student worksheets",
  "Question banks",
  "Interactive and game-based material",
];

export function ProgrammeFacts() {
  return (
    <div className="exp-card overflow-hidden">
      <ul className="exp-spec">
        <li>
          <span className="exp-mono">Resources</span>
          <div>
            <p className="text-3xl leading-none font-bold">{RESOURCE_COUNT}</p>
            <p className="exp-muted mt-1 text-[15px]">open educational resources</p>
          </div>
        </li>
        <li>
          <span className="exp-mono">Domains</span>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <span key={d} className="exp-chip">
                {d}
              </span>
            ))}
          </div>
        </li>
        <li>
          <span className="exp-mono">Languages</span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <span key={l} className="exp-chip">
                {l}
              </span>
            ))}
          </div>
        </li>
        <li>
          <span className="exp-mono">Aligned to</span>
          <p className="text-[15px] font-semibold">NCERT and Maharashtra State syllabus</p>
        </li>
        <li>
          <span className="exp-mono">Approach</span>
          <p className="text-[15px] font-semibold">
            Inquiry-based and hands-on. Most resources take 3 to 5 minutes.
          </p>
        </li>
        <li>
          <span className="exp-mono">Formats</span>
          <div className="flex flex-col gap-1 text-[15px] font-semibold">
            {FORMATS.map((f) => (
              <p key={f}>{f}</p>
            ))}
          </div>
        </li>
        <li>
          <span className="exp-mono">Works on</span>
          <p className="text-[15px] font-semibold">
            Phone, laptop, or printed for low-internet settings.
          </p>
        </li>
        <li>
          <span className="exp-mono">Built by</span>
          <p className="text-[15px] font-semibold">
            An in-house team over 3 years: content creators, translators, voiceover artists, and
            animators.
          </p>
        </li>
      </ul>
    </div>
  );
}
