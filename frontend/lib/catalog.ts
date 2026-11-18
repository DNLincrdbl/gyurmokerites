import { readFileSync } from "node:fs";
import path from "node:path";

export type Size = {
  id: string;
  name: string;
  width: number;
  height: number;
  price: number;
};

export type Automation = {
  id: string;
  name: string;
  detail: string;
  price: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  body: string;
  image: string;
  installFee: number;
  sizes: Size[];
  automation: Automation[];
};

export type Cladding = { id: string; name: string; detail: string; factor: number };
export type Fulfillment = {
  id: string;
  name: string;
  detail: string;
  factor: number;
  capacity: number;
};

export type Catalog = {
  priceNote: string;
  workshop: { weeklyCapacity: number; leadWeeks: number; horizonWeeks: number };
  claddings: Cladding[];
  fulfillment: Fulfillment[];
  products: Product[];
};

export function getCatalog(): Catalog {
  const file = path.join(process.cwd(), "..", "shared", "catalog.json");
  return JSON.parse(readFileSync(file, "utf8")) as Catalog;
}

export function fromPrice(product: Product) {
  return Math.min(...product.sizes.map((size) => size.price));
}
