import FormularioAuditoria from "@/components/FormularioAuditoria";

export const metadata = {
  title: "Analisar dívida | AuditCrédito",
  description: "Preencha os dados do seu crédito para verificar se os juros cobrados estão dentro da média do mercado.",
};

export default function AuditoriaPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Cabeçalho da página */}
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
          <span className="text-xs text-gray-400">Ferramenta educacional independente</span>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Título da seção */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Análise de juros do seu crédito
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Informe os dados do seu contrato e verificaremos se a taxa cobrada está
            dentro da média divulgada pelo Banco Central para o mesmo tipo de crédito.
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <FormularioAuditoria />
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-start gap-2 px-1">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Ferramenta educacional.</strong> Esta análise é baseada em dados
            públicos do Banco Central do Brasil e utiliza metodologia de juros compostos.
            Não constitui consultoria jurídica, financeira ou legal.
            Para contestação de cobranças, consulte um advogado especializado.
          </p>
        </div>
      </div>
    </main>
  );
}
