import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Sent via a dedicated Gmail account, not aman.pathan@pratham.org directly
// — Pratham's domain DNS isn't accessible right now, and Gmail SMTP can
// only send "from" whichever address it authenticated as. Reply-To still
// points at Aman's real address so replies land in his actual inbox.
const REPLY_TO = "aman.pathan@pratham.org";
const DISPLAY_NAME = "Aman Pathan (Step by Step English)";

export async function POST(req: NextRequest) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailAppPassword) {
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
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });
    await transporter.sendMail({
      from: `"${DISPLAY_NAME}" <${gmailUser}>`,
      replyTo: REPLY_TO,
      to,
      subject,
      html,
    });
    return NextResponse.json({ sent: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Email send failed" },
      { status: 500 },
    );
  }
}
