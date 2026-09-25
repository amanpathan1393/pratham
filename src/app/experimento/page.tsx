import Link from "next/link";
import { Screen } from "./_components/Screen";

const PATHS = [
  { href: "/experimento/challenges", label: "I'm a Fellow", index: "01" },
  { href: "/experimento/partner", label: "I'm an NGO Partner", index: "02" },
  { href: "/experimento/about?from=curious", label: "I'm just curious", index: "03" },
] as const;

export default function ExperimentoLanding() {
  return (
    <Screen stage={1} showBack={false}>
      <header className="exp-fade-up mt-4">
        <p className="exp-mono text-xs font-medium" style={{ color: "var(--exp-blue)" }}>
          STEM · Grades 6-10
        </p>
        <h1 className="mt-3 text-5xl leading-[1.02] font-bold tracking-tight">
          Experimento
          <br />
          India
        </h1>
        <p className="exp-muted mt-4 text-lg leading-snug">
          Hands-on, inquiry-based learning in Energy, Environment, Health, and Mathematics.
        </p>
        <p className="exp-muted mt-3 text-sm">
          A Siemens Stiftung, Siemens Limited and Pratham initiative.
        </p>
      </header>

      <div>
        <p
          className="exp-mono exp-fade-up mb-3 text-xs font-medium"
          style={{ animationDelay: "120ms" }}
        >
          Where would you like to start?
        </p>
        <nav className="flex flex-col gap-3" aria-label="Choose a path">
          {PATHS.map(({ href, label, index }, i) => (
            <Link
              key={href}
              href={href}
              className="exp-card exp-link-card exp-fade-up"
              style={{ animationDelay: `${220 + i * 130}ms` }}
            >
              <span className="exp-mono text-xs font-medium" style={{ color: "var(--exp-blue)" }}>
                {index}
              </span>
              <span className="flex-1">{label}</span>
              <span aria-hidden="true" style={{ color: "var(--exp-blue)" }}>
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </Screen>
  );
}
