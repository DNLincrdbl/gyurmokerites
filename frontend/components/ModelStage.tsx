"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const FenceCanvas = dynamic(() => import("./FenceCanvas"), {
  ssr: false,
  loading: () => <p className="fine">A modell töltődik.</p>,
});

export function ModelStage() {
  const [open, setOpen] = useState(false);
  return (
    <section className="wrap stage-block">
      <div>
        <p className="kicker">Modell</p>
        <h2>A kapu forgatható.</h2>
        <p className="lede">
          Bemutató modell. Közelíteni és forgatni lehet. A saját 3D fájl ugyanezen a helyen cserélhető.
        </p>
        {open ? null : (
          <button type="button" className="button" onClick={() => setOpen(true)}>
            Modell megnyitása
          </button>
        )}
      </div>
      {open ? (
        <div className="stage">
          <FenceCanvas />
        </div>
      ) : null}
    </section>
  );
}
