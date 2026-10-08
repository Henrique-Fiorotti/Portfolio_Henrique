import { NextResponse } from "next/server";
import { locales } from "@/data/i18n";

// Accept-Language lists the visitor's languages in preference order: take the first one we speak.
// No header or "*" (crawlers, scripts) keeps the Portuguese source; an unsupported language gets English.
const pickLocale = (acceptLanguage = "") => {
  const codes = acceptLanguage.split(",").map(part => part.split(";")[0].trim().slice(0, 2).toLowerCase()).filter(Boolean);
  return codes.find(code => locales.includes(code)) ?? (codes.length && !codes.includes("*") ? "en" : "pt");
};

// Every page lives under /<lang>. A URL without one is sent to the language the visitor chose before, or their browser's.
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const preferred = () => {
    const chosen = request.cookies.get("lang")?.value;
    return locales.includes(chosen) ? chosen : pickLocale(request.headers.get("accept-language") ?? "");
  };
  // The résumé used to be its own page; it is now a section of the home page.
  const legacyResume = pathname.match(/^\/(?:([a-z]{2})\/)?curriculo\/?$/);
  if (legacyResume) {
    const locale = locales.includes(legacyResume[1]) ? legacyResume[1] : preferred();
    return NextResponse.redirect(new URL(`/${locale}#curriculo`, request.url));
  }
  if (locales.some(locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))) return;
  request.nextUrl.pathname = `/${preferred()}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
