import { createCodeBackground, FRAME_INTERVAL } from "./code-background";

// Workers have no requestAnimationFrame. The field is capped at 20 fps anyway,
// so a timer keeps the same cadence without touching the main thread.
let renderer = null;
let timer = 0;
let playing = false;

const stop = () => {
  clearTimeout(timer);
  timer = 0;
  playing = false;
};

const tick = () => {
  renderer.draw(performance.now());
  timer = setTimeout(tick, FRAME_INTERVAL);
};

self.onmessage = ({ data }) => {
  if (data.type === "init") {
    renderer = createCodeBackground(data.canvas, (width, height) => new OffscreenCanvas(width, height));
    if (!renderer) return;
    renderer.setAppearance(data.fontFamily, data.isDark);
    renderer.resize(data.width, data.height);
    return;
  }
  if (!renderer) return;
  if (data.type === "appearance") {
    renderer.setAppearance(data.fontFamily, data.isDark);
    if (!playing) renderer.draw(performance.now());
    return;
  }
  if (data.type === "resize") {
    renderer.resize(data.width, data.height);
    if (!playing) renderer.draw(performance.now());
    return;
  }
  if (data.type === "still") {
    stop();
    renderer.draw(0);
    return;
  }
  if (data.type === "play") {
    if (playing) return;
    playing = true;
    tick();
    return;
  }
  if (data.type === "pause") stop();
};
