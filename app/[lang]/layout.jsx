import "../globals.css";
import { DM_Sans, Roboto_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { alternatesFor, htmlLang, locales, messages } from "@/data/i18n";
const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans"
});
const mono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono"
});
export const dynamicParams = false;
export const generateStaticParams = () => locales.map(lang => ({
  lang
}));

export async function generateMetadata({
  params
}) {
  const {
    lang
  } = await params;
  return {
    // hreflang and canonical URLs must be absolute; set SITE_URL to the real domain when it is not Vercel's.
    metadataBase: new URL(process.env.SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")),
    ...messages[lang].meta,
    alternates: alternatesFor(`/${lang}`),
    icons: {
      icon: "/images/icons8-portfolio-16.png"
    }
  };
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eeeaff"
};
export default async function RootLayout({
  children,
  params
}) {
  const {
    lang
  } = await params;
  if (!locales.includes(lang)) notFound();
  return <html lang={htmlLang[lang]} className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>;
}
