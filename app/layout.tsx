import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import PWARegister from "@/components/pwa-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "BLOOMING — Terapia Cristã Integrativa",
  description:
    "Uma jornada de cura fundamentada na Palavra. Terapia cristã com perspectiva judaico-messiânica, neurociência e endocrinologia, para mulheres, casais, famílias e líderes.",
  openGraph: {
    title: "BLOOMING — Terapia Cristã Integrativa",
    description:
      "Cura profunda. Identidade sólida. Relacionamentos saudáveis. Fundamentados na Palavra.",
    type: "website",
  },
  appleWebApp: { capable: true, title: "Blooming", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f3ece0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}<PWARegister /></body>
    </html>
  );
}
