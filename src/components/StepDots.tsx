export function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => i + 1).map((step) => (
        <span
          key={step}
          className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            step === current
              ? "scale-125 bg-teal"
              : step < current
                ? "bg-teal"
                : "bg-inactive"
          }`}
        />
      ))}
    </div>
  );
}
