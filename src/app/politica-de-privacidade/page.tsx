export const metadata = {
  title: "Política de Privacidade | AuditCrédito",
  description: "Como coletamos, usamos e protegemos seus dados no AuditCrédito.",
};

export default function PoliticaPrivacidadePage() {
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Política de Privacidade</h1>
            <p className="text-sm text-gray-500">Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">1. Quem somos</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O AuditCrédito é uma ferramenta educacional independente para comparação de taxas de juros
              com dados públicos do Banco Central do Brasil. Este documento descreve como tratamos os dados
              pessoais coletados ao usar nosso serviço, em conformidade com a Lei Geral de Proteção de Dados
              (LGPD — Lei 13.709/2018).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">2. Dados coletados</h2>
            <p className="text-sm text-gray-700 leading-relaxed">Coletamos apenas os dados necessários para o funcionamento do serviço:</p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Nome completo</strong> — para personalização do relatório.</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Endereço de e-mail</strong> — para entrega do relatório em PDF.</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Dados da operação de crédito</strong> — tipo, valor, taxa e período — usados exclusivamente para o cálculo comparativo.</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Endereço IP</strong> — coletado automaticamente para controle de uso e segurança.</span></li>
            </ul>
            <p className="text-sm font-semibold text-gray-800 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              ⚠️ Não coletamos CPF, RG, número de conta bancária, senha, dados de cartão de crédito ou qualquer outro dado sensível.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">3. Base legal e finalidade</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              O tratamento de dados é baseado no <strong>consentimento explícito do titular</strong> (LGPD, art. 7º, I),
              obtido por meio do aceite ao preencher o formulário de análise. Os dados são usados exclusivamente para:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Realizar o cálculo comparativo de taxas;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Gerar e entregar o relatório em PDF;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Controle de segurança e prevenção de abuso do serviço.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">4. Retenção de dados</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Os dados são retidos pelo prazo de <strong>90 (noventa) dias</strong> contados da data da análise,
              após o qual são excluídos automaticamente dos nossos sistemas. Dados de IP são retidos por
              <strong> 30 (trinta) dias</strong> para fins de segurança.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">5. Compartilhamento de dados</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins comerciais.
              Os dados podem ser compartilhados com:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Resend</strong> (resend.com) — serviço de entrega de e-mail, somente para envio do relatório;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span><strong>Firebase/Google Firestore</strong> — armazenamento temporário dos dados da análise;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Autoridades competentes, mediante requisição legal.</span></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">6. Direitos do titular</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Nos termos da LGPD, você tem direito a:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 pl-4">
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Confirmar a existência de tratamento de seus dados;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Acessar, corrigir ou solicitar a exclusão dos seus dados;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Revogar o consentimento a qualquer momento;</span></li>
              <li className="flex gap-2"><span className="text-gray-400">•</span><span>Solicitar portabilidade dos dados.</span></li>
            </ul>
            <p className="text-sm text-gray-700">
              Para exercer esses direitos, entre em contato pelo e-mail:{" "}
              <a href="mailto:privacidade@auditcredito.com.br" className="text-blue-600 underline">
                privacidade@auditcredito.com.br
              </a>
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">7. Cookies</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Utilizamos apenas cookies estritamente necessários para o funcionamento do serviço
              (sessão de navegação). Não utilizamos cookies de rastreamento ou publicidade de terceiros.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">8. Segurança</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo:
              transmissão por HTTPS, validação e sanitização de inputs, controle de taxa de requisições
              e acesso restrito ao banco de dados.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-gray-900">9. Contato</h2>
            <p className="text-sm text-gray-700">
              Dúvidas sobre esta política podem ser enviadas para:{" "}
              <a href="mailto:privacidade@auditcredito.com.br" className="text-blue-600 underline">
                privacidade@auditcredito.com.br
              </a>
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
