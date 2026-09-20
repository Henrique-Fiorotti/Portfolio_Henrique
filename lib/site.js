const productionDomain = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "https://portfolio-henrique-edi3.vercel.app";

// Vercel exposes the production domain even in preview builds. Never canonicalize
// a production page to a temporary preview deployment or an invented domain.
export const siteUrl = productionDomain
  ? new URL(productionDomain.startsWith("http") ? productionDomain : `https://${productionDomain}`)
  : null;

export const siteTitle = "Henrique Fiorotti | Desenvolvimento & Suporte de TI";
export const siteDescription = "Portfólio de Henrique Fiorotti, Técnico em Desenvolvimento de Sistemas com experiência em desenvolvimento web, suporte técnico e infraestrutura de TI.";
