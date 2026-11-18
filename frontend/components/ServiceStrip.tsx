import { services } from "@/lib/content";

export function ServiceStrip() {
  return (
    <section className="service-strip" aria-label="Szolgáltatások">
      {services.map((service) => (
        <article key={service.title}>
          <ServiceIcon name={service.icon} />
          <div>
            <h2>{service.title}</h2>
            <p>{service.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function ServiceIcon({ name }: { name: (typeof services)[number]["icon"] }) {
  return (
    <svg className="service-icon" viewBox="0 0 24 24" aria-hidden="true">
      {name === "kerites" ? (
        <path d="M4 19.5V9M8 19.5V6.5M12 19.5V6.5M16 19.5V6.5M20 19.5V9M4 9.5h16" />
      ) : null}
      {name === "garazs" ? (
        <path d="M3 12.5 12 5.5l9 7M7 12.5V19M17 12.5V19M7 19h10" />
      ) : null}
      {name === "general" ? (
        <path d="M4 20V9.5L12 4l8 5.5V20M4 20h16M10 20v-6h4v6" />
      ) : null}
      {name === "auto" ? (
        <>
          <rect x="8" y="6" width="8" height="13" rx="2" />
          <circle cx="12" cy="15.4" r="1.15" />
          <path d="M17.4 8.2c1.5 1 1.5 2.8 0 3.8M19.2 6.4c2.4 1.7 2.4 4.7 0 6.4" />
        </>
      ) : null}
      {name === "lakatos" ? (
        <path d="M5 9h11v3H9v8" />
      ) : null}
      {name === "lepcso" ? <path d="M4.5 19.5H10V14h5.5V8.5H20" /> : null}
      {name === "vaz" ? (
        <path d="M4 20V8h16v12M4 8l8-4 8 4M12 4v16" />
      ) : null}
      {name === "egyedi" ? (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 4.2v2.6M12 17.2v2.6M4.2 12h2.6M17.2 12h2.6M6.6 6.6l1.8 1.8M15.6 15.6l1.8 1.8M17.4 6.6l-1.8 1.8M8.4 15.6l-1.8 1.8" />
        </>
      ) : null}
    </svg>
  );
}
