"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const sessionKey = "gyurmo-session";

type Kind = "szemely" | "ceg";

type Billing = {
  kind: Kind;
  name: string;
  phone: string;
  zip: string;
  city: string;
  street: string;
  companyName?: string;
  taxNumber?: string;
  contactName?: string;
};

type Account = {
  email: string;
  kind: Kind;
  billing: Billing;
};

type Draft = {
  kind: Kind;
  email: string;
  password: string;
  name: string;
  phone: string;
  zip: string;
  city: string;
  street: string;
  companyName: string;
  taxNumber: string;
  contactName: string;
};

const emptyDraft: Draft = {
  kind: "szemely",
  email: "",
  password: "",
  name: "",
  phone: "",
  zip: "",
  city: "",
  street: "",
  companyName: "",
  taxNumber: "",
  contactName: "",
};

export function AccountButton() {
  const [open, setOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    window.localStorage.removeItem("gyurmo-email");
    const token = window.sessionStorage.getItem(sessionKey);
    if (!token) return;
    let ignore = false;
    fetch("/gyurmo-api/account/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) {
          window.sessionStorage.removeItem(sessionKey);
          return null;
        }
        const data = (await response.json()) as { account: Account };
        return data.account;
      })
      .then((next) => {
        if (!ignore && next) setAccount(next);
      })
      .catch(() => {
        window.sessionStorage.removeItem(sessionKey);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="account-btn"
        aria-label={account ? "Fiók" : "Belépés"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <AccountIcon filled={Boolean(account)} />
      </button>
      {open ? (
        <AccountDialog
          account={account}
          onClose={() => setOpen(false)}
          onAccount={setAccount}
        />
      ) : null}
    </>
  );
}

function AccountDialog({
  account,
  onClose,
  onAccount,
}: {
  account: Account | null;
  onClose: () => void;
  onAccount: (account: Account | null) => void;
}) {
  const titleId = useId();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const y = window.scrollY;
    const root = document.documentElement;
    root.classList.add("scroll-lock");
    document.body.style.top = `-${y}px`;
    const blockScroll = (event: Event) => {
      const panel = document.querySelector(".account-panel");
      if (panel && event.target instanceof Node && panel.contains(event.target)) return;
      event.preventDefault();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      const scrolling = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key);
      if (!scrolling) return;
      const panel = document.querySelector(".account-panel");
      if (panel && event.target instanceof Node && panel.contains(event.target)) return;
      event.preventDefault();
    };
    document.addEventListener("wheel", blockScroll, { passive: false });
    document.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("scroll-lock");
      document.body.style.top = "";
      document.removeEventListener("wheel", blockScroll);
      document.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", onKey);
      window.scrollTo(0, y);
    };
  }, [mounted, onClose]);

  useLayoutEffect(() => {
    const el = formRef.current;
    const body = bodyRef.current;
    if (!el || !body) return;
    const next = body.offsetHeight;
    const prev = el.dataset.ready === "1" ? el.getBoundingClientRect().height : 0;
    el.dataset.ready = "1";
    el.style.transition = "none";
    if (prev === 0 || Math.abs(prev - next) < 1) {
      el.style.height = `${next}px`;
      el.getBoundingClientRect();
      el.style.transition = "";
      return;
    }
    el.style.height = `${prev}px`;
    el.getBoundingClientRect();
    el.style.transition = "";
    el.style.height = `${next}px`;
  }, [mounted, mode, draft.kind, error, notice]);

  if (!mounted) return null;

  function update(key: keyof Draft, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    if (mode === "forgot") {
      try {
        const response = await fetch("/gyurmo-api/account/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: draft.email, phone: draft.phone, password: draft.password }),
        });
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        if (!response.ok) {
          setError(data.error || "A jelszót nem tudtuk cserélni.");
          update("password", "");
          return;
        }
        setDraft(emptyDraft);
        setMode("login");
        setNotice("Az új jelszóval be lehet lépni.");
      } catch {
        setError("A műhely most nem elérhető.");
        update("password", "");
      } finally {
        setBusy(false);
      }
      return;
    }
    const path = mode === "login" ? "login" : "register";
    const body =
      mode === "login"
        ? { email: draft.email, password: draft.password }
        : { ...draft, password: draft.password };
    try {
      const response = await fetch(`/gyurmo-api/account/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string; token?: string; account?: Account };
      if (!response.ok || !data.token || !data.account) {
        setError(data.error || "Nem sikerült. Próbáld újra.");
        update("password", "");
        return;
      }
      window.sessionStorage.setItem(sessionKey, data.token);
      onAccount(data.account);
      setDraft(emptyDraft);
    } catch {
      setError("A műhely most nem elérhető.");
      update("password", "");
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    const token = window.sessionStorage.getItem(sessionKey);
    window.sessionStorage.removeItem(sessionKey);
    onAccount(null);
    onClose();
    if (!token) return;
    await fetch("/gyurmo-api/account/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => undefined);
  }

  const title = account ? "Fiók" : mode === "register" ? "Regisztráció" : mode === "forgot" ? "Új jelszó" : "Belépés";
  const lead = account ? account.email : mode === "forgot" ? "A számlán megadott telefonnal cserélhető." : "";

  return createPortal(
    <div className="account-layer" onClick={onClose}>
      <section
        className="account-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="account-head">
          <AccountIcon filled={Boolean(account)} />
          <div>
            <h2 id={titleId}>{title}</h2>
            {lead ? <p>{lead}</p> : null}
          </div>
          <button type="button" className="account-close" aria-label="Bezárás" onClick={onClose}>
            ×
          </button>
        </header>
        {account ? (
          <SignedIn account={account} onLeave={leave} />
        ) : (
          <form ref={formRef} className="account-form" onSubmit={submit}>
            <div ref={bodyRef} className="account-form-in">
            {mode === "forgot" ? null : (
              <div className="account-modes" role="tablist" aria-label="Belépés vagy regisztráció">
                <button type="button" aria-pressed={mode === "login"} onClick={() => { setMode("login"); setError(""); setNotice(""); }}>
                  Belépés
                </button>
                <button type="button" aria-pressed={mode === "register"} onClick={() => { setMode("register"); setError(""); setNotice(""); }}>
                  Regisztráció
                </button>
              </div>
            )}
            {mode === "register" ? (
              <div className="account-modes" role="tablist" aria-label="Számlázás típusa">
                <button type="button" aria-pressed={draft.kind === "szemely"} onClick={() => update("kind", "szemely")}>
                  Magánszemély
                </button>
                <button type="button" aria-pressed={draft.kind === "ceg"} onClick={() => update("kind", "ceg")}>
                  Cég
                </button>
              </div>
            ) : null}
            {mode === "register" ? (
              <KindFields draft={draft} onChange={update} />
            ) : null}
            <Field
              label="Email"
              type="email"
              value={draft.email}
              autoComplete="email"
              onChange={(value) => update("email", value)}
            />
            {mode === "register" || mode === "forgot" ? (
              <Field
                label={mode === "forgot" ? "Számlázási telefon" : "Telefon"}
                type="tel"
                value={draft.phone}
                autoComplete="tel"
                onChange={(value) => update("phone", value)}
              />
            ) : null}
            {mode === "register" ? (
              <div className="account-pair">
                <Field label="Irányítószám" value={draft.zip} autoComplete="postal-code" onChange={(value) => update("zip", value)} />
                <Field label="Város" value={draft.city} autoComplete="address-level2" onChange={(value) => update("city", value)} />
              </div>
            ) : null}
            {mode === "register" ? (
              <Field
                label={draft.kind === "ceg" ? "Székhely" : "Számlázási cím"}
                value={draft.street}
                autoComplete="street-address"
                onChange={(value) => update("street", value)}
              />
            ) : null}
            <Field
              label={mode === "forgot" ? "Új jelszó" : "Jelszó"}
              type="password"
              value={draft.password}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              onChange={(value) => update("password", value)}
            />
            {mode === "register" || mode === "forgot" ? (
              <p className="account-note">
                {mode === "forgot"
                  ? "A régi belépések ezután nem érvényesek. Legalább 10 karakter, betű és szám."
                  : "Legalább 10 karakter, betű és szám. A jelszót titkosítva tároljuk."}
              </p>
            ) : null}
            {notice ? <p className="account-note">{notice}</p> : null}
            {error ? <p className="error">{error}</p> : null}
            <button type="submit" className="tesla-btn account-submit" disabled={busy}>
              {busy ? "Egy pillanat" : mode === "login" ? "Belépés" : mode === "forgot" ? "Jelszó csere" : "Regisztráció"}
            </button>
            {mode === "login" ? (
              <button type="button" className="account-text" onClick={() => { setMode("forgot"); setError(""); setNotice(""); }}>
                Elfelejtett jelszó
              </button>
            ) : null}
            {mode === "forgot" ? (
              <button type="button" className="account-text" onClick={() => { setMode("login"); setError(""); }}>
                Vissza a belépéshez
              </button>
            ) : null}
            </div>
          </form>
        )}
      </section>
    </div>,
    document.body,
  );
}

function SignedIn({ account, onLeave }: { account: Account; onLeave: () => void }) {
  const billing = account.billing;
  const address = `${billing.zip} ${billing.city}, ${billing.street}`;
  return (
    <div className="account-in">
      <dl className="account-bill">
        <div>
          <dt>Számlázás</dt>
          <dd>{account.kind === "ceg" ? "Cég" : "Magánszemély"}</dd>
        </div>
        {account.kind === "ceg" ? (
          <>
            <div>
              <dt>Cégnév</dt>
              <dd>{billing.companyName}</dd>
            </div>
            <div>
              <dt>Adószám</dt>
              <dd>{billing.taxNumber}</dd>
            </div>
            <div>
              <dt>Kapcsolattartó</dt>
              <dd>{billing.contactName}</dd>
            </div>
          </>
        ) : (
          <div>
            <dt>Név</dt>
            <dd>{billing.name}</dd>
          </div>
        )}
        <div>
          <dt>Cím</dt>
          <dd>{address}</dd>
        </div>
        <div>
          <dt>Telefon</dt>
          <dd>{billing.phone}</dd>
        </div>
      </dl>
      <button type="button" className="tesla-btn account-submit" onClick={onLeave}>
        Kilépés
      </button>
    </div>
  );
}

function KindFields({
  draft,
  onChange,
}: {
  draft: Draft;
  onChange: (key: keyof Draft, value: string) => void;
}) {
  return (
    <div className="account-kind">
      <div
        className={`account-kind-pane${draft.kind === "szemely" ? " is-on" : ""}`}
        inert={draft.kind !== "szemely"}
        aria-hidden={draft.kind !== "szemely"}
      >
        <Field label="Név" value={draft.name} autoComplete="name" onChange={(value) => onChange("name", value)} />
      </div>
      <div
        className={`account-kind-pane${draft.kind === "ceg" ? " is-on" : ""}`}
        inert={draft.kind !== "ceg"}
        aria-hidden={draft.kind !== "ceg"}
      >
        <Field label="Cégnév" value={draft.companyName} autoComplete="organization" onChange={(value) => onChange("companyName", value)} />
        <Field label="Adószám" value={draft.taxNumber} autoComplete="off" placeholder="12345678-1-12" onChange={(value) => onChange("taxNumber", value)} />
        <Field label="Kapcsolattartó" value={draft.contactName} autoComplete="name" onChange={(value) => onChange("contactName", value)} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <label>
      {label}
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function AccountIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="account-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.15" />
      <circle cx="12" cy="9.7" r="2.35" fill={filled ? "currentColor" : "none"} />
      <path d="M7.15 17.35c.85-2.15 2.45-3.15 4.85-3.15s4 .95 4.85 3.15" />
    </svg>
  );
}
