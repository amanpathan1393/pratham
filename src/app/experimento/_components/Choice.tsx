"use client";

function Tick() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" aria-hidden="true">
      <path
        d="M3 8.5l3.2 3.2L13 5"
        stroke="#181717"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// One tappable option. "multi" behaves like a checkbox (aria-pressed),
// "single" like a radio (aria-checked, the parent supplies role="radiogroup").
export function Choice({
  label,
  hint,
  selected,
  onSelect,
  mode = "single",
  state,
  disabled,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
  mode?: "single" | "multi";
  state?: "right" | "wrong";
  disabled?: boolean;
}) {
  const aria =
    mode === "multi"
      ? { "aria-pressed": selected }
      : { role: "radio" as const, "aria-checked": selected };
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      data-state={state}
      className="pub-choice"
      {...aria}
    >
      <span className="pub-mark" data-shape={mode === "single" ? "circle" : "square"}>
        {selected && <Tick />}
      </span>
      <span>
        <span className="block">{label}</span>
        {hint && <span className="pub-muted mt-0.5 block text-[13px] font-normal">{hint}</span>}
      </span>
    </button>
  );
}
