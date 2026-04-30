import type { CSSProperties } from "react";

/* ─── SVG icon helper ────────────────────────────────────────────────────── */
function I({ d, c = "w-5 h-5", sw = 2, style }: { d: string; c?: string; sw?: number; style?: CSSProperties }) {
  return (
    <svg className={c} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={sw}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ─── Aurora decorative orb ──────────────────────────────────────────────── */
function Orb({ style, cls = "" }: { style: CSSProperties; cls?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${cls}`}
      style={{ filter: "blur(100px)", ...style }}
    />
  );
}

/* ─── SVG noise grain overlay ────────────────────────────────────────────── */
function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.028 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="grain-f">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-f)" />
    </svg>
  );
}

/* ─── Logo ───────────────────────────────────────────────────────────────── */
const LOGO_D = "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "linear-gradient(135deg, #00D46A22 0%, #00D46A44 100%)", border: "1px solid rgba(0,212,106,0.3)" }}
      >
        <I d={LOGO_D} c="w-4 h-4" style={{ color: "#00D46A" } />
      </span>
      <span className="font-bold text-base tracking-tight" style={{ color: "#F1F5F9" }}>
        AuditCrédito
      </span>
    </div>
  );
}

/* ─── Hero product preview card ──────────────────────────────────────────── */
function HeroPreview() {
  return (
    <div className="preview-card max-w-sm w-full mx-auto mt-12 anim-fade-up-4">
      {/* Window chrome */}
      <div className="preview-card-header">
        <div className="preview-dot" style={{ background: "#FC5C5C" }} />
        <div className="preview-dot" style={{ background: "#FCBC3C" }} />
        <div className="preview-dot" style={{ background: "#34C759" }} />
        <span className="ml-3 text-xs font-mono" style={{ color: "rgba(241,245,249,0.3)" }}>
          auditcredito.com.br/resultado
        </span>
      </div>
      {/* Content */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(241,245,249,0.35)" }}>
            Análise — Crédito Pessoal
          </span>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(252,92,92,0.15)", color: "#FC5C5C", border: "1px solid rgba(252,92,92,0.3)" }}
          >
            ⚠ Abusiva
          </span>
        </div>
        {/* Rows */}
        <div className="preview-row">
          <span className="text-sm" style={{ color: "rgba(241,245,249,0.55)" }}>Taxa contratada</span>
          <span className="text-sm font-bold" style={{ color: "#FC5C5C" }}>8,5% a.m.</span>
        </div>
        <div className="preview-row">
          <span className="text-sm" style={{ color: "rgba(241,245,249,0.55)" }}>Média BCB (ref.)</span>
          <span className="text-sm font-bold" style={{ color: "#00D46A" }}>3,2% a.m.</span>
        </div>
        <div className="preview-divider" />
        {/* Bar visual */}
        <div className="mt-3 mb-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs w-24 flex-shrink-0" style={{ color: "rgba(241,245,249,0.4)" }}>Sua taxa</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: "88%", background: "linear-gradient(90deg,#FC5C5C,#FF8C42)" }} />
            </div>
            <span className="text-xs w-14 text-right font-bold" style={{ color: "#FC5C5C" }}>8,5% a.m.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs w-24 flex-shrink-0" style={{ color: "rgba(241,245,249,0.4)" }}>Média BCB</span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: "34%", background: "linear-gradient(90deg,#00D46A,#00C4C8)" }} />
            </div>
            <span className="text-xs w-14 text-right font-bold" style={{ color: "#00D46A" }}>3,2% a.m.</span>
          </div>
        </div>
        <div className="preview-divider" />
        <div className="preview-row mt-1">
          <span className="text-sm" style={{ color: "rgba(241,245,249,0.55)" }}>Pago a mais (est.)</span>
          <span className="text-base font-bold" style={{ color: "#fff" }}>R$ 4.290</span>
        </div>
        <div className="mt-4 text-center">
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(0,212,106,0.1)", color: "#00D46A", border: "1px solid rgba(0,212,106,0.2)" }}
          >
            Relatório completo + contestação pronta por R$ 19,90 →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Star row ───────────────────────────────────────────────────────────── */
function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#FBBF24">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div style={{ background: "#060D1A", color: "#F1F5F9", fontFamily: "var(--font-ibm, system-ui)" }}>

      {/* ══════════ HEADER ══════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(6,13,26,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <a href="/" aria-label="AuditCrédito — página inicial"><Logo /></a>
          <a href="/auditoria" className="btn-neon text-sm py-2.5 px-5">
            Analisar agora
          </a>
        </div>
      </header>

      <main>

        {/* ══════════ HERO ════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          {/* Grain texture */}
          <Grain />

          {/* Aurora orbs */}
          <Orb
            cls="orb-float"
            style={{ width: 560, height: 560, top: "-140px", right: "-80px", background: "radial-gradient(circle, rgba(0,212,106,0.13) 0%, transparent 70%)" }}
          />
          <Orb
            cls="orb-float-2"
            style={{ width: 480, height: 480, bottom: "0px", left: "-120px", background: "radial-gradient(circle, rgba(75,142,255,0.12) 0%, transparent 70%)" }}
          />
          <Orb
            style={{ width: 320, height: 320, top: "40%", left: "45%", background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center w-full">

            {/* Label pill */}
            <div className="flex justify-center mb-6 anim-fade-up">
              <span className="section-label">
                <I d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" c="w-3 h-3" />
                Dados oficiais do Banco Central do Brasil
              </span>
            </div>

            {/* H1 — three rhythm lines */}
            <h1
              className="font-bold leading-none mb-6 anim-fade-up-1"
              style={{ fontSize: "clamp(2.4rem, 7vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              <span style={{ color: "#F1F5F9" }}>O banco cobra mais.</span>
              <br />
              <span style={{ color: "#F1F5F9" }}>Você paga </span>
              <span className="gradient-text-neon">sem saber disso.</span>
            </h1>

            {/* Sub */}
            <p
              className="text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10 anim-fade-up-2"
              style={{ color: "rgba(241,245,249,0.6)" }}
            >
              Em 2 minutos você vê a verdade sobre a taxa do seu crédito —
              comparada com os dados oficiais do Banco Central.
              Sem CPF. Sem cadastro. Sem enrolação.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 anim-fade-up-3">
              <a href="/auditoria" className="btn-neon btn-neon-pulse w-full sm:w-auto text-base py-4 px-8">
                Descobrir agora — é grátis
                <I d="M17 8l4 4m0 0l-4 4m4-4H3" c="w-4 h-4" />
              </a>
              <a href="#como-funciona" className="btn-dark-ghost w-full sm:w-auto text-base py-4 px-8">
                Ver como funciona
              </a>
            </div>

            {/* Trust strips */}
            <div
              className="flex flex-wrap items-center justify-center gap-4 mt-6 anim-fade-up-4"
              style={{ color: "rgba(241,245,249,0.32)", fontSize: "0.8rem" }}
            >
              {["Sem CPF", "Sem cadastro", "Resultado em 2 min", "100% gratuito"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <I d="M5 13l4 4L19 7" c="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>

            {/* Product preview */}
            <HeroPreview />
          </div>
        </section>

        {/* ══════════ STATS STRIP ════════════════════════════════════════ */}
        <div
          style={{
            background: "rgba(255,255,255,0.025)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 grid grid-cols-3 divide-x" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {[
              { n: "400%", sup: "a.a.", label: "Juros do rotativo no Brasil — o mais alto do planeta" },
              { n: "R$ 19,90", sup: "", label: "Relatório completo + documento de contestação pronto" },
              { n: "2 min", sup: "", label: "Para saber exatamente quanto você está pagando a mais" },
            ].map(({ n, sup, label }) => (
              <div key={label} className="stat-dk" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                <span className="stat-dk-num">
                  {n}
                  {sup && <sup style={{ fontSize: "0.45em", verticalAlign: "super", color: "rgba(241,245,249,0.5)" }}>{sup}</sup>}
                </span>
                <span className="stat-dk-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════ COMO FUNCIONA ════════════════════════════════════════ */}
        <section id="como-funciona" className="relative py-24 px-4 sm:px-6 overflow-hidden">
          <Orb
            style={{ width: 400, height: 400, top: "0", left: "-150px", background: "radial-gradient(circle, rgba(75,142,255,0.08) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="section-label section-label-blue mb-4 inline-flex">Em 3 passos simples</span>
              <h2
                className="font-bold mt-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
              >
                Como funciona
              </h2>
              <p className="mt-3 text-base" style={{ color: "rgba(241,245,249,0.5)" }}>
                Direto ao ponto. Sem cadastro, sem burocracia.
              </p>
            </div>

            {/* Steps — vertical layout with connector */}
            <div className="space-y-4">
              {[
                {
                  n: "01",
                  icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                  title: "Informe os dados do seu crédito",
                  body: "Tipo de crédito, valor, taxa cobrada e prazo. Nenhum CPF, nenhuma senha, nenhum dado bancário.",
                  tag: "30 segundos",
                },
                {
                  n: "02",
                  icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  title: "Consultamos o Banco Central em tempo real",
                  body: "Acessamos a API pública do BCB/SGS e buscamos a taxa média oficial para o seu tipo de crédito.",
                  tag: "Automático",
                },
                {
                  n: "03",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Você vê a verdade — sem filtro",
                  body: "Sua taxa vs. a média oficial, a diferença em reais, e o veredicto. Sem eufemismo, sem enrolação.",
                  tag: "Resultado imediato",
                },
              ].map(({ n, icon, title, body, tag }, idx) => (
                <div key={n} className="flex gap-5 glass-card glass-card-neon p-6">
                  {/* Left: number */}
                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg"
                      style={{
                        background: "linear-gradient(135deg, rgba(0,212,106,0.15), rgba(0,212,106,0.05))",
                        border: "1px solid rgba(0,212,106,0.3)",
                        color: "#00D46A",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {n}
                    </div>
                    {idx < 2 && (
                      <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.07)", minHeight: 24 }} />
                    )}
                  </div>
                  {/* Right: content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
                      <h3 className="font-bold text-base" style={{ color: "#F1F5F9" }}>{title}</h3>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(241,245,249,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {tag}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.5)" }}>
                      {body}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <I d={icon} c="w-4 h-4 flex-shrink-0" style={{ color: "#00D46A" } />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="/auditoria" className="btn-neon inline-flex">
                Fazer minha análise gratuita
                <I d="M17 8l4 4m0 0l-4 4m4-4H3" c="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ══════════ O QUE VOCÊ DESCOBRE ══════════════════════════════════ */}
        <section
          className="relative py-24 px-4 sm:px-6 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Orb
            cls="orb-float-3"
            style={{ width: 500, height: 500, top: "-100px", right: "-150px", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-label mb-4 inline-flex">Análise completa</span>
              <h2
                className="font-bold mt-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
              >
                O que aparece na sua tela
              </h2>
              <p className="mt-3 text-base" style={{ color: "rgba(241,245,249,0.5)" }}>
                Análise básica já mostra o essencial. O relatório entrega tudo para agir.
              </p>
            </div>

            {/* Free vs Paid two-column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Free column */}
              <div className="glass-card p-6 sm:p-7">
                <div className="flex items-center gap-2.5 mb-6">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "rgba(0,212,106,0.12)", color: "#00D46A", border: "1px solid rgba(0,212,106,0.25)" }}
                  >
                    Grátis
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "rgba(241,245,249,0.7)" }}>
                    Análise básica
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Comparativo de taxas", body: "Sua taxa cobrada lado a lado com a média oficial do Banco Central." },
                    { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Diferença em reais", body: "Não em percentual abstrato — em reais, calculado com juros compostos." },
                    { icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z", title: "Veredicto da taxa", body: "Dentro da média, acima ou potencialmente abusiva. Com base no BCB." },
                  ].map(({ icon, title, body }) => (
                    <div key={title} className="feat-row">
                      <div className="feat-check feat-check-green">
                        <I d="M5 13l4 4L19 7" c="w-3 h-3" style={{ color: "#00D46A" } sw={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(241,245,249,0.45)" }}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Paid column */}
              <div
                className="glass-card p-6 sm:p-7"
                style={{ border: "1px solid rgba(75,142,255,0.25)", background: "rgba(75,142,255,0.04)" }}
              >
                <div className="flex items-center gap-2.5 mb-6">
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "rgba(75,142,255,0.14)", color: "#4B8EFF", border: "1px solid rgba(75,142,255,0.3)" }}
                  >
                    R$ 19,90
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "rgba(241,245,249,0.7)" }}>
                    Relatório completo
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { title: "Cálculo detalhado com juros compostos", body: "Cada centavo calculado mês a mês, com memória de cálculo completa." },
                    { title: "Base legal pronta (CDC + Súmula 297 STJ)", body: "Os artigos certos para contestar cobranças abusivas por escrito." },
                    { title: "Requerimento Administrativo completo", body: "Preenche com seus dados, assina e envia ao banco. Só isso." },
                    { title: "Guia de negociação passo a passo", body: "O que dizer, onde ir e como reagir quando o banco empurrar." },
                  ].map(({ title, body }) => (
                    <div key={title} className="feat-row">
                      <div className="feat-check feat-check-blue">
                        <I d="M5 13l4 4L19 7" c="w-3 h-3" style={{ color: "#4B8EFF" } sw={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "#F1F5F9" }}>{title}</p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(241,245,249,0.45)" }}>{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5" style={{ borderTop: "1px solid rgba(75,142,255,0.15)" }}>
                  <a href="/auditoria" className="btn-neon w-full justify-center text-sm py-3">
                    Fazer análise gratuita primeiro
                    <I d="M17 8l4 4m0 0l-4 4m4-4H3" c="w-4 h-4" />
                  </a>
                  <p className="text-center text-xs mt-3" style={{ color: "rgba(241,245,249,0.3)" }}>
                    Relatório disponível após a análise. Garantia de 7 dias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════ A VERDADE QUE O BANCO NÃO CONTA ════════════════════ */}
        <section
          className="relative py-24 px-4 sm:px-6 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Orb
            cls="orb-float"
            style={{ width: 450, height: 450, top: "50%", left: "-180px", background: "radial-gradient(circle, rgba(252,92,92,0.07) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-label section-label-red mb-4 inline-flex">
                O que ninguém te conta no gerente
              </span>
              <h2
                className="font-bold mt-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
              >
                O banco sabe o que faz.{" "}
                <span className="gradient-text-neon">Agora você também vai saber.</span>
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  cls: "alert-dk-red",
                  iconD: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  iconColor: "#FC5C5C",
                  label: "Realidade brutal",
                  text: "O Brasil tem os juros ao consumidor mais altos do mundo. O cartão rotativo passou de 400% ao ano em 2024. Isso não é exagero — é o próprio Banco Central confirmando nos relatórios oficiais.",
                },
                {
                  cls: "alert-dk-amber",
                  iconD: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  iconColor: "#FBBF24",
                  label: "Seu direito existe",
                  text: "O CDC e a Súmula 297 do STJ garantem que cláusulas abusivas podem ser contestadas. O banco tem advogados que sabem disso há décadas. A questão é: você sabe também?",
                },
                {
                  cls: "alert-dk-green",
                  iconD: "M5 13l4 4L19 7",
                  iconColor: "#00D46A",
                  label: "A informação é sua",
                  text: "O Banco Central publica todo mês a taxa média por tipo de crédito. Essa informação é pública, gratuita e é sua por direito. A maioria das pessoas nunca soube como acessá-la.",
                },
                {
                  cls: "alert-dk-green",
                  iconD: "M5 13l4 4L19 7",
                  iconColor: "#00D46A",
                  label: "O primeiro passo",
                  text: "Saber é o primeiro passo para agir. Não prometemos milagres — entregamos o que você tem direito: a informação organizada, os números certos e o documento pronto para contestar.",
                },
              ].map(({ cls, iconD, iconColor, label, text }, i) => (
                <div key={i} className={`${cls} flex gap-4 p-5`}>
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                    style={{ background: `${iconColor}18` }}
                  >
                    <svg className="w-4 h-4" style={{ color: iconColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={iconD} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: iconColor }}>{label}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.65)" }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ MID CTA ══════════════════════════════════════════════ */}
        <section
          className="relative py-20 px-4 sm:px-6 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,106,0.06) 0%, rgba(6,13,26,0) 60%)",
            borderTop: "1px solid rgba(0,212,106,0.12)",
            borderBottom: "1px solid rgba(0,212,106,0.12)",
          }}
        >
          <Orb
            style={{ width: 480, height: 480, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(0,212,106,0.07) 0%, transparent 70%)" }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2
              className="font-bold mb-4 leading-tight"
              style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
            >
              Chega de pagar a mais em silêncio.
            </h2>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "rgba(241,245,249,0.55)" }}>
              O relatório completo traz o cálculo com juros compostos,
              o Requerimento Administrativo pronto para assinar e o guia de negociação.
              Tudo por{" "}
              <strong style={{ color: "#F1F5F9" }}>R&nbsp;19,90</strong>{" "}
              — após a análise gratuita.
            </p>
            <a href="/auditoria" className="btn-neon inline-flex text-base py-4 px-10">
              Fazer análise gratuita agora
            </a>
            <p className="mt-4 text-sm" style={{ color: "rgba(241,245,249,0.28)" }}>
              A análise básica é sempre grátis. O relatório é opcional.
            </p>
          </div>
        </section>

        {/* ══════════ DEPOIMENTOS ══════════════════════════════════════════ */}
        <section className="py-24 px-4 sm:px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-label section-label-blue mb-4 inline-flex">Quem já descobriu</span>
              <h2
                className="font-bold mt-4"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
              >
                Pessoas que tomaram o controle
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  texto: "Achava que estava pagando normal. O relatório mostrou que paguei R$ 2.400 a mais no meu financiamento. Fui ao banco no mesmo dia com o documento em mãos.",
                  nome: "Carlos M.",
                  tipo: "Crédito pessoal · São Paulo",
                  inicial: "C",
                  color: "#00D46A",
                },
                {
                  texto: "Taxa quase 3x acima da média. O modelo de requerimento me poupou horas de pesquisa. Entrei com a contestação e o banco reduziu os juros em 15 dias.",
                  nome: "Fernanda R.",
                  tipo: "Cartão rotativo · Belo Horizonte",
                  inicial: "F",
                  color: "#4B8EFF",
                },
                {
                  texto: "Minha taxa estava na média, mas aprendi que posso negociar. Mostrei os números ao gerente e consegui reduzir ainda mais. Isso eu não sabia que podia fazer.",
                  nome: "Paulo S.",
                  tipo: "Consignado · Porto Alegre",
                  inicial: "P",
                  color: "#A855F7",
                },
              ].map(({ texto, nome, tipo, inicial, color }) => (
                <div key={nome} className="testi-card flex flex-col gap-4">
                  <Stars />
                  {/* Large open-quote */}
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "rgba(241,245,249,0.65)" }}
                  >
                    &ldquo;{texto}&rdquo;
                  </p>
                  <div
                    className="flex items-center gap-3 pt-4"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `${color}22`, border: `1px solid ${color}44`, color }}
                    >
                      {inicial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#F1F5F9" }}>{nome}</p>
                      <p className="text-xs" style={{ color: "rgba(241,245,249,0.3)" }}>{tipo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FAQ ══════════════════════════════════════════════════ */}
        <section
          className="py-24 px-4 sm:px-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="font-bold"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", letterSpacing: "-0.02em", color: "#F1F5F9" }}
              >
                Perguntas frequentes
              </h2>
            </div>
            <div className="space-y-2.5">
              {[
                {
                  q: "Isso limpa meu nome?",
                  a: "Não — e é importante deixar isso claro. AuditCrédito compara a taxa do seu contrato com os dados do Banco Central. Se a taxa estiver abusiva, você vai ter o documento certo para questionar junto ao banco.",
                },
                {
                  q: "O relatório tem valor jurídico?",
                  a: "Não substitui um advogado. Mas entrega os números organizados, a base legal relevante (CDC, Súmula 297 do STJ) e o modelo de Requerimento Administrativo pronto para assinar e enviar.",
                },
                {
                  q: "De onde vêm os dados?",
                  a: "Diretamente da API pública do Banco Central do Brasil (BCB/SGS). Não criamos os números — buscamos a taxa média oficial, atualizada mensalmente pelo BCB, em tempo real.",
                },
                {
                  q: "Preciso pagar para usar?",
                  a: "A análise básica é sempre grátis. O relatório completo — com cálculo detalhado, base legal e modelo de requerimento — custa R$ 19,90.",
                },
                {
                  q: "Meus dados ficam armazenados?",
                  a: "Apenas o necessário para entregar o relatório. Nenhum CPF, nenhuma senha, nenhum dado bancário. Excluídos após 90 dias. Todos os detalhes na Política de Privacidade.",
                },
                {
                  q: "E se eu não ficar satisfeito?",
                  a: "Garantia de 7 dias, sem burocracia e sem perguntas. Mande um e-mail para suporte@auditcredito.com.br e devolvemos o valor integral.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="faq-dk">
                  <p className="font-semibold text-sm mb-2" style={{ color: "#F1F5F9" }}>{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(241,245,249,0.5)" }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════ FINAL CTA ════════════════════════════════════════════ */}
        <section
          className="relative py-28 px-4 sm:px-6 overflow-hidden"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Grain />
          <Orb
            cls="orb-float"
            style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle, rgba(0,212,106,0.1) 0%, rgba(75,142,255,0.06) 50%, transparent 70%)" }}
          />
          {/* Horizontal grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "100% 64px",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <span className="section-label mb-6 inline-flex">Última chance de agir hoje</span>
            <h2
              className="font-black leading-tight mt-6 mb-5"
              style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", letterSpacing: "-0.03em", color: "#F1F5F9" }}
            >
              Quanto tempo você ainda vai ficar sem saber?
            </h2>
            <p
              className="text-lg mb-10 leading-relaxed"
              style={{ color: "rgba(241,245,249,0.55)", maxWidth: 480, margin: "0 auto 2.5rem" }}
            >
              Menos de 2 minutos. Sem cadastro. Sem cartão de crédito para a análise básica.
              Só a verdade sobre a taxa que você está pagando agora.
            </p>
            <a href="/auditoria" className="btn-neon btn-neon-pulse inline-flex text-lg py-5 px-12">
              Quero saber agora — é grátis
              <I d="M17 8l4 4m0 0l-4 4m4-4H3" c="w-5 h-5" />
            </a>
            <div
              className="flex flex-wrap items-center justify-center gap-5 mt-8 text-sm"
              style={{ color: "rgba(241,245,249,0.3)" }}
            >
              {["Garantia de 7 dias", "Dados do Banco Central", "Sem CPF"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <I d="M5 13l4 4L19 7" c="w-3.5 h-3.5" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ══════════ FOOTER ══════════════════════════════════════════════ */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <a href="/" aria-label="AuditCrédito"><Logo /></a>
            <nav className="flex flex-wrap gap-5">
              {[
                { label: "Fazer análise", href: "/auditoria" },
                { label: "Privacidade", href: "/politica-de-privacidade" },
                { label: "Termos de Uso", href: "/termos-de-uso" },
                { label: "Suporte", href: "mailto:suporte@auditcredito.com.br" },
              ].map(({ label, href }) => (
                <a key={label} href={href} className="footer-link-dk">{label}</a>
              ))}
            </nav>
          </div>

          <div className="h-divider-dark mb-6" />

          <div className="space-y-2">
            <p className="text-xs leading-relaxed" style={{ color: "rgba(241,245,249,0.22)" }}>
              <strong style={{ color: "rgba(241,245,249,0.38)" }}>Aviso legal:</strong>{" "}
              O AuditCrédito é uma ferramenta educacional independente. As análises são informativas e baseadas em
              dados públicos do Banco Central do Brasil. Não constituem parecer jurídico, financeiro ou legal.
              Para contestações formais, consulte um advogado especializado em direito do consumidor.
            </p>
            <p className="text-xs" style={{ color: "rgba(241,245,249,0.18)" }}>
              Dados: Banco Central do Brasil — SGS (api.bcb.gov.br)&nbsp;·&nbsp;
              Garantia de 7 dias&nbsp;·&nbsp;
              suporte@auditcredito.com.br&nbsp;·&nbsp;
              © {new Date().getFullYear()} AuditCrédito
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
