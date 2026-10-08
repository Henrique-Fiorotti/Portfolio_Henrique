"use client";

import { useEffect, useRef } from "react";
const SYMBOLS = "01=*%#";
const LINES = ["Henrique", "Fiorotti"];
const STEP = 55;

// The name resolves out of the same glyphs the background is drawn with.
export function DecodeName() {
  const headingRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lines = Array.from(headingRef.current.children);
    const start = performance.now();
    let frame = 0;
    let lastStep = -1;
    const tick = now => {
      frame = requestAnimationFrame(tick);
      const step = Math.floor((now - start) / STEP);
      if (step === lastStep) return;
      lastStep = step;
      let settled = true;
      lines.forEach((line, lineIndex) => {
        line.textContent = Array.from(LINES[lineIndex], (character, index) => {
          if (now - start >= 250 + (lineIndex * 8 + index) * 45) return character;
          settled = false;
          return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }).join("");
      });
      if (settled) cancelAnimationFrame(frame);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lines.forEach((line, lineIndex) => line.textContent = LINES[lineIndex]);
    };
  }, []);
  return <h1 ref={headingRef} aria-label="Henrique Fiorotti"><span aria-hidden="true">Henrique</span> <span aria-hidden="true">Fiorotti</span></h1>;
}
