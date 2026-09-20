import fs from "node:fs/promises";
import assert from "node:assert/strict";

const origin = process.env.AUDIT_URL;
assert(origin, "Set AUDIT_URL to the public deployment URL");
const url = new URL(origin);
assert.equal(url.protocol, "https:", "The public deployment must use HTTPS");
const results = [];
for (const route of ["/", "/curriculo", "/robots.txt", "/sitemap.xml", "/opengraph-image", "/curriculo-henrique-fiorotti.pdf", "/projetos/orbis"]) {
  const response = await fetch(new URL(route, url), { signal: AbortSignal.timeout(30000) });
  const body = response.headers.get("content-type")?.includes("text") || route.endsWith(".xml") ? await response.text() : "";
  await response.body?.cancel().catch(() => {});
  results.push({ route, status: response.status, url: response.url,
    contentType: response.headers.get("content-type"),
    ...(route === "/" && { canonical: body.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1] || null,
      csp: response.headers.get("content-security-policy"), nosniff: response.headers.get("x-content-type-options"), hsts: response.headers.get("strict-transport-security") }),
    ...(["/sitemap.xml", "/robots.txt"].includes(route) && response.ok && { body }),
  });
}
await fs.mkdir(".audit/deployment", { recursive: true });
await fs.writeFile(".audit/deployment/results.json", JSON.stringify({ checkedAt: new Date().toISOString(), origin, results }, null, 2));
console.log(JSON.stringify(results, null, 2));
const home = results[0];
if (results.some(result => result.status !== 200) || !home.csp || home.nosniff !== "nosniff" || !home.hsts || home.canonical !== url.origin + "/") process.exitCode = 1;
