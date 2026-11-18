import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap page-intro">
      <p className="kicker">404</p>
      <h1>Ez az oldal nincs meg.</h1>
      <Link href="/">Vissza a kezdőre</Link>
    </section>
  );
}
