import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Partners } from "@/components/Partners";
import { about, services, values } from "@/lib/content";

export const metadata: Metadata = { title: "A műhely" };

export default function WorkshopPage() {
  return (
    <>
      <PageIntro
        kicker="GyurMó Kerítés Kft."
        title="Tizenöt év szerkezet."
        lede="Már több mint 15 éve építünk. A kihívásokból maradt a tudás, amivel egy kaput, egy csarnokot vagy egy korlátot végig lehet vinni."
      />
      <figure className="team wrap">
        <img src="/archiv/GyurMo-nyitokep.jpeg" alt="A GyurMó csapata a műhelyautó előtt" />
      </figure>
      <section className="wrap prose">
        {about.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p className="stat-line">
          <span>15+ év</span>
          <span>150+ ügyfél</span>
          <span>Szeged</span>
        </p>
      </section>
      <section className="wrap split-notes">
        <img src="/studio/cnc-2.jpg" alt="Acél kapu vágása a műhelyben" />
        <div>
          {values.map((value) => (
            <div key={value.title}>
              <h2>{value.title}</h2>
              <p>{value.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="wrap service-list">
        <p className="kicker">Szolgáltatás</p>
        {services.map((service) => (
          <div key={service.title} className="index-row">
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </div>
        ))}
      </section>
      <Partners />
      <section className="wrap prose">
        <p>
          Állást a <Link href="/karrier">karrier</Link> oldalon lehet kérdezni.
        </p>
      </section>
    </>
  );
}
