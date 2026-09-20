"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { WindowLayoutProvider } from "./WindowLayout";
import { SmoothScroll } from "./SmoothScroll";
import { AnimatedCodeBackground } from "./AnimatedCodeBackground";

const LOADER_NAME = "Henrique Fiorotti";
const LOADER_INITIALS = new Set([0, LOADER_NAME.indexOf("F")]);

export function PortfolioExperience({ children }) {
  const loaderRef = useRef(null);
  const loaderNameRef = useRef(null);
  const loaderLettersRef = useRef([]);
  const loaderDotRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    const content = contentRef.current;
    const brand = content?.querySelector(".brand");
    if (!content || !brand) return;
    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const finishLoading = () => {
      document.body.style.overflow = previousOverflow;
      root.classList.remove("portfolio-loading");
      content.inert = false;
      content.removeAttribute("aria-busy");
      content.style.removeProperty("opacity");
      window.dispatchEvent(new Event("portfolio-intro-complete"));
    };

    if (window.__portfolioIntroExpired || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishLoading();
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    root.classList.add("portfolio-loading");
    content.inert = true;
    content.setAttribute("aria-busy", "true");
    let ctx;
    const safetyTimer = window.setTimeout(() => {
      ctx?.revert();
      finishLoading();
    }, 8000);
    try {
      ctx = gsap.context(() => {
        const letters = loaderLettersRef.current.filter(Boolean);
        const removableLetters = letters
          .filter((_, index) => !LOADER_INITIALS.has(index))
          .reverse();
        const logoRect = brand.getBoundingClientRect();
        const logoStyle = window.getComputedStyle(brand);
        const tl = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            window.clearTimeout(safetyTimer);
            finishLoading();
          }
        });

        tl.set(loaderNameRef.current, { autoAlpha: 1 });
        tl.fromTo(letters,
          { autoAlpha: 0, y: 14, filter: "blur(5px)" },
          {
            duration: 0.24,
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.045,
            ease: "power2.out",
            force3D: true
          }
        );

        tl.to(removableLetters, {
          duration: 0.13,
          autoAlpha: 0,
          y: -8,
          width: 0,
          scaleX: 0,
          stagger: 0.045,
          ease: "power2.in",
          force3D: true,
          autoRound: false
        }, "+=0.5");

        tl.to(letters[LOADER_NAME.indexOf("F")], {
          duration: 0.2,
          color: "var(--ink)"
        }, "<");

        tl.to(loaderDotRef.current, {
          duration: 0.28,
          autoAlpha: 1,
          width: "auto",
          scale: 1,
          ease: "back.out(2)",
          force3D: true
        });

        tl.to(loaderNameRef.current, {
          duration: 0.75,
          left: logoRect.left,
          top: logoRect.top,
          xPercent: 0,
          yPercent: 0,
          fontSize: logoStyle.fontSize,
          fontWeight: logoStyle.fontWeight,
          letterSpacing: logoStyle.letterSpacing,
          ease: "power3.inOut",
          force3D: true,
          autoRound: false
        }, "+=0.25");

        tl.to(loaderRef.current, {
          duration: 0.5,
          autoAlpha: 0,
          ease: "power2.inOut",
          force3D: true
        }, "+=0.4");

        tl.to(contentRef.current, {
          duration: 0.5,
          opacity: 1,
          ease: "power2.out"
        }, "<");
      });

    } catch {
      window.clearTimeout(safetyTimer);
      ctx?.revert();
      finishLoading();
    }
    return () => {
      window.clearTimeout(safetyTimer);
      ctx?.revert();
      finishLoading();
    };
  }, []);

  return <WindowLayoutProvider>
    <SmoothScroll />
    <AnimatedCodeBackground />
    <div ref={loaderRef} className="loaderOverlay" aria-hidden="true">
      <span ref={loaderNameRef} className="loaderName" aria-hidden="true">
        {LOADER_NAME.split("").map((letter, index) => <span
          ref={node => { loaderLettersRef.current[index] = node; }}
          className={`loaderLetter ${index >= LOADER_NAME.indexOf("F") ? "loaderAccent" : ""}`}
          key={`${letter}-${index}`}
        >{letter}</span>)}
        <span ref={loaderDotRef} className="loaderDot">.</span>
      </span>
    </div>
    <main ref={contentRef} id="conteudo" className="siteContent" tabIndex={-1}>{children}</main>
  </WindowLayoutProvider>;
}
