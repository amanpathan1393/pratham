import Link from "next/link";

export default function CuriousPage() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-4 bg-zinc-50 px-6 text-center dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Curious Visitor
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        This screen is coming next.
      </p>
      <Link
        href="/"
        className="mt-2 text-sm font-medium text-zinc-600 underline dark:text-zinc-400"
      >
        Back
      </Link>
    </main>
  );
}
