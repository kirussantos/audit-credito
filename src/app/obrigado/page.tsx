import { Suspense } from "react";
import ObrigadoConteudo from "./ObrigadoConteudo";

export const metadata = {
  title: "Relatório enviado | AuditCrédito",
  description: "Seu relatório de análise foi enviado por e-mail.",
};

export default function ObrigadoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "#1B4F72" }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </span>
          <span className="font-bold text-gray-900 text-base">AuditCrédito</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-12">
        <Suspense fallback={<div className="text-center text-gray-400 py-8">Carregando...</div>}>
          <ObrigadoConteudo />
        </Suspense>
      </div>
    </main>
  );
}
