import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import {
  META_PIXEL_INIT_SCRIPT,
  MetaPixelNoscript,
  MetaPixelTracker,
} from "@/components/MetaPixel";
import "./globals.css";

const ibm = IBM_Plex_Sans({
  variable: "--font-ibm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AuditCrédito — Descubra se o banco está te cobrando juros acima do mercado",
  description:
    "Compare a taxa do seu empréstimo com os dados oficiais do Banco Central em segundos. Análise grátis, sem CPF, sem cadastro.",
  openGraph: {
    title: "AuditCrédito — Seus juros estão acima da média?",
    description:
      "Ferramenta gratuita que compara a taxa do seu crédito com os dados do Banco Central do Brasil.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${ibm.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* ── Meta Pixel init (afterInteractive = após hidratação React) ── */}
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: META_PIXEL_INIT_SCRIPT }}
        />
        {/* Fallback para navegadores sem JS */}
        <MetaPixelNoscript />
        {/* PageView a cada navegação SPA + CAPI de cada página */}
        <MetaPixelTracker />
        {children}
      </body>
    </html>
  );
}
