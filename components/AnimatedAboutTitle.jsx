"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TITLE = "Curiosidade, código e atenção aos detalhes.";
const WORDS = TITLE.split(" ");

export function AnimatedAboutTitle() {
  const titleRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const title = titleRef.current;
    const words = wordsRef.current.filter(Boolean);
    const detailWord = words.at(-1);
    if (!title || !words.length || !detailWord) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      gsap.set(words, { clearProps: "all" });
      gsap.set(detailWord, { color: "var(--blue)" });
      return;
    }

    gsap.set(words, { autoAlpha: 0, y: 24, filter: "blur(7px)" });
    let timeline;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();

      timeline = gsap.timeline();
      timeline.to(words, {
        duration: 0.55,
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        stagger: 0.1,
        ease: "power3.out"
      });
      timeline.to(detailWord, {
        duration: 0.5,
        color: "var(--blue)",
        scale: 1.04,
        ease: "power2.out"
      }, "+=0.12");
      timeline.to(detailWord, {
        duration: 0.3,
        scale: 1,
        ease: "power2.inOut"
      });
    }, { threshold: 0.45, rootMargin: "0px 0px -8%" });

    observer.observe(title);

    return () => {
      observer.disconnect();
      timeline?.kill();
    };
  }, []);

  return <h2 ref={titleRef} className="animatedAboutTitle" aria-label={TITLE}>
      {WORDS.map((word, index) => <span
        ref={node => { wordsRef.current[index] = node; }}
        className="animatedAboutWord"
        aria-hidden="true"
        key={word}
      >{word}</span>)}
    </h2>;
}
