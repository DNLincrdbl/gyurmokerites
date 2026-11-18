"use client";

import { useEffect, useState } from "react";
import { quotes } from "@/lib/content";

export function QuoteRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [paused]);

  const quote = quotes[index];

  return (
    <section
      className="quote-stage center-stage"
      aria-label="Rólunk írták"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2>Rólunk írták</h2>
      <article className="quote-card">
        <p key={quote.name} className="quote-text">
          „{quote.text}”
        </p>
        <footer>{quote.name}</footer>
        <div className="slider-dots">
          {quotes.map((item, i) => (
            <button
              key={item.name}
              type="button"
              aria-label={item.name}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </article>
    </section>
  );
}
