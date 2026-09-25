import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./experimento.css";
import { ExperimentoShell } from "./_components/Shell";

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-exp-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-exp-mono",
});

export const metadata: Metadata = {
  title: "Experimento India",
  description: "Hands-on, inquiry-based STEM for Grades 6-10.",
};

export default function ExperimentoLayout({ children }: { children: React.ReactNode }) {
  return (
    <ExperimentoShell fontClassName={`${sans.variable} ${mono.variable}`}>
      {children}
    </ExperimentoShell>
  );
}
