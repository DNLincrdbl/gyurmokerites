import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "../../shared/catalog.json");

export function readCatalog() {
  return JSON.parse(readFileSync(file, "utf8"));
}

const MONTHS = [
  "január",
  "február",
  "március",
  "április",
  "május",
  "június",
  "július",
  "augusztus",
  "szeptember",
  "október",
  "november",
  "december",
];

function mondayOf(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  return d;
}

export function isoWeekId(monday) {
  const d = new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function formatRange(monday) {
  const end = new Date(monday);
  end.setDate(monday.getDate() + 6);
  if (monday.getMonth() === end.getMonth()) {
    return `${MONTHS[monday.getMonth()]} ${monday.getDate()}–${end.getDate()}.`;
  }
  return `${MONTHS[monday.getMonth()]} ${monday.getDate()}. – ${MONTHS[end.getMonth()]} ${end.getDate()}.`;
}

export function listWeeks(catalog) {
  const start = mondayOf(new Date());
  start.setDate(start.getDate() + 7 * catalog.workshop.leadWeeks);
  const weeks = [];
  for (let i = 0; i < catalog.workshop.horizonWeeks; i += 1) {
    const from = new Date(start);
    from.setDate(start.getDate() + i * 7);
    weeks.push({ id: isoWeekId(from), label: formatRange(from) });
  }
  return weeks;
}

export function priceConfiguration(catalog, input) {
  const product = catalog.products.find((item) => item.id === input.productId);
  if (!product) return { error: "Ismeretlen termék." };

  const fulfillment = catalog.fulfillment.find((item) => item.id === input.fulfillmentId);
  if (!fulfillment) return { error: "Válassza ki, mit kér a műhelytől." };

  const cladding = catalog.claddings.find((item) => item.id === input.claddingId);
  if (!cladding) return { error: "Válasszon borítást." };

  const quantity = Number(input.quantity) || 1;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 3) {
    return { error: "Egy rendelésben 1–3 darab kérhető." };
  }

  const custom = input.sizeId === "egyedi";
  const size = custom ? null : product.sizes.find((item) => item.id === input.sizeId);
  if (!custom && !size) return { error: "Válasszon méretet." };

  let customWidth = null;
  let customHeight = null;
  if (custom) {
    customWidth = Number(input.customWidth);
    customHeight = Number(input.customHeight);
    if (
      !Number.isFinite(customWidth) ||
      !Number.isFinite(customHeight) ||
      customWidth < 80 ||
      customWidth > 1200 ||
      customHeight < 90 ||
      customHeight > 320
    ) {
      return { error: "Az egyedi méret 80–1200 cm széles és 90–320 cm magas lehet." };
    }
  }

  const automation = input.automationId
    ? product.automation.find((item) => item.id === input.automationId)
    : null;
  if (input.automationId && !automation) return { error: "Ismeretlen automatika." };

  let capacity = fulfillment.capacity;
  if (custom) capacity += 1;
  if (automation) capacity += 1;
  capacity *= quantity;

  const lines = [
    {
      label: "Kapu",
      text: custom
        ? `${product.name}, egyedi ${customWidth}×${customHeight} cm`
        : `${product.name}, ${size.name} · ${size.width}×${size.height} cm`,
    },
    { label: "Borítás", text: cladding.name },
    { label: "Teljesítés", text: fulfillment.name },
  ];
  if (automation) lines.push({ label: "Automatika", text: `${automation.name} · ${automation.detail}` });
  if (quantity > 1) lines.push({ label: "Darab", text: String(quantity) });

  const base = {
    productId: product.id,
    productName: product.name,
    fulfillmentId: fulfillment.id,
    claddingId: cladding.id,
    sizeId: custom ? "egyedi" : size.id,
    automationId: automation ? automation.id : null,
    quantity,
    customWidth,
    customHeight,
    capacity,
    lines,
  };

  if (custom) {
    return { ...base, quote: true, amount: null };
  }

  let raw = size.price * cladding.factor * fulfillment.factor;
  if (fulfillment.id === "komplett") raw += product.installFee;
  if (automation) raw += automation.price;
  raw *= quantity;

  return { ...base, quote: false, amount: Math.round(raw / 1000) * 1000 };
}
