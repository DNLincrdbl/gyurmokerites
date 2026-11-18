"use client";

import { useEffect, useRef, useState } from "react";

const CUT = 3;
const WIDE = "(min-width: 981px)";

export function IntroGate() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<"play" | "open" | "gone">("play");
  const [still, setStill] = useState("");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia(WIDE).matches;
    if (reduce || !desktop) {
      setPhase("gone");
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    const html = document.documentElement;
    html.classList.add("intro-lock");
    video.src = "/nyito.mp4";
    video.load();

    let raf = 0;
    let dead = false;

    const reveal = () => {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(raf);
      html.classList.remove("intro-lock");
      setPhase("gone");
    };

    const cut = () => {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(raf);
      video.pause();
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) {
        reveal();
        return;
      }
      context.drawImage(video, 0, 0, width, height);
      setStill(canvas.toDataURL("image/jpeg", 0.86));
      setPhase("open");
    };

    const tick = () => {
      if (dead) return;
      if (video.currentTime >= CUT) {
        cut();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (dead) return;
      video.play().then(() => {
        if (!dead) raf = requestAnimationFrame(tick);
      }).catch(() => reveal());
    };

    if (video.readyState >= 2) start();
    else video.addEventListener("canplay", start, { once: true });
    video.addEventListener("error", reveal, { once: true });

    const giveUp = window.setTimeout(() => {
      if (!dead && video.currentTime < 0.05) reveal();
    }, 4000);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(giveUp);
      video.removeEventListener("canplay", start);
      video.removeEventListener("error", reveal);
      html.classList.remove("intro-lock");
    };
  }, []);

  useEffect(() => {
    if (phase === "play") return;
    if (phase === "gone") {
      document.documentElement.classList.remove("intro-lock");
      return;
    }
    const backup = window.setTimeout(() => setPhase("gone"), 1400);
    return () => window.clearTimeout(backup);
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div className={`intro${phase === "open" ? " intro-open" : ""}`} aria-hidden>
      {phase === "play" ? (
        <video ref={videoRef} className="intro-video" muted playsInline preload="auto" />
      ) : (
        <>
          <div className="intro-pane intro-left" onAnimationEnd={() => setPhase("gone")}>
            <div className="intro-still" style={{ backgroundImage: `url(${still})` }} />
          </div>
          <div className="intro-pane intro-right">
            <div className="intro-still" style={{ backgroundImage: `url(${still})` }} />
          </div>
        </>
      )}
    </div>
  );
}
