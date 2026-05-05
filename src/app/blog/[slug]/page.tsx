import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { artigos, getArtigo, type Secao } from "@/lib/artigos";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Static generation                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
export function generateStaticParams() {
  return artigos.map((a) => ({ slug: a.slug }));
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Metadata                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) return { title: "Artigo não encontrado" };

  const url = `https://auditcredito.com.br/blog/${slug}`;
  return {
    title: `${artigo.titulo} | AuditCrédito`,
    description: artigo.descricao,
    keywords: artigo.palavrasChave.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: artigo.titulo,
      description: artigo.descricao,
      locale: "pt_BR",
      type: "article",
      publishedTime: artigo.dataPublicacao,
      url,
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Small helpers                                                              */
/* ─────────────────────────────────────────────────────────────────────────── */
function Orb({ style, cls = "" }: { style: CSSProperties; cls?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${cls}`}
      style={{ filter: "blur(100px)", ...style }}
    />
  );
}

function fmtData(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const CATEGORIAS_COLOR: Record<string, string> = {
  "Educação Financeira": "#00D46A",
  "Banco Central": "#4B8EFF",
  "Tipos de Crédito": "#A855F7",
  "Ação Prática": "#FBBF24",
  "Direitos do Consumidor": "#FC5C5C",
};

const LOGO_D =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Section renderers                                                          */
/* ─────────────────────────────────────────────────────────────────────────── */
function SecaoIntro({ paragrafos }: { paragrafos: string[] }) {
  return (
    <div className="mb-8">
      {paragrafos.map((p, i) => (
        <p key={i} className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: "rgba(241,245,249,0.75)" }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function SecaoH2({ titulo, paragrafos }: { titulo: string; paragrafos: string[] }) {
  return (
    <div className="mb-8">
      <h2 className="font-bold text-xl sm:text-2xl mb-4" style={{ color: "#F1F5F9", letterSpacing: "-0.015em" }}>
        {titulo}
      </h2>
      {paragrafos.map((p, i) => (
        <p key={i} className="text-sm sm:text-base leading-relaxed mb-3" style={{ color: "rgba(241,245,249,0.65)" }}>
          {p}
        </p>
      ))}
    </div>
  );
}

function SecaoLista({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <div className="mb-8 rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p className="font-semibold text-sm mb-4" style={{ color: "rgba(241,245,249,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.7rem" }}>
        {titulo}
      </p>
      <ul className="space-y-3">
        {itens.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5" style={{ background: "rgba(0,212,106,0.15)", border: "1px solid rgba(0,212,106,0.3)" }}>
              <svg className="w-2.5 h-2.5" style={{ color: "#00D46A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.65)" }}>{item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SecaoDestaque({ texto }: { texto: string }) {
  return (
    <div className="mb-8 rounded-xl px-5 py-4 flex gap-3" style={{ background: "rgba(0,212,106,0.06)", border: "1px solid rgba(0,212,106,0.18)", borderLeft: "3px solid #00D46A" }}>
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#00D46A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm leading-relaxed font-medium" style={{ color: "rgba(241,245,249,0.80)" }}>{texto}</p>
    </div>
  );
}

function SecaoTabela({ cabecalhos, linhas }: { cabecalhos: string[]; linhas: string[][] }) {
  return (
    <div className="mb-8 overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            {cabecalhos.map((h, i) => (
              <th key={i} className="px-4 py-3 text-left font-semibold" style={{ color: "rgba(241,245,249,0.55)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, ri) => (
            <tr key={ri} style={{ borderBottom: ri < linhas.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: ri % 2 === 1 ? "rgba(255,255,255,0.015)" : "transparent" }}>
              {linha.map((cell, ci) => (
                <td key={ci} className="px-4 py-3" style={{ color: ci === 0 ? "rgba(241,245,249,0.85)" : "rgba(241,245,249,0.60)" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecaoCTA() {
  return (
    <div
      className="mb-8 rounded-2xl p-6 text-center"
      style={{
        background: "linear-gradient(135deg, rgba(0,212,106,0.09) 0%, rgba(75,142,255,0.06) 100%)",
        border: "1px solid rgba(0,212,106,0.20)",
      }}
    >
      <p className="font-bold text-lg mb-1" style={{ color: "#F1F5F9", letterSpacing: "-0.01em" }}>
        Verifique agora se a sua taxa está dentro da média
      </p>
      <p className="text-sm mb-5" style={{ color: "rgba(241,245,249,0.55)" }}>
        Compare sua taxa com os dados oficiais do Banco Central em 2 minutos.
        Grátis, sem CPF, sem cadastro.
      </p>
      <a
        href="/auditoria"
        className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl cursor-pointer"
        style={{ background: "#00D46A", color: "#060D1A" }}
      >
        Fazer análise gratuita
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </a>
      <p className="text-xs mt-3" style={{ color: "rgba(241,245,249,0.28)" }}>
        Análise básica sempre grátis · Relatório completo por R$ 19,90
      </p>
    </div>
  );
}

function SecaoFAQ({ itens }: { itens: { q: string; r: string }[] }) {
  return (
    <div className="mb-8">
      <h2 className="font-bold text-xl mb-5" style={{ color: "#F1F5F9", letterSpacing: "-0.015em" }}>
        Perguntas frequentes
      </h2>
      <div className="space-y-3">
        {itens.map(({ q, r }, i) => (
          <div key={i} className="rounded-xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="font-semibold text-sm mb-2" style={{ color: "#F1F5F9" }}>{q}</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.58)" }}>{r}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSecao(s: Secao, i: number) {
  switch (s.tipo) {
    case "intro":   return <SecaoIntro   key={i} {...s} />;
    case "h2":      return <SecaoH2      key={i} titulo={s.titulo} paragrafos={s.paragrafos} />;
    case "lista":   return <SecaoLista   key={i} titulo={s.titulo} itens={s.itens} />;
    case "destaque":return <SecaoDestaque key={i} texto={s.texto} />;
    case "tabela":  return <SecaoTabela  key={i} cabecalhos={s.cabecalhos} linhas={s.linhas} />;
    case "cta":     return <SecaoCTA     key={i} />;
    case "faq":     return <SecaoFAQ     key={i} itens={s.itens} />;
    default:        return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
export default async function ArtigoPage({ params }: Props) {
  const { slug } = await params;
  const artigo = getArtigo(slug);
  if (!artigo) notFound();

  const cor = CATEGORIAS_COLOR[artigo.categoria] ?? "#00D46A";
  const url = `https://auditcredito.com.br/blog/${slug}`;

  /* JSON-LD structured data */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.titulo,
    description: artigo.descricao,
    datePublished: artigo.dataPublicacao,
    url,
    publisher: {
      "@type": "Organization",
      name: "AuditCrédito",
      url: "https://auditcredito.com.br",
    },
    keywords: artigo.palavrasChave.join(", "),
    inLanguage: "pt-BR",
  };

  /* Related articles (same category, different slug) */
  const relacionados = artigos
    .filter((a) => a.slug !== slug && a.categoria === artigo.categoria)
    .slice(0, 2);
  const outros = artigos
    .filter((a) => a.slug !== slug && a.categoria !== artigo.categoria)
    .slice(0, 2 - relacionados.length);
  const sugeridos = [...relacionados, ...outros];

  return (
    <div style={{ background: "#060D1A", color: "#F1F5F9", fontFamily: "var(--font-ibm, system-ui)", minHeight: "100vh" }}>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
          <a href="/" aria-label="AuditCrédito" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#00D46A22 0%,#00D46A44 100%)", border: "1px solid rgba(0,212,106,0.3)" }}>
              <svg className="w-4 h-4" style={{ color: "#00D46A" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={LOGO_D} />
              </svg>
            </span>
            <span className="font-bold text-base tracking-tight" style={{ color: "#F1F5F9" }}>AuditCrédito</span>
          </a>
          <a href="/auditoria"
            className="text-sm font-semibold px-4 py-2 rounded-xl"
            style={{ background: "rgba(0,212,106,0.12)", border: "1px solid rgba(0,212,106,0.25)", color: "#00D46A" }}>
            Analisar meu contrato
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <Orb style={{ width: 500, height: 500, top: "-100px", right: "-150px", background: "radial-gradient(circle, rgba(0,212,106,0.09) 0%, transparent 70%)" }} />
        <Orb style={{ width: 400, height: 400, bottom: "200px", left: "-180px", background: "radial-gradient(circle, rgba(75,142,255,0.07) 0%, transparent 70%)" }} />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-xs" style={{ color: "rgba(241,245,249,0.35)" }}>
            <a href="/" style={{ color: "rgba(241,245,249,0.35)" }}>Início</a>
            <span>/</span>
            <a href="/blog" style={{ color: "rgba(241,245,249,0.35)" }}>Blog</a>
            <span>/</span>
            <span style={{ color: "rgba(241,245,249,0.55)" }}>{artigo.categoria}</span>
          </nav>

          {/* Article header */}
          <header className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${cor}18`, color: cor, border: `1px solid ${cor}30` }}
              >
                {artigo.categoria}
              </span>
              <span style={{ color: "rgba(241,245,249,0.2)" }}>·</span>
              <span className="text-xs" style={{ color: "rgba(241,245,249,0.35)" }}>
                {artigo.tempoLeitura} min de leitura
              </span>
            </div>

            <h1 className="font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.025em", color: "#F1F5F9" }}>
              {artigo.titulo}
            </h1>

            <p className="text-sm" style={{ color: "rgba(241,245,249,0.35)" }}>
              Publicado em {fmtData(artigo.dataPublicacao)}
            </p>
          </header>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "2.5rem" }} />

          {/* Article body */}
          <article>
            {artigo.secoes.map((s, i) => renderSecao(s, i))}
          </article>

          {/* Bottom CTA */}
          <div
            className="mt-4 rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="font-bold text-base mb-1" style={{ color: "#F1F5F9" }}>
              Gostou do conteúdo? Veja como o AuditCrédito funciona na prática.
            </p>
            <p className="text-sm mb-4" style={{ color: "rgba(241,245,249,0.50)" }}>
              Informe os dados do seu contrato e compare sua taxa com a média oficial do Banco Central em minutos.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/auditoria"
                className="inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl"
                style={{ background: "#00D46A", color: "#060D1A" }}>
                Fazer análise gratuita
              </a>
              <a href="/blog"
                className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(241,245,249,0.65)" }}>
                Ver mais artigos
              </a>
            </div>
          </div>

          {/* Suggested articles */}
          {sugeridos.length > 0 && (
            <div className="mt-12">
              <h3 className="font-semibold text-base mb-4" style={{ color: "rgba(241,245,249,0.6)", textTransform: "uppercase", letterSpacing: "0.07em", fontSize: "0.7rem" }}>
                Leia também
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sugeridos.map((a) => {
                  const c2 = CATEGORIAS_COLOR[a.categoria] ?? "#00D46A";
                  return (
                    <a key={a.slug} href={`/blog/${a.slug}`}
                      className="rounded-xl p-4 block"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <span className="text-xs font-semibold" style={{ color: c2 }}>{a.categoria}</span>
                      <p className="font-semibold text-sm mt-1 leading-snug" style={{ color: "#F1F5F9" }}>{a.titulo}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(241,245,249,0.40)" }}>{a.tempoLeitura} min</p>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "rgba(241,245,249,0.22)" }}>
            © {new Date().getFullYear()} AuditCrédito — Conteúdo educacional. Não constitui parecer jurídico.
          </p>
          <nav className="flex gap-5">
            {[
              { label: "Início", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: "Análise", href: "/auditoria" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="text-xs" style={{ color: "rgba(241,245,249,0.35)" }}>{label}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
