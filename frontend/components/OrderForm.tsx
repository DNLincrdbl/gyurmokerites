"use client";

import { useEffect, useMemo, useState } from "react";
import type { Catalog } from "@/lib/catalog";
import { ft } from "@/lib/format";

type Week = { id: string; label: string; remaining: number; total: number };
type Line = { label: string; text: string };
type Quote = {
  quote: boolean;
  amount: number | null;
  capacity: number;
  lines: Line[];
  error?: string;
};

type Props = {
  catalog: Catalog;
  initialSlug?: string;
  lockProduct?: boolean;
};

const emptyCustomer = { name: "", email: "", phone: "", city: "", address: "", note: "" };

export function OrderForm({ catalog, initialSlug, lockProduct = false }: Props) {
  const initial = catalog.products.find((item) => item.slug === initialSlug) ?? catalog.products[0];
  const [productId, setProductId] = useState(initial.id);
  const [sizeId, setSizeId] = useState("s");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [claddingId, setCladdingId] = useState(catalog.claddings[0].id);
  const [automationId, setAutomationId] = useState("");
  const [fulfillmentId, setFulfillmentId] = useState("gyartas");
  const [quantity, setQuantity] = useState(1);
  const [weekId, setWeekId] = useState("");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [company, setCompany] = useState("");
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState("");

  const product = catalog.products.find((item) => item.id === productId) ?? catalog.products[0];

  const payload = useMemo(
    () => ({
      productId,
      sizeId,
      claddingId,
      automationId: automationId || null,
      fulfillmentId,
      quantity,
      customWidth: customWidth ? Number(customWidth) : null,
      customHeight: customHeight ? Number(customHeight) : null,
    }),
    [productId, sizeId, claddingId, automationId, fulfillmentId, quantity, customWidth, customHeight],
  );

  useEffect(() => {
    let ignore = false;
    fetch("/gyurmo-api/capacity")
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) setWeeks(data.weeks || []);
      })
      .catch(() => {
        if (!ignore) setQuoteError("A műhely naptára most nem elérhető.");
      });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("/gyurmo-api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok) {
            setQuote(null);
            setQuoteError(data.error || "Az árat most nem tudtuk kiszámolni.");
            return;
          }
          setQuote(data);
          setQuoteError("");
        })
        .catch(() => setQuoteError("Az árat a műhely szervere adja, és most nem válaszol."));
    }, 180);
    return () => clearTimeout(timer);
  }, [payload]);

  useEffect(() => {
    if (!quote || !weekId) return;
    const week = weeks.find((item) => item.id === weekId);
    if (week && week.remaining < quote.capacity) setWeekId("");
  }, [quote, weekId, weeks]);

  function updateCustomer(key: keyof typeof emptyCustomer, value: string) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/gyurmo-api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, week: weekId, customer, company }),
      });
      const data = await response.json();
      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "A rendelést nem tudtuk rögzíteni.");
        return;
      }
      setOrderId(data.id);
      setStatus("done");
    } catch {
      setStatus("error");
      setMessage("A kapcsolat megszakadt. A foglalás nem biztos, hogy rögzült.");
    }
  }

  if (status === "done") {
    const week = weeks.find((item) => item.id === weekId);
    return (
      <section className="order-done">
        <p className="kicker">Rendelés</p>
        <h2>{orderId}</h2>
        <p className="lede">
          {quote?.quote
            ? "A hetet lefoglaltuk. Az árat a műhely visszaigazolja a megadott számon."
            : "A hetet lefoglaltuk. Visszahívjuk a megadott számon."}
        </p>
        {week ? <p>{week.label}</p> : null}
        {quote ? <LineList lines={quote.lines} /> : null}
        {quote && !quote.quote && quote.amount != null ? <p className="price">{ft(quote.amount)}</p> : null}
      </section>
    );
  }

  const needed = quote?.capacity ?? 3;

  return (
    <form className="order wrap" onSubmit={submit}>
      <div className="order-main">
        <fieldset className="order-step">
          <legend><span>01</span> Kapu</legend>
          {(lockProduct ? [product] : catalog.products).map((item) => (
            <button
              key={item.id}
              type="button"
              className="choice"
              aria-pressed={item.id === productId}
              onClick={() => {
                setProductId(item.id);
                setSizeId("s");
                setAutomationId("");
              }}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </fieldset>

        <fieldset className="order-step">
          <legend><span>02</span> Méret</legend>
          {product.sizes.map((size) => (
            <button
              key={size.id}
              type="button"
              className="choice"
              aria-pressed={sizeId === size.id}
              onClick={() => setSizeId(size.id)}
            >
              <span>
                {size.name} · {size.width}×{size.height} cm
              </span>
              <span>{ft(size.price)}</span>
            </button>
          ))}
          <button
            type="button"
            className="choice"
            aria-pressed={sizeId === "egyedi"}
            onClick={() => setSizeId("egyedi")}
          >
            <span>Egyedi nyílás</span>
            <span>Ajánlatra</span>
          </button>
          {sizeId === "egyedi" ? (
            <div className="form-grid">
              <label>
                Szélesség, cm
                <input
                  inputMode="numeric"
                  value={customWidth}
                  onChange={(event) => setCustomWidth(event.target.value)}
                  required
                />
              </label>
              <label>
                Magasság, cm
                <input
                  inputMode="numeric"
                  value={customHeight}
                  onChange={(event) => setCustomHeight(event.target.value)}
                  required
                />
              </label>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="order-step">
          <legend><span>03</span> Borítás</legend>
          {catalog.claddings.map((item) => (
            <button
              key={item.id}
              type="button"
              className="choice"
              aria-pressed={claddingId === item.id}
              onClick={() => setCladdingId(item.id)}
            >
              <span>{item.name}</span>
              <span className="fine">{item.detail}</span>
            </button>
          ))}
        </fieldset>

        <fieldset className="order-step">
          <legend><span>04</span> Automatika</legend>
          <button
            type="button"
            className="choice"
            aria-pressed={automationId === ""}
            onClick={() => setAutomationId("")}
          >
            <span>Nincs</span>
            <span className="fine">Kézi nyitás</span>
          </button>
          {product.automation.map((item) => (
            <button
              key={item.id}
              type="button"
              className="choice"
              aria-pressed={automationId === item.id}
              onClick={() => setAutomationId(item.id)}
            >
              <span>
                {item.name}
                <small> {item.detail}</small>
              </span>
              <span>{ft(item.price)}</span>
            </button>
          ))}
        </fieldset>

        <fieldset className="order-step">
          <legend><span>05</span> Mit kér a műhelytől</legend>
          {catalog.fulfillment.map((item) => (
            <button
              key={item.id}
              type="button"
              className="choice"
              aria-pressed={fulfillmentId === item.id}
              onClick={() => setFulfillmentId(item.id)}
            >
              <span>{item.name}</span>
              <span className="fine">{item.detail}</span>
            </button>
          ))}
        </fieldset>

        <fieldset className="order-step">
          <legend><span>06</span> Elérhetőség</legend>
          <div className="form-grid">
            <label>
              Név
              <input value={customer.name} onChange={(event) => updateCustomer("name", event.target.value)} required />
            </label>
            <label>
              Telefon
              <input value={customer.phone} onChange={(event) => updateCustomer("phone", event.target.value)} required />
            </label>
          </div>
          <label>
            Email
            <input
              type="email"
              value={customer.email}
              onChange={(event) => updateCustomer("email", event.target.value)}
              required
            />
          </label>
          <div className="form-grid">
            <label>
              Település
              <input value={customer.city} onChange={(event) => updateCustomer("city", event.target.value)} />
            </label>
            <label>
              Cím, ha szerelést kér
              <input value={customer.address} onChange={(event) => updateCustomer("address", event.target.value)} />
            </label>
          </div>
          <label>
            Megjegyzés
            <textarea rows={3} value={customer.note} onChange={(event) => updateCustomer("note", event.target.value)} />
          </label>
        </fieldset>
      </div>

      <aside className="order-side">
        <div className="order-card">
          <p className="kicker">Összegzés</p>
          {quote ? <LineList lines={quote.lines} /> : <p className="fine">Az ár számolódik.</p>}
          {quote?.quote ? <p className="price">Ajánlatra</p> : null}
          {quote && !quote.quote && quote.amount != null ? <p className="price">{ft(quote.amount)}</p> : null}
          {quote ? <p className="fine">{quote.capacity} műhelyegység ezen a héten</p> : null}

          <p className="kicker">Műhelyhét</p>
          <div className="weeks">
            {weeks.map((week) => {
              const open = week.remaining >= needed;
              return (
                <button
                  key={week.id}
                  type="button"
                  className="choice"
                  aria-pressed={weekId === week.id}
                  disabled={!open}
                  onClick={() => setWeekId(week.id)}
                >
                  <span>{week.label}</span>
                  <span className="fine">{open ? `${week.remaining} szabad` : "betelt"}</span>
                </button>
              );
            })}
            {weeks.length === 0 ? <p className="fine">A naptár töltődik.</p> : null}
          </div>

          <label>
            Darab
            <select value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </label>

          <input className="hp" tabIndex={-1} autoComplete="off" value={company} onChange={(event) => setCompany(event.target.value)} />
          {quoteError ? <p className="error">{quoteError}</p> : null}
          {message ? <p className="error">{message}</p> : null}
          <button className="tesla-btn order-submit" type="submit" disabled={status === "sending" || !weekId || !quote}>
            {status === "sending" ? "Rögzítés" : quote?.quote ? "Hét foglalása, ár később" : "Kapacitás lefoglalása"}
          </button>
          <p className="fine">{catalog.priceNote}</p>
        </div>
      </aside>
    </form>
  );
}

function LineList({ lines }: { lines: Line[] }) {
  return (
    <dl className="order-lines">
      {lines.map((line) => (
        <div key={line.label}>
          <dt>{line.label}</dt>
          <dd>{line.text}</dd>
        </div>
      ))}
    </dl>
  );
}
