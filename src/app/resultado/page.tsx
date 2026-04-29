import ResultadoAuditoria from "@/components/ResultadoAuditoria";

export const metadata = {
  title: "Resultado da análise | AuditCrédito",
  description: "Resultado da comparação entre a taxa cobrada e a taxa média do Banco Central.",
};

export default function ResultadoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "#1B4F72" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span className="font-bold text-gray-900 text-base">AuditCrédito</span>
          </a>
          <a
            href="/auditoria"
            className="text-xs text-[#2E86C1] hover:underline"
          >
            Nova análise
          </a>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Resultado da análise
          </h1>
          <p className="text-gray-500 text-sm">
            Comparação entre a taxa contratada e a taxa média de referência do Banco Central.
          </p>
        </div>

        <ResultadoAuditoria />

        <div className="mt-8 text-center">
          <a
            href="/auditoria"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Analisar outro contrato
          </a>
        </div>
      </div>
    </main>
  );
}
