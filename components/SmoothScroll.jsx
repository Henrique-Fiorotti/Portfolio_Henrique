"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    gsap.registerPlugin(ScrollTrigger);
    let cleanup = () => {};
    const updateMotion = () => {
      cleanup();
      if (reducedMotion.matches) return;
      const lenis = new Lenis({
        duration: 1.15,
        easing: value => Math.min(1, 1.001 - Math.pow(2, -10 * value)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.2,
        anchors: true
      });
      const updateScrollTrigger = () => ScrollTrigger.update();
      const animate = time => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(animate);
      ScrollTrigger.refresh();

      cleanup = () => {
        gsap.ticker.remove(animate);
        lenis.off("scroll", updateScrollTrigger);
        lenis.destroy();
      };
    };
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);
    return () => {
      cleanup();
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  return null;
}
