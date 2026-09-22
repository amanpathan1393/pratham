import Link from "next/link";
import { listRowClass } from "@/lib/theme";
import { FellowIcon, NgoIcon, CuriousIcon, ArrowIcon } from "@/components/PathwayIcons";

const OPTIONS = [
  { href: "/fellow", label: "I'm a TFI Fellow", Icon: FellowIcon },
  { href: "/ngo", label: "I represent an NGO", Icon: NgoIcon },
  { href: "/curious", label: "I'm curious", Icon: CuriousIcon },
] as const;

// Fixed (not random) so server and client render identically — individually
// animated instead of one static tiled image, each drifting on its own
// offset so the page feels alive without ever covering the heading.
const DOODLE_ICONS = [
  { Icon: BookIcon, style: { top: "5%", left: "6%" }, size: 30, delay: "0s", rotate: 0 },
  { Icon: PencilIcon, style: { top: "4%", right: "8%" }, size: 28, delay: "1.3s", rotate: 35 },
  { Icon: StarIcon, style: { top: "24%", left: "38%" }, size: 20, delay: "2.1s", rotate: 0 },
  { Icon: SpeechIcon, style: { top: "30%", right: "4%" }, size: 34, delay: "0.6s", rotate: 0 },
  { Icon: CapIcon, style: { top: "46%", left: "3%" }, size: 32, delay: "1.8s", rotate: 0 },
  { Icon: CheckBadgeIcon, style: { top: "62%", right: "6%" }, size: 24, delay: "0.3s", rotate: 0 },
  { Icon: StarIcon, style: { top: "74%", left: "12%" }, size: 16, delay: "2.5s", rotate: 0 },
  { Icon: PencilIcon, style: { top: "70%", right: "22%" }, size: 24, delay: "1s", rotate: -20 },
] as const;

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden px-6 py-10">
      {DOODLE_ICONS.map(({ Icon, style, size, delay, rotate }, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute animate-float text-teal/30"
          style={{
            ...style,
            width: size,
            height: size,
            animationDelay: delay,
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
          }}
        >
          <Icon />
        </span>
      ))}

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
        <h1 className="mx-auto mt-4 inline-block rounded-2xl bg-gold px-6 py-3 text-4xl font-bold tracking-tight text-white shadow-md">
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

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5c-2-1.5-5-1.5-7 0v13c2-1.5 5-1.5 7 0 2-1.5 5-1.5 7 0V5c-2-1.5-5-1.5-7 0Z" />
      <path d="M12 5v13" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1z" />
      <path d="M14 7l3 3" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M12 2l2.5 6.5L21 10l-5.5 4 1.5 7-5-3.8L7 21l1.5-7L3 10l6.5-1.5Z" />
    </svg>
  );
}

function SpeechIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v9a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4H5.5A2.5 2.5 0 0 1 3 14.5Z" />
      <path d="M7.5 8.5h9M7.5 12h6" />
    </svg>
  );
}

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9l10-4 10 4-10 4-10-4Z" />
      <path d="M6 11v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
      <path d="M20 9v6" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}
