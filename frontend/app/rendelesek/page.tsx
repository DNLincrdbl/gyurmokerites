"use client";

import { useEffect, useState } from "react";
import { ft } from "@/lib/format";

type Line = { label: string; text: string };
type Order = {
  id: string;
  createdAt: string;
  status: string;
  week: string;
  capacity: number;
  total: number | null;
  name: string;
  phone: string;
  email: string;
  city: string;
  note: string;
  lines: Line[];
};
type Inquiry = {
  id: number;
  createdAt: string;
  kind: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const statusLabel: Record<string, string> = {
  rogzitett: "Rögzítve",
  ajanlat: "Ajánlatra vár",
  torolve: "Törölve",
};

export default function OrdersPage() {
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem("gyurmo-admin") || "";
    setToken(saved);
    setReady(true);
    if (saved) load(saved);
  }, []);

  async function load(value: string) {
    setError("");
    const response = await fetch("/gyurmo-api/orders", { headers: { "x-admin-token": value } });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Nem sikerült belépni.");
      setOrders([]);
      return;
    }
    sessionStorage.setItem("gyurmo-admin", value);
    setOrders(data.orders);
    setInquiries(data.inquiries);
  }

  if (!ready) return null;

  return (
    <section className="wrap admin">
      <p className="kicker">Műhelynapló</p>
      <h1>Rendelések</h1>
      <form
        className="admin-lock"
        onSubmit={(event) => {
          event.preventDefault();
          load(token);
        }}
      >
        <label>
          Kulcs
          <input value={token} onChange={(event) => setToken(event.target.value)} type="password" />
        </label>
        <button className="button" type="submit">
          Megnyitás
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}

      <div className="admin-list">
        {orders.map((order) => (
          <article key={order.id}>
            <header>
              <strong>{order.id}</strong>
              <span>{statusLabel[order.status] || order.status}</span>
            </header>
            <p>
              {order.name} · {order.phone}
              {order.email ? ` · ${order.email}` : ""}
            </p>
            <p>
              {order.week}
              {order.city ? ` · ${order.city}` : ""} · {order.capacity} egység
            </p>
            {order.lines.map((line) => (
              <p key={line.label}>
                <span className="fine">{line.label}</span> {line.text}
              </p>
            ))}
            {order.note ? <p>{order.note}</p> : null}
            <p className="price">{order.total == null ? "Ajánlatra" : ft(order.total)}</p>
            <p className="fine">{new Date(order.createdAt).toLocaleString("hu-HU")}</p>
          </article>
        ))}
      </div>

      {inquiries.length > 0 ? (
        <>
          <h2>Üzenetek</h2>
          <div className="admin-list">
            {inquiries.map((item) => (
              <article key={item.id}>
                <header>
                  <strong>{item.name}</strong>
                  <span>{item.kind}</span>
                </header>
                <p>
                  {item.email}
                  {item.phone ? ` · ${item.phone}` : ""}
                </p>
                <p>{item.message}</p>
                <p className="fine">{new Date(item.createdAt).toLocaleString("hu-HU")}</p>
              </article>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
