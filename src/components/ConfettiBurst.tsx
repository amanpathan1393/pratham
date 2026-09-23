// Colors deliberately avoid gold — the winning cell's own background turns
// solid gold, so gold confetti pieces would disappear against it.
const CONFETTI_PIECES = [
  { tx: "-20px", ty: "-24px", color: "#FFFFFF", delay: "0ms" },
  { tx: "20px", ty: "-26px", color: "#3DDC84", delay: "40ms" },
  { tx: "-26px", ty: "8px", color: "#FFFFFF", delay: "80ms" },
  { tx: "26px", ty: "10px", color: "#1A7F74", delay: "20ms" },
  { tx: "0px", ty: "-34px", color: "#3DDC84", delay: "60ms" },
  { tx: "-12px", ty: "24px", color: "#1A7F74", delay: "100ms" },
];

export function ConfettiBurst() {
  return (
    <span className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, i) => (
        <span
          key={i}
          className="animate-confetti absolute top-1/2 left-1/2 h-2 w-2 rounded-full shadow-sm"
          style={
            {
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              "--tx": piece.tx,
              "--ty": piece.ty,
            } as React.CSSProperties
          }
        />
      ))}
    </span>
  );
}
