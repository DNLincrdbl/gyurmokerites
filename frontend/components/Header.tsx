"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [solid, setSolid] = useState(!home);

  useEffect(() => {
    const onScroll = () => setSolid(!home || window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [home]);

  return (
    <header className={solid ? "nav nav-solid" : "nav"}>
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
        </div>
      </div>
    </header>
  );
}
