export function listRowClass({
  selected = false,
  disabled = false,
}: {
  selected?: boolean;
  disabled?: boolean;
} = {}): string {
  const state = disabled
    ? "text-muted"
    : selected
      ? "font-semibold text-teal"
      : "text-primary hover:pl-2.5 hover:bg-teal/5";

  return `flex min-h-14 w-full items-center gap-3 border-t-[1.5px] border-border px-1 py-4 text-left text-base transition-all duration-200 active:bg-teal/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 ${state}`;
}

export const ctaClass =
  "flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-teal text-base font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#15665d] hover:shadow-lg active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-inactive disabled:text-muted disabled:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2";
