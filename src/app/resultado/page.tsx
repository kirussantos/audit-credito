import type { CSSProperties } from "react";
import ResultadoAuditoria from "@/components/ResultadoAuditoria";

export const metadata = {
  title: "Resultado da análise | AuditCrédito",
  description: "Resultado da comparação entre a taxa cobrada e a taxa média de referência do Banco Central.",
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

export default function ResultadoPage() {
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
          top: -100,
          right: -150,
          background: "radial-gradient(circle, rgba(75,142,255,0.15) 0%, transparent 70%)",
        }}
      />
      <Orb
        cls="orb-float-2"
        style={{
          width: 500,
          height: 500,
          top: 300,
          left: -200,
          background: "radial-gradient(circle, rgba(0,212,106,0.10) 0%, transparent 70%)",
        }}
      />
      <Orb
        cls="orb-float-3"
        style={{
          width: 350,
          height: 350,
          bottom: 50,
          right: 0,
          background: "radial-gradient(circle, rgba(139,92,246,0.09) 0%, transparent 70%)",
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

          <a
            href="/auditoria"
            className="text-xs font-semibold"
            style={{ color: "#00D46A" }}
          >
            Nova análise
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 relative z-10">

        <div className="mb-6 anim-fade-up">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5 leading-tight"
            style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Resultado da análise
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
            Comparação entre a taxa contratada e a taxa média de referência do Banco Central.
          </p>
        </div>

        {/* Resultado em card branco para legibilidade */}
        <div
          className="rounded-2xl anim-fade-up-1"
          style={{
            background: "#FFFFFF",
            boxShadow: "0 24px 64px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          <div className="p-6 sm:p-8">
            <ResultadoAuditoria />
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/auditoria"
            className="text-sm underline"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Analisar outro contrato
          </a>
        </div>
      </div>
    </main>
  );
}
