// Every line below comes from confirmed Experimento content; nothing here
// is embellished. Update in one place and both /about and /partner follow.
//
// RESOURCE COUNT: "400+" is from our own event note, as of 2026-09-25.
// Public press material from Mar 2026 says "250+". If Chinmay confirms a
// different number, change RESOURCE_COUNT only.
const RESOURCE_COUNT = "400+";

// The dot colors are the portal's accent palette, used decoratively.
const DOMAINS = [
  { label: "Energy", color: "#f7be36" },
  { label: "Environment", color: "#44bb97" },
  { label: "Health", color: "#ff318c" },
  { label: "Mathematics", color: "#007acc" },
];

const LANGUAGES = ["English", "Hindi", "Marathi", "Tamil", "Kannada"];

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
    <div className="pub-card overflow-hidden">
      <ul className="pub-facts">
        <li>
          <span className="pub-eyebrow">Resources</span>
          <div>
            <p className="text-3xl leading-none font-bold">{RESOURCE_COUNT}</p>
            <p className="pub-muted mt-1 text-[15px]">open educational resources</p>
          </div>
        </li>
        <li>
          <span className="pub-eyebrow">Domains</span>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((d) => (
              <span key={d.label} className="pub-chip">
                <i style={{ background: d.color }} />
                {d.label}
              </span>
            ))}
          </div>
        </li>
        <li>
          <span className="pub-eyebrow">Languages</span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <span key={l} className="pub-chip">
                {l}
              </span>
            ))}
          </div>
        </li>
        <li>
          <span className="pub-eyebrow">Aligned to</span>
          <p className="text-[15px] font-medium">NCERT and Maharashtra State syllabus</p>
        </li>
        <li>
          <span className="pub-eyebrow">Approach</span>
          <p className="text-[15px] font-medium">
            Inquiry-based and hands-on. Most resources take 3 to 5 minutes.
          </p>
        </li>
        <li>
          <span className="pub-eyebrow">Formats</span>
          <div className="flex flex-col gap-1 text-[15px] font-medium">
            {FORMATS.map((f) => (
              <p key={f}>{f}</p>
            ))}
          </div>
        </li>
        <li>
          <span className="pub-eyebrow">Works on</span>
          <p className="text-[15px] font-medium">
            Phone, laptop, or printed for low-internet settings.
          </p>
        </li>
      </ul>
    </div>
  );
}
