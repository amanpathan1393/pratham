"use client";

// Bots that auto-fill forms tend to fill every input they can find,
// including ones a real visitor never sees or reaches. This field is kept
// out of the visual layout and out of the tab order; if it comes back with
// a value, the submission is treated as spam.
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label htmlFor="website">Website</label>
      <input
        id="website"
        name="website"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
