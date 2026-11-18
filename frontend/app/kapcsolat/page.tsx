import type { Metadata } from "next";
import { ContactBlock } from "@/components/ContactBlock";
import { FaqList } from "@/components/FaqList";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = { title: "Kapcsolat" };

export default function ContactPage() {
  return (
    <>
      <PageIntro
        kicker="Kapcsolat"
        title="Szóljon, vagy foglaljon hetet."
        lede="A kész kapu a rendelés oldalon rögzül. Felmérésre és egyedi munkára a térkép melletti űrlap, a telefon vagy az email való."
      />
      <ContactBlock />
      <section className="wrap home-faq contact-faq">
        <h2>Kérdések</h2>
        <FaqList />
      </section>
    </>
  );
}
