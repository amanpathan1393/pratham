// Safe to call from client components: this only ever talks to our own
// /api/follow-up-email route, never a third-party API directly, so no
// secret is ever exposed to the browser.
export async function sendFollowUpEmail(params: { to: string; subject?: string; html?: string }) {
  try {
    await fetch("/api/follow-up-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  } catch {
    // Best-effort; a failed follow-up email should never block the
    // submission success screen the visitor already saw.
  }
}
