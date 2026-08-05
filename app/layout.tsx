import type { Metadata, Viewport } from "next";
import { AnimatedCodeBackground } from "@/components/AnimatedCodeBackground";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henrique Fiorotti | Desenvolvedor",
  description: "Portfólio de Henrique Fiorotti, desenvolvedor de sistemas com projetos em front-end, back-end e automação.",
  icons: { icon: "/images/icons8-portfolio-16.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#eeeaff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AnimatedCodeBackground />
        {children}
      </body>
    </html>
  );
}
