"use client";

import { useSearchParams } from "next/navigation";

export default function ObrigadoConteudo() {
  const params = useSearchParams();
  const email  = params.get("email") ?? "";

  return (
    <div className="space-y-6">
      {/* Confirmação */}
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "#EAFAF1" }}
        >
          <svg className="w-8 h-8" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Relatório enviado.
        </h1>

        {email ? (
          <p className="text-gray-600 text-base">
            Em instantes você vai receber em{" "}
            <strong className="text-gray-900">{email}</strong>{" "}
            o documento mais completo que já teve nas mãos para lidar com o banco.
          </p>
        ) : (
          <p className="text-gray-600 text-base">
            Em instantes você vai receber no seu e-mail o documento mais completo
            que já teve nas mãos para lidar com o banco.
          </p>
        )}
      </div>

      {/* Aviso de spam */}
      <div
        className="flex items-start gap-3 rounded-xl border px-4 py-3"
        style={{ backgroundColor: "#FEF9E7", borderColor: "#FAD7A0" }}
      >
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#D35400" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-gray-800 mb-0.5">Não encontrou o e-mail?</p>
          <p className="text-sm text-gray-600">
            Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
            O remetente é <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">noreply@auditcredito.com.br</span>.
          </p>
        </div>
      </div>

      {/* Próximos passos — sem links externos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Seus próximos passos
        </h2>

        <div className="space-y-5">
          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#1B4F72" }}
            >
              1
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Leia o relatório com calma</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Revise o cálculo e entenda os números antes de agir. Tudo está explicado
                de forma clara — sem jargão jurídico.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#1B4F72" }}
            >
              2
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Use o modelo de requerimento</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Preencha com seus dados pessoais e envie ao banco por escrito — presencialmente
                ou pela ouvidoria digital. Guarde o número de protocolo.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#1B4F72" }}
            >
              3
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Se o banco não responder em 15 dias</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Registre sua reclamação no consumidor.gov.br e acione o PROCON do seu estado.
                São canais gratuitos, com alto índice de resolução.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#1B4F72" }}
            >
              4
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-0.5">Para ação judicial</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Um advogado especializado em direito do consumidor pode avaliar a viabilidade
                de revisional ou repetição de indébito. Muitos trabalham com êxito — você paga
                só se ganhar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Garantia e suporte */}
      <div
        className="rounded-xl border p-4 text-center"
        style={{ backgroundColor: "#F4F6F9", borderColor: "#E5E7EB" }}
      >
        <p className="text-sm font-semibold text-gray-800 mb-1">
          Garantia de 7 dias, sem burocracia
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Se o relatório não atender suas expectativas por qualquer motivo, basta enviar um e-mail
          para{" "}
          <a
            href="mailto:suporte@auditcredito.com.br"
            className="font-semibold"
            style={{ color: "#1B4F72" }}
          >
            suporte@auditcredito.com.br
          </a>{" "}
          e devolvemos tudo. Sem perguntas.
        </p>
      </div>

      {/* Link para nova análise */}
      <div className="text-center pt-2">
        <a
          href="/auditoria"
          className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
          Analisar outro contrato
        </a>
      </div>
    </div>
  );
}
