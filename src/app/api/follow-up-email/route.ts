import { NextRequest, NextResponse } from "next/server";

// "From" a real Pratham address, so this needs Resend (or whatever email
// provider Pratham uses) to have pratham.org's sending domain verified
// (SPF/DKIM DNS records) — that's an infra step, not something this route
// can do on its own. See RESEND_API_KEY in .env.local.example.
const FROM_EMAIL = "Aman Pathan <aman.pathan@pratham.org>";

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — no-op success so the calling page never shows
    // an error for a feature that simply hasn't been activated.
    return NextResponse.json({ skipped: true });
  }

  const body = await req.json().catch(() => null);
  const to = typeof body?.to === "string" ? body.to.trim() : "";
  if (!to) {
    return NextResponse.json({ error: "Missing recipient email." }, { status: 400 });
  }
  const subject =
    typeof body?.subject === "string" && body.subject
      ? body.subject
      : "Thanks for your interest in Step by Step English";
  const html =
    typeof body?.html === "string" && body.html
      ? body.html
      : "<p>Thanks for your interest — we'll follow up soon.</p>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json({ error: "Email send failed", detail }, { status: 502 });
    }
    return NextResponse.json({ sent: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email send failed" },
      { status: 500 },
    );
  }
}
