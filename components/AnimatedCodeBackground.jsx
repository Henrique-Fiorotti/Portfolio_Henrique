"use client";

import { useEffect, useRef } from "react";
const FRAME_INTERVAL = 1000 / 20;
const hash = (column, row) => {
  const value = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
  return value - Math.floor(value);
};
export function AnimatedCodeBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let scrollResumeTimer = 0;
    let isScrolling = false;
    let columns = 0;
    let rows = 0;
    let cellWidth = 0;
    let cellHeight = 0;
    let seeds = [];
    let phases = [];
    // Rasterize each symbol once per font/theme/size instead of thousands of
    // fillText calls per frame. Global alpha preserves the continuous field.
    const glyphAtlas = document.createElement("canvas");
    const glyphContext = glyphAtlas.getContext("2d");
    if (!glyphContext) return;
    const glyphSize = 24;
    const glyphs = ["0", "1", "=", "*", "%", "#"];
    let atlasIsDark;
    let canvasFont = "";
    let disposed = false;
    const prepareGlyphs = () => {
      atlasIsDark = document.documentElement.classList.contains("dark");
      glyphAtlas.width = glyphSize * glyphs.length;
      glyphAtlas.height = glyphSize * 2;
      glyphContext.font = canvasFont;
      glyphContext.textAlign = "center";
      glyphContext.textBaseline = "middle";
      [atlasIsDark ? "#73aaff" : "#004aad", atlasIsDark ? "#dcd6eb" : "#24212b"].forEach((color, row) => {
        glyphContext.fillStyle = color;
        glyphs.forEach((glyph, column) => glyphContext.fillText(glyph, column * glyphSize + glyphSize / 2, row * glyphSize + glyphSize / 2));
      });
    };
    const resize = () => {
      const pixelRatio = 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      cellWidth = width < 640 ? 15 : 18;
      cellHeight = width < 640 ? 17 : 20;
      columns = Math.ceil(width / cellWidth) + 1;
      rows = Math.ceil(height / cellHeight) + 1;
      seeds = new Float64Array(columns * rows);
      phases = new Float64Array(columns * rows);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const index = row * columns + column;
          seeds[index] = hash(column, row);
          phases[index] = column * .16 + row * .11 + seeds[index] * 5;
        }
      }
      const fontFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-roboto-mono").trim() || '"Roboto Mono"';
      canvasFont = `600 ${width < 640 ? 9 : 10}px ${fontFamily}, monospace`;
      prepareGlyphs();
    };
    const draw = time => {
      const isDark = document.documentElement.classList.contains("dark");
      if (atlasIsDark !== isDark) prepareGlyphs();
      const seconds = time / 1000;
      const fields = [{
        x: width * (.12 + .35 * (Math.sin(seconds * .21) + 1) / 2),
        y: height * (.18 + .52 * (Math.cos(seconds * .16) + 1) / 2),
        rx: Math.max(250, width * .29),
        ry: Math.max(220, height * .4),
        power: 1
      }, {
        x: width * (.62 + .27 * Math.cos(seconds * .13)),
        y: height * (.54 + .31 * Math.sin(seconds * .18)),
        rx: Math.max(300, width * .34),
        ry: Math.max(240, height * .34),
        power: .9
      }, {
        x: width * (.5 + .42 * Math.sin(seconds * .09 + 2.4)),
        y: height * (.8 + .16 * Math.cos(seconds * .12 + 1.1)),
        rx: Math.max(220, width * .23),
        ry: Math.max(180, height * .28),
        power: .72
      }];
      // The Gaussian separates into horizontal and vertical factors. Calculate
      // these per row/column, preserving the field instead of thousands of exp()
      // calls per frame. Cell seeds/phases are cached until the viewport changes.
      const influences = fields.map(field => ({
        x: Array.from({ length: columns }, (_, column) => Math.exp(-Math.pow((column * cellWidth - field.x) / field.rx, 2) * 1.8)),
        y: Array.from({ length: rows }, (_, row) => Math.exp(-Math.pow((row * cellHeight - field.y) / field.ry, 2) * 1.8) * field.power),
      }));
      context.clearRect(0, 0, width, height);
      for (let row = 0; row < rows; row += 1) {
        const y = row * cellHeight;
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellWidth;
          const index = row * columns + column;
          const seed = seeds[index];
          let influence = 0;
          for (const field of influences) {
            influence += field.x[column] * field.y[row];
          }
          const ripple = .88 + .12 * Math.sin(seconds * 1.7 + phases[index]);
          influence = Math.min(1, influence * ripple);
          if (influence > .13) {
            const symbol = influence > .68 ? "#" : influence > .43 ? seed > .48 ? "#" : "%" : seed > .55 ? "%" : "*";
            const alpha = .16 + influence * .47;
            context.globalAlpha = isDark ? alpha * .72 : alpha;
            context.drawImage(glyphAtlas, glyphs.indexOf(symbol) * glyphSize, 0, glyphSize, glyphSize, x - glyphSize / 2, y - glyphSize / 2, glyphSize, glyphSize);
          } else {
            const symbolIndex = Math.floor(seed * 3);
            const alpha = .1 + seed * .07;
            context.globalAlpha = isDark ? alpha * .62 : alpha;
            context.drawImage(glyphAtlas, symbolIndex * glyphSize, glyphSize, glyphSize, glyphSize, x - glyphSize / 2, y - glyphSize / 2, glyphSize, glyphSize);
          }
        }
      }
    };
    const animate = time => {
      animationFrame = window.requestAnimationFrame(animate);
      if (isScrolling || document.hidden) return;
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;
      draw(time);
    };
    const start = () => {
      window.cancelAnimationFrame(animationFrame);
      if (document.hidden) return;
      // The intro covers the canvas. Do not keep repainting hidden decoration
      // while the browser hydrates the useful content underneath it.
      if (document.documentElement.classList.contains("portfolio-loading")) return;
      if (motionPreference.matches) {
        draw(0);
      } else {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };
    const handleResize = () => {
      resize();
      if (motionPreference.matches) draw(0);
    };
    const handleThemeChange = () => {
      if (motionPreference.matches) draw(0);
    };
    const handleScroll = () => {
      isScrolling = true;
      window.clearTimeout(scrollResumeTimer);
      scrollResumeTimer = window.setTimeout(() => {
        isScrolling = false;
        lastFrame = 0;
      }, 140);
    };
    resize();
    start();
    document.fonts.ready.then(() => {
      if (disposed) return;
      prepareGlyphs();
      if (motionPreference.matches) draw(0);
    });
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("portfolio-theme-change", handleThemeChange);
    window.addEventListener("portfolio-intro-complete", start);
    motionPreference.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(scrollResumeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("portfolio-theme-change", handleThemeChange);
      window.removeEventListener("portfolio-intro-complete", start);
      motionPreference.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);
  return <canvas ref={canvasRef} className="animatedCodeBackground" aria-hidden="true" />;
}
