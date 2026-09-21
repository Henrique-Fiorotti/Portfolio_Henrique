import { siteUrl } from "@/lib/site";
import { projects } from "@/data/portfolio";

export default function sitemap() {
  if (!siteUrl) return [];
  return ["/", "/curriculo", ...projects.map(({ slug }) => `/projetos/${slug}`)].map(route => ({
    url: new URL(route, siteUrl).href,
  }));
}
