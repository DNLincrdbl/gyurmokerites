"use client";

import { useState } from "react";

export function InquiryForm({ kind = "kapcsolat" }: { kind?: "kapcsolat" | "karrier" }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const response = await fetch("/gyurmo-api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          message: form.get("message"),
          company: form.get("company"),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Az üzenet nem ment el.");
        setPending(false);
        return;
      }
      setSent(true);
    } catch {
      setError("A kapcsolat megszakadt.");
      setPending(false);
    }
  }

  if (sent) {
    return <p className="lede">Megkaptuk. Visszahívjuk, vagy írunk.</p>;
  }

  return (
    <form className="inquiry" onSubmit={submit}>
      <label>
        Név
        <input name="name" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Telefon
        <input name="phone" />
      </label>
      <label>
        Üzenet
        <textarea name="message" rows={5} required />
      </label>
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" />
      {error ? <p className="error">{error}</p> : null}
      <button className="button" type="submit" disabled={pending}>
        Üzenet küldése
      </button>
    </form>
  );
}
