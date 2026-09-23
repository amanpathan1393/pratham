const CONFETTI_PIECES = [
  { tx: "-18px", ty: "-22px", color: "#1A7F74", delay: "0ms" },
  { tx: "18px", ty: "-24px", color: "#F2B705", delay: "40ms" },
  { tx: "-24px", ty: "6px", color: "#F2B705", delay: "80ms" },
  { tx: "24px", ty: "8px", color: "#1A7F74", delay: "20ms" },
  { tx: "0px", ty: "-30px", color: "#F2B705", delay: "60ms" },
  { tx: "-10px", ty: "20px", color: "#1A7F74", delay: "100ms" },
];

export function ConfettiBurst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {CONFETTI_PIECES.map((piece, i) => (
        <span
          key={i}
          className="animate-confetti absolute top-1/2 left-1/2 h-1.5 w-1.5 rounded-full"
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
