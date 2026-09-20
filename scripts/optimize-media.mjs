import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sources = [
  "images/user.svg", "images/hcg.png",
  ...["orbis", "producplus", "hubit", "identidade", "brutalist", "leitzo"].map(name => `images/projects/${name}-project.svg`),
];
await fs.mkdir("public/images/optimized", { recursive: true });
for (const source of sources) {
  const input = path.join("assets/source", source);
  const output = path.join("public/images/optimized", path.parse(source).name + ".webp");
  await sharp(input).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 85, effort: 6 }).toFile(output);
  console.log(`${input}: ${(await fs.stat(input)).size} -> ${(await fs.stat(output)).size} bytes`);
}
for (const name of ["fastapi-rest-api", "node-express-product-api"]) {
  await sharp(`assets/source/${name}.png`).resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 85, effort: 6 }).toFile(`public/images/optimized/${name}.webp`);
}
