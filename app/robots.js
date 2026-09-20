import { siteUrl } from "@/lib/site";

export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(siteUrl && { sitemap: new URL("/sitemap.xml", siteUrl).href }),
  };
}
