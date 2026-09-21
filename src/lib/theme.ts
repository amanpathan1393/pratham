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
      : "text-primary";

  return `flex min-h-14 w-full items-center gap-3 border-t-[1.5px] border-border px-1 py-4 text-left text-base transition active:bg-inactive/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal focus-visible:outline-offset-2 ${state}`;
}
