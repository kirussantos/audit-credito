import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
