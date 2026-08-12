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
  title: "Henrique Fiorotti | Desenvolvedor",
  description: "Portfólio de Henrique Fiorotti, desenvolvedor de sistemas com projetos em front-end, back-end e automação.",
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
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <SmoothScroll />
        <AnimatedCodeBackground />
        {children}
      </body>
    </html>;
}
