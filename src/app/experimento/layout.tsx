import type { Metadata } from "next";
import { ExperimentoShell } from "./_components/Shell";

export const metadata: Metadata = {
  title: "Experimento India",
  description: "Hands-on, inquiry-based STEM for Grades 6-10.",
};

export default function ExperimentoLayout({ children }: { children: React.ReactNode }) {
  return <ExperimentoShell>{children}</ExperimentoShell>;
}
