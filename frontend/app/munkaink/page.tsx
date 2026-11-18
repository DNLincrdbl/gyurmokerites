import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { works } from "@/lib/content";

export const metadata: Metadata = { title: "Munkáink" };

export default function WorksPage() {
  return (
    <>
      <PageIntro
        kicker="Referencia"
        title="Ami elkészült."
        lede="A bemutatóterem és a kivitelezések. Minden tétel külön, a saját képeivel. A rendelhető kapuk ára a termékeknél van."
      />
      <div className="wrap work-list">
        {works.map((work, index) => (
          <article key={work.slug} className="work-row">
            <p className="fine">{String(index + 1).padStart(2, "0")}</p>
            <div>
              <h2>
                <Link href={`/munkaink/${work.slug}`}>{work.title}</Link>
              </h2>
              <p>{work.body}</p>
            </div>
            <Link href={`/munkaink/${work.slug}`} className="work-photo">
              <img src={work.images[0]} alt={work.title} />
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
