import { siteUrl } from "@/lib/site";

export default function sitemap() {
  if (!siteUrl) return [];
  return ["/", "/curriculo"].map(route => ({
    url: new URL(route, siteUrl).href,
  }));
}
