import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderForm } from "@/components/OrderForm";
import { fromPrice, getCatalog } from "@/lib/catalog";
import { works } from "@/lib/content";
import { ft } from "@/lib/format";

type Params = { slug: string };

export function generateStaticParams() {
  return getCatalog().products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = getCatalog().products.find((item) => item.slug === slug);
    return { title: product?.name ?? "Termék" };
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const catalog = getCatalog();
  const product = catalog.products.find((item) => item.slug === slug);
  if (!product) notFound();
  const related = works.filter((work) => work.product === product.slug);

  return (
    <>
      <article className="product wrap">
        <img src={product.image} alt={product.name} />
        <div>
          <p className="kicker">Kapu</p>
          <h1>{product.name}</h1>
          <p className="lede">{product.summary}</p>
          <p>{product.body}</p>
          <p className="price">
            {ft(fromPrice(product))} <span>tól</span>
          </p>
          <p className="fine">Acél borítás, gyártás, automatika nélkül.</p>
          <dl className="spec">
            {product.sizes.map((size) => (
              <div key={size.id}>
                <dt>
                  {size.name} · {size.width}×{size.height} cm
                </dt>
                <dd>{ft(size.price)}</dd>
              </div>
            ))}
            <div>
              <dt>Egyedi nyílás</dt>
              <dd>Ajánlatra, a hét így is foglalható</dd>
            </div>
          </dl>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="wrap related">
          <p className="kicker">Ehhez közel álló munkák</p>
          <div className="home-works">
            {related.map((work) => (
              <Link key={work.slug} href={`/munkaink/${work.slug}`}>
                <img src={work.images[0]} alt={work.title} />
                <span>{work.title}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <OrderForm catalog={catalog} initialSlug={product.slug} lockProduct />
    </>
  );
}
