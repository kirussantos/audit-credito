import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import Script from "next/script";
import {
  META_PIXEL_INIT_SCRIPT,
  MetaPixelNoscript,
  MetaPixelTracker,
} from "@/components/MetaPixel";
import GA4Tracker from "@/components/GA4Tracker";
import { GA4_ID } from "@/lib/ga4";
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
  other: {
    "facebook-domain-verification": "hvtu6shevrqg291fvopkgr1y97cpxd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${ibm.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* ── Google Tag Manager ── */}
        <Script id="gtm-init" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-N3W3GPSV');
        `}</Script>
        {/* Fallback GTM para navegadores sem JS */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3W3GPSV"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* ── GA4 direto — garante window.gtag disponível para eventos SPA ── */}
        {/* send_page_view:false evita duplicar com o GTM — só eventos customizados */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA4_ID}', {
            send_page_view: false,
            cookie_flags: 'SameSite=None;Secure'
          });
        `}</Script>

        {/* PageView a cada navegação SPA */}
        <GA4Tracker />

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
