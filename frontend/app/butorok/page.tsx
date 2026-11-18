import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { furniture } from "@/lib/content";

export const metadata: Metadata = { title: "Bútor" };

export default function FurniturePage() {
  return (
    <>
      <PageIntro
        kicker="Bútor"
        title="Acél váz, fa lap."
        lede="A kapuk mellett a műhely egyedi bútorokat is készít. Most beltéri darabok vannak a bemutatóteremben. A kültéri, funkcionális és design darabok ugyanebbe a listába kerülnek, ár nélkül, egyeztetéssel."
      />
      <div className="wrap furniture">
        {furniture.map((piece) => (
          <article key={piece.title}>
            <img src={piece.image} alt={piece.title} />
            <p className="fine">
              {piece.place} · {piece.kind}
            </p>
            <h2>{piece.title}</h2>
            <p>{piece.body}</p>
          </article>
        ))}
      </div>
    </>
  );
}
