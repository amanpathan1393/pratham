import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Step by Step English",
  description: "Step by Step English — a Pratham/PraDigi programme",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${notoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="flex items-center justify-center gap-6 border-b-[1.5px] border-border px-6 py-3">
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
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
