"use client";

import { useEffect, useState } from "react";

interface Props {
  analiseId: string;
}

export default function BotaoCheckout({ analiseId }: Props) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_CHECKOUT_URL;
    if (!base) return;
    const u = new URL(base);
    u.searchParams.set("ref", analiseId);
    u.searchParams.set("utm_content", analiseId);
    setUrl(u.toString());
  }, [analiseId]);

  if (!url) return null;

  return (
    <div className="w-full">
      {/* Botão principal */}
      <a
        href={url}
        className="block w-full text-center rounded-xl text-white font-bold text-base py-4 px-6 transition-opacity hover:opacity-90 active:opacity-80 shadow-md"
        style={{ backgroundColor: "#1B4F72" }}
      >
        Baixar Relatório Completo&nbsp;—&nbsp;R$&nbsp;19,90
      </a>

      {/* O que está incluído */}
      <div className="mt-3 space-y-1.5">
        {[
          "Relatório comparativo com cálculo detalhado",
          "Modelo de Requerimento Administrativo editável",
          "Guia de Negociação passo a passo",
          "Referências legais (CDC e Súmula 297 STJ)",
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 text-sm text-gray-700">
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: "#1E8449" }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span>{item}</span>
          </div>
        ))}
      </div>

      {/* Rodapé do botão */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Pagamento seguro via Pix ou cartão
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          7 dias de garantia incondicional
        </div>
      </div>

      {/* Contexto de preço honesto */}
      <p className="mt-3 text-center text-xs text-gray-400">
        Menos que uma hora de consulta com advogado.
        Reembolso integral solicitado por e-mail em até 7 dias.
      </p>
    </div>
  );
}
