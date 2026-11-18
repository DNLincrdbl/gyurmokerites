"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";

export function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {faqs.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q} className={`faq-item${expanded ? " is-open" : ""}`}>
            <button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? -1 : index)}>
              {item.q}
            </button>
            <div className="faq-answer">
              <div>
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
