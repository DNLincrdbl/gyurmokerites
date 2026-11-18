import type { Metadata } from "next";
import { Instrument_Serif, Schibsted_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IntroGate } from "@/components/IntroGate";
import { PageEnter } from "@/components/PageEnter";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
});

const sans = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "GyurMó Kerítés Kft.",
    template: "%s · GyurMó Kerítés Kft.",
  },
  description:
    "Kapuk, kerítések és fémszerkezetek Szegeden. Személybejáró, kétszárnyú, toló- és úszókapu, árral és műhelyidővel. Anyag, gyártás, vagy szereléssel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hu" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <IntroGate />
        <Header />
        <main>
          <PageEnter>{children}</PageEnter>
        </main>
        <Footer />
      </body>
    </html>
  );
}
