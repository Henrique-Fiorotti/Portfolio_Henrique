"use client";

import { useEffect, useRef } from "react";
const SYMBOLS = ["0", "1", "=", "*", "%", "#"];
// The field drifts slowly, so 20 fps reads as smooth; each frame costs ~7 ms of glyph raster on a mid-range phone.
const FRAME_INTERVAL = 1000 / 20;
// Glyph size in px (desktop, mobile); the grid spacing scales with it.
const GLYPH_SIZE = [15, 12];
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
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    // Colors and the glyph face come from the design tokens on <html>; colors are re-read when the OS theme flips.
    const tokens = getComputedStyle(document.documentElement);
    let blue = "";
    let line = "";
    const readColors = () => {
      blue = tokens.getPropertyValue("--blue").trim();
      line = tokens.getPropertyValue("--line").trim();
    };
    readColors();
    const mono = tokens.getPropertyValue("--font-mono").trim() || "monospace";
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let seeds = new Float32Array(0);
    let seedColumns = 0;
    // The cursor drags its own field through the glyphs; it trails the pointer and fades when it leaves.
    const pointer = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      power: 0,
      targetPower: 0
    };
    const handlePointerMove = event => {
      if (event.pointerType !== "mouse") return;
      pointer.targetX = event.clientX;
      pointer.targetY = event.clientY;
      if (pointer.targetPower === 0) {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
      pointer.targetPower = 1.15;
    };
    const handlePointerLeave = () => {
      pointer.targetPower = 0;
    };
    // Rings of glyphs that travel outward through the field: jackpots and clicks on the background.
    let waves = [];
    const addWave = (x, y, glyphs, color, speed, life, thickness) => {
      if (motionPreference.matches) return;
      waves.push({
        x,
        y,
        glyphs,
        color,
        speed,
        life,
        thickness,
        start: performance.now() / 1000
      });
    };
    // A won jackpot sends $ and 7 out from the middle of the screen, where the drawn card lands.
    const handleJackpot = event => addWave(width / 2, height / 2, "$7", event.detail?.color ?? blue, 900, 1.4, 80);
    const handleClick = event => {
      if (event.target.closest(".panel, a, button, header, h2, p")) return;
      addWave(event.clientX, event.clientY, "#%", blue, 650, 1, 50);
    };
    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
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
      const seconds = time / 1000;
      const glyphSize = GLYPH_SIZE[width < 640 ? 1 : 0];
      const cellWidth = Math.round(glyphSize * 1.8);
      const cellHeight = Math.round(glyphSize * 2);
      const columns = Math.ceil(width / cellWidth) + 1;
      const rows = Math.ceil(height / cellHeight) + 1;
      if (seedColumns !== columns || seeds.length !== columns * rows) {
        seeds = new Float32Array(columns * rows);
        for (let index = 0; index < seeds.length; index += 1) seeds[index] = hash(index % columns, Math.floor(index / columns));
        seedColumns = columns;
      }
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
      pointer.x += (pointer.targetX - pointer.x) * .26;
      pointer.y += (pointer.targetY - pointer.y) * .26;
      pointer.power += (pointer.targetPower - pointer.power) * .12;
      if (pointer.power > .01) fields.push({
        x: pointer.x,
        y: pointer.y,
        rx: 150,
        ry: 150,
        power: pointer.power
      });
      waves = waves.filter(wave => seconds - wave.start < wave.life);
      for (const wave of waves) {
        const age = seconds - wave.start;
        wave.radius = age * wave.speed;
        wave.fade = 1 - age / wave.life;
      }
      context.clearRect(0, 0, width, height);
      context.font = `600 ${glyphSize}px ${mono}`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      for (let row = 0; row < rows; row += 1) {
        const y = row * cellHeight;
        for (let column = 0; column < columns; column += 1) {
          const x = column * cellWidth;
          const seed = seeds[row * columns + column];
          let strongest = null;
          let strength = .2;
          for (const wave of waves) {
            const ring = (Math.hypot(x - wave.x, y - wave.y) - wave.radius) / wave.thickness;
            const value = Math.exp(-ring * ring) * wave.fade;
            if (value > strength) {
              strongest = wave;
              strength = value;
            }
          }
          if (strongest) {
            context.globalAlpha = .25 + strength * .7;
            context.fillStyle = strongest.color;
            context.fillText(strongest.glyphs[seed > .5 ? 0 : 1], x, y);
            context.globalAlpha = 1;
            continue;
          }
          let influence = 0;
          for (const field of fields) {
            influence += fieldStrength(x, y, field.x, field.y, field.rx, field.ry) * field.power;
          }
          const ripple = .88 + .12 * Math.sin(seconds * 1.7 + column * .16 + row * .11 + seed * 5);
          influence = Math.min(1, influence * ripple);
          if (influence > .13) {
            const symbol = influence > .68 ? "#" : influence > .43 ? seed > .48 ? "#" : "%" : seed > .55 ? "%" : "*";
            const alpha = .16 + influence * .47;
            context.globalAlpha = alpha;
            context.fillStyle = blue;
            context.fillText(symbol, x, y);
          } else {
            const symbolIndex = Math.floor(seed * 3);
            const alpha = .1 + seed * .07;
            context.globalAlpha = alpha;
            context.fillStyle = line;
            context.fillText(SYMBOLS[symbolIndex], x, y);
          }
        }
      }
    };
    const animate = time => {
      animationFrame = window.requestAnimationFrame(animate);
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
    resize();
    start();
    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true
    });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("jackpot", handleJackpot);
    window.addEventListener("click", handleClick);
    motionPreference.addEventListener("change", start);
    const handleScheme = () => {
      readColors();
      start();
    };
    colorScheme.addEventListener("change", handleScheme);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("jackpot", handleJackpot);
      window.removeEventListener("click", handleClick);
      motionPreference.removeEventListener("change", start);
      colorScheme.removeEventListener("change", handleScheme);
    };
  }, []);
  return <canvas ref={canvasRef} className="animatedCodeBackground" aria-hidden="true" />;
}
