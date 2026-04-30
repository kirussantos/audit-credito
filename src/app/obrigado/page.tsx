import type { CSSProperties } from "react";
import { Suspense } from "react";
import ObrigadoConteudo from "./ObrigadoConteudo";

export const metadata = {
  title: "Relatório enviado | AuditCrédito",
  description: "Seu relatório de análise foi enviado por e-mail.",
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

export default function ObrigadoPage() {
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
          right: -100,
          background: "radial-gradient(circle, rgba(0,212,106,0.15) 0%, transparent 70%)",
        }}
      />
      <Orb
        cls="orb-float-2"
        style={{
          width: 500,
          height: 500,
          bottom: 0,
          left: -200,
          background: "radial-gradient(circle, rgba(75,142,255,0.10) 0%, transparent 70%)",
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
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-2.5">
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
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-12 relative z-10">
        <Suspense
          fallback={
            <div className="text-center py-8 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Carregando…
            </div>
          }
        >
          <ObrigadoConteudo />
        </Suspense>
      </div>
    </main>
  );
}
