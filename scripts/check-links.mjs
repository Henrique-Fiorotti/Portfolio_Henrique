import fs from "node:fs/promises";
import { projects, profile } from "../data/portfolio.js";

const links = [...new Set([profile.github, profile.linkedin, ...projects.flatMap(project => [project.site, project.repository]).filter(Boolean)])];
const results = [];
// Small batches avoid flooding a host. HEAD is often rejected by live demos.
async function check(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000), headers: { "User-Agent": "PortfolioLinkCheck/1.0", Accept: "text/html" } });
      const result = { url, status: response.status, finalUrl: response.url, state: response.ok ? "ok" : [404, 410].includes(response.status) ? "broken" : "review" };
      await response.body?.cancel();
      if (response.status < 500) return result;
      last = result;
    } catch (error) { last = { url, state: "review", error: error.cause?.code || error.message }; }
  }
  return last;
}
for (let index = 0; index < links.length; index += 3) {
  const batch = await Promise.all(links.slice(index, index + 3).map(check));
  results.push(...batch);
  batch.forEach(result => console.log(`${result.state.toUpperCase()} ${result.status || result.error} ${result.url}`));
  if (process.env.GITHUB_ACTIONS) batch.filter(result => result.state === "review").forEach(result => console.log(`::warning::Manual link review needed: ${result.url} (${result.status || result.error})`));
}
await fs.mkdir(".audit/links", { recursive: true });
await fs.writeFile(".audit/links/results.json", JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log("403, 429, 999 and connection errors need manual review; HTTP success does not prove the destination content is correct.");
if (results.some(result => result.state === "broken")) process.exitCode = 1;
