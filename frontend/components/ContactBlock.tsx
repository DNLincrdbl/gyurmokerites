import Link from "next/link";
import { InquiryForm } from "@/components/InquiryForm";
import { company } from "@/lib/format";

const mapQuery = encodeURIComponent(company.mapQuery);

export function ContactBlock() {
  return (
    <section className="contact-stage center-stage" id="kapcsolat">
      <h2>Kapcsolat</h2>
      <div className="contact-tiles">
        <article className="contact-tile contact-tile-map">
          <iframe
            title="GyurMó műhely, Délép ipari telep, Szeged"
            src={`https://maps.google.com/maps?q=${mapQuery}&z=15&hl=hu&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            className="tesla-btn"
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noreferrer"
          >
            Útvonal
          </a>
        </article>
        <article className="contact-tile contact-tile-info">
          <p className="kicker">Műhely</p>
          <h3>{company.workshop}</h3>
          <p>{company.address}</p>
          <p className="fine">{company.area}.</p>
          <dl className="contact-facts">
            <div>
              <dt>Telefon</dt>
              <dd>
                <a href={company.phoneHref}>{company.phone}</a>
              </dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href={company.emailHref}>{company.email}</a>
              </dd>
            </div>
            <div>
              <dt>Állás</dt>
              <dd>
                <a href={company.jobPhoneHref}>{company.jobPhone}</a>
              </dd>
            </div>
            <div>
              <dt>Facebook</dt>
              <dd>
                <a href={company.facebook} target="_blank" rel="noreferrer">
                  GyurMó Kerítés
                </a>
              </dd>
            </div>
          </dl>
        </article>
        <article className="contact-tile contact-tile-form">
          <h3>Üzenet</h3>
          <InquiryForm />
          <p className="fine">
            Kész kapura a <Link href="/rendeles">rendelés</Link> oldal való.
          </p>
        </article>
      </div>
    </section>
  );
}
