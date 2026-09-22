import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Step by Step English",
  description: "Step by Step English — a PraDigi programme",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col bg-cream">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -top-16 -right-16 h-64 w-64 animate-float rounded-full bg-teal/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -bottom-20 -left-20 h-72 w-72 animate-float rounded-full bg-gold/10 blur-3xl"
          style={{ animationDelay: "2.5s" }}
        />
        <header className="relative border-b-[3px] border-gold bg-cream shadow-sm">
          <div className="flex items-center justify-center gap-6 px-6 py-3">
            <Image
              src="/images/pratham-logo.png"
              alt="Pratham"
              width={144}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <Image
              src="/images/pradigi-logo.webp"
              alt="PraDigi"
              width={92}
              height={32}
              className="h-8 w-auto"
              priority
            />
          </div>
        </header>
        <div className="relative flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
