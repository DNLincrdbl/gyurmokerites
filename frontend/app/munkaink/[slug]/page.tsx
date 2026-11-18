import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWork, works } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams() {
  return works.map((work) => ({ slug: work.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return params.then(({ slug }) => ({ title: getWork(slug)?.title ?? "Munka" }));
}

export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const work = getWork(slug);
  if (!work) notFound();

  return (
    <article className="wrap work-detail">
      <p className="kicker">Megvalósult munka</p>
      <h1>{work.title}</h1>
      <p className="lede">{work.body}</p>
      <div className="gallery">
        {work.images.map((src) => (
          <img key={src} src={src} alt={work.title} />
        ))}
      </div>
      <p className="work-links">
        <Link href="/munkaink">Vissza a munkákhoz</Link>
        {work.product ? <Link href={`/termekek/${work.product}`}>Rendelhető kapu</Link> : null}
      </p>
    </article>
  );
}
