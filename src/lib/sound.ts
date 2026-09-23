let audioCtx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

// A short synthesized "ding" — no audio asset needed, so nothing to source
// or license. Browsers require a user gesture before audio can play; every
// call site is triggered directly from a tap, so that's already satisfied.
export function playDing() {
  try {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch {
    // Best-effort; sound is a nice-to-have, never blocks the interaction.
  }
}
