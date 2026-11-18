"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type GateCard = {
  key: string;
  name: string;
  line: string;
  image: string;
  alt: string;
  orderHref: string;
  detailHref: string;
};

type Slide = GateCard & { loopKey: string; clone: boolean };

const headCount = 2;

export function GateSlider({ cards }: { cards: GateCard[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const domIndex = useRef(headCount);
  const jumping = useRef(false);
  const paused = useRef(false);
  const [index, setIndex] = useState(0);
  const loop = cards.length > 1;
  const slides: Slide[] = loop
    ? [
        ...cards.slice(-headCount).map((card, i) => ({ ...card, loopKey: `${card.key}-before-${i}`, clone: true })),
        ...cards.map((card) => ({ ...card, loopKey: card.key, clone: false })),
        ...cards.slice(0, headCount).map((card, i) => ({ ...card, loopKey: `${card.key}-after-${i}`, clone: true })),
      ]
    : cards.map((card) => ({ ...card, loopKey: card.key, clone: false }));

  function realFromDom(dom: number) {
    return ((dom - headCount) % cards.length + cards.length) % cards.length;
  }

  function scrollLeftFor(root: HTMLElement, card: HTMLElement) {
    return card.offsetLeft - (root.clientWidth - card.offsetWidth) / 2;
  }

  function place(dom: number, behavior: ScrollBehavior) {
    const root = scroller.current;
    const card = root?.children[dom] as HTMLElement | undefined;
    if (!root || !card) return;
    const left = scrollLeftFor(root, card);
    domIndex.current = dom;
    setIndex(realFromDom(dom));
    if (behavior === "auto") {
      jumping.current = true;
      root.scrollLeft = left;
      requestAnimationFrame(() => {
        jumping.current = false;
      });
      return;
    }
    root.scrollTo({ left, behavior });
  }

  function settle() {
    const root = scroller.current;
    if (!root || !loop || jumping.current) return;
    const rootRect = root.getBoundingClientRect();
    const center = rootRect.left + rootRect.width / 2;
    let nearest = 0;
    let best = Number.POSITIVE_INFINITY;
    [...root.children].forEach((node, i) => {
      const rect = (node as HTMLElement).getBoundingClientRect();
      const delta = Math.abs(rect.left + rect.width / 2 - center);
      if (delta < best) {
        best = delta;
        nearest = i;
      }
    });
    const realStart = headCount;
    const realEnd = headCount + cards.length - 1;
    if (nearest < realStart || nearest > realEnd) {
      place(realStart + realFromDom(nearest), "auto");
      return;
    }
    domIndex.current = nearest;
    setIndex(realFromDom(nearest));
  }

  useLayoutEffect(() => {
    if (!loop) return;
    const apply = () => {
      const root = scroller.current;
      const card = root?.children[headCount] as HTMLElement | undefined;
      if (!root || !card || card.offsetWidth === 0) return false;
      jumping.current = true;
      root.scrollLeft = scrollLeftFor(root, card);
      domIndex.current = headCount;
      requestAnimationFrame(() => {
        jumping.current = false;
      });
      return true;
    };
    if (apply()) return;
    const frame = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(frame);
  }, [loop, cards.length]);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    let timer = 0;
    const onScroll = () => {
      if (jumping.current) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, 70);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("scrollend", settle);
    return () => {
      window.clearTimeout(timer);
      root.removeEventListener("scroll", onScroll);
      root.removeEventListener("scrollend", settle);
    };
  }, [cards.length, loop]);

  useEffect(() => {
    if (!loop) return;
    const timer = window.setInterval(() => {
      if (paused.current || document.hidden || jumping.current) return;
      place(domIndex.current + 1, "smooth");
    }, 6200);
    return () => window.clearInterval(timer);
  }, [loop, slides.length]);

  return (
    <section
      className="slider-block"
      aria-label="Kapuk"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="slider-scroller" ref={scroller}>
        {slides.map((card) => (
          <article key={card.loopKey} className="gate-card" aria-hidden={card.clone || undefined} inert={card.clone || undefined}>
            <img src={card.image} alt={card.clone ? "" : card.alt} />
            <div className="gate-card-copy">
              <h2>{card.name}</h2>
              <p>{card.line}</p>
              <div className="gate-card-actions">
                <Link href={card.orderHref} className="tesla-btn" tabIndex={card.clone ? -1 : undefined}>
                  Rendelés
                </Link>
                <Link href={card.detailHref} className="tesla-btn tesla-btn-light" tabIndex={card.clone ? -1 : undefined}>
                  Részletek
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <button type="button" className="slider-next" aria-label="Következő" onClick={() => place(domIndex.current + 1, "smooth")}>
        ›
      </button>
      <div className="slider-dots">
        {cards.map((card, i) => (
          <button
            key={card.key}
            type="button"
            aria-label={card.name}
            aria-current={i === index ? "true" : undefined}
            onClick={() => place(headCount + i, "smooth")}
          />
        ))}
      </div>
    </section>
  );
}
