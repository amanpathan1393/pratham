import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "../lab.css";

const sans = Space_Grotesk({ subsets: ["latin"], variable: "--font-exp-sans" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-exp-mono",
});

export const metadata: Metadata = {
  title: "Experimento back room",
  robots: { index: false, follow: false },
};

export default function BackRoomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`exp-lab min-h-full ${sans.variable} ${mono.variable}`}>
      <div className="mx-auto w-full max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
