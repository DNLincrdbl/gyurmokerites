import { partners } from "@/lib/content";

export function Partners() {
  return (
    <section className="partner-stage center-stage" aria-label="Partnereink">
      <h2>Partnereink</h2>
      <div className="partner-row">
        {partners.map((partner) => (
          <figure key={partner.name} className="partner-tile">
            <img src={partner.src} alt={partner.name} />
          </figure>
        ))}
      </div>
    </section>
  );
}
