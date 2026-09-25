import Link from "next/link";
import { ProgrammeFacts } from "../_components/ProgrammeFacts";
import { Screen } from "../_components/Screen";

export default function PartnerPage() {
  return (
    <Screen stage={3}>
      <header className="exp-fade-up">
        <h1 className="text-3xl leading-tight font-bold tracking-tight">
          Partner with Experimento
        </h1>
        <p className="exp-muted mt-2 text-base">
          If your organisation works with learners in Grades 6-10, this is what the programme
          offers.
        </p>
      </header>

      <div className="exp-fade-up" style={{ animationDelay: "100ms" }}>
        <ProgrammeFacts />
      </div>

      {/* DRAFT COPY: we have no confirmed partner requirements, so this stays
          deliberately general and makes no commitments. Replace with real
          wording if Chinmay/Jagdeep can give it. */}
      <section
        className="exp-card exp-fade-up px-4 py-4"
        style={{ animationDelay: "200ms" }}
        aria-labelledby="partner-brings"
      >
        <h2 id="partner-brings" className="exp-mono text-xs font-medium" style={{ color: "var(--exp-blue)" }}>
          What a partner brings
        </h2>
        <p className="mt-2 text-base leading-snug font-semibold">
          Your learners, your context, and the people who work with them. How we work together is
          something the team will talk through with you.
        </p>
      </section>

      <Link
        href="/experimento/capture?from=ngo"
        className="exp-btn exp-btn-primary exp-fade-up"
        style={{ animationDelay: "300ms" }}
      >
        Continue
      </Link>
    </Screen>
  );
}
