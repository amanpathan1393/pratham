export function listRowClass({
  selected = false,
  disabled = false,
}: {
  selected?: boolean;
  disabled?: boolean;
} = {}): string {
  const base =
    "flex min-h-14 w-full items-center gap-3 rounded-xl px-4 py-4 text-left text-base font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2";

  if (disabled) {
    return `${base} cursor-not-allowed bg-inactive text-muted shadow-none`;
  }
  if (selected) {
    return `${base} bg-teal text-white shadow-md`;
  }
  return `${base} bg-white text-primary shadow-sm hover:-translate-y-0.5 hover:shadow-md`;
}

export const ctaClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-teal text-base font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#15665d] hover:shadow-lg active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-inactive disabled:text-muted disabled:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2";
