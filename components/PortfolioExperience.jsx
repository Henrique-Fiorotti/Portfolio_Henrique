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
        const name = loaderNameRef.current;
        const dot = loaderDotRef.current;

        // The intro used to animate width, left, top and font-size, which
        // relaid out the page on every frame. Everything below moves with
        // transforms instead: the widths are measured once and the pieces are
        // repositioned from their current scale, so the browser never reflows.
        const pieces = [...letters, dot];
        const widths = pieces.map(piece => piece.offsetWidth);
        const setPieceX = pieces.map(piece => gsap.quickSetter(piece, "x", "px"));
        const setNameX = gsap.quickSetter(name, "x", "px");
        const layout = () => {
          let collapsed = 0;
          pieces.forEach((piece, index) => {
            setPieceX[index](-collapsed);
            collapsed += widths[index] * (1 - gsap.getProperty(piece, "scaleX"));
          });
          // The box keeps its full width, so re-centre the visible glyphs.
          setNameX(collapsed / 2);
        };
        layout();

        // Measured when the flight starts, while the name is still unscaled:
        // changing the origin of a translation-only transform is invisible.
        let flight = { x: 0, y: 0, scale: 1 };
        const measureFlight = () => {
          const initial = letters[0].getBoundingClientRect();
          const nameRect = name.getBoundingClientRect();
          // Land the loader's H on the header's H so the crossfade does not
          // jump. The two boxes have different line heights, so match the
          // baseline side rather than the top.
          const logoRect = (brand.querySelector(".brandInitial") || brand).getBoundingClientRect();
          const scale = parseFloat(window.getComputedStyle(brand).fontSize) / parseFloat(window.getComputedStyle(name).fontSize);
          gsap.set(name, { transformOrigin: `${initial.left - nameRect.left}px ${initial.bottom - nameRect.top}px` });
          flight = {
            x: gsap.getProperty(name, "x") + logoRect.left - initial.left,
            y: gsap.getProperty(name, "y") + logoRect.bottom - initial.bottom,
            scale,
          };
        };

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
          scaleX: 0,
          stagger: 0.045,
          ease: "power2.in",
          force3D: true,
          autoRound: false,
          onUpdate: layout
        }, "+=0.5");

        tl.to(letters[LOADER_NAME.indexOf("F")], {
          duration: 0.2,
          color: "var(--ink)"
        }, "<");

        tl.to(dot, {
          duration: 0.28,
          autoAlpha: 1,
          scale: 1,
          ease: "back.out(2)",
          force3D: true,
          onUpdate: layout
        });

        tl.call(measureFlight, null, "+=0.25");
        tl.to(name, {
          duration: 0.75,
          x: () => flight.x,
          y: () => flight.y,
          scale: () => flight.scale,
          ease: "power3.inOut",
          force3D: true,
          autoRound: false
        });

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
