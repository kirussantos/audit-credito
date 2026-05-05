import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { artigos } from "@/lib/artigos";

export const metadata: Metadata = {
  title: "Blog — Juros Bancários, CDC e Direitos do Consumidor | AuditCrédito",
  description:
    "Artigos educacionais sobre juros abusivos, tipos de crédito, Código de Defesa do Consumidor e como contestar cobranças bancárias excessivas no Brasil.",
  openGraph: {
    title: "Blog AuditCrédito — Educação Financeira e Direitos do Consumidor",
    description:
      "Aprenda sobre juros bancários, seus direitos e como usar os dados do Banco Central a seu favor.",
    locale: "pt_BR",
    type: "website",
  },
};

function Orb({ style, cls = "" }: { style: CSSProperties; cls?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${cls}`}
      style={{ filter: "blur(100px)", ...style }}
    />
  );
}

const LOGO_D =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

const CATEGORIAS_COLOR: Record<string, string> = {
  "Educação Financeira": "#00D46A",
  "Banco Central": "#4B8EFF",
  "Tipos de Crédito": "#A855F7",
  "Ação Prática": "#FBBF24",
  "Direitos do Consumidor": "#FC5C5C",
};

function fmtData(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div style={{ background: "#060D1A", color: "#F1F5F9", fontFamily: "var(--font-ibm, system-ui)", minHeight: "100vh" }}>

      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(6,13,26,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <a href="/" aria-label="AuditCrédito — página inicial" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#00D46A22 0%,#00D46A44 100%)", border: "1px solid rgba(0,212,106,0.3)" }}>
              <svg className="w-4 h-4" style={{ color: "#00D46A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={LOGO_D} />
              </svg>
            </span>
            <span className="font-bold text-base tracking-tight" style={{ color: "#F1F5F9" }}>AuditCrédito</span>
          </a>
          <a href="/auditoria"
            className="text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer"
            style={{ background: "rgba(0,212,106,0.12)", border: "1px solid rgba(0,212,106,0.25)", color: "#00D46A" }}>
            Analisar meu contrato
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <Orb cls="orb-float" style={{ width: 500, height: 500, top: "-80px", right: "-100px", background: "radial-gradient(circle, rgba(0,212,106,0.10) 0%, transparent 70%)" }} />
        <Orb cls="orb-float-2" style={{ width: 400, height: 400, top: "400px", left: "-150px", background: "radial-gradient(circle, rgba(75,142,255,0.09) 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16">

          {/* Page header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <a href="/" className="text-xs" style={{ color: "rgba(241,245,249,0.35)" }}>Início</a>
              <span style={{ color: "rgba(241,245,249,0.2)" }}>/</span>
              <span className="text-xs" style={{ color: "rgba(241,245,249,0.55)" }}>Blog</span>
            </div>
            <h1 className="font-bold mb-3" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.025em", color: "#F1F5F9" }}>
              Educação Financeira e{" "}
              <span style={{ color: "#00D46A" }}>Direitos do Consumidor</span>
            </h1>
            <p className="text-base leading-relaxed max-w-xl" style={{ color: "rgba(241,245,249,0.55)" }}>
              Tudo sobre juros bancários, tipos de crédito e como usar os dados
              do Banco Central para proteger o seu bolso.
            </p>
          </div>

          {/* Articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
            {artigos.map((artigo) => {
              const cor = CATEGORIAS_COLOR[artigo.categoria] ?? "#00D46A";
              return (
                <a
                  key={artigo.slug}
                  href={`/blog/${artigo.slug}`}
                  className="group block rounded-2xl p-6 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {/* Category + time */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${cor}18`, color: cor, border: `1px solid ${cor}30` }}
                    >
                      {artigo.categoria}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(241,245,249,0.30)" }}>
                      {artigo.tempoLeitura} min de leitura
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    className="font-bold text-base leading-snug mb-2"
                    style={{ color: "#F1F5F9", letterSpacing: "-0.01em" }}
                  >
                    {artigo.titulo}
                  </h2>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(241,245,249,0.50)" }}>
                    {artigo.descricao}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(241,245,249,0.28)" }}>
                      {fmtData(artigo.dataPublicacao)}
                    </span>
                    <span className="text-xs font-semibold flex items-center gap-1" style={{ color: cor }}>
                      Ler artigo
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div
            className="mt-16 rounded-2xl p-8 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,106,0.07) 0%, rgba(75,142,255,0.05) 100%)",
              border: "1px solid rgba(0,212,106,0.15)",
            }}
          >
            <h2 className="font-bold text-xl mb-2" style={{ color: "#F1F5F9", letterSpacing: "-0.015em" }}>
              Pronto para descobrir a verdade sobre o seu contrato?
            </h2>
            <p className="text-sm mb-6" style={{ color: "rgba(241,245,249,0.55)" }}>
              Compare sua taxa com os dados oficiais do Banco Central em 2 minutos. Grátis e sem CPF.
            </p>
            <a href="/auditoria"
              className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer"
              style={{ background: "#00D46A", color: "#060D1A" }}>
              Fazer análise gratuita
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(241,245,249,0.22)" }}>© {new Date().getFullYear()} AuditCrédito — Conteúdo educacional. Não constitui parecer jurídico.</p>
          <nav className="flex gap-5">
            {[
              { label: "Início", href: "/" },
              { label: "Análise", href: "/auditoria" },
              { label: "Privacidade", href: "/politica-de-privacidade" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-xs" style={{ color: "rgba(241,245,249,0.35)" }}>{label}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
