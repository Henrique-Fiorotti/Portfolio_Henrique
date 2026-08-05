"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
const INITIAL_LABEL = "Conhecer Projetos";
const HOVER_LABEL = "Explorar Projetos";
const SPIN_CHARACTERS = ["◆", "7", "✦"];
export function CasinoProjectButton() {
  const buttonRef = useRef(null);
  const isHoveringRef = useRef(false);
  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    const reels = Array.from(button.querySelectorAll(".casinoButtonReel"));
    return () => {
      gsap.killTweensOf(reels);
    };
  }, []);
  const spin = showHoverLabel => {
    const button = buttonRef.current;
    if (!button || isHoveringRef.current === showHoverLabel) return;
    isHoveringRef.current = showHoverLabel;
    const reels = Array.from(button.querySelectorAll(".casinoButtonReel"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    button.classList.toggle("isCasinoActive", showHoverLabel);
    gsap.killTweensOf(reels);
    if (reducedMotion) {
      gsap.set(reels, {
        y: showHoverLabel ? "-400%" : "0%"
      });
      return;
    }
    if (showHoverLabel) {
      gsap.set(reels, {
        y: "0%"
      });
      gsap.to(reels, {
        y: "-400%",
        duration: 0.62,
        ease: "power3.inOut",
        stagger: {
          each: 0.018,
          from: "start"
        }
      });
      return;
    }
    gsap.to(reels, {
      y: "-800%",
      duration: 0.62,
      ease: "power3.inOut",
      stagger: {
        each: 0.018,
        from: "start"
      },
      onComplete: () => gsap.set(reels, {
        y: "0%"
      })
    });
  };
  return <a ref={buttonRef} className="button primary casinoButton" href="#projetos" aria-label="Conhecer projetos" onMouseEnter={() => spin(true)} onMouseLeave={() => spin(false)} onFocus={() => spin(true)} onBlur={() => spin(false)}>
      
      <span className="casinoButtonText" aria-hidden="true">
        {Array.from(INITIAL_LABEL).map((character, index) => {
        const hoverCharacter = HOVER_LABEL[index];
        const isSpace = character === " ";
        const sequence = isSpace ? [" ", " ", " ", " ", " ", " ", " ", " ", " "] : [character, SPIN_CHARACTERS[index % SPIN_CHARACTERS.length], SPIN_CHARACTERS[(index + 1) % SPIN_CHARACTERS.length], SPIN_CHARACTERS[(index + 2) % SPIN_CHARACTERS.length], hoverCharacter, SPIN_CHARACTERS[(index + 2) % SPIN_CHARACTERS.length], SPIN_CHARACTERS[(index + 1) % SPIN_CHARACTERS.length], SPIN_CHARACTERS[index % SPIN_CHARACTERS.length], character];
        return <span className="casinoButtonSlot" key={`${character}-${index}`}>
              <span className="casinoButtonReel">
                {sequence.map((item, sequenceIndex) => <span key={sequenceIndex}>{item === " " ? "\u00a0" : item}</span>)}
              </span>
            </span>;
      })}
      </span>
    </a>;
}
