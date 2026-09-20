import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

// AUDIT_TOOLS_ROOT also allows running the same audit before installing dev tools.
const require = createRequire(process.env.AUDIT_TOOLS_ROOT
  ? path.join(process.env.AUDIT_TOOLS_ROOT, "package.json") : import.meta.url);
const { default: lighthouse } = await import(pathToFileURL(require.resolve("lighthouse")));
const { default: desktopConfig } = await import(pathToFileURL(require.resolve("lighthouse/core/config/desktop-config.js")));
const { launch } = await import(pathToFileURL(require.resolve("chrome-launcher")));
const { chromium } = require("playwright");
const label = process.argv[2] || "current";
const baseUrl = process.env.AUDIT_URL || "http://127.0.0.1:3217";
const output = path.resolve(".audit", label);
await fs.mkdir(output, { recursive: true });
await fs.mkdir(path.join(output, "browser-profile"), { recursive: true });
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  userDataDir: path.join(output, "browser-profile"),
  chromeFlags: ["--headless=new", "--no-first-run", "--disable-extensions"],
});
const selectedProfile = process.argv[3];
const results = selectedProfile
  ? JSON.parse(await fs.readFile(path.join(output, "summary.json"), "utf8")).filter(result => result.profile !== selectedProfile)
  : [];
try {
  for (const [route, profile, count] of [["/", "mobile", 3], ["/", "desktop", 3], ["/curriculo", "mobile", 1]]) {
    if (selectedProfile && selectedProfile !== profile) continue;
    for (let run = 1; run <= count; run++) {
      const name = `${route === "/" ? "home" : "curriculo"}-${profile}-${run}`;
      const { lhr, report } = await lighthouse(baseUrl + route, {
        port: chrome.port, logLevel: "error", output: "html",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      }, profile === "desktop" ? desktopConfig : undefined);
      await fs.writeFile(path.join(output, name + ".html"), report);
      await fs.writeFile(path.join(output, name + ".json"), JSON.stringify(lhr));
      const metrics = Object.fromEntries([
        "first-contentful-paint", "largest-contentful-paint", "speed-index",
        "total-blocking-time", "cumulative-layout-shift", "total-byte-weight",
      ].map(key => [key, lhr.audits[key]?.numericValue]));
      const result = { name, route, profile, run, lighthouseVersion: lhr.lighthouseVersion, settings: lhr.configSettings,
        scores: Object.fromEntries(Object.entries(lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])),
        metrics, warnings: lhr.runWarnings, runtimeError: lhr.runtimeError,
        failures: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1).map(a => ({ id: a.id, title: a.title, displayValue: a.displayValue })),
      };
      results.push(result);
      console.log(JSON.stringify({ name, scores: result.scores, metrics, runtimeError: result.runtimeError }));
      await fs.writeFile(path.join(output, "summary.json"), JSON.stringify(results, null, 2));
    }
  }
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${chrome.port}`);
  for (const [name, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    const context = await browser.newContext({ viewport, colorScheme: "light" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(5500);
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
    console.log(JSON.stringify({ screenshot: name, errors, horizontalOverflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) }));
    await context.close();
  }
  await browser.close();
} finally {
  await chrome.kill();
}
