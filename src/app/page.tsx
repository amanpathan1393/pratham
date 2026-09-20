import Link from "next/link";
import { pastelClass } from "@/lib/theme";

const OPTIONS = [
  { href: "/fellow", label: "I'm a TFI Fellow" },
  { href: "/ngo", label: "I represent an NGO" },
  { href: "/curious", label: "I'm curious" },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-navy">
          Step by Step English
        </h1>
        <p className="mt-3 text-xl text-navy/70">What brings you here?</p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-4">
        {OPTIONS.map((option, index) => (
          <Link
            key={option.href}
            href={option.href}
            className={`flex min-h-24 items-center justify-center rounded-2xl ${pastelClass(
              index,
            )} px-6 py-6 text-center text-xl font-bold text-navy shadow-sm transition active:scale-[0.98]`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
