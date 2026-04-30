import FormularioAuditoria from "@/components/FormularioAuditoria";

export const metadata = {
  title: "Analisar minha taxa | AuditCrédito",
  description: "Informe os dados do seu contrato e descubra em segundos se o banco está te cobrando acima da média oficial do Banco Central.",
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
          <div
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#D6EAF8", color: "#1B4F72" }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Dados do Banco Central
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Título da seção */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Quanto o banco está te cobrando?
          </h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-lg mx-auto">
            Informe os dados do contrato abaixo. Em menos de 1 minuto você sabe
            se a taxa é justa — ou se está acima do que deveria.
          </p>
        </div>

        {/* Barra de progresso visual */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {["Informe os dados", "Veja o resultado", "Decida o que fazer"].map((etapa, i) => (
            <div key={etapa} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-gray-200" />}
              <div className="flex items-center gap-1.5">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={
                    i === 0
                      ? { backgroundColor: "#1B4F72", color: "#fff" }
                      : { backgroundColor: "#E5E7EB", color: "#9CA3AF" }
                  }
                >
                  {i + 1}
                </span>
                <span
                  className="text-xs font-medium hidden sm:inline"
                  style={{ color: i === 0 ? "#1B4F72" : "#9CA3AF" }}
                >
                  {etapa}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Card do formulário */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <FormularioAuditoria />
        </div>

        {/* Tranquilizadores */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icone: "🔒", texto: "Sem CPF, sem senha, sem dados bancários" },
            { icone: "⚡", texto: "Resultado em segundos — sem espera" },
            { icone: "🆓", texto: "Análise básica 100% gratuita" },
          ].map(({ icone, texto }) => (
            <div
              key={texto}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-100"
            >
              <span className="text-base">{icone}</span>
              <p className="text-xs text-gray-600 leading-snug">{texto}</p>
            </div>
          ))}
        </div>

        {/* Disclaimer discreto */}
        <p className="mt-5 text-xs text-gray-400 text-center leading-relaxed">
          Análise baseada em dados públicos do Banco Central do Brasil. Não constitui consultoria jurídica ou financeira.
        </p>
      </div>
    </main>
  );
}
