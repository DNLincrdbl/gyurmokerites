import type { Metadata } from "next";
import { OrderForm } from "@/components/OrderForm";
import { PageIntro } from "@/components/PageIntro";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Rendelés" };

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ termek?: string }>;
}) {
  const { termek } = await searchParams;
  const catalog = getCatalog();
  return (
    <>
      <PageIntro
        kicker="Műhelykapacitás"
        title="Egy hét, egy kapu."
        lede="A kész méretnek ára van. Az egyedi nyílás ajánlatra megy, a hetet attól még le lehet tenni. Csak anyagot is lehet kérni, szerelés nélkül."
      />
      <OrderForm catalog={catalog} initialSlug={termek} />
    </>
  );
}
