"use client";

import { useEffect, useRef } from "react";
const SYMBOLS = ["0", "1", "=", "*", "%", "#"];
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
    const resize = () => {
      const pixelRatio = 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    const fieldStrength = (x, y, centerX, centerY, radiusX, radiusY) => {
      const normalizedX = (x - centerX) / radiusX;
      const normalizedY = (y - centerY) / radiusY;
      return Math.exp(-(normalizedX * normalizedX + normalizedY * normalizedY) * 1.8);
    };
    const draw = time => {
      const isDark = document.documentElement.classList.contains("dark");
      const seconds = time / 1000;
      const cellWidth = width < 640 ? 15 : 18;
      const cellHeight = width < 640 ? 17 : 20;
      const columns = Math.ceil(width / cellWidth) + 1;
      const rows = Math.ceil(height / cellHeight) + 1;
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
      context.clearRect(0, 0, width, height);
      context.font = `600 ${width < 640 ? 9 : 10}px "Roboto Mono", monospace`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (let row = 0; row < rows; row += 1) {
        const y = row * cellHeight;
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellWidth;
          const seed = hash(column, row);
          let influence = 0;
          for (const field of fields) {
            influence += fieldStrength(x, y, field.x, field.y, field.rx, field.ry) * field.power;
          }
          const ripple = .88 + .12 * Math.sin(seconds * 1.7 + column * .16 + row * .11 + seed * 5);
          influence = Math.min(1, influence * ripple);
          if (influence > .13) {
            const symbol = influence > .68 ? "#" : influence > .43 ? seed > .48 ? "#" : "%" : seed > .55 ? "%" : "*";
            const alpha = .16 + influence * .47;
            context.fillStyle = isDark
              ? `rgba(115, 170, 255, ${alpha * .72})`
              : `rgba(0, 74, 173, ${alpha})`;
            context.fillText(symbol, x, y);
          } else {
            const symbolIndex = Math.floor(seed * 3);
            const alpha = .1 + seed * .07;
            context.fillStyle = isDark
              ? `rgba(220, 214, 235, ${alpha * .62})`
              : `rgba(36, 33, 43, ${alpha})`;
            context.fillText(SYMBOLS[symbolIndex], x, y);
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
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("portfolio-theme-change", handleThemeChange);
    motionPreference.addEventListener("change", start);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(scrollResumeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("portfolio-theme-change", handleThemeChange);
      motionPreference.removeEventListener("change", start);
    };
  }, []);
  return <canvas ref={canvasRef} className="animatedCodeBackground" aria-hidden="true" />;
}
