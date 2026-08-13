import { AnimatedCodeBackground } from "@/components/AnimatedCodeBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const themeScript = `
  (function () {
    try {
      var savedTheme = localStorage.getItem("portfolio-theme");
      var theme = savedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      document.documentElement.classList.toggle("dark", theme === "dark");
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {}
  })();
`;

export const metadata = {
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
  return <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SmoothScroll />
        <AnimatedCodeBackground />
        {children}
      </body>
    </html>;
}
