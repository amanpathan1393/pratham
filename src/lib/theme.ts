const PASTELS = [
  "bg-pastel-pink",
  "bg-pastel-sky",
  "bg-pastel-mint",
  "bg-pastel-lavender",
] as const;

export function pastelClass(index: number): string {
  return PASTELS[index % PASTELS.length];
}
