"use client";

import { useEffect, useState } from "react";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Formatadores ─────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number) => `${v.toFixed(2)}%`;

// ─── Configurações de status ──────────────────────────────────────────────────

const CONFIG_STATUS: Record<
  StatusAuditoria,
  { cor: string; fundo: string; borda: string; rotulo: string; emoji: string }
> = {
  DENTRO_DA_MEDIA: {
    cor:    "#1E8449",
    fundo:  "#EAFAF1",
    borda:  "#A9DFBF",
    rotulo: "Dentro da média",
    emoji:  "✓",
  },
  ACIMA_DA_MEDIA: {
    cor:    "#D35400",
    fundo:  "#FEF9E7",
    borda:  "#FAD7A0",
    rotulo: "Acima da média",
    emoji:  "⚠",
  },
  POTENCIALMENTE_ABUSIVO: {
    cor:    "#C0392B",
    fundo:  "#FDEDEC",
    borda:  "#F1948A",
    rotulo: "Significativamente acima da média",
    emoji:  "!",
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
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2E86C1] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-400">Carregando resultado...</p>
      </div>
    );
  }

  const { resultado, taxaBCB, contrato, geradoEm } = dados;
  const config       = CONFIG_STATUS[resultado.status];
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
            className="mt-0.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
            style={{ backgroundColor: config.cor, color: "#fff" }}
          >
            {config.emoji} {config.rotulo}
          </span>
          <div>
            {!acimaDaMedia ? (
              <p className="text-sm text-gray-700">
                <strong>Sua taxa está dentro da média para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()}.</strong>{" "}
                Isso é bom — mas não significa que você não possa negociar condições melhores.
                Bancos quase sempre aceitam renegociar com clientes que conhecem seus números.
              </p>
            ) : (
              <p className="text-sm text-gray-700">
                <strong>A taxa cobrada está acima da média oficial do Banco Central</strong>{" "}
                para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()} no período informado.
                Veja abaixo exatamente quanto isso representa no seu bolso.
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
            <dt className="text-gray-500">Tipo de crédito</dt>
            <dd className="font-medium text-gray-900">{ROTULO_TIPO_CREDITO[contrato.tipoCredito]}</dd>
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
              Total com taxa cobrada ({pct(resultado.taxaCobrada)} a.m.)
            </dt>
            <dd className="font-semibold text-red-600">{brl(valorCobradoTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">
              Total com taxa média BCB ({pct(resultado.taxaMediaBCB)} a.m.)
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

      {/* ── CTA PRINCIPAL — apenas se acima da média ─────────────────────────── */}
      {acimaDaMedia && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-xl border-2 p-6"
          style={{ backgroundColor: "#FDEDEC", borderColor: "#C0392B" }}
        >
          {/* Headline de impacto */}
          <div className="text-center mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#C0392B" }}>
              O que isso significa para você
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
              Você pagou{" "}
              <span style={{ color: "#C0392B" }}>{brl(resultado.diferencaAbusiva)}</span>{" "}
              a mais do que deveria.
            </h3>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Esse dinheiro saiu do seu bolso direto para o banco. Agora você tem duas escolhas.
            </p>
          </div>

          {/* Duas escolhas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 opacity-60">
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">Opção A</p>
              <p className="text-sm text-gray-500">
                Fechar esta página e seguir em frente como se nada tivesse acontecido.
              </p>
            </div>
            <div
              className="bg-white rounded-lg border-2 p-4"
              style={{ borderColor: "#1B4F72" }}
            >
              <p className="text-xs font-bold uppercase mb-1" style={{ color: "#1B4F72" }}>Opção B</p>
              <p className="text-sm text-gray-700 font-medium">
                Pegar o Relatório Completo e ter em mãos o documento para questionar o banco.
              </p>
            </div>
          </div>

          {/* O que está incluído */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-3">O Relatório Completo inclui:</p>
            <ul className="space-y-2">
              {[
                "Cálculo detalhado com fórmula de juros compostos",
                "Modelo de Requerimento Administrativo pronto para assinar e enviar",
                "Referências legais completas (CDC + Súmula 297 do STJ)",
                "Guia de negociação passo a passo",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#1E8449" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
              className="inline-block w-full sm:w-auto px-8 py-4 rounded-xl text-white font-bold text-base transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1B4F72" }}
            >
              Quero o Relatório Completo — R$&nbsp;19,90
            </a>
            <p className="mt-3 text-xs text-gray-500">
              Garantia incondicional de 7 dias. Se não servir, devolvemos tudo — sem burocracia.
            </p>
          </div>
        </div>
      )}

      {/* ── CTA para quem está dentro da média ───────────────────────────────── */}
      {!acimaDaMedia && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-xl border p-5 text-center"
          style={{ backgroundColor: "#EBF5FB", borderColor: "#AED6F1" }}
        >
          <h3 className="font-semibold text-gray-900 mb-2">
            Sua taxa está na média — mas você pode negociar melhor
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            O relatório completo inclui o cálculo detalhado e orientações para negociar
            condições ainda melhores com a instituição financeira.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
            className="inline-block px-6 py-3 rounded-lg text-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B4F72" }}
          >
            Ver Relatório Completo — R$&nbsp;19,90
          </a>
          <p className="mt-2 text-xs text-gray-400">Garantia de 7 dias</p>
        </div>
      )}

      {/* ── O que fazer agora (sem links externos) ───────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
          O que você pode fazer agora
        </h2>

        <div className="space-y-5 text-sm text-gray-700">
          <div className="flex gap-3">
            <span
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: "#1B4F72" }}
            >
              1
            </span>
            <div>
              <p className="font-semibold mb-0.5">Negocie diretamente com o banco</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Apresente os números que você acabou de ver. Solicite revisão do contrato por escrito e guarde o protocolo.
                Bancos negociam quando percebem que o cliente conhece seus direitos.
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
              <p className="font-semibold mb-0.5">Registre uma reclamação formal</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                O consumidor.gov.br e o PROCON do seu estado recebem reclamações contra instituições financeiras.
                São canais gratuitos com alto índice de resolução. Você encontra os endereços em qualquer buscador.
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
              <p className="font-semibold mb-0.5">Consulte um advogado especializado</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Para contestação judicial, um advogado de direito do consumidor pode avaliar a viabilidade
                de ação revisional ou repetição de indébito. Muitos trabalham com honorários condicionados ao resultado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Disclaimer ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 px-1">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-400 leading-relaxed">
          Análise baseada na comparação entre a taxa informada e a taxa média do Banco Central do Brasil
          (série SGS {taxaBCB.codigoSerie}, referência {taxaBCB.data}). Não constitui parecer jurídico,
          financeiro ou legal.{" "}
          <span className="text-gray-300">Gerado em {new Date(geradoEm).toLocaleString("pt-BR")}.</span>
        </p>
      </div>

    </div>
  );
}
