"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/portfolio";
const SPIN_CHARACTERS = ["◆", "7", "✦"];
const SPIN_MS = 1150;
const isBlank = character => character === " " || character === " ";
const REEL = [...projects, ...projects, ...projects].map(project => project.title);
export function CasinoProjectButton({
  label,
  hover,
  aria,
  drawn
}) {
  // The two labels share one reel per character, so the shorter one is padded on both sides to stay centered.
  const length = Math.max(label.length, hover.length);
  const center = text => " ".repeat(Math.floor((length - text.length) / 2)) + text + " ".repeat(Math.ceil((length - text.length) / 2));
  const initialLabel = center(label);
  const hoverLabel = center(hover);
  const [phase, setPhase] = useState("idle");
  const [stop, setStop] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const winnerRef = useRef(-1);
  const timersRef = useRef([]);
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);
  const land = () => {
    const project = projects[winnerRef.current];
    const card = document.getElementById(project.slug);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPhase("won");
    setAnnouncement(`${drawn} ${project.title}`);
    if (card) {
      card.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center"
      });
      card.querySelector(".projectActions a")?.focus({
        preventScroll: true
      });
      card.classList.remove("isJackpot");
      void card.offsetWidth;
      card.classList.add("isJackpot");
      window.dispatchEvent(new CustomEvent("jackpot", {
        detail: {
          color: project.accent
        }
      }));
      timersRef.current.push(setTimeout(() => card.classList.remove("isJackpot"), 2400));
    }
    timersRef.current.push(setTimeout(() => setPhase("idle"), 1800));
  };
  const spin = () => {
    if (phase !== "idle") return;
    let winner = Math.floor(Math.random() * projects.length);
    if (winner === winnerRef.current) winner = (winner + 1) % projects.length;
    winnerRef.current = winner;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      land();
      return;
    }
    setStop(0);
    setPhase("spinning");
    requestAnimationFrame(() => requestAnimationFrame(() => setStop(projects.length * 2 + winner)));
    timersRef.current.push(setTimeout(land, SPIN_MS));
  };
  return <>
      <button type="button" className={`button primary casinoButton ${phase === "idle" ? "" : "isSpinning"}`} aria-label={`${label} — ${aria}`} onClick={spin}>
        <span className="casinoButtonText" aria-hidden="true">
          {Array.from(initialLabel).map((character, index) => {
          const sequence = isBlank(character) && isBlank(hoverLabel[index]) ? Array(5).fill(" ") : [character, ...[0, 1, 2].map(offset => SPIN_CHARACTERS[(index + offset) % SPIN_CHARACTERS.length]), hoverLabel[index]];
          return <span className="casinoButtonSlot" key={index} style={{
            "--i": index
          }}>
                <span className="casinoButtonReel">
                  {sequence.map((item, sequenceIndex) => <span key={sequenceIndex}>{item}</span>)}
                </span>
              </span>;
        })}
        </span>
        {phase !== "idle" && <span className="jackpotWindow" aria-hidden="true">
            <span className="jackpotSlot">
              <span className="jackpotReel" style={{
              "--stop": stop
            }}>
                {REEL.map((title, index) => <span key={index}>{title}</span>)}
              </span>
            </span>
          </span>}
      </button>
      <span className="srOnly" aria-live="polite">{announcement}</span>
    </>;
}
