import fs from "node:fs/promises";
import { chromium } from "playwright";

const label = process.argv[2] || "current";
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error("Use a simple audit label");
const output = `.audit/runtime-${label}`;
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, ...(process.platform === "win32" ? { channel: "msedge" } : {}) });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await page.addInitScript(() => {
    window.__longTasks = [];
    new PerformanceObserver(list => window.__longTasks.push(...list.getEntries().map(({ startTime, duration }) => ({ startTime, duration })))).observe({ type: "longtask", buffered: true });
  });
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await session.send("Profiler.enable");
  await session.send("Profiler.start");
  await page.goto(process.env.AUDIT_URL || "http://127.0.0.1:3217");
  await page.waitForTimeout(12000);
  const { profile } = await session.send("Profiler.stop");
  const nodes = new Map(profile.nodes.map(node => [node.id, node]));
  const times = new Map();
  profile.samples.forEach((id, index) => times.set(id, (times.get(id) || 0) + profile.timeDeltas[index]));
  const topFunctions = [...times].map(([id, time]) => ({ ...nodes.get(id).callFrame, selfMs: Math.round(time / 1000) })).sort((a, b) => b.selfMs - a.selfMs).slice(0, 30);
  const longTasks = await page.evaluate(() => window.__longTasks);
  const summary = { cpuSlowdown: 4, observationSecondsAfterLoad: 12, totalProfileSeconds: (profile.endTime - profile.startTime) / 1e6, longTaskCount: longTasks.length, blockingMs: Math.round(longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0)), topFunctions, longTasks };
  await fs.writeFile(`${output}/cpu.cpuprofile`, JSON.stringify(profile));
  await fs.writeFile(`${output}/summary.json`, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ ...summary, topFunctions: topFunctions.slice(0, 5), longTasks: `${longTasks.length} entries saved in ${output}/summary.json` }, null, 2));
} finally { await browser.close(); }
