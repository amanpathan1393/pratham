import Link from "next/link";

const OPTIONS = [
  { href: "/fellow", label: "I'm a TFI Fellow" },
  { href: "/ngo", label: "I represent an NGO" },
  { href: "/curious", label: "I'm curious" },
] as const;

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-10 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Step by Step English
        </h1>
        <p className="mt-3 text-xl text-zinc-600 dark:text-zinc-400">
          What brings you here?
        </p>
      </div>

      <div className="flex w-full max-w-md flex-col gap-4">
        {OPTIONS.map((option) => (
          <Link
            key={option.href}
            href={option.href}
            className="flex min-h-24 items-center justify-center rounded-2xl bg-white px-6 py-6 text-center text-xl font-semibold text-zinc-900 shadow-md ring-1 ring-zinc-200 transition active:scale-[0.98] active:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-800 dark:active:bg-zinc-800"
          >
            {option.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
