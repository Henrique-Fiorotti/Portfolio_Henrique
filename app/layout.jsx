import { AnimatedCodeBackground } from "@/components/AnimatedCodeBackground";
import "./globals.css";
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
  return <html lang="pt-BR">
      <body>
        <AnimatedCodeBackground />
        {children}
      </body>
    </html>;
}
