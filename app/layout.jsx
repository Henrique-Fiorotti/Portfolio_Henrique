import { DM_Sans, Roboto_Mono } from "next/font/google";
import { siteUrl, siteTitle, siteDescription } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

const sans = DM_Sans({ subsets: ["latin"], display: "swap", variable: "--font-dm-sans" });
const mono = Roboto_Mono({ subsets: ["latin"], display: "swap", variable: "--font-roboto-mono" });

const themeScript = `
  (function () {
    var savedTheme;
    try { savedTheme = localStorage.getItem("portfolio-theme"); } catch {}
    var theme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    if (location.pathname === "/" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("portfolio-loading");
      window.setTimeout(function () {
        window.__portfolioIntroExpired = true;
        document.documentElement.classList.remove("portfolio-loading");
        var content = document.querySelector(".siteContent");
        if (content) {
          content.inert = false;
          content.removeAttribute("aria-busy");
          content.style.removeProperty("opacity");
        }
      }, 8000);
    }
  })();
`;

export const metadata = {
  metadataBase: siteUrl || new URL("http://localhost:3000"),
  openGraph: {
    type: "website", locale: "pt_BR", siteName: "Henrique Fiorotti",
    title: siteTitle, description: siteDescription,
    ...(siteUrl && { url: siteUrl.href }),
  },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
  ...(process.env.VERCEL_ENV === "preview" && { robots: { index: false, follow: false } }),
  title: "Henrique Fiorotti | Desenvolvimento & Suporte de TI",
  description: "Portfólio de Henrique Fiorotti, Técnico em Desenvolvimento de Sistemas com experiência em desenvolvimento web, suporte técnico e infraestrutura de TI.",
  icons: {
    icon: "/images/icons8-portfolio-16.png"
  }
};
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eeeaff"
};
export default function RootLayout({
  children
}) {
  return <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skipLink" href="#conteudo">Pular para o conteúdo</a>
        {children}
        {process.env.NEXT_PUBLIC_SPEED_INSIGHTS === "1" && <SpeedInsights />}
      </body>
    </html>;
}
