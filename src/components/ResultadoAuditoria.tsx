"use client";

import { useEffect, useState } from "react";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import { ROTULO_TIPO_CREDITO, LINKS_ORIENTACAO } from "@/config/constants";

// ─── Formatadores ─────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number) => `${v.toFixed(2)}%`;

// ─── Configurações de status ──────────────────────────────────────────────────

const CONFIG_STATUS: Record<
  StatusAuditoria,
  { cor: string; fundo: string; borda: string; rotulo: string }
> = {
  DENTRO_DA_MEDIA: {
    cor:    "#1E8449",
    fundo:  "#EAFAF1",
    borda:  "#A9DFBF",
    rotulo: "Dentro da média",
  },
  ACIMA_DA_MEDIA: {
    cor:    "#D35400",
    fundo:  "#FEF9E7",
    borda:  "#FAD7A0",
    rotulo: "Acima da média",
  },
  POTENCIALMENTE_ABUSIVO: {
    cor:    "#C0392B",
    fundo:  "#FDEDEC",
    borda:  "#F1948A",
    rotulo: "Significativamente acima da média",
  },
};

// ─── Gráfico de barras CSS ────────────────────────────────────────────────────

function BarraComparativa({
  taxaCobrada,
  taxaBCB,
}: {
  taxaCobrada: number;
  taxaBCB: number;
}) {
  const max = Math.max(taxaCobrada, taxaBCB, 0.01);
  const pctCobrada = Math.round((taxaCobrada / max) * 100);
  const pctBCB     = Math.round((taxaBCB     / max) * 100);

  return (
    <div className="space-y-4">
      {/* Barra taxa cobrada */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1.5">
          <span>Taxa cobrada pelo banco</span>
          <span className="font-semibold text-gray-900">{pct(taxaCobrada)} a.m.</span>
        </div>
        <div className="h-9 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="h-full rounded-lg flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all duration-1000"
            style={{ width: `${pctCobrada}%`, backgroundColor: "#C0392B", minWidth: "3rem" }}
          >
            {pct(taxaCobrada)}
          </div>
        </div>
      </div>

      {/* Barra taxa BCB */}
      <div>
        <div className="flex justify-between text-sm text-gray-600 mb-1.5">
          <span>Taxa média — Banco Central</span>
          <span className="font-semibold text-gray-900">{pct(taxaBCB)} a.m.</span>
        </div>
        <div className="h-9 bg-gray-100 rounded-lg overflow-hidden">
          <div
            className="h-full rounded-lg flex items-center justify-end pr-3 text-white text-xs font-semibold transition-all duration-1000"
            style={{ width: `${pctBCB}%`, backgroundColor: "#1E8449", minWidth: "3rem" }}
          >
            {pct(taxaBCB)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Link externo ─────────────────────────────────────────────────────────────

function LinkExterno({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-sm text-[#2E86C1] hover:underline"
    >
      {children}
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ResultadoAuditoria() {
  const [dados, setDados] = useState<RespostaAnalise | null>(null);
  const [erro, setErro]   = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("auditoria_resultado");
    if (!raw) {
      setErro("Nenhuma análise encontrada. Preencha o formulário novamente.");
      return;
    }
    try {
      setDados(JSON.parse(raw) as RespostaAnalise);
    } catch {
      setErro("Erro ao carregar o resultado. Preencha o formulário novamente.");
    }
  }, []);

  // ── Estados de carregamento / erro ─────────────────────────────────────────

  if (erro) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">{erro}</p>
        <a
          href="/auditoria"
          className="inline-block px-6 py-2.5 rounded-lg text-white text-sm font-medium"
          style={{ backgroundColor: "#1B4F72" }}
        >
          Fazer nova análise
        </a>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="text-center py-16">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2E86C1] rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const { resultado, taxaBCB, contrato, instituicao, geradoEm } = dados;
  const config    = CONFIG_STATUS[resultado.status];
  const acimaDaMedia = resultado.status !== "DENTRO_DA_MEDIA";
  const valorCobradoTotal = resultado.valorCorrigido + resultado.diferencaAbusiva;

  return (
    <div className="space-y-6">

      {/* ── Badge de status ─────────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-5"
        style={{ backgroundColor: config.fundo, borderColor: config.borda }}
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: config.cor, color: "#fff" }}
          >
            {config.rotulo}
          </span>
          <div>
            {!acimaDaMedia ? (
              <p className="text-sm text-gray-700">
                <strong>Sua taxa está dentro da média praticada pelo mercado</strong>{" "}
                para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()} no período informado.
                Mesmo assim, você pode tentar negociar melhores condições com a instituição.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                <strong>Identificamos que a taxa cobrada está acima da média divulgada pelo Banco Central</strong>{" "}
                para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()} no período informado.
                Veja abaixo o detalhamento e as orientações gratuitas disponíveis.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Gráfico comparativo ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Comparativo de taxas — {ROTULO_TIPO_CREDITO[contrato.tipoCredito]}
        </h2>
        <BarraComparativa
          taxaCobrada={resultado.taxaCobrada}
          taxaBCB={resultado.taxaMediaBCB}
        />
        <p className="mt-3 text-xs text-gray-400">
          Referência BCB: série SGS {taxaBCB.codigoSerie} · data base {taxaBCB.data}
        </p>
      </div>

      {/* ── Resumo financeiro ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Resumo financeiro
        </h2>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Banco / Instituição</dt>
            <dd className="font-medium text-gray-900">{instituicao}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Valor financiado (principal)</dt>
            <dd className="font-medium text-gray-900">{brl(resultado.valorOriginal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Período analisado</dt>
            <dd className="font-medium text-gray-900">{resultado.periodoMeses} meses</dd>
          </div>

          <div className="border-t border-gray-100 pt-3 flex justify-between">
            <dt className="text-gray-500">
              Montante com taxa cobrada ({pct(resultado.taxaCobrada)} a.m.)
            </dt>
            <dd className="font-semibold text-red-600">{brl(valorCobradoTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">
              Montante com taxa média BCB ({pct(resultado.taxaMediaBCB)} a.m.)
            </dt>
            <dd className="font-semibold" style={{ color: "#1E8449" }}>
              {brl(resultado.valorCorrigido)}
            </dd>
          </div>

          {acimaDaMedia && (
            <div
              className="flex justify-between rounded-lg p-3 border"
              style={{ backgroundColor: "#FDEDEC", borderColor: "#F1948A" }}
            >
              <dt className="font-semibold text-gray-800">Diferença identificada</dt>
              <dd className="font-bold text-red-700 text-base">{brl(resultado.diferencaAbusiva)}</dd>
            </div>
          )}

          <div className="flex justify-between border-t border-gray-100 pt-3">
            <dt className="text-gray-500">Excesso percentual sobre a taxa BCB</dt>
            <dd
              className="font-semibold"
              style={{ color: acimaDaMedia ? "#C0392B" : "#1E8449" }}
            >
              {resultado.percentualExcesso > 0 ? "+" : ""}
              {pct(resultado.percentualExcesso)}
            </dd>
          </div>
        </dl>
      </div>

      {/* ── CTA (apenas se acima da média) ───────────────────────────────────── */}
      {acimaDaMedia && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-xl border p-5 text-center"
          style={{ backgroundColor: "#EBF5FB", borderColor: "#AED6F1" }}
        >
          <h3 className="font-semibold text-gray-900 mb-1">
            Relatório completo com orientações
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            O relatório detalhado inclui o cálculo completo, referências legais e
            orientações para contestação junto à instituição financeira.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Baixar Relatório Completo com Orientações
          </a>
        </div>
      )}

      {/* ── Próximos passos gratuitos ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          Próximos passos gratuitos
        </h2>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex gap-3">
            <span className="text-lg">1.</span>
            <div>
              <p className="font-medium mb-0.5">Negocie diretamente com o banco</p>
              <p className="text-gray-500 text-xs">
                Apresente a comparação de taxas e solicite revisão do contrato. Bancos
                frequentemente aceitam renegociar para evitar inadimplência.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-lg">2.</span>
            <div>
              <p className="font-medium mb-1">Registre uma reclamação no consumidor.gov.br</p>
              <LinkExterno href={LINKS_ORIENTACAO.consumidor_gov}>
                consumidor.gov.br — Reclamações online
              </LinkExterno>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-lg">3.</span>
            <div>
              <p className="font-medium mb-1">Acione o PROCON do seu estado</p>
              <LinkExterno href={LINKS_ORIENTACAO.procon}>
                Encontrar o PROCON mais próximo
              </LinkExterno>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-lg">4.</span>
            <div>
              <p className="font-medium mb-1">Verifique os cálculos com a Calculadora do Cidadão</p>
              <LinkExterno href={LINKS_ORIENTACAO.calculadora_bcb}>
                Calculadora do Cidadão — Banco Central do Brasil
              </LinkExterno>
            </div>
          </div>

          <div className="flex gap-3">
            <span className="text-lg">5.</span>
            <div>
              <p className="font-medium mb-1">Ouvidoria do Banco Central</p>
              <p className="text-gray-500 text-xs mb-1">
                Para reclamações contra instituições financeiras não resolvidas pelo banco.
              </p>
              <LinkExterno href={LINKS_ORIENTACAO.bcb_ouvidoria}>
                Ouvidoria BCB — Canal de atendimento
              </LinkExterno>
            </div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 px-1">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500 leading-relaxed">
          Esta análise é baseada na comparação entre a taxa informada por você e a taxa
          média divulgada pelo Banco Central do Brasil (série SGS {taxaBCB.codigoSerie},
          referência {taxaBCB.data}). Não constitui parecer jurídico, financeiro ou legal.
          Recomendamos consultar um advogado especializado ou o Procon para ações formais
          de contestação.{" "}
          <span className="text-gray-400">Análise gerada em {new Date(geradoEm).toLocaleString("pt-BR")}.</span>
        </p>
      </div>

    </div>
  );
}
