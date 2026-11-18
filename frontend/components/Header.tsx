"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AccountButton } from "@/components/AccountPanel";

const links = [
  { href: "/termekek", label: "Kapuk" },
  { href: "/munkaink", label: "Munkáink" },
  { href: "/butorok", label: "Bútor" },
  { href: "/muhely", label: "Műhely" },
];

export function Header() {
  const pathname = usePathname();
  const home = pathname === "/";
  const headerRef = useRef<HTMLElement>(null);
  const [solid, setSolid] = useState(!home);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(!home || window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    if (!menu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenu(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menu]);

  return (
    <header ref={headerRef} className={solid ? "nav nav-solid" : "nav"}>
      <div className="nav-inner">
        <Link href="/" className="logo-link">
          <img src="/archiv/GyurMo-logo.png" alt="GyurMó Kerítés" className="logo" />
        </Link>
        <nav className="nav-links" aria-label="Főmenü">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="nav-end">
          <Link href="/rendeles" className="nav-order">
            Rendelés
          </Link>
          <AccountButton />
          <button
            type="button"
            className={menu ? "nav-burger is-open" : "nav-burger"}
            aria-expanded={menu}
            aria-controls="site-menu"
            aria-label={menu ? "Menü bezárása" : "Menü"}
            onClick={() => setMenu((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
      <div id="site-menu" className={menu ? "nav-menu is-open" : "nav-menu"} inert={!menu} aria-hidden={!menu}>
        <nav aria-label="Főmenü">
          {links.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
