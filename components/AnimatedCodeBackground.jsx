"use client";

import { useEffect, useRef } from "react";
import { createCodeBackground, FRAME_INTERVAL } from "@/lib/code-background";

const readFontFamily = () => getComputedStyle(document.documentElement).getPropertyValue("--font-roboto-mono").trim() || '"Roboto Mono"';

// A canvas can only be handed to a worker once, and React runs effects twice in
// development. Keep the backend attached to the element instead of rebuilding.
const backends = new WeakMap();

// The field is decoration: it must never compete with the page for the main
// thread. Where OffscreenCanvas exists the whole loop runs in a worker; the
// fallback keeps the previous throttled requestAnimationFrame loop.
const createWorkerBackend = canvas => {
  if (typeof Worker !== "function" || typeof canvas.transferControlToOffscreen !== "function") return null;
  let worker;
  try {
    worker = new Worker(new URL("../lib/code-background.worker.js", import.meta.url));
  } catch {
    return null;
  }
  const offscreen = canvas.transferControlToOffscreen();
  const post = message => worker.postMessage(message);
  return {
    init: (width, height, fontFamily, isDark) => worker.postMessage({ type: "init", canvas: offscreen, width, height, fontFamily, isDark }, [offscreen]),
    resize: (width, height) => post({ type: "resize", width, height }),
    appearance: (fontFamily, isDark) => post({ type: "appearance", fontFamily, isDark }),
    play: () => post({ type: "play" }),
    pause: () => post({ type: "pause" }),
    still: () => post({ type: "still" }),
  };
};

const createMainThreadBackend = canvas => {
  const renderer = createCodeBackground(canvas, (width, height) => {
    const surface = document.createElement("canvas");
    surface.width = width;
    surface.height = height;
    return surface;
  });
  if (!renderer) return null;
  let animationFrame = 0;
  let lastFrame = 0;
  let playing = false;
  const animate = time => {
    animationFrame = requestAnimationFrame(animate);
    if (time - lastFrame < FRAME_INTERVAL) return;
    lastFrame = time;
    renderer.draw(time);
  };
  const pause = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    playing = false;
  };
  return {
    init: (width, height, fontFamily, isDark) => {
      renderer.setAppearance(fontFamily, isDark);
      renderer.resize(width, height);
    },
    resize: (width, height) => {
      renderer.resize(width, height);
      if (!playing) renderer.draw(performance.now());
    },
    appearance: (fontFamily, isDark) => {
      renderer.setAppearance(fontFamily, isDark);
      if (!playing) renderer.draw(performance.now());
    },
    play: () => {
      if (playing) return;
      playing = true;
      lastFrame = 0;
      animationFrame = requestAnimationFrame(animate);
    },
    pause,
    still: () => {
      pause();
      renderer.draw(0);
    },
  };
};

export function AnimatedCodeBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isScrolling = false;
    let scrollResumeTimer = 0;
    let disposed = false;
    const isDark = () => document.documentElement.classList.contains("dark");

    let backend = backends.get(canvas);
    if (!backend) {
      backend = createWorkerBackend(canvas) || createMainThreadBackend(canvas);
      if (!backend) return;
      backends.set(canvas, backend);
      backend.init(window.innerWidth, window.innerHeight, readFontFamily(), isDark());
    }

    const sync = () => {
      if (motionPreference.matches) {
        backend.still();
        return;
      }
      // The intro covers the canvas. Do not keep repainting hidden decoration
      // while the browser hydrates the useful content underneath it.
      if (isScrolling || document.hidden || document.documentElement.classList.contains("portfolio-loading")) {
        backend.pause();
        return;
      }
      backend.play();
    };

    const handleResize = () => {
      backend.resize(window.innerWidth, window.innerHeight);
      backend.appearance(readFontFamily(), isDark());
      sync();
    };
    const handleAppearance = () => {
      backend.appearance(readFontFamily(), isDark());
      sync();
    };
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        sync();
      }
      clearTimeout(scrollResumeTimer);
      scrollResumeTimer = setTimeout(() => {
        isScrolling = false;
        sync();
      }, 140);
    };

    sync();
    document.fonts.ready.then(() => {
      if (disposed) return;
      handleAppearance();
    });
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("portfolio-theme-change", handleAppearance);
    window.addEventListener("portfolio-intro-complete", sync);
    motionPreference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      clearTimeout(scrollResumeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("portfolio-theme-change", handleAppearance);
      window.removeEventListener("portfolio-intro-complete", sync);
      motionPreference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      backend.pause();
    };
  }, []);
  return <canvas ref={canvasRef} className="animatedCodeBackground" aria-hidden="true" />;
}
