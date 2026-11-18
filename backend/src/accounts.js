import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "./db.js";

const dummyHash = hashPassword("gyurmo-timing-pad");

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

function passwordMatches(password, stored) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash || hash.length !== 64) return false;
  const next = scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function strongPassword(password) {
  return password.length >= 10 && /[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]/.test(password) && /\d/.test(password);
}

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

function publicAccount(row) {
  return {
    email: row.email,
    kind: row.kind,
    billing: JSON.parse(row.billing),
  };
}

function issueSession(accountId) {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  db.prepare("INSERT INTO sessions (token_hash, account_id, expires_at) VALUES (?, ?, ?)").run(
    tokenHash(token),
    accountId,
    expires,
  );
  return token;
}

export function billingFrom(body, text) {
  const kind = body.kind === "ceg" ? "ceg" : "szemely";
  const billing = {
    kind,
    name: text(body.name, 120),
    phone: text(body.phone, 40),
    zip: text(body.zip, 8),
    city: text(body.city, 80),
    street: text(body.street, 160),
  };
  if (kind === "ceg") {
    billing.companyName = text(body.companyName, 160);
    billing.taxNumber = text(body.taxNumber, 20);
    billing.contactName = text(body.contactName, 120);
  }
  return billing;
}

export function billingError(billing, email) {
  if (!email) return "Érvényes email kell.";
  if (billing.phone.length < 6) return "Kérjük a telefonszámot.";
  if (!/^\d{4}$/.test(billing.zip)) return "Az irányítószám négy számjegy.";
  if (billing.city.length < 2 || billing.street.length < 3) return "Kérjük a számlázási címet.";
  if (billing.kind === "szemely" && billing.name.length < 2) return "Kérjük a nevet.";
  if (billing.kind === "ceg") {
    if (billing.companyName.length < 2) return "Kérjük a cégnevet.";
    if (billing.contactName.length < 2) return "Kérjük a kapcsolattartó nevét.";
    if (!/^\d{8}-\d-\d{2}$/.test(billing.taxNumber)) return "Az adószám formája: 12345678-1-12.";
  }
  return "";
}

export function registerAccount({ email, password, billing }) {
  if (!strongPassword(password)) {
    return { error: "A jelszó legalább 10 karakter, betűvel és számmal." };
  }
  const existing = db.prepare("SELECT id FROM accounts WHERE email = ?").get(email);
  if (existing) return { error: "Ezzel az emaillel már van fiók." };
  const result = db
    .prepare(
      "INSERT INTO accounts (email, password_hash, kind, billing, created_at) VALUES (?, ?, ?, ?, ?)",
    )
    .run(email, hashPassword(password), billing.kind, JSON.stringify(billing), new Date().toISOString());
  const row = db.prepare("SELECT email, kind, billing FROM accounts WHERE id = ?").get(result.lastInsertRowid);
  return { token: issueSession(result.lastInsertRowid), account: publicAccount(row) };
}

export function loginAccount({ email, password }) {
  const row = db.prepare("SELECT id, email, kind, billing, password_hash FROM accounts WHERE email = ?").get(email);
  const ok = passwordMatches(password, row ? row.password_hash : dummyHash);
  if (!row || !ok) return { error: "Az email vagy a jelszó nem stimmel." };
  return { token: issueSession(row.id), account: publicAccount(row) };
}

export function accountByToken(token) {
  if (!token) return null;
  const row = db
    .prepare(
      `SELECT accounts.email, accounts.kind, accounts.billing, sessions.expires_at
       FROM sessions JOIN accounts ON accounts.id = sessions.account_id
       WHERE sessions.token_hash = ?`,
    )
    .get(tokenHash(token));
  if (!row || row.expires_at < new Date().toISOString()) return null;
  return publicAccount(row);
}

function phoneTail(value) {
  return String(value || "").replace(/\D/g, "").slice(-9);
}

export function resetPassword({ email, phone, password }) {
  if (!strongPassword(password)) {
    return { error: "A jelszó legalább 10 karakter, betűvel és számmal." };
  }
  const row = db.prepare("SELECT id, billing FROM accounts WHERE email = ?").get(email);
  scryptSync(String(password).slice(0, 200), "gyurmo-reset-pad", 16);
  let stored = "";
  if (row) {
    try {
      stored = JSON.parse(row.billing).phone || "";
    } catch {
      stored = "";
    }
  }
  const given = phoneTail(phone);
  const known = phoneTail(stored);
  if (!row || given.length < 8 || given !== known) {
    return { error: "Az email vagy a telefonszám nem stimmel." };
  }
  db.prepare("UPDATE accounts SET password_hash = ? WHERE id = ?").run(hashPassword(password), row.id);
  db.prepare("DELETE FROM sessions WHERE account_id = ?").run(row.id);
  return { ok: true };
}

export function dropSession(token) {
  if (!token) return;
  db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash(token));
}
