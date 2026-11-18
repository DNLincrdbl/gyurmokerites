import Link from "next/link";
import { ContactBlock } from "@/components/ContactBlock";
import { FaqList } from "@/components/FaqList";
import { GateSlider, type GateCard } from "@/components/GateSlider";
import { Partners } from "@/components/Partners";
import { QuoteRotator } from "@/components/QuoteRotator";
import { Reveal } from "@/components/Reveal";
import { ServiceStrip } from "@/components/ServiceStrip";
import { fromPrice, getCatalog } from "@/lib/catalog";
import { works } from "@/lib/content";
import { ft } from "@/lib/format";

const slides: Array<Omit<GateCard, "line"> & { line: string; slug?: string }> = [
  {
    key: "szemely",
    slug: "szemelybejaro",
    name: "Személybejáró",
    line: "A kerítés vonalában.",
    image: "/studio/aluminium.jpg",
    alt: "Lamellás antracit kerítés személybejáróval",
    orderHref: "/rendeles?termek=szemelybejaro",
    detailHref: "/termekek/szemelybejaro",
  },
  {
    key: "ket",
    slug: "ketszarnyu",
    name: "Kétszárnyú",
    line: "Ha van hely kinyílni.",
    image: "/studio/ketszarnyu.jpg",
    alt: "Kétszárnyú antracit kapu",
    orderHref: "/rendeles?termek=ketszarnyu",
    detailHref: "/termekek/ketszarnyu",
  },
  {
    key: "tolo",
    slug: "tolokapu",
    name: "Tolókapu",
    line: "A szárny a kerítés mentén fut.",
    image: "/studio/tolo-3.jpg",
    alt: "Zárt antracit tolókapu",
    orderHref: "/rendeles?termek=tolokapu",
    detailHref: "/termekek/tolokapu",
  },
  {
    key: "auto",
    slug: "tolokapu",
    name: "Automatika",
    line: "Görgőn, világítással.",
    image: "/studio/automata.jpg",
    alt: "Világító tolókapu görgőn",
    orderHref: "/rendeles?termek=tolokapu",
    detailHref: "/termekek/tolokapu",
  },
  {
    key: "ejjel",
    slug: "uszokapu",
    name: "Úszókapu",
    line: "Geometrikus mező, éjszakára.",
    image: "/studio/ejjel.jpg",
    alt: "Világító geometrikus kapu éjjel",
    orderHref: "/rendeles?termek=uszokapu",
    detailHref: "/termekek/uszokapu",
  },
  {
    key: "lezer",
    name: "Lézervágott",
    line: "Egyedi minta a szárnyon.",
    image: "/studio/egyedi.jpg",
    alt: "Lézervágott kétszárnyú kapu",
    orderHref: "/rendeles?termek=ketszarnyu",
    detailHref: "/munkaink/lezervagott",
  },
];

const bento = [
  { src: "/studio/automata.jpg", title: "Automatika", href: "/termekek/tolokapu", area: "a", alt: "Világító tolókapu görgőn" },
  { src: "/studio/tolo-3.jpg", title: "Zárt mező", href: "/termekek/tolokapu", area: "b", alt: "Zárt antracit tolókapu" },
  { src: "/studio/egyedi.jpg", title: "Lézervágott", href: "/munkaink/lezervagott", area: "c", alt: "Lézervágott kétszárnyú kapu" },
  { src: "/studio/pillerek.jpg", title: "Kétszárnyú", href: "/termekek/ketszarnyu", area: "d", alt: "Lamellás kétszárnyú kapu kőoszlopok között" },
  { src: "/studio/csuklo.jpg", title: "Csomópont", href: "/muhely", area: "e", alt: "Acél kapu csuklója" },
  { src: "/studio/cnc.jpg", title: "Műhely", href: "/muhely", area: "f", alt: "Lézervágás a műhelyben" },
  { src: "/studio/makro.jpg", title: "Felület", href: "/muhely", area: "g", alt: "Porszórt acélfelület" },
  { src: "/studio/varrat.jpg", title: "Hegesztés", href: "/muhely", area: "h", alt: "Hegesztett acélcsomó" },
  { src: "/studio/cnc-2.jpg", title: "Vágás", href: "/muhely", area: "i", alt: "Acél kapu vágása" },
];

const homeWorks = ["uszokapuk", "nivo-aluminium", "lezervagott", "autobeallo"]
  .map((slug) => works.find((work) => work.slug === slug))
  .filter((work) => work !== undefined);

export default function HomePage() {
  const catalog = getCatalog();

  return (
    <>
      <section className="hero">
        <img src="/studio/tolo.jpg" alt="Antracit tolókapu, zárt mezőkkel" />
        <div className="hero-copy">
          <h1>Kapu, méretre.</h1>
          <div className="hero-links">
            <Link href="/rendeles" className="tesla-btn">
              Rendelés
            </Link>
            <Link href="/termekek" className="tesla-btn tesla-btn-light">
              Részletek
            </Link>
          </div>
        </div>
      </section>

      <ServiceStrip />

      <GateSlider
        cards={slides.map((slide) => {
          const product = slide.slug ? catalog.products.find((item) => item.slug === slide.slug) : undefined;
          const price = product ? `${ft(fromPrice(product))}-tól` : "";
          return { ...slide, line: price ? `${slide.line} ${price}` : slide.line };
        })}
      />

      <section className="bento-wrap">
        <Reveal>
          <h2>A kapu közelről.</h2>
        </Reveal>
        <div className="bento">
          {bento.map((item, index) => (
            <Link key={item.src} href={item.href} className={`bento-card bento-${item.area}`} style={{ animationDelay: `${index * 70}ms` }}>
              <img src={item.src} alt={item.alt} />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-band wrap">
        <div className="home-stats">
          <span>15+ év</span>
          <span>150+ ügyfél</span>
          <span>Szeged</span>
        </div>
      </section>

      <section className="home-band wrap">
        <div className="section-head">
          <h2>Ami elkészült.</h2>
          <Link href="/munkaink">Összes munka</Link>
        </div>
        <div className="home-works">
          {homeWorks.map((work) => (
            <Link key={work.slug} href={`/munkaink/${work.slug}`}>
              <img src={work.images[0]} alt={work.title} />
              <span>{work.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-band wrap home-faq">
        <h2>Kérdések</h2>
        <FaqList />
      </section>

      <Partners />
      <QuoteRotator />
      <ContactBlock />
    </>
  );
}
