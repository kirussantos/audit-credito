/* ─── Ícones inline reutilizáveis ─────────────────────────────────────────── */
import type { CSSProperties } from "react";

function Icon({ path, cls = "w-5 h-5", style }: { path: string; cls?: string; style?: CSSProperties }) {
  return (
    <svg className={cls} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const LOGO_PATH =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

/* ─── Logo ──────────────────────────────────────────────────────────────────── */
function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: inverted ? "rgba(255,255,255,0.15)" : "#1E3A5F" }}
      >
        <Icon path={LOGO_PATH} cls="w-4.5 h-4.5 text-white" />
      </span>
      <span
        className="font-bold text-base tracking-tight"
        style={{ color: inverted ? "#fff" : "#0F172A" }}
      >
        AuditCrédito
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "var(--font-ibm, system-ui)" }}>

      {/* ════════════════════════════════════════════════════════
          HEADER — sticky, glass-like
      ════════════════════════════════════════════════════════ */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--bdr)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Logo />
          <a href="/auditoria" className="btn-cta text-sm py-2.5 px-5">
            Analisar agora
          </a>
        </div>
      </header>

      <main className="flex-1">

        {/* ════════════════════════════════════════════════════
            HERO — dark navy, grid texture
        ════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 60%, #2D5A8E 100%)",
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow spot */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 anim-fade-up">
              <span
                className="trust-pill"
                style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)" }}
              >
                <Icon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" cls="w-3.5 h-3.5" />
                Banco Central do Brasil — dados oficiais
              </span>
            </div>

            {/* H1 */}
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 anim-fade-up-1"
              style={{ color: "#fff", letterSpacing: "-0.02em" }}
            >
              O banco está te cobrando{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #60A5FA, #34D399)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                juros acima do mercado
              </span>
              <br className="hidden sm:block" />
              — e você provavelmente não sabe disso.
            </h1>

            {/* Sub */}
            <p
              className="text-lg sm:text-xl mb-8 leading-relaxed max-w-2xl mx-auto anim-fade-up-2"
              style={{ color: "rgba(255,255,255,0.72)" }}
            >
              Em 2 minutos você vê a verdade sobre a taxa do seu crédito.
              Comparamos com os dados oficiais do Banco Central.
              Sem cadastro, sem CPF, sem enrolação.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 anim-fade-up-3">
              <a href="/auditoria" className="btn-cta btn-pulse text-base w-full sm:w-auto py-4 px-8">
                Descobrir agora — é grátis
                <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" cls="w-4 h-4" />
              </a>
            </div>

            {/* Trust strips */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 anim-fade-up-4"
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}
            >
              {["Sem CPF", "Sem cadastro", "Resultado em segundos", "100% gratuito"].map((t) => (
                <span key={t} className="flex items-center gap-1">
                  <Icon path="M5 13l4 4L19 7" cls="w-3 h-3" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="relative border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.25)" }}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-4 text-center">
              {[
                { n: "400%", label: "ao ano — rotativo de cartão no Brasil, o maior do planeta" },
                { n: "R$&nbsp;19,90", label: "pelo relatório completo + contestação pronta" },
                { n: "2 min", label: "para saber a verdade sobre a sua taxa" },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span
                    className="text-2xl sm:text-3xl font-bold"
                    style={{ color: "#60A5FA" }}
                    dangerouslySetInnerHTML={{ __html: n }}
                  />
                  <span
                    className="text-xs sm:text-sm leading-snug max-w-[160px]"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            COMO FUNCIONA — 3 passos com linha conectora
        ════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6" style={{ background: "var(--surface)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--blue)" }}
              >
                Em 3 passos simples
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                Como funciona
              </h2>
              <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "var(--text-3)" }}>
                Direto ao ponto. Sem cadastro, sem burocracia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                  title: "Informe os dados",
                  body: "Tipo de crédito, valor, taxa cobrada e prazo. Sem CPF, sem senha, sem dado bancário.",
                },
                {
                  num: "02",
                  icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  title: "Buscamos no Banco Central",
                  body: "Acessamos em tempo real a API pública do BCB/SGS. Os dados são deles — a gente só organiza para você.",
                },
                {
                  num: "03",
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Você vê a verdade",
                  body: "Sua taxa vs. a média oficial, a diferença em reais, o veredicto. Sem eufemismo.",
                },
              ].map(({ num, icon, title, body }, i) => (
                <div
                  key={num}
                  className="relative flex flex-col gap-4 p-6 rounded-2xl card card-lift"
                  style={{ borderColor: "var(--bdr)" }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--surface-3)" }}
                    >
                      <Icon path={icon} cls="w-5 h-5" style={{ color: "var(--blue)" }} />
                    </span>
                    <span
                      className="text-4xl font-bold leading-none"
                      style={{ color: "var(--bdr-2)", fontVariantNumeric: "tabular-nums" }}
                    >
                      {num}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1" style={{ color: "var(--text)" }}>
                      {title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                      {body}
                    </p>
                  </div>
                  {/* Step indicator dot */}
                  <div
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold sm:hidden"
                    style={{ background: "var(--navy-mid)" }}
                  >
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="/auditoria" className="btn-cta inline-flex">
                Fazer minha análise gratuita
              </a>
            </div>
          </div>
        </section>

        <div className="h-divider" />

        {/* ════════════════════════════════════════════════════
            O QUE VOCÊ DESCOBRE — 4 cards em grid 2×2
        ════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6" style={{ background: "var(--surface-3)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--blue)" }}
              >
                Análise completa
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                O que aparece na sua tela
              </h2>
              <p className="mt-3 text-base max-w-md mx-auto" style={{ color: "var(--text-3)" }}>
                A análise básica já mostra o essencial. O relatório entrega tudo que precisa para agir.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                {
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                  badge: "Grátis",
                  badgeColor: "var(--success)",
                  title: "Comparativo de taxas",
                  body: "Sua taxa cobrada lado a lado com a média oficial do Banco Central. Os dois números na mesma tela.",
                },
                {
                  icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  badge: "Grátis",
                  badgeColor: "var(--success)",
                  title: "Diferença em reais",
                  body: "Não em percentual abstrato — em reais. Quanto saiu do seu bolso a mais, calculado com juros compostos.",
                },
                {
                  icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  badge: "Grátis",
                  badgeColor: "var(--success)",
                  title: "Veredicto da taxa",
                  body: "Dentro da média, acima ou potencialmente abusiva. Com base nos dados do BCB — não na nossa opinião.",
                },
                {
                  icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                  badge: "Relatório R$ 19,90",
                  badgeColor: "var(--navy-mid)",
                  title: "Contestação pronta",
                  body: "Requerimento Administrativo completo, base legal (CDC + Súmula 297 STJ) e guia de negociação. Só assina e envia.",
                },
              ].map(({ icon, badge, badgeColor, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 p-5 rounded-2xl bg-white card card-lift"
                  style={{ borderColor: "var(--bdr)" }}
                >
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--surface-3)" }}
                  >
                    <svg className="w-5 h-5" style={{ color: "var(--blue)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                        {title}
                      </h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full text-white flex-shrink-0"
                        style={{ background: badgeColor }}
                      >
                        {badge}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-divider" />

        {/* ════════════════════════════════════════════════════
            A VERDADE QUE O BANCO NÃO CONTA — bullets emocionais
        ════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6" style={{ background: "var(--surface)" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--danger)" }}
              >
                O que ninguém te conta no gerente
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                O banco sabe o que faz —{" "}
                <span style={{ color: "var(--navy-mid)" }}>e você também vai saber agora</span>
              </h2>
            </div>

            <div className="space-y-5">
              {[
                {
                  icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  color: "var(--danger)",
                  bg: "#FEF2F2",
                  text: "O Brasil tem os juros ao consumidor mais altos do mundo. O cartão rotativo passou de 400% ao ano em 2024. Isso não é exagero — é o próprio Banco Central confirmando nos relatórios oficiais.",
                },
                {
                  icon: "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  color: "var(--warning)",
                  bg: "#FFFBEB",
                  text: "O CDC e a Súmula 297 do STJ garantem que cláusulas abusivas podem ser contestadas. O banco tem advogados que sabem disso há décadas. A questão é: você sabe também?",
                },
                {
                  icon: "M5 13l4 4L19 7",
                  color: "var(--success)",
                  bg: "#F0FDF4",
                  text: "O Banco Central publica todo mês a taxa média por tipo de crédito. Essa informação é pública, gratuita e é sua por direito. A maioria das pessoas nunca soube como acessá-la.",
                },
                {
                  icon: "M5 13l4 4L19 7",
                  color: "var(--success)",
                  bg: "#F0FDF4",
                  text: "Saber é o primeiro passo para agir. Não prometemos milagres — entregamos o que você tem direito: a informação organizada, os números certos e o documento pronto para contestar.",
                },
              ].map(({ icon, color, bg, text }, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-5 rounded-xl"
                  style={{ background: bg, border: `1px solid ${bg === "#F0FDF4" ? "var(--success-bdr)" : bg === "#FEF2F2" ? "var(--danger-bdr)" : "var(--warning-bdr)"}` }}
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                    style={{ background: color + "22" }}
                  >
                    <svg className="w-4 h-4" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CTA BANNER — dark navy
        ════════════════════════════════════════════════════ */}
        <section
          className="py-16 px-4 sm:px-6"
          style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 100%)" }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
              style={{ color: "#fff", letterSpacing: "-0.01em" }}
            >
              Chega de pagar a mais em silêncio
            </h2>
            <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              O relatório completo traz o cálculo com juros compostos, o modelo de Requerimento
              Administrativo pronto para assinar, as referências legais corretas e o guia de
              negociação passo a passo. Tudo por R&nbsp;19,90 — após a análise gratuita.
            </p>
            <a href="/auditoria" className="btn-cta inline-flex text-base py-4 px-10">
              Fazer análise gratuita agora
            </a>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              A análise básica é sempre grátis. O relatório é opcional — R$&nbsp;19,90.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            DEPOIMENTOS — 3 cards com avatar
        ════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6" style={{ background: "var(--surface)" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "var(--blue)" }}
              >
                Quem já descobriu
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                Pessoas que tomaram o controle
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  texto: "Achava que estava pagando normal. O relatório mostrou que paguei R$ 2.400 a mais no meu financiamento. Fui ao banco no mesmo dia com o documento em mãos.",
                  nome: "Carlos M.",
                  tipo: "Crédito pessoal · São Paulo",
                  inicial: "C",
                },
                {
                  texto: "Taxa quase 3x acima da média. O modelo de requerimento me poupou horas de pesquisa. Entrei com a contestação e o banco reduziu os juros em 15 dias.",
                  nome: "Fernanda R.",
                  tipo: "Cartão rotativo · Belo Horizonte",
                  inicial: "F",
                },
                {
                  texto: "Minha taxa estava na média, mas aprendi que posso negociar. Conversei com o gerente, mostrei os números e consegui reduzir ainda mais. Isso eu não sabia.",
                  nome: "Paulo S.",
                  tipo: "Consignado · Porto Alegre",
                  inicial: "P",
                },
              ].map(({ texto, nome, tipo, inicial }) => (
                <div
                  key={nome}
                  className="flex flex-col gap-4 p-6 rounded-2xl card card-lift"
                  style={{ borderColor: "var(--bdr)" }}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4" fill="#F59E0B" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--text-2)" }}>
                    &ldquo;{texto}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--bdr)" }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: "var(--navy-mid)" }}
                    >
                      {inicial}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{nome}</p>
                      <p className="text-xs" style={{ color: "var(--text-4)" }}>{tipo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="h-divider" />

        {/* ════════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-6" style={{ background: "var(--surface-2)" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
                Perguntas frequentes
              </h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  q: "Isso limpa meu nome?",
                  a: "Não — e é importante deixar isso claro. AuditCrédito compara a taxa do seu contrato com os dados do Banco Central. Se a taxa estiver abusiva, você vai ter o documento certo para questionar junto ao banco ou aos órgãos competentes.",
                },
                {
                  q: "O relatório tem valor jurídico?",
                  a: "Não substitui um advogado. Mas entrega os números organizados, a base legal relevante (CDC, Súmula 297 do STJ) e o modelo de Requerimento Administrativo pronto para assinar e enviar. O que você faz com isso é sua decisão.",
                },
                {
                  q: "De onde vêm os dados?",
                  a: "Diretamente da API pública do Banco Central do Brasil (BCB/SGS). Não criamos os números — buscamos a taxa média oficial, atualizada mensalmente pelo BCB, em tempo real.",
                },
                {
                  q: "Preciso pagar para usar?",
                  a: "A análise básica é sempre grátis. Você vê o comparativo de taxas, a diferença em reais e o veredicto. O relatório completo — com cálculo detalhado, base legal e modelo de requerimento — custa R$ 19,90.",
                },
                {
                  q: "Meus dados ficam armazenados?",
                  a: "Apenas o necessário para entregar o relatório. Nenhum CPF, nenhuma senha, nenhum dado bancário. Os dados são excluídos após 90 dias. Todos os detalhes estão na Política de Privacidade.",
                },
                {
                  q: "E se eu não ficar satisfeito?",
                  a: "Garantia de 7 dias, sem burocracia e sem perguntas. Mande um e-mail para suporte@auditcredito.com.br e devolvemos o valor integral.",
                },
              ].map(({ q, a }, i) => (
                <div
                  key={q}
                  className="rounded-xl p-5"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--bdr)",
                  }}
                >
                  <p className="font-semibold text-sm mb-2" style={{ color: "var(--text)" }}>
                    {q}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CTA FINAL — gradiente escuro com urgência
        ════════════════════════════════════════════════════ */}
        <section
          className="py-24 px-4 sm:px-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0D1B2A 0%, #1E3A5F 70%, #2D5A8E 100%)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 80%, rgba(37,99,235,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(22,163,74,0.08) 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-2xl mx-auto text-center">
            <h2
              className="text-2xl sm:text-4xl font-bold mb-4 leading-tight"
              style={{ color: "#fff", letterSpacing: "-0.02em" }}
            >
              Quanto tempo você ainda vai ficar sem saber?
            </h2>
            <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
              Menos de 2 minutos. Sem cadastro. Sem cartão de crédito para a análise básica.
              Só a verdade sobre a taxa que você está pagando.
            </p>
            <a href="/auditoria" className="btn-cta text-lg py-5 px-12 inline-flex">
              Quero saber agora — é grátis
              <Icon path="M17 8l4 4m0 0l-4 4m4-4H3" cls="w-5 h-5" />
            </a>
            <div
              className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {["Garantia de 7 dias", "Dados do Banco Central", "Sem CPF"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Icon path="M5 13l4 4L19 7" cls="w-3.5 h-3.5" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* ════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════ */}
      <footer
        className="border-t py-10 px-4 sm:px-6"
        style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <Logo />
            <nav className="flex flex-wrap gap-5 text-sm" style={{ color: "var(--text-3)" }}>
              {[
                { label: "Fazer análise", href: "/auditoria" },
                { label: "Privacidade", href: "/politica-de-privacidade" },
                { label: "Termos de Uso", href: "/termos-de-uso" },
                { label: "Suporte", href: "mailto:suporte@auditcredito.com.br" },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-link"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="h-divider mb-6" />

          <div className="space-y-2">
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-4)" }}>
              <strong style={{ color: "var(--text-3)" }}>Aviso legal:</strong> O AuditCrédito é uma
              ferramenta educacional independente. As análises são informativas e baseadas em dados
              públicos do Banco Central do Brasil. Não constituem parecer jurídico, financeiro ou
              legal. Para contestações formais, consulte um advogado especializado em direito do
              consumidor.
            </p>
            <p className="text-xs" style={{ color: "var(--text-4)" }}>
              Dados: Banco Central do Brasil — SGS (api.bcb.gov.br) &nbsp;·&nbsp; Garantia de 7
              dias &nbsp;·&nbsp; suporte@auditcredito.com.br &nbsp;·&nbsp; © {new Date().getFullYear()} AuditCrédito
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
