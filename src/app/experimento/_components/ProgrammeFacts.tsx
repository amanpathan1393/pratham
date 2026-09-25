// Every fact below comes from confirmed Experimento content; nothing here
// is embellished. Update in one place and both /about and /partner follow.
//
// RESOURCE COUNT: "400+" is from our own event note, as of 2026-09-25.
// Public press material from Mar 2026 says "250+". If Chinmay confirms a
// different number, change RESOURCE_COUNT only.
const RESOURCE_COUNT = "400+";

// Icons are simple 24px stroke paths. The domain colors are the portal's
// accent palette, used decoratively.
type IconPath = string[];

const DOMAINS: { label: string; color: string; icon: IconPath }[] = [
  { label: "Energy", color: "#f7be36", icon: ["M13 2L4 14h7l-1 8 9-12h-7l1-8z"] },
  { label: "Environment", color: "#44bb97", icon: ["M5 19c0-9 5-14 15-14 0 10-5 15-14 15", "M5 19l8-8"] },
  {
    label: "Health",
    color: "#ff318c",
    icon: ["M12 20.5S3 14.7 3 8.7A4.7 4.7 0 0 1 12 6.6a4.7 4.7 0 0 1 9 2.1c0 6-9 11.8-9 11.8z"],
  },
  { label: "Mathematics", color: "#007acc", icon: ["M5 12h6", "M8 9v6", "M14 9h5", "M14 15h5"] },
];

// Native script beside the English name.
const LANGUAGES = [
  { native: "English", name: "English", lang: "en" },
  { native: "हिन्दी", name: "Hindi", lang: "hi" },
  { native: "मराठी", name: "Marathi", lang: "mr" },
  { native: "தமிழ்", name: "Tamil", lang: "ta" },
  { native: "ಕನ್ನಡ", name: "Kannada", lang: "kn" },
];

const FORMATS: { label: string; icon: IconPath }[] = [
  { label: "Activity videos", icon: ["M4 6h16v12H4z", "M10.5 9.5v5l4-2.5z"] },
  { label: "Explanatory videos", icon: ["M4 6h16v12H4z", "M8 10h8", "M8 14h5"] },
  { label: "Audio", icon: ["M4 9v6h4l5 4V5L8 9H4z", "M16.5 9a4 4 0 0 1 0 6"] },
  { label: "Teacher lesson plans", icon: ["M7 3h7l4 4v14H7z", "M14 3v4h4", "M10 12h5", "M10 16h5"] },
  { label: "Student worksheets", icon: ["M4 20l1-4L16 5l3 3L8 19z", "M14 7l3 3"] },
  {
    label: "Question banks",
    icon: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M9.6 9.3a2.5 2.5 0 1 1 3.9 2c-.9.6-1.5 1.1-1.5 2.2", "M12 16.6v.1"],
  },
];

const GAME_ICON: IconPath = [
  "M7 9h10a4 4 0 0 1 4 4v2a3 3 0 0 1-5 2l-1-1H9l-1 1a3 3 0 0 1-5-2v-2a4 4 0 0 1 4-4z",
  "M8 12v3",
  "M6.5 13.5h3",
  "M16 13h.01",
  "M18 14.5h.01",
];

const DEVICES: { label: string; icon: IconPath }[] = [
  { label: "Phone", icon: ["M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z", "M11 18h2"] },
  { label: "Laptop", icon: ["M5 6h14v9H5z", "M3 18h18"] },
  { label: "Printed", icon: ["M7 8V4h10v4", "M7 17H5v-6h14v6h-2", "M7 14h10v6H7z"] },
];

function Icon({ paths, size = 20 }: { paths: IconPath; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function Block({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <section className="pub-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="pub-eyebrow mb-2">{title}</h3>
      {children}
    </section>
  );
}

export function ProgrammeFacts() {
  return (
    <div className="flex flex-col gap-5">
      {/* Hero stat */}
      <div
        className="pub-fade-up overflow-hidden rounded-3xl p-5"
        style={{ background: "var(--pub-gold)" }}
      >
        <p className="text-xs font-semibold tracking-wide uppercase" style={{ opacity: 0.7 }}>
          Open educational resources
        </p>
        <p className="mt-1 text-[64px] leading-none font-bold tracking-tight">{RESOURCE_COUNT}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-semibold">
            Inquiry-based
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-semibold">
            Hands-on
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[13px] font-semibold">
            Most take 3 to 5 minutes
          </span>
        </div>
      </div>

      <Block title="Four domains" delay={80}>
        <div className="grid grid-cols-2 gap-2.5">
          {DOMAINS.map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-2.5 rounded-2xl p-2.5"
              style={{ background: `${d.color}1f`, border: `1.5px solid ${d.color}66` }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{ background: d.color, color: d.color === "#f7be36" ? "#181717" : "#fff" }}
              >
                <Icon paths={d.icon} size={20} />
              </span>
              <span className="min-w-0 text-[14px] leading-tight font-semibold">{d.label}</span>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Available in five languages" delay={160}>
        <div className="grid grid-cols-3 gap-2.5">
          {LANGUAGES.map((l) => (
            <div key={l.name} className="pub-tile px-2 py-3 text-center">
              <p lang={l.lang} className="text-lg leading-tight font-semibold">
                {l.native}
              </p>
              {l.name !== l.native && <p className="pub-muted mt-0.5 text-[12px]">{l.name}</p>}
            </div>
          ))}
        </div>
      </Block>

      <Block title="Aligned to" delay={240}>
        <div className="flex flex-wrap gap-2">
          {["NCERT", "Maharashtra State syllabus"].map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold"
              style={{ background: "var(--pub-gold-soft)", border: "1.5px solid var(--pub-gold)" }}
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5l3.2 3.2L13 5"
                  stroke="#181717"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {a}
            </span>
          ))}
        </div>
      </Block>

      <Block title="Formats" delay={320}>
        <div className="grid grid-cols-2 gap-2.5">
          {FORMATS.map((f) => (
            <div key={f.label} className="pub-tile flex items-center gap-2.5 px-3 py-3">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ background: "var(--pub-gold-soft)" }}
              >
                <Icon paths={f.icon} />
              </span>
              <span className="text-[13.5px] leading-tight font-medium">{f.label}</span>
            </div>
          ))}
          <div
            className="pub-tile col-span-2 flex items-center gap-2.5 px-3 py-3"
            style={{ borderColor: "var(--pub-gold)", background: "var(--pub-gold-soft)" }}
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "var(--pub-gold)" }}
            >
              <Icon paths={GAME_ICON} />
            </span>
            <span className="text-[13.5px] leading-tight font-semibold">
              Interactive and game-based material
            </span>
          </div>
        </div>
      </Block>

      <Block title="Works on" delay={400}>
        <div className="grid grid-cols-3 gap-2.5">
          {DEVICES.map((d) => (
            <div key={d.label} className="pub-tile flex flex-col items-center gap-1.5 px-2 py-3">
              <Icon paths={d.icon} size={24} />
              <span className="text-[13px] font-medium">{d.label}</span>
            </div>
          ))}
        </div>
        <p className="pub-muted mt-2 text-[13px]">Printed copies work in low-internet settings.</p>
      </Block>
    </div>
  );
}
