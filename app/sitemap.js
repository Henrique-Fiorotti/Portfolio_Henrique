import { siteUrl } from "@/lib/site";
import { caseStudies } from "@/data/case-studies";

export default function sitemap() {
  if (!siteUrl) return [];
  return ["/", "/curriculo", ...Object.keys(caseStudies).map(slug => `/projetos/${slug}`)].map(route => ({
    url: new URL(route, siteUrl).href,
  }));
}
