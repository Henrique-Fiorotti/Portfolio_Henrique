"use client";

import { useEffect, useRef } from "react";
const SYMBOLS = "01=*%#";
const LINES = ["Henrique", "Fiorotti"];
const STEP = 55;
// What the server renders before the script runs: fixed, so it matches on hydration and the real name never flashes first.
const masked = word => Array.from(word, (_, index) => SYMBOLS[(word.charCodeAt(index) + index) % SYMBOLS.length]).join("");

// The name resolves out of the same glyphs the background is drawn with.
// The glyphs are an overlay (::after, from data-mask) over the real, hidden word, so their widths never move the layout
// and the heading's text stays the name.
export function DecodeName() {
  const headingRef = useRef(null);
  useEffect(() => {
    const heading = headingRef.current;
    const done = () => {
      heading.dataset.decoded = "";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      done();
      return;
    }
    // Strict Mode runs this twice in development; the first cleanup marked it decoded.
    delete heading.dataset.decoded;
    const lines = Array.from(heading.children);
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
        line.dataset.mask = Array.from(LINES[lineIndex], (character, index) => {
          if (now - start >= 250 + (lineIndex * 8 + index) * 45) return character;
          settled = false;
          return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        }).join("");
      });
      if (settled) {
        cancelAnimationFrame(frame);
        done();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      done();
    };
  }, []);
  return <h1 ref={headingRef} aria-label="Henrique Fiorotti">
      <span aria-hidden="true" data-mask={masked(LINES[0])}>{LINES[0]}</span> <span aria-hidden="true" data-mask={masked(LINES[1])}>{LINES[1]}</span>
    </h1>;
}
