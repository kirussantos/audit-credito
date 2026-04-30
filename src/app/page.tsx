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
            Descobrir agora
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
            Banco Central do Brasil confirma os dados — todo mês
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            O banco está te cobrando juros acima do mercado —{" "}
            <span style={{ color: "#1B4F72" }}>e você provavelmente nem sabe disso</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Em 2 minutos você vê a verdade sobre a taxa do seu empréstimo ou financiamento.
            Comparamos com os dados oficiais do Banco Central. Sem enrolação, sem promessa vazia.
          </p>

          <a
            href="/auditoria"
            className="inline-block text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Quero descobrir agora — é grátis
          </a>

          <p className="mt-4 text-sm text-gray-400">
            Sem cadastro &nbsp;·&nbsp; Sem CPF &nbsp;·&nbsp; Resultado em segundos
          </p>
        </div>
      </section>

      {/* ── Números que pesam ── */}
      <section className="py-10 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { valor: "400%", descricao: "ao ano — o rotativo do cartão no Brasil, o maior do planeta" },
            { valor: "R$ 19,90", descricao: "pelo relatório completo com contestação pronta — menos que 1 tarifa bancária" },
            { valor: "2 min", descricao: "para saber se você está pagando a mais — ou não" },
          ].map(({ valor, descricao }) => (
            <div key={valor} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-extrabold" style={{ color: "#1B4F72" }}>{valor}</span>
              <span className="text-sm text-gray-500 max-w-[220px] leading-snug">{descricao}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Como Funciona ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Como funciona
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Direto ao ponto. Sem cadastro, sem burocracia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                numero: "01",
                titulo: "Informe os dados do contrato",
                descricao: "Tipo de crédito, valor, taxa cobrada e prazo. Nenhum CPF, nenhuma senha, nenhum dado bancário. Só o que importa para o cálculo.",
              },
              {
                numero: "02",
                titulo: "Buscamos a taxa oficial do BCB",
                descricao: "Acessamos em tempo real a base pública do Banco Central. Não inventamos os dados — eles vêm de lá, atualizados todo mês.",
              },
              {
                numero: "03",
                titulo: "Você vê a verdade",
                descricao: "Sua taxa cobrada lado a lado com a média do mercado. A diferença em reais, no seu bolso. Sem rodeios.",
              },
              {
                numero: "04",
                titulo: "Você decide o que fazer",
                descricao: "Se a taxa for abusiva, o relatório completo traz o cálculo detalhado, a base legal e o modelo de requerimento pronto para assinar.",
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
            O que aparece na sua tela
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-xl mx-auto">
            A análise gratuita já mostra o essencial. O relatório completo entrega tudo que você precisa para agir.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                titulo: "Comparativo de taxas",
                descricao: "Sua taxa vs. a média oficial do Banco Central. Os dois números na mesma tela — sem interpretação, sem eufemismo.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                titulo: "Diferença em reais",
                descricao: "Não em percentual abstrato. Em reais — quanto saiu do seu bolso a mais, calculado com juros compostos.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                titulo: "Veredicto da taxa",
                descricao: "Dentro da média, acima ou potencialmente abusiva. Com base nos dados oficiais — não na nossa opinião.",
              },
              {
                icone: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                titulo: "Modelo de contestação pronto",
                descricao: "O relatório completo inclui um Requerimento Administrativo já preenchido. Você só assina e envia ao banco.",
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            O banco sabe o que faz — a pergunta é: você sabe também?
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Algumas verdades que ninguém vai te contar no gerente.
          </p>
          <div className="space-y-5">
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#C0392B" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700">
                <strong>O Brasil tem os juros ao consumidor mais altos do mundo.</strong>{" "}
                O cartão rotativo passou de 400% ao ano em 2024. Isso não é alarmismo — é o Banco Central
                confirmando nos próprios relatórios. E a maioria das pessoas continua pagando sem questionar.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#C0392B" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700">
                <strong>O CDC e a Súmula 297 do STJ garantem que cláusulas abusivas podem ser contestadas.</strong>{" "}
                O banco sabe disso desde sempre. A questão é se você também sabe — e se tem os números certos
                para entrar nessa conversa em pé de igualdade.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                <strong>O Banco Central publica todo mês a taxa média por tipo de crédito.</strong>{" "}
                Essa informação é pública, gratuita e é sua por direito. A maioria das pessoas nunca soube
                como acessá-la ou o que fazer com ela. O AuditCrédito faz isso por você em segundos.
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-gray-700">
                <strong>Saber é o primeiro passo para agir.</strong>{" "}
                Não prometemos milagres. Entregamos o que você tem direito: a informação organizada, os
                números certos e o documento pronto para quem decidir questionar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA intermediário ── */}
      <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: "#1B4F72" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Chega de aceitar qualquer taxa em silêncio
          </h2>
          <p className="text-blue-200 mb-8 text-base leading-relaxed">
            O relatório completo traz o cálculo com juros compostos, o modelo de Requerimento
            Administrativo pronto para enviar ao banco, as referências legais corretas e o guia de
            negociação passo a passo. Tudo por R&nbsp;19,90 — após a análise gratuita.
          </p>
          <a
            href="/auditoria"
            className="inline-block bg-white font-bold text-base px-8 py-4 rounded-xl transition-opacity hover:opacity-90"
            style={{ color: "#1B4F72" }}
          >
            Fazer análise gratuita agora
          </a>
          <p className="mt-4 text-blue-300 text-sm">
            A análise é sempre grátis. O relatório completo é opcional — R$&nbsp;19,90.
          </p>
        </div>
      </section>

      {/* ── Depoimentos / prova social ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Pessoas que já descobriram
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                texto: "Eu achava que estava pagando normal. O relatório mostrou que eu pagei R$ 2.400 a mais no meu financiamento. Entrei em contato com o banco no mesmo dia.",
                nome: "Carlos M.",
                detalhe: "Crédito pessoal — São Paulo",
              },
              {
                texto: "Fiz a análise grátis e levei um susto. Taxa quase 3x acima da média. O modelo de requerimento me poupou horas de pesquisa. Recomendo para qualquer pessoa com dívida.",
                nome: "Fernanda R.",
                detalhe: "Cartão rotativo — Belo Horizonte",
              },
              {
                texto: "Minha taxa estava dentro da média, mas aprendi que posso negociar. Isso eu não sabia. Já fui conversar com o gerente e consegui reduzir os juros.",
                nome: "Paulo S.",
                detalhe: "Consignado — Porto Alegre",
              },
            ].map(({ texto, nome, detalhe }) => (
              <div key={nome} className="bg-gray-50 rounded-xl border border-gray-100 p-5 flex flex-col gap-4">
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  &ldquo;{texto}&rdquo;
                </p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{nome}</p>
                  <p className="text-xs text-gray-400">{detalhe}</p>
                </div>
              </div>
            ))}
          </div>
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
                  "Não — e é importante deixar isso claro. AuditCrédito compara a taxa do seu contrato com os dados do Banco Central. Se a taxa estiver abusiva, você vai ter o documento certo para questionar junto ao banco ou aos órgãos competentes. O processo de contestação é seu para conduzir — e o relatório é o seu ponto de partida.",
              },
              {
                pergunta: "O relatório tem valor jurídico?",
                resposta:
                  "Não substitui um advogado. Mas entrega os números organizados, a base legal relevante (CDC, Súmula 297 do STJ) e o modelo de Requerimento Administrativo pronto para assinar e enviar. O que você faz com isso é sua decisão.",
              },
              {
                pergunta: "De onde vêm os dados?",
                resposta:
                  "Diretamente da API pública do Banco Central do Brasil (BCB/SGS). Nós não criamos os números — buscamos a taxa média oficial, atualizada mensalmente pelo próprio BCB, em tempo real.",
              },
              {
                pergunta: "Preciso pagar para usar?",
                resposta:
                  "A análise básica é sempre grátis. Você vê o comparativo de taxas, a diferença em reais e o veredicto. O relatório completo — com cálculo detalhado, base legal e modelo de requerimento — custa R$ 19,90.",
              },
              {
                pergunta: "Meus dados ficam armazenados?",
                resposta:
                  "Apenas o necessário para entregar o relatório. Nenhum CPF, nenhuma senha, nenhum dado bancário. Os dados da análise ficam armazenados por 90 dias e depois são excluídos. Todos os detalhes estão na nossa Política de Privacidade.",
              },
              {
                pergunta: "E se eu não ficar satisfeito?",
                resposta:
                  "Garantia de 7 dias, sem burocracia e sem perguntas. Mande um e-mail para suporte@auditcredito.com.br e devolvemos o valor integral.",
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
      <section className="py-20 px-4 sm:px-6" style={{ backgroundColor: "#F4F6F9" }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Quanto tempo você ainda vai ficar sem saber?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Menos de 2 minutos. Sem cadastro. Sem cartão de crédito para a análise básica.
            Só a verdade sobre a taxa que você está pagando.
          </p>
          <a
            href="/auditoria"
            className="inline-block text-white font-bold text-lg px-10 py-5 rounded-xl shadow-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Quero saber agora — é grátis
          </a>
          <p className="mt-5 text-sm text-gray-400">
            Garantia de 7 dias &nbsp;·&nbsp; Sem burocracia &nbsp;·&nbsp; Dados do Banco Central
          </p>
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
              <a href="mailto:suporte@auditcredito.com.br" className="hover:text-gray-800">Suporte</a>
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
              suporte@auditcredito.com.br
              &nbsp;·&nbsp; © {new Date().getFullYear()} AuditCrédito
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
