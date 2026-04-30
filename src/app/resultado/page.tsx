import ResultadoAuditoria from "@/components/ResultadoAuditoria";

export const metadata = {
  title: "Resultado da análise | AuditCrédito",
  description: "Resultado da comparação entre a taxa cobrada e a taxa média de referência do Banco Central.",
};

const LOGO_PATH =
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z";

export default function ResultadoPage() {
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
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
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

          <a
            href="/auditoria"
            className="text-xs font-semibold underline underline-offset-2"
            style={{ color: "var(--blue)" }}
          >
            Nova análise
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-10">

        <div className="mb-6 anim-fade-up">
          <h1
            className="text-2xl sm:text-3xl font-bold mb-1.5 leading-tight"
            style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
          >
            Resultado da análise
          </h1>
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            Comparação entre a taxa contratada e a taxa média de referência do Banco Central.
          </p>
        </div>

        <ResultadoAuditoria />

        <div className="mt-8 text-center">
          <a
            href="/auditoria"
            className="text-sm underline"
            style={{ color: "var(--text-4)" }}
          >
            Analisar outro contrato
          </a>
        </div>
      </div>
    </main>
  );
}
