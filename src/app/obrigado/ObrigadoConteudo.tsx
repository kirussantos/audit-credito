"use client";

import { useSearchParams } from "next/navigation";
import { LINKS_ORIENTACAO } from "@/config/constants";

function LinkExterno({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-[#2E86C1] hover:underline py-1"
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {children}
    </a>
  );
}

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
          Relatório enviado!
        </h1>

        {email ? (
          <p className="text-gray-600">
            Seu relatório foi enviado para{" "}
            <strong className="text-gray-900">{email}</strong>.
          </p>
        ) : (
          <p className="text-gray-600">
            Seu relatório foi enviado para o e-mail cadastrado.
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
          <p className="text-sm font-semibold text-gray-800 mb-0.5">Não encontrou o email?</p>
          <p className="text-sm text-gray-600">
            Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
            O remetente é <span className="font-mono text-xs">noreply@auditcredito.com.br</span>.
          </p>
        </div>
      </div>

      {/* Recursos gratuitos */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
          Recursos gratuitos para seus próximos passos
        </h2>
        <div className="space-y-1">
          <LinkExterno href={LINKS_ORIENTACAO.consumidor_gov}>
            consumidor.gov.br — Registre sua reclamação online
          </LinkExterno>
          <LinkExterno href={LINKS_ORIENTACAO.calculadora_bcb}>
            Calculadora do Cidadão — Banco Central do Brasil
          </LinkExterno>
          <LinkExterno href={LINKS_ORIENTACAO.procon}>
            Encontre o PROCON do seu estado
          </LinkExterno>
          <LinkExterno href={LINKS_ORIENTACAO.bcb_ouvidoria}>
            Ouvidoria do Banco Central
          </LinkExterno>
        </div>
      </div>

      {/* Lembrete de garantia */}
      <p className="text-center text-xs text-gray-400 leading-relaxed">
        Garantia de 7 dias: se não ficar satisfeito, entre em contato para reembolso integral.
        <br />
        Sem burocracia, sem perguntas.
      </p>

      {/* Link para nova análise */}
      <div className="text-center pt-2">
        <a
          href="/auditoria"
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Analisar outro contrato
        </a>
      </div>
    </div>
  );
}
