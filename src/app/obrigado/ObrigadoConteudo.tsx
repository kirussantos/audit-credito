"use client";

import { useSearchParams } from "next/navigation";

export default function ObrigadoConteudo() {
  const params = useSearchParams();
  const email  = params.get("email") ?? "";

  return (
    <div className="space-y-5">

      {/* Confirmação de envio */}
      <div
        className="text-center py-6 px-4 rounded-2xl"
        style={{ background: "var(--success-bg)", border: "1px solid var(--success-bdr)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--cta)" }}
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)", letterSpacing: "-0.01em" }}>
          Relatório enviado.
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--text-2)" }}>
          {email ? (
            <>
              Em instantes você vai receber em{" "}
              <strong style={{ color: "var(--text)" }}>{email}</strong>{" "}
              o documento mais completo que já teve nas mãos para lidar com o banco.
            </>
          ) : (
            <>
              Em instantes você vai receber no seu e-mail o documento mais completo
              que já teve nas mãos para lidar com o banco.
            </>
          )}
        </p>
      </div>

      {/* Alerta de spam */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3.5"
        style={{ background: "var(--warning-bg)", border: "1px solid var(--warning-bdr)" }}
      >
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--warning)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
            Não encontrou o e-mail?
          </p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
            O remetente é{" "}
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ background: "rgba(0,0,0,0.06)", color: "var(--text-2)" }}
            >
              noreply@auditcredito.com.br
            </span>
          </p>
        </div>
      </div>

      {/* Próximos passos */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}
      >
        <h2
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-3)" }}
        >
          Seus próximos passos
        </h2>

        <div className="space-y-5">
          {[
            {
              n: "1",
              title: "Leia o relatório com calma",
              body: "Revise o cálculo e entenda os números antes de agir. Tudo está explicado de forma clara, sem jargão jurídico.",
            },
            {
              n: "2",
              title: "Use o modelo de requerimento",
              body: "Preencha com seus dados e envie ao banco por escrito — pela agência ou pela ouvidoria digital. Guarde o número de protocolo.",
            },
            {
              n: "3",
              title: "Se o banco não responder em 15 dias",
              body: "Registre sua reclamação no consumidor.gov.br e acione o PROCON do seu estado. Canais gratuitos com alto índice de resolução.",
            },
            {
              n: "4",
              title: "Para ação judicial",
              body: "Um advogado de direito do consumidor pode avaliar revisional ou repetição de indébito. Muitos trabalham com êxito — você paga só se ganhar.",
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="flex gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ background: "var(--navy-mid)" }}
              >
                {n}
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>
                  {title}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Garantia */}
      <div
        className="rounded-xl px-5 py-4 text-center"
        style={{ background: "var(--surface-2)", border: "1px solid var(--bdr)" }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
          Garantia de 7 dias, sem burocracia
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
          Se o relatório não atender suas expectativas por qualquer motivo, basta enviar um e-mail
          para{" "}
          <a
            href="mailto:suporte@auditcredito.com.br"
            className="font-semibold underline"
            style={{ color: "var(--blue)" }}
          >
            suporte@auditcredito.com.br
          </a>
          {" "}e devolvemos tudo. Sem perguntas.
        </p>
      </div>

      {/* Nova análise */}
      <div className="text-center pt-2">
        <a
          href="/auditoria"
          className="text-sm underline"
          style={{ color: "var(--text-4)" }}
        >
          Analisar outro contrato
        </a>
      </div>
    </div>
  );
}
