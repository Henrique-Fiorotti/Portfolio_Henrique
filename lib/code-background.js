// The renderer only needs a 2D context and plain values, never the DOM, so the
// same code draws inside a worker (OffscreenCanvas) and on the main thread.
export const FRAME_INTERVAL = 1000 / 20;

const GLYPH_SIZE = 24;
const GLYPHS = ["0", "1", "=", "*", "%", "#"];

const hash = (column, row) => {
  const value = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

export function createCodeBackground(canvas, createSurface) {
  const context = canvas.getContext("2d");
  const glyphAtlas = createSurface(GLYPH_SIZE * GLYPHS.length, GLYPH_SIZE * 2);
  const glyphContext = glyphAtlas?.getContext("2d");
  if (!context || !glyphContext) return null;

  let width = 0;
  let height = 0;
  let columns = 0;
  let rows = 0;
  let cellWidth = 0;
  let cellHeight = 0;
  let seeds = new Float64Array(0);
  let phases = new Float64Array(0);
  let fontFamily = '"Roboto Mono"';
  let isDark = false;
  let canvasFont = "";

  // Rasterize each symbol once per font/theme/size instead of thousands of
  // fillText calls per frame. Global alpha preserves the continuous field.
  const prepareGlyphs = () => {
    glyphContext.clearRect(0, 0, glyphAtlas.width, glyphAtlas.height);
    glyphContext.font = canvasFont;
    glyphContext.textAlign = "center";
    glyphContext.textBaseline = "middle";
    [isDark ? "#73aaff" : "#004aad", isDark ? "#dcd6eb" : "#24212b"].forEach((color, row) => {
      glyphContext.fillStyle = color;
      GLYPHS.forEach((glyph, column) => glyphContext.fillText(glyph, column * GLYPH_SIZE + GLYPH_SIZE / 2, row * GLYPH_SIZE + GLYPH_SIZE / 2));
    });
  };

  const resize = (nextWidth, nextHeight) => {
    width = nextWidth;
    height = nextHeight;
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    context.setTransform(1, 0, 0, 1, 0, 0);
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
    canvasFont = `600 ${width < 640 ? 9 : 10}px ${fontFamily}, monospace`;
    prepareGlyphs();
  };

  const draw = time => {
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
          context.drawImage(glyphAtlas, GLYPHS.indexOf(symbol) * GLYPH_SIZE, 0, GLYPH_SIZE, GLYPH_SIZE, x - GLYPH_SIZE / 2, y - GLYPH_SIZE / 2, GLYPH_SIZE, GLYPH_SIZE);
        } else {
          const symbolIndex = Math.floor(seed * 3);
          const alpha = .1 + seed * .07;
          context.globalAlpha = isDark ? alpha * .62 : alpha;
          context.drawImage(glyphAtlas, symbolIndex * GLYPH_SIZE, GLYPH_SIZE, GLYPH_SIZE, GLYPH_SIZE, x - GLYPH_SIZE / 2, y - GLYPH_SIZE / 2, GLYPH_SIZE, GLYPH_SIZE);
        }
      }
    }
  };

  return {
    draw,
    resize,
    setAppearance(nextFontFamily, nextIsDark) {
      const changed = nextFontFamily !== fontFamily || nextIsDark !== isDark;
      fontFamily = nextFontFamily;
      isDark = nextIsDark;
      if (!changed || !width) return;
      canvasFont = `600 ${width < 640 ? 9 : 10}px ${fontFamily}, monospace`;
      prepareGlyphs();
    },
  };
}
