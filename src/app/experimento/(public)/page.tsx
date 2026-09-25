import Image from "next/image";
import Link from "next/link";
import { PubScreen } from "../_components/PubScreen";

const PATHS = [
  { href: "/experimento/challenges", label: "I'm a Fellow", index: "1" },
  { href: "/experimento/partner", label: "I'm an NGO Partner", index: "2" },
  { href: "/experimento/about?from=curious", label: "I'm just curious", index: "3" },
] as const;

const DOMAIN_DOTS = ["#f7be36", "#44bb97", "#ff318c", "#007acc"];

export default function ExperimentoLanding() {
  return (
    <PubScreen showBack={false}>
      <div className="pub-fade-up grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <Image
          src="/images/siemens-stiftung-logo.png"
          alt="Siemens Stiftung"
          width={361}
          height={50}
          className="h-auto w-full max-w-[132px]"
          priority
        />
        <Image
          src="/images/pratham-stacked-logo.png"
          alt="Pratham"
          width={200}
          height={177}
          className="h-auto w-[68px]"
          priority
        />
        <Image
          src="/images/siemens-logo.png"
          alt="Siemens"
          width={1134}
          height={180}
          className="h-auto w-full max-w-[100px] justify-self-end"
          priority
        />
      </div>

      <header className="pub-fade-up" style={{ animationDelay: "60ms" }}>
        <div className="mb-4 flex gap-1.5" aria-hidden="true">
          {DOMAIN_DOTS.map((c) => (
            <span key={c} className="h-2.5 w-8 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <p className="pub-eyebrow">STEM · Grades 6-10</p>
        <h1 className="mt-3 text-[44px] leading-[1.05] font-bold tracking-tight">
          <span className="pub-mark-line">Experimento</span>
          <br />
          India
        </h1>
        <p className="pub-muted mt-4 text-lg leading-snug">
          Hands-on, inquiry-based learning in Energy, Environment, Health, and Mathematics.
        </p>
        <p className="pub-muted mt-3 text-sm">
          A Siemens Stiftung, Siemens Limited and Pratham initiative.
        </p>
      </header>

      <div>
        <p className="pub-eyebrow pub-fade-up mb-3" style={{ animationDelay: "120ms" }}>
          Where would you like to start?
        </p>
        <nav className="flex flex-col gap-3" aria-label="Choose a path">
          {PATHS.map(({ href, label, index }, i) => (
            <Link
              key={href}
              href={href}
              className="pub-card pub-link-card pub-fade-up"
              style={{ animationDelay: `${220 + i * 130}ms` }}
            >
              <span className="pub-dot" aria-hidden="true">
                {index}
              </span>
              <span className="flex-1">{label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </div>
    </PubScreen>
  );
}
