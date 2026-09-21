import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const base = process.env.AUDIT_URL || "http://127.0.0.1:3217";
const output = ".audit/checks";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH }
    : process.platform === "win32" ? { channel: "msedge" } : {}),
});
const checks = [];
const record = name => { checks.push(name); console.log(`PASS ${name}`); };
try {
  for (const [name, options] of [
    ["desktop", { viewport: { width: 1440, height: 1000 }, colorScheme: "light" }],
    ["mobile", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: "dark", reducedMotion: "reduce" }],
  ]) {
    const context = await browser.newContext(options);
    const page = await context.newPage();
    const errors = [];
    const videoRequests = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
    page.on("request", request => { if (request.resourceType() === "media") videoRequests.push(request.url()); });
    const response = await page.goto(base);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => !document.documentElement.classList.contains("portfolio-loading") && getComputedStyle(document.querySelector("main")).opacity === "1", null, { timeout: 12000 });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator("main").evaluate(el => getComputedStyle(el).opacity), "1");
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const navigation = await page.locator(".siteHeader nav").boundingBox();
    for (const selector of [".brand", ".windowLayoutControls"]) {
      const bounds = await page.locator(selector).boundingBox();
      assert(bounds.x + bounds.width <= navigation.x || bounds.x >= navigation.x + navigation.width
        || bounds.y + bounds.height <= navigation.y || bounds.y >= navigation.y + navigation.height,
      `${selector} must not overlap navigation`);
    }
    assert.equal(videoRequests.length, 0, "Videos should not download on page load");
    await page.screenshot({ path: `${output}/${name}-home.png` });
    const navigationContrast = await new AxeBuilder({ page }).include(".siteHeader").withRules(["color-contrast"]).analyze();
    assert.deepEqual(navigationContrast.violations.map(v => v.nodes.map(n => n.target)), [], `${name} navigation contrast`);
    record(`${name}: visible content, no overflow, no initial video download`);

    // The animated background must stay off the main thread wherever the
    // browser can transfer the canvas, otherwise it competes with interactions.
    assert.equal(await page.evaluate(() => "transferControlToOffscreen" in HTMLCanvasElement.prototype), true);
    assert.equal(await page.evaluate(() => { try { document.querySelector(".animatedCodeBackground").getContext("2d"); return false; } catch { return true; } }), true, "Background canvas is owned by the worker");
    assert.equal(page.workers().filter(worker => worker.url().startsWith(base)).length, 1);
    record(`${name}: animated background rendered in a worker`);

    const contact = page.getByRole("button", { name: "Entrar em contato" });
    await contact.click();
    assert.equal(await page.locator(".contactDialog").evaluate(el => el.open), true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector(".contactDialog").open);
    assert.equal(await contact.evaluate(el => document.activeElement === el), true);
    record(`${name}: contact dialog, Escape and focus restoration`);

    const initialTheme = await page.locator("html").getAttribute("data-theme");
    await page.locator(".themeToggle").focus();
    await page.locator(".themeToggle").click();
    assert.notEqual(await page.locator("html").getAttribute("data-theme"), initialTheme);
    await page.locator(".themeToggle").click();
    record(`${name}: theme switching`);

    assert.equal(await page.locator(".projectDirectory, .caseStudies").count(), 0);
    assert.equal(await page.locator(".projectDetailsTrigger").count(), 10);
    assert.equal(await page.locator(".projectDetailsDialog").count(), 0, "Details are mounted only when opened");
    assert.equal(await page.locator(".experienceRole .starStep").count(), 4);
    await page.locator(".experienceSection").screenshot({ path: `${output}/${name}-star.png` });
    record(`${name}: STAR experience and details available only through carousel`);

    const timestamps = page.locator(".projectsCarouselTimestamp");
    await timestamps.first().focus();
    await page.keyboard.press("End");
    await page.waitForTimeout(800);
    assert.equal(await timestamps.last().getAttribute("aria-current"), "true");
    await page.locator(".projectMedia").last().focus();
    await page.waitForTimeout(800);
    const lastBounds = await page.locator(".projectMedia").last().boundingBox();
    assert(lastBounds.x >= -2 && lastBounds.x + lastBounds.width <= options.viewport.width + 2, "Focused project must be visible");
    await page.screenshot({ path: `${output}/${name}-projects.png` });
    if (name === "mobile") assert.equal(videoRequests.length, 0, "Reduced motion must not play hidden videos");
    record(`${name}: carousel keyboard navigation and visible focused links`);

    for (let index = 0; index < await timestamps.count(); index++) {
      await timestamps.nth(index).focus();
      await page.keyboard.press("Enter");
      await page.waitForTimeout(800);
      const contrast = await new AxeBuilder({ page }).include(".projectsCarouselViewport").withRules(["color-contrast"]).analyze();
      assert.deepEqual(contrast.violations.map(v => v.nodes.map(n => n.target)), [], `Project ${index + 1} contrast`);
      const trigger = page.locator(".projectDetailsTrigger").nth(index);
      const title = await page.locator(".projectContent h3").nth(index).textContent();
      // Bring the trigger into view first and let smooth scrolling settle, so
      // the comparison below measures the modal and not an unfinished scroll.
      await trigger.scrollIntoViewIfNeeded();
      await page.waitForFunction(() => {
        const current = { y: Math.round(scrollY), x: Math.round(document.querySelector(".projectsCarouselViewport").scrollLeft) };
        const previous = window.__scrollProbe;
        window.__scrollProbe = current;
        return Boolean(previous) && previous.x === current.x && previous.y === current.y;
      }, null, { polling: 150, timeout: 5000 });
      const beforeOpen = await page.evaluate(() => window.__scrollProbe);
      await trigger.click();
      const modal = page.getByRole("dialog", { name: title, exact: true });
      await modal.waitFor({ state: "visible" });
      assert.equal(await modal.locator("h2").textContent(), title);
      assert.equal(await modal.locator(".starStep").count(), [0, 4, 5].includes(index) ? 4 : 0);
      assert.equal(await modal.evaluate(el => el.scrollWidth > el.clientWidth), false);
      assert.equal(await page.evaluate(() => document.body.style.overflow), "hidden");
      if (index === 0) {
        await page.keyboard.press("Shift+Tab");
        assert.equal(await modal.evaluate(el => el.contains(document.activeElement)), true, "Focus stays inside modal");
        await page.keyboard.press("Tab");
        assert.equal(await modal.evaluate(el => el.contains(document.activeElement)), true);
        const modalAccessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        assert.deepEqual(modalAccessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), []);
        await modal.locator(".projectDetailsBody").evaluate(el => { el.scrollTop = 0; });
        await page.screenshot({ path: `${output}/${name}-project-modal.png` });
        const body = modal.locator(".projectDetailsBody");
        const bounds = await body.boundingBox();
        await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        await page.mouse.wheel(0, 600);
        await page.waitForTimeout(300);
        if (await body.evaluate(el => el.scrollHeight > el.clientHeight)) assert((await body.evaluate(el => el.scrollTop)) > 0, "Modal scrolls independently");
      }
      if (index % 3 === 0) await page.keyboard.press("Escape");
      else if (index % 3 === 1) await modal.getByRole("button", { name: `Fechar detalhes de ${title}` }).click();
      else await page.mouse.click(4, 4);
      await modal.waitFor({ state: "detached" });
      assert.equal(await trigger.evaluate(el => document.activeElement === el), true);
      const afterClose = await page.evaluate(() => ({ y: scrollY, x: document.querySelector(".projectsCarouselViewport").scrollLeft }));
      assert(Math.abs(afterClose.y - beforeOpen.y) < 3 && Math.abs(afterClose.x - beforeOpen.x) < 3, "Opening details preserves carousel position");
    }
    record(`${name}: all project modals, contrast, closing methods, focus and carousel position`);

    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    await fs.writeFile(`${output}/${name}-axe.json`, JSON.stringify(accessibility, null, 2));
    assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), []);
    assert.deepEqual(errors, []);
    record(`${name}: no WCAG A/AA violations or browser errors`);

    await page.goto(base + "/curriculo");
    assert.equal(await page.locator("canvas").count(), 0);
    assert.equal(await page.locator("h1").textContent(), "Henrique Fiorotti");
    assert.equal((await page.request.get(base + "/curriculo-henrique-fiorotti.pdf")).status(), 200);
    assert.equal(response.headers()["x-content-type-options"], "nosniff");
    assert.match(response.headers()["content-security-policy"], /frame-ancestors 'none'/);
    record(`${name}: resume, PDF and security headers`);
    assert.equal(await page.locator(".resume .starStep").count(), 4);
    for (const slug of ["orbis", "fastapi-rest-api", "node-express-product-api"]) {
      const caseResponse = await page.goto(`${base}/projetos/${slug}`);
      assert.equal(caseResponse.status(), 200);
      assert.equal(await page.locator(".starStep").count(), 4);
      assert.equal(await page.locator("canvas").count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      const caseAccessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      assert.deepEqual(caseAccessibility.violations.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), []);
    }
    assert.equal((await page.request.get(`${base}/projetos/unknown-project`)).status(), 404);
    record(`${name}: case studies, accessible STAR content and unknown slug 404`);
    await context.close();
  }

  const noJs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  const staticPage = await noJs.newPage();
  await staticPage.goto(base);
  assert.equal(await staticPage.locator("main").evaluate(el => getComputedStyle(el).opacity), "1");
  assert.equal(await staticPage.locator(".loaderOverlay").isVisible(), false);
  assert.notEqual(await staticPage.locator(".projectsCarouselViewport").evaluate(el => getComputedStyle(el).overflowX), "hidden");
  assert.equal(await staticPage.locator(".projectDetailsTrigger").count(), 10);
  assert.equal(await staticPage.locator(".experienceRole .starStep").count(), 4);
  record("JavaScript disabled: readable content and native project scrolling");
  await staticPage.locator(".projectDetailsTrigger").first().click();
  await staticPage.waitForURL("**/projetos/orbis");
  assert.equal(await staticPage.locator(".starStep").count(), 4);
  const fallbackResponse = await staticPage.goto(base + "/projetos/producplus");
  assert.equal(fallbackResponse.status(), 200);
  assert.equal(await staticPage.locator("h1").textContent(), "PRODUCPLUS");
  record("JavaScript disabled: project details open as accessible pages");
  await noJs.close();

  const blocked = await browser.newContext();
  const failedPage = await blocked.newPage();
  await failedPage.route("**/_next/static/**/*.js*", route => route.abort());
  await failedPage.goto(base);
  await failedPage.waitForTimeout(8500);
  assert.equal(await failedPage.locator("main").evaluate(el => getComputedStyle(el).opacity), "1");
  assert.equal(await failedPage.locator(".loaderOverlay").isVisible(), false);
  record("Blocked JavaScript bundles: loader watchdog restores content");
  await blocked.close();

  const noStorage = await browser.newContext({ reducedMotion: "reduce" });
  await noStorage.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  const storagePage = await noStorage.newPage();
  await storagePage.goto(base);
  await storagePage.locator(".themeToggle").click();
  assert.equal(await storagePage.locator("html").getAttribute("data-theme"), "dark");
  record("Storage blocked: theme still works");
  await noStorage.close();

  // The intro flies the name into the header with transforms only. If that
  // measurement breaks, the crossfade jumps instead of landing on the logo.
  const intro = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const introPage = await intro.newPage();
  await introPage.goto(base);
  await introPage.waitForFunction(() => {
    const overlay = document.querySelector(".loaderOverlay");
    const opacity = overlay && Number(getComputedStyle(overlay).opacity);
    return opacity > 0.05 && opacity < 0.95;
  }, null, { timeout: 15000 });
  const landing = await introPage.evaluate(() => {
    const loader = document.querySelectorAll(".loaderLetter")[0].getBoundingClientRect();
    const logo = document.querySelector(".brandInitial").getBoundingClientRect();
    return { left: Math.abs(loader.left - logo.left), bottom: Math.abs(loader.bottom - logo.bottom) };
  });
  assert(landing.left <= 1 && landing.bottom <= 1, `Intro must land on the logo, off by ${JSON.stringify(landing)}`);
  record("Intro lands the name on the header logo");
  await intro.close();

  const narrow = await browser.newContext({ viewport: { width: 320, height: 740 }, reducedMotion: "reduce" });
  const narrowPage = await narrow.newPage();
  await narrowPage.goto(base);
  assert.equal(await narrowPage.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  for (const link of await narrowPage.locator(".siteHeader nav a").all()) {
    assert.equal(await link.evaluate(el => {
      const box = el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height / 2));
    }), true, "Navigation links must not be covered at 320px");
  }
  await narrowPage.screenshot({ path: `${output}/mobile-320.png` });
  record("320px viewport: accessible navigation and no horizontal overflow");
  await narrow.close();

  for (const route of ["/robots.txt", "/sitemap.xml", "/opengraph-image"]) {
    assert.equal((await fetch(base + route)).status, 200);
  }
  record("Robots, sitemap and share image are available");
  await fs.writeFile(`${output}/summary.json`, JSON.stringify(checks, null, 2));
} finally {
  await browser.close();
}
