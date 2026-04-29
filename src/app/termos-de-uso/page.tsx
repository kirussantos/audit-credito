export const metadata = {
  title: "Termos de Uso | AuditCrédito",
  description: "Termos e condições de uso do AuditCrédito.",
};

export default function TermosDeUsoPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
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
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Termos de Uso</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">1. Sobre o serviço</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O AuditCrédito é uma ferramenta educacional e informativa que permite ao usuário
              comparar a taxa de juros de um contrato de crédito com as taxas médias divulgadas
              pelo Banco Central do Brasil (BCB). O serviço é fornecido para fins exclusivamente
              informativos e educacionais.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">2. Natureza do serviço — limitações</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm text-orange-800 font-semibold mb-2">⚠️ Leia com atenção</p>
              <ul className="text-sm text-orange-700 space-y-1.5">
                <li>• O AuditCrédito <strong>não é</strong> um serviço jurídico, financeiro ou de advocacia.</li>
                <li>• As análises <strong>não têm valor jurídico</strong> e não substituem parecer de advogado.</li>
                <li>• O serviço <strong>não garante</strong> nenhum resultado junto a bancos, órgãos reguladores ou tribunais.</li>
                <li>• O serviço <strong>não limpa o nome</strong> do usuário nem remove restrições em cadastros de inadimplência.</li>
                <li>• Estar acima da taxa média do BCB <strong>não configura automaticamente</strong> abusividade ou ilegalidade.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">3. Uso adequado</h2>
            <p className="text-sm text-gray-700 leading-relaxed">Ao usar o AuditCrédito, o usuário declara que:</p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Tem pelo menos 18 anos de idade ou autorização legal para contratar;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>As informações fornecidas são verídicas ao seu melhor conhecimento;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Usa o serviço para fins pessoais, informativos e legais;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Não tentará sobrecarregar, hackear ou manipular o sistema.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">4. Relatório completo — compra e reembolso</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O relatório completo em PDF é um produto digital cobrado ao valor de R$ 19,90.
              Nos termos do art. 49 do Código de Defesa do Consumidor (Lei 8.078/90), o usuário
              tem direito ao <strong>arrependimento da compra em até 7 (sete) dias corridos</strong>
              contados da data da compra, mediante solicitação pelo e-mail{" "}
              <a href="mailto:suporte@auditcredito.com.br" className="text-blue-600 underline">
                suporte@auditcredito.com.br
              </a>.
              O reembolso será processado integralmente, sem questionamentos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">5. Precisão das informações</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              As taxas são obtidas em tempo real da API pública do Banco Central do Brasil (SGS/BCB).
              Eventuais indisponibilidades da API do BCB ou atrasos na atualização dos dados não são
              de responsabilidade do AuditCrédito. O usuário é responsável pela exatidão dos dados
              informados no formulário.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">6. Propriedade intelectual</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O código, design, textos e o relatório gerado são propriedade do AuditCrédito.
              O relatório PDF adquirido é licenciado para uso pessoal do comprador.
              É vedada a redistribuição, revenda ou reprodução comercial sem autorização.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">7. Limitação de responsabilidade</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O AuditCrédito não se responsabiliza por decisões tomadas com base nas análises fornecidas,
              por resultados de negociações com bancos, por ações ou omissões de terceiros, ou por
              eventuais imprecisões nos dados divulgados pelo Banco Central.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">8. Identificação do fornecedor</h2>
            <p className="text-sm text-gray-700">
              CNPJ: a definir<br />
              E-mail: <a href="mailto:suporte@auditcredito.com.br" className="text-blue-600 underline">suporte@auditcredito.com.br</a><br />
              Endereço: a definir
            </p>
            <p className="text-xs text-gray-500">
              As informações de CNPJ e endereço serão preenchidas antes do lançamento comercial do serviço.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">9. Foro e legislação aplicável</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Estes termos são regidos pela legislação brasileira. Fica eleito o foro da comarca
              do domicílio do usuário para dirimir eventuais controvérsias, conforme o CDC.
            </p>
          </section>

          <div className="pt-4 border-t border-gray-100">
            <a href="/" className="text-sm text-blue-600 hover:underline">← Voltar para o início</a>
          </div>
        </div>
      </div>
    </main>
  );
}
