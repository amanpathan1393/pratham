import type { Metadata } from "next";
import { Geist, Geist_Mono, Baloo_2 } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Step by Step English",
  description: "Step by Step English — a Pratham/PraDigi programme",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${baloo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-page text-navy">
        <header className="bg-navy px-6 py-2.5 text-center">
          <span className="font-heading text-base font-bold tracking-tight text-white">
            Step by Step <span className="text-gold">English</span>
          </span>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
        <footer className="bg-navy px-6 py-2.5 text-center">
          <span className="text-xs font-medium text-white/70">
            A Pratham / PraDigi programme
          </span>
        </footer>
      </body>
    </html>
  );
}
