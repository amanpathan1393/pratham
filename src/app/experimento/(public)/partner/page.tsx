import Link from "next/link";
import { ProgrammeFacts } from "../../_components/ProgrammeFacts";
import { PubScreen } from "../../_components/PubScreen";
import { progressFor } from "../../_components/origin";

export default function PartnerPage() {
  return (
    <PubScreen progress={progressFor("ngo", "partner")}>
      <header className="pub-fade-up">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight">
          Partner with <span className="pub-mark-line">Experimento</span>
        </h1>
        <p className="pub-muted mt-2 text-base">
          If your organisation works with learners in Grades 6-10, this is what the programme
          offers.
        </p>
      </header>

      <div className="pub-fade-up" style={{ animationDelay: "100ms" }}>
        <ProgrammeFacts />
      </div>

      {/* DRAFT COPY: we have no confirmed partner requirements, so this stays
          deliberately general and makes no commitments. Replace with real
          wording if Chinmay/Jagdeep can give it. */}
      <section
        className="pub-card pub-fade-up px-4 py-4"
        style={{ animationDelay: "200ms" }}
        aria-labelledby="partner-brings"
      >
        <h2 id="partner-brings" className="pub-eyebrow">
          What a partner brings
        </h2>
        <p className="mt-2 text-base leading-snug font-medium">
          Your learners, your context, and the people who work with them. How we work together is
          something the team will talk through with you.
        </p>
      </section>

      <Link
        href="/experimento/capture?from=ngo"
        className="pub-btn pub-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        Continue
      </Link>
    </PubScreen>
  );
}
