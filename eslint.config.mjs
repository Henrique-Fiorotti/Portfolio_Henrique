import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([".next/**", ".audit/**", "legacy/**", "assets/**", "node_modules/**", "script.js"]),
  {
    files: ["components/SkillPill.jsx"],
    // These are small vector icons with explicit dimensions, not raster photos.
    rules: { "@next/next/no-img-element": "off" },
  },
]);
