"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WindowScrollSequence({ children, active = true }) {
  const sequenceRef = useRef(null);

  useLayoutEffect(() => {
    if (!active) return;

    gsap.registerPlugin(ScrollTrigger);

    const sequence = sequenceRef.current;
    if (!sequence) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray(".windowScrollPanel", sequence);
        const frames = panels.map(panel => panel.querySelector(".windowScrollFrame"));

        if (frames.some(frame => !frame)) return;

        gsap.set(frames.slice(1), {
          scale: 0.68,
          yPercent: 22,
          autoAlpha: 0,
          filter: "brightness(0.78)"
        });
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: sequence,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.45,
            invalidateOnRefresh: true
          }
        });

        frames.slice(1).forEach((currentFrame, index) => {
          timeline
            .to(frames[index], {
              scale: 0.68,
              yPercent: -5,
              autoAlpha: 0,
              filter: "brightness(0.68)",
              duration: 1,
              ease: "none"
            }, index)
            .to(currentFrame, {
              scale: 1,
              yPercent: 0,
              autoAlpha: 1,
              filter: "brightness(1)",
              duration: 1,
              ease: "none"
            }, index);
        });

        ScrollTrigger.refresh();
      });
    }, sequence);

    return () => {
      media.revert();
      context.revert();
    };
  }, [active]);

  return <div ref={sequenceRef} className="windowScrollSequence">
    {children}
  </div>;
}
