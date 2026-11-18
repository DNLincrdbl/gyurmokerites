import type { Metadata } from "next";
import Link from "next/link";
import { ModelStage } from "@/components/ModelStage";
import { PageIntro } from "@/components/PageIntro";
import { fromPrice, getCatalog } from "@/lib/catalog";
import { ft } from "@/lib/format";

export const metadata: Metadata = { title: "Termékek" };

export default function ProductsPage() {
  const catalog = getCatalog();
  return (
    <>
      <PageIntro
        kicker="Bemutató"
        title="Négy kapu."
        lede="Nem aprócikk. Személybejáró, kétszárnyú, tolókapu és úszókapu. Mindegyik három méretben, acél, alumínium vagy WPC borítással, automatikával vagy anélkül."
      />
      <div className="wrap catalog">
        {catalog.products.map((product, index) => (
          <article key={product.id} className={index % 2 ? "catalog-row flip" : "catalog-row"}>
            <img src={product.image} alt={product.name} />
            <div>
              <p className="fine">0{index + 1}</p>
              <h2>{product.name}</h2>
              <p>{product.body}</p>
              <p className="price">
                {ft(fromPrice(product))} <span>tól</span>
              </p>
              <Link href={`/termekek/${product.slug}`}>Részletek és rendelés</Link>
            </div>
          </article>
        ))}
      </div>
      <section className="wrap detail-strip">
        <img src="/studio/csuklo.jpg" alt="Acél kapu csuklója közelről" />
        <img src="/studio/cnc.jpg" alt="Lézervágás a műhelyben" />
        <img src="/studio/varrat.jpg" alt="Hegesztett acél csomópont" />
      </section>
      <ModelStage />
    </>
  );
}
