import type { CSSProperties } from "react";
import FormularioAuditoria from "@/components/FormularioAuditoria";

export const metadata = {
  title: "Analisar minha taxa | AuditCrédito",
  description:
    "Informe os dados do seu crédito e descubra em segundos se o banco está te cobrando acima da média oficial do Banco Central.",
};

const LOGO_PATH =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

function Orb({ style, cls = "" }: { style: CSSProperties; cls?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute rounded-full pointer-events-none ${cls}`}
      style={{ filter: "blur(120px)", ...style }}
    />
  );
}

export default function AuditoriaPage() {
  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#060D1A" }}
    >
      {/* Aurora orbs */}
      <Orb
        cls="orb-float"
        style={{
          width: 500,
          height: 500,
          top: -150,
          right: -100,
          background: "radial-gradient(circle, rgba(0,212,106,0.15) 0%, transparent 70%)",
        }}
      />
      <Orb
        cls="orb-float-2"
        style={{
          width: 600,
          height: 600,
          top: 200,
          left: -200,
          background: "radial-gradient(circle, rgba(75,142,255,0.12) 0%, transparent 70%)",
        }}
      />
      <Orb
        cls="orb-float-3"
        style={{
          width: 400,
          height: 400,
          bottom: 0,
          right: 100,
          background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <header
        className="border-b sticky top-0 z-50"
        style={{
          background: "rgba(6,13,26,0.85)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.07)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(0,212,106,0.12)",
                border: "1px solid rgba(0,212,106,0.3)",
              }}
            >
              <svg
                className="w-4 h-4"
                style={{ color: "#00D46A" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={LOGO_PATH} />
              </svg>
            </span>
            <span className="font-bold text-sm tracking-tight" style={{ color: "#FFFFFF" }}>
              AuditCrédito
            </span>
          </a>

          <div
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(0,212,106,0.10)",
              color: "#00D46A",
              border: "1px solid rgba(0,212,106,0.2)",
            }}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Dados do Banco Central
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 relative z-10">

        {/* Topo da página */}
        <div className="mb-8 anim-fade-up">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-2 leading-tight"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Quanto o banco está te cobrando?
          </h1>
          <p className="text-base" style={{ color: "rgba(255,255,255,0.55)" }}>
            Preencha os dados abaixo. Em menos de 1 minuto você sabe se a taxa é justa —
            ou se está acima do que deveria.
          </p>
        </div>

        {/* Card do formulário — fundo branco para legibilidade */}
        <div
          className="rounded-2xl mb-6 anim-fade-up-1"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 24px 64px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div className="p-6 sm:p-8">
            <FormularioAuditoria />
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 anim-fade-up-2">
          {[
            {
              icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
              text: "Sem CPF, sem senha, sem dados bancários",
            },
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              text: "Resultado em segundos — sem espera",
            },
            {
              icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              text: "Análise básica 100% gratuita",
            },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <svg
                className="w-4 h-4 flex-shrink-0"
                style={{ color: "#00D46A" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.60)" }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-5 text-xs text-center" style={{ color: "rgba(255,255,255,0.28)" }}>
          Análise baseada em dados públicos do Banco Central do Brasil. Não constitui
          consultoria jurídica ou financeira.
        </p>
      </div>
    </main>
  );
}
