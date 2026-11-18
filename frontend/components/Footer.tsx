import Link from "next/link";
import { company } from "@/lib/format";

const columns = [
  {
    title: "Kapuk",
    links: [
      { href: "/termekek/szemelybejaro", label: "Személybejáró" },
      { href: "/termekek/ketszarnyu", label: "Kétszárnyú" },
      { href: "/termekek/tolokapu", label: "Tolókapu" },
      { href: "/termekek/uszokapu", label: "Úszókapu" },
      { href: "/rendeles", label: "Rendelés" },
    ],
  },
  {
    title: "Műhely",
    links: [
      { href: "/muhely", label: "A műhely" },
      { href: "/munkaink", label: "Munkáink" },
      { href: "/butorok", label: "Bútor" },
      { href: "/karrier", label: "Karrier" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-top">
        <Link href="/" className="footer-logo">
          <img src="/archiv/GyurMo-logo.png" alt="GyurMó Kerítés" />
        </Link>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="footer-label">{column.title}</p>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div>
          <p className="footer-label">Kapcsolat</p>
          <a href={company.phoneHref}>{company.phone}</a>
          <a href={company.emailHref}>{company.email}</a>
          <p>{company.workshop}</p>
          <a href={company.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <p className="wrap footer-credit">
        Készítette:
        <a href="https://noctra.hu" target="_blank" rel="noreferrer">
          Noctra
        </a>
      </p>
      <div className="footer-giant" aria-hidden="true">
        <span>GYURMÓ</span>
      </div>
    </footer>
  );
}
