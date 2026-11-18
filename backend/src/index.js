import { timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import { accountByToken, billingError, billingFrom, dropSession, loginAccount, registerAccount, resetPassword } from "./accounts.js";
import { db } from "./db.js";
import { listWeeks, priceConfiguration, readCatalog } from "./catalog.js";

function loadEnv() {
  const file = join(dirname(fileURLToPath(import.meta.url)), "../.env");
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (!match) continue;
    const key = match[1].trim();
    if (!process.env[key]) process.env[key] = match[2].trim();
  }
}

loadEnv();

const app = express();
app.use(cors());
app.use(express.json({ limit: "200kb" }));

const adminToken = process.env.ADMIN_TOKEN || "";

function adminOk(header) {
  if (!adminToken || !header) return false;
  const expected = Buffer.from(adminToken);
  const given = Buffer.from(String(header));
  if (expected.length !== given.length) return false;
  return timingSafeEqual(expected, given);
}

function text(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function configurationInput(body) {
  return {
    productId: body.productId,
    sizeId: body.sizeId,
    claddingId: body.claddingId,
    automationId: body.automationId || null,
    fulfillmentId: body.fulfillmentId,
    quantity: body.quantity,
    customWidth: body.customWidth,
    customHeight: body.customHeight,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/capacity", (_req, res) => {
  const catalog = readCatalog();
  const usedStmt = db.prepare(
    "SELECT COALESCE(SUM(capacity), 0) AS used FROM orders WHERE week = ? AND status != 'torolve'",
  );
  const weeks = listWeeks(catalog).map((week) => {
    const used = usedStmt.get(week.id).used;
    const remaining = Math.max(0, catalog.workshop.weeklyCapacity - used);
    return { ...week, total: catalog.workshop.weeklyCapacity, remaining };
  });
  res.json({ weeks });
});

app.post("/api/quote", (req, res) => {
  const priced = priceConfiguration(readCatalog(), configurationInput(req.body || {}));
  if (priced.error) {
    res.status(400).json(priced);
    return;
  }
  res.json(priced);
});

app.post("/api/orders", (req, res) => {
  const body = req.body || {};
  if (text(body.company, 80)) {
    res.status(400).json({ error: "A rendelést nem tudtuk rögzíteni." });
    return;
  }

  const catalog = readCatalog();
  const priced = priceConfiguration(catalog, configurationInput(body));
  if (priced.error) {
    res.status(400).json(priced);
    return;
  }

  const weeks = listWeeks(catalog);
  const week = weeks.find((item) => item.id === body.week);
  if (!week) {
    res.status(400).json({ error: "Ez a hét nem foglalható." });
    return;
  }

  const customer = {
    name: text(body.customer?.name, 80),
    email: text(body.customer?.email, 120).toLowerCase(),
    phone: text(body.customer?.phone, 40),
    city: text(body.customer?.city, 80),
    address: text(body.customer?.address, 180),
    note: text(body.customer?.note, 1000),
  };

  if (customer.name.length < 2) {
    res.status(400).json({ error: "Kérjük a nevet." });
    return;
  }
  if (!validEmail(customer.email)) {
    res.status(400).json({ error: "Az email cím nem érvényes." });
    return;
  }
  if (customer.phone.length < 6) {
    res.status(400).json({ error: "Kérjük a telefonszámot." });
    return;
  }
  if (priced.fulfillmentId === "komplett" && customer.city.length < 2) {
    res.status(400).json({ error: "Szereléshez kell a település." });
    return;
  }

  const status = priced.quote ? "ajanlat" : "rogzitett";
  const payload = { ...priced, week, customer };

  const insert = db.transaction(() => {
    const used = db
      .prepare(
        "SELECT COALESCE(SUM(capacity), 0) AS used FROM orders WHERE week = ? AND status != 'torolve'",
      )
      .get(week.id).used;
    if (used + priced.capacity > catalog.workshop.weeklyCapacity) {
      const error = new Error("FULL");
      throw error;
    }
    const count = db.prepare("SELECT COUNT(*) AS count FROM orders").get().count + 1;
    const id = `GM-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;
    db.prepare(
      `INSERT INTO orders (
        id, created_at, status, week, capacity, total, customer_name, customer_email, customer_phone, payload
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      new Date().toISOString(),
      status,
      week.id,
      priced.capacity,
      priced.amount,
      customer.name,
      customer.email,
      customer.phone,
      JSON.stringify(payload),
    );
    return id;
  });

  try {
    const id = insert();
    res.status(201).json({
      id,
      status,
      week,
      amount: priced.amount,
      quote: priced.quote,
      lines: priced.lines,
    });
  } catch (error) {
    if (error.message === "FULL") {
      res.status(409).json({ error: "Ez a hét időközben betelt. Válasszon másikat." });
      return;
    }
    throw error;
  }
});

app.post("/api/inquiries", (req, res) => {
  const body = req.body || {};
  if (text(body.company, 80)) {
    res.status(400).json({ error: "Az üzenetet nem tudtuk rögzíteni." });
    return;
  }
  const kind = body.kind === "karrier" ? "karrier" : "kapcsolat";
  const payload = {
    name: text(body.name, 80),
    email: text(body.email, 120).toLowerCase(),
    phone: text(body.phone, 40),
    message: text(body.message, 2000),
  };
  if (payload.name.length < 2 || !validEmail(payload.email) || payload.message.length < 4) {
    res.status(400).json({ error: "Név, email és üzenet kell." });
    return;
  }
  const result = db
    .prepare("INSERT INTO inquiries (created_at, kind, payload) VALUES (?, ?, ?)")
    .run(new Date().toISOString(), kind, JSON.stringify(payload));
  res.status(201).json({ id: result.lastInsertRowid });
});

function bearer(req) {
  const header = req.get("authorization") || "";
  const match = header.match(/^Bearer\s+([a-f0-9]{64})$/i);
  return match ? match[1] : "";
}

app.post("/api/account/register", (req, res) => {
  const email = text(req.body?.email, 120).toLowerCase();
  const password = String(req.body?.password || "");
  if (password.length > 200) {
    res.status(400).json({ error: "A jelszó túl hosszú." });
    return;
  }
  if (!validEmail(email)) {
    res.status(400).json({ error: "Érvényes email kell." });
    return;
  }
  const billing = billingFrom(req.body || {}, text);
  const problem = billingError(billing, email);
  if (problem) {
    res.status(400).json({ error: problem });
    return;
  }
  const result = registerAccount({ email, password, billing });
  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.status(201).json(result);
});

app.post("/api/account/login", (req, res) => {
  const email = text(req.body?.email, 120).toLowerCase();
  const password = String(req.body?.password || "");
  if (!validEmail(email) || !password || password.length > 200) {
    res.status(400).json({ error: "Az email vagy a jelszó nem stimmel." });
    return;
  }
  const result = loginAccount({ email, password });
  if (result.error) {
    res.status(401).json({ error: result.error });
    return;
  }
  res.json(result);
});

app.post("/api/account/reset", (req, res) => {
  const email = text(req.body?.email, 120).toLowerCase();
  const phone = text(req.body?.phone, 40);
  const password = String(req.body?.password || "");
  if (password.length > 200) {
    res.status(400).json({ error: "A jelszó túl hosszú." });
    return;
  }
  if (!validEmail(email)) {
    res.status(400).json({ error: "Az email vagy a telefonszám nem stimmel." });
    return;
  }
  const result = resetPassword({ email, phone, password });
  if (result.error) {
    res.status(400).json({ error: result.error });
    return;
  }
  res.json({ ok: true });
});

app.get("/api/account/me", (req, res) => {
  const account = accountByToken(bearer(req));
  if (!account) {
    res.status(401).json({ error: "Nincs belépve." });
    return;
  }
  res.json({ account });
});

app.post("/api/account/logout", (req, res) => {
  dropSession(bearer(req));
  res.status(204).end();
});

app.get("/api/orders", (req, res) => {
  if (!adminOk(req.get("x-admin-token"))) {
    res.status(401).json({ error: "Hibás kulcs." });
    return;
  }
  const orders = db
    .prepare(
      "SELECT id, created_at, status, week, capacity, total, customer_name, customer_phone, payload FROM orders ORDER BY created_at DESC",
    )
    .all()
    .map((row) => {
      const payload = JSON.parse(row.payload);
      return {
        id: row.id,
        createdAt: row.created_at,
        status: row.status,
        week: payload.week?.label || row.week,
        capacity: row.capacity,
        total: row.total,
        name: row.customer_name,
        phone: row.customer_phone,
        email: payload.customer?.email || "",
        city: payload.customer?.city || "",
        note: payload.customer?.note || "",
        lines: payload.lines || [],
      };
    });
  const inquiries = db
    .prepare("SELECT id, created_at, kind, payload FROM inquiries ORDER BY created_at DESC")
    .all()
    .map((row) => ({ id: row.id, createdAt: row.created_at, kind: row.kind, ...JSON.parse(row.payload) }));
  res.json({ orders, inquiries });
});

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`GyurMó műhely API a ${port} porton.`);
});
