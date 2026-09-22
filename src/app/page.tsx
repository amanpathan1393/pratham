import Link from "next/link";
import { listRowClass } from "@/lib/theme";
import { FellowIcon, NgoIcon, CuriousIcon, ArrowIcon } from "@/components/PathwayIcons";

const OPTIONS = [
  { href: "/fellow", label: "I'm a TFI Fellow", Icon: FellowIcon },
  { href: "/ngo", label: "I represent an NGO", Icon: NgoIcon },
  { href: "/curious", label: "I'm curious", Icon: CuriousIcon },
] as const;

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden px-6 py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url(/images/doodle-pattern.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 right-8 h-10 w-10 animate-spin-slow rounded-full border-2 border-dashed border-teal/25 sm:right-16"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-24 left-8 h-14 w-14 animate-spin-slow rounded-full border-2 border-dashed border-gold/30 sm:left-16"
        style={{ animationDirection: "reverse", animationDuration: "20s" }}
      />

      <div className="relative animate-fade-in-up text-center">
        <span className="inline-block animate-soft-pulse rounded-full bg-gold/15 px-3 py-1 text-xs font-bold tracking-wide text-gold uppercase">
          A PraDigi programme
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-primary">
          Step by Step English
        </h1>
        <p className="mt-3 text-xl text-secondary">What brings you here?</p>
      </div>

      <div
        className="relative flex w-full max-w-md animate-fade-in-up flex-col gap-3"
        style={{ animationDelay: "150ms" }}
      >
        {OPTIONS.map(({ href, label, Icon }, i) => (
          <Link key={href} href={href} className={`group ${listRowClass()}`}>
            <span
              className="flex h-9 w-9 shrink-0 animate-icon-bob items-center justify-center rounded-full bg-teal/10 text-teal"
              style={{ animationDelay: `${i * 250}ms` }}
            >
              <Icon />
            </span>
            <span className="flex-1 text-lg font-semibold">{label}</span>
            <span className="text-teal opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
