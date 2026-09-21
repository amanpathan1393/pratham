import Link from "next/link";
import { listRowClass } from "@/lib/theme";

const OPTIONS = [
  { href: "/fellow", label: "I'm a TFI Fellow" },
  { href: "/ngo", label: "I represent an NGO" },
  { href: "/curious", label: "I'm curious" },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Step by Step English
        </h1>
        <p className="mt-3 text-xl text-secondary">What brings you here?</p>
      </div>

      <div className="w-full max-w-md border-b-[1.5px] border-border">
        {OPTIONS.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className={listRowClass()}
          >
            <span className="text-lg font-semibold">{option.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
