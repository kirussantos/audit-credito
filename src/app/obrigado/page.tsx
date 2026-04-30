import { Suspense } from "react";
import ObrigadoConteudo from "./ObrigadoConteudo";

export const metadata = {
  title: "Relatório enviado | AuditCrédito",
  description: "Seu relatório de análise foi enviado por e-mail.",
};

const LOGO_PATH =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <header
        className="border-b sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--bdr)",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-2.5">
          <a href="/" className="flex items-center gap-2.5">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "var(--navy-mid)" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={LOGO_PATH} />
              </svg>
            </span>
            <span className="font-bold text-sm tracking-tight" style={{ color: "var(--text)" }}>
              AuditCrédito
            </span>
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-xl mx-auto w-full px-4 py-12">
        <Suspense
          fallback={
            <div className="text-center py-8 text-sm" style={{ color: "var(--text-4)" }}>
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
