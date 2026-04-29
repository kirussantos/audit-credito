export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Header ── */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#1B4F72" }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span className="font-bold text-gray-900 text-base">AuditCrédito</span>
          </div>
          <a
            href="/auditoria"
            className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Analisar agora
          </a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "#D6EAF8", color: "#1B4F72" }}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Dados oficiais do Banco Central do Brasil
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Descubra se o banco está cobrando juros{" "}
            <span style={{ color: "#1B4F72" }}>acima da média</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Compare a taxa do seu empréstimo ou financiamento com os dados oficiais do Banco Central em segundos.
            Análise gratuita, sem cadastro, sem promessas vazias.
          </p>

          <a
            href="/auditoria"
            className="inline-block text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Analisar minha dívida gratuitamente
          </a>

          <p className="mt-4 text-sm text-gray-400">
            Sem cadastro &nbsp;·&nbsp; Resultado imediato &nbsp;·&nbsp; 100% gratuito
          </p>
        </div>
      </section>

      {/* ── Números de contexto ── */}
      <section className="py-10 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { valor: "52% a.m.", descricao: "Taxa média do rotativo de cartão de crédito (BCB, 2025)" },
            { valor: "R$ 19,90", descricao: "Custo do relatório completo — menos que uma consulta rápida" },
            { valor: "5 tipos", descricao: "de crédito analisados: pessoal, consignado, cartão e mais" },
          ].map(({ valor, descricao }) => (
            <div key={valor} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold" style={{ color: "#1B4F72" }}>{valor}</span>
              <span className="text-sm text-gray-500 max-w-[200px] leading-snug">{descricao}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Como funciona
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                numero: "01",
                titulo: "Informe os dados do seu contrato",
                descricao: "Digite o tipo de crédito, o valor, a taxa cobrada e o período. Nenhum dado bancário ou CPF é necessário.",
              },
              {
                numero: "02",
                titulo: "Buscamos a taxa média oficial",
                descricao: "Consultamos em tempo real a API do Sistema Gerenciador de Séries Temporais do Banco Central (BCB/SGS).",
              },
              {
                numero: "03",
                titulo: "Calculamos a diferença",
                descricao: "Aplicamos a fórmula de juros compostos sobre ambas as taxas e mostramos o comparativo com clareza.",
              },
              {
                numero: "04",
                titulo: "Você recebe o resultado",
                descricao: "Veja se a taxa está dentro da média, acima ou potencialmente abusiva. O relatório completo é opcional.",
              },
            ].map(({ numero, titulo, descricao }) => (
              <div key={numero} className="flex gap-4 p-5 rounded-xl border border-gray-100 bg-gray-50">
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: "#1B4F72" }}
                >
                  {numero}
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{titulo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── O que você descobre ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ backgroundColor: "#EBF5FB" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            O que você descobre
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            A análise gratuita já mostra os principais números. O relatório completo traz o detalhamento para quem quiser agir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                titulo: "Comparativo de taxas",
                descricao: "Sua taxa versus a taxa média do Banco Central para o mesmo tipo de crédito.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                titulo: "Diferença em reais",
                descricao: "Quanto você pode ter pago a mais em relação à média de mercado, calculado por juros compostos.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                titulo: "Classificação da taxa",
                descricao: "Dentro da média, acima da média ou potencialmente abusiva — com base nos dados oficiais.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                titulo: "Próximos passos gratuitos",
                descricao: "Links para o consumidor.gov.br, PROCON, Calculadora do Cidadão e ouvidoria do Banco Central.",
              },
            ].map(({ icone, titulo, descricao }) => (
              <div key={titulo} className="flex gap-4 p-5 rounded-xl bg-white border border-blue-100">
                <span
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#D6EAF8" }}
                >
                  <svg className="w-5 h-5" style={{ color: "#1B4F72" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    {icone}
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">{titulo}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Por que isso importa ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Por que isso importa
          </h2>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                O Brasil tem uma das maiores taxas de juros para crédito ao consumidor do mundo.
                O cartão de crédito rotativo pode ultrapassar 400% ao ano — enquanto países como França e Alemanha aplicam tetos legais.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                A Súmula 297 do STJ reconhece que o Código de Defesa do Consumidor se aplica aos contratos bancários.
                Cláusulas abusivas podem ser questionadas administrativamente ou judicialmente.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                O Banco Central publica mensalmente a taxa média cobrada por cada tipo de crédito.
                Essa informação é pública, mas poucos consumidores sabem como acessá-la ou interpretá-la.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                O AuditCrédito não resolve sua situação — mas entrega a informação que você precisa para ter uma conversa
                mais embasada com o banco, o PROCON ou um advogado especializado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Relatório completo (CTA intermediário) ── */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: "#1B4F72" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Quer mais do que o resumo?
          </h2>
          <p className="text-blue-200 mb-8 text-base leading-relaxed">
            O relatório completo inclui o cálculo detalhado com a fórmula de juros compostos,
            um modelo de Requerimento Administrativo pronto para enviar ao banco,
            referências legais e um guia de negociação passo a passo.
          </p>
          <a
            href="/auditoria"
            className="inline-block bg-white font-bold text-base px-8 py-4 rounded-xl transition-opacity hover:opacity-90"
            style={{ color: "#1B4F72" }}
          >
            Fazer análise gratuita agora
          </a>
          <p className="mt-4 text-blue-300 text-sm">
            O relatório completo custa R$&nbsp;19,90 — após ver a análise gratuita.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Perguntas frequentes
          </h2>
          <div className="space-y-6">
            {[
              {
                pergunta: "Isso limpa meu nome?",
                resposta:
                  "Não. Esta ferramenta compara taxas de juros com dados públicos do Banco Central. Ela não acessa cadastros de inadimplência, não remove restrições e não garante qualquer resultado junto ao banco ou aos órgãos de proteção ao crédito.",
              },
              {
                pergunta: "O relatório tem valor jurídico?",
                resposta:
                  "Não. É uma análise informativa com base em dados públicos. Não substitui parecer jurídico nem financeiro. Se você precisar de uma contestação formal, recomendamos consultar um advogado especializado em direito do consumidor.",
              },
              {
                pergunta: "De onde vêm os dados?",
                resposta:
                  "Diretamente da API pública do Sistema Gerenciador de Séries Temporais do Banco Central do Brasil (BCB/SGS). Os dados são atualizados mensalmente pelo próprio Banco Central e acessados em tempo real.",
              },
              {
                pergunta: "Preciso pagar para usar?",
                resposta:
                  "A análise básica é completamente gratuita — você vê o comparativo de taxas e a classificação sem pagar nada. O relatório completo em PDF, com o modelo de requerimento, referências legais e guia de negociação, custa R$ 19,90.",
              },
              {
                pergunta: "Meus dados ficam armazenados?",
                resposta:
                  "Os dados informados no formulário (tipo de crédito, valor, taxa, período) são usados apenas para o cálculo. Não coletamos CPF, dados bancários ou informações sensíveis. Para mais detalhes, consulte nossa política de privacidade.",
              },
            ].map(({ pergunta, resposta }) => (
              <div key={pergunta} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                <p className="font-semibold text-gray-900 mb-2">{pergunta}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pronto para descobrir?
          </h2>
          <p className="text-gray-600 mb-8">
            Leva menos de 2 minutos. Sem cadastro, sem cartão de crédito para a análise básica.
          </p>
          <a
            href="/auditoria"
            className="inline-block text-white font-bold text-base px-8 py-4 rounded-xl shadow transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Analisar minha dívida gratuitamente
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 bg-white py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span
                className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ backgroundColor: "#1B4F72" }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
              <span className="font-bold text-gray-900">AuditCrédito</span>
            </div>
            <div className="flex flex-wrap gap-5 text-sm text-gray-500">
              <a href="/auditoria" className="hover:text-gray-800">Fazer análise</a>
              <a href="/politica-de-privacidade" className="hover:text-gray-800">Privacidade</a>
              <a href="/termos-de-uso" className="hover:text-gray-800">Termos de Uso</a>
              <a
                href="https://www.consumidor.gov.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                consumidor.gov.br
              </a>
              <a
                href="https://www.bcb.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-800"
              >
                Banco Central
              </a>
              <a href="mailto:suporte@auditcredito.com.br" className="hover:text-gray-800">
                Suporte
              </a>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-3">
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Aviso legal:</strong> O AuditCrédito é uma ferramenta educacional independente.
              As análises são informativas e baseadas em dados públicos do Banco Central do Brasil.
              Não constituem parecer jurídico, financeiro ou legal. Para contestações formais ou ações judiciais,
              consulte um advogado especializado em direito do consumidor.
            </p>
            <p className="text-xs text-gray-400">
              Dados de taxas: Banco Central do Brasil — SGS (api.bcb.gov.br).
              &nbsp;|&nbsp; Garantia de 7 dias: reembolso integral mediante solicitação por e-mail.
            </p>
            <p className="text-xs text-gray-400">
              CNPJ: a definir &nbsp;·&nbsp; suporte@auditcredito.com.br
              &nbsp;·&nbsp; © {new Date().getFullYear()} AuditCrédito
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
