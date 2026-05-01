"use client";

import { useEffect, useState } from "react";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

/* ── Formatadores ─────────────────────────────────────────────────────────── */
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (v: number, casas = 2) => `${v.toFixed(casas).replace(".", ",")}%`;

/* ── Conversor de taxa ────────────────────────────────────────────────────── */
function taxaAnualEquiv(mensal: number): number {
  return (Math.pow(1 + mensal / 100, 12) - 1) * 100;
}

/* ── Status config ────────────────────────────────────────────────────────── */
type Cfg = { cor: string; bg: string; bdr: string; texto: string; rotulo: string };

const STATUS_CFG: Record<StatusAuditoria, Cfg> = {
  DENTRO_DA_MEDIA: {
    cor: "#16A34A", bg: "#F0FDF4", bdr: "#BBF7D0",
    texto: "Sua taxa está dentro da média",
    rotulo: "Dentro da média",
  },
  ACIMA_DA_MEDIA: {
    cor: "#D97706", bg: "#FFFBEB", bdr: "#FDE68A",
    texto: "Taxa acima da média do Banco Central",
    rotulo: "Acima da média",
  },
  POTENCIALMENTE_ABUSIVO: {
    cor: "#DC2626", bg: "#FEF2F2", bdr: "#FECACA",
    texto: "Taxa significativamente acima da média",
    rotulo: "Potencialmente abusiva",
  },
};

/* ── Barra comparativa (com taxa mensal E anual) ─────────────────────────── */
function BarraComparativa({ taxaCobrada, taxaBCB }: { taxaCobrada: number; taxaBCB: number }) {
  const max = Math.max(taxaCobrada, taxaBCB, 0.01);
  const wCobrada = Math.max(Math.round((taxaCobrada / max) * 100), 6);
  const wBCB     = Math.max(Math.round((taxaBCB     / max) * 100), 6);
  const anualCobrada = taxaAnualEquiv(taxaCobrada);
  const anualBCB     = taxaAnualEquiv(taxaBCB);

  return (
    <div className="space-y-5">
      {/* Taxa cobrada */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--text-3)" }}>Taxa cobrada pelo banco</span>
          <div className="text-right">
            <span className="font-bold" style={{ color: "#DC2626" }}>{pct(taxaCobrada)} a.m.</span>
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: "#FEF2F2", color: "#DC2626" }}>
              {pct(anualCobrada, 1)} a.a.
            </span>
          </div>
        </div>
        <div className="h-10 rounded-xl overflow-hidden" style={{ background: "var(--surface-2)" }}>
          <div
            className="h-full rounded-xl flex items-center justify-end pr-3 text-white text-xs font-bold anim-bar"
            style={{ width: `${wCobrada}%`, background: "linear-gradient(90deg, #DC2626, #EF4444)", minWidth: "3rem" }}
          >
            {pct(taxaCobrada)}
          </div>
        </div>
      </div>

      {/* Média BCB */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "var(--text-3)" }}>Média do Banco Central (referência)</span>
          <div className="text-right">
            <span className="font-bold" style={{ color: "#16A34A" }}>{pct(taxaBCB)} a.m.</span>
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded font-medium"
              style={{ background: "#F0FDF4", color: "#16A34A" }}>
              {pct(anualBCB, 1)} a.a.
            </span>
          </div>
        </div>
        <div className="h-10 rounded-xl overflow-hidden" style={{ background: "var(--surface-2)" }}>
          <div
            className="h-full rounded-xl flex items-center justify-end pr-3 text-white text-xs font-bold anim-bar"
            style={{ width: `${wBCB}%`, background: "linear-gradient(90deg, #16A34A, #22C55E)", minWidth: "3rem", animationDelay: "0.15s" }}
          >
            {pct(taxaBCB)}
          </div>
        </div>
      </div>

      {/* Rótulo "a.m. = ao mês, a.a. = ao ano" */}
      <p className="text-xs text-right" style={{ color: "var(--text-4)" }}>
        a.m. = ao mês &nbsp;·&nbsp; a.a. = ao ano (equivalente, juros compostos)
      </p>
    </div>
  );
}

/* ── Linha do resumo financeiro ──────────────────────────────────────────── */
function SummaryRow({ label, value, valueColor, bold = false, sub }: {
  label: string; value: string; valueColor?: string; bold?: boolean; sub?: string;
}) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b last:border-0" style={{ borderColor: "var(--bdr)" }}>
      <div>
        <span className="text-sm" style={{ color: "var(--text-3)" }}>{label}</span>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>{sub}</p>}
      </div>
      <span
        className={`text-sm ml-4 text-right flex-shrink-0 ${bold ? "font-bold text-base" : "font-semibold"}`}
        style={{ color: valueColor ?? "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── Card de prazo de prescrição ──────────────────────────────────────────── */
function PrescricaoCard({ dataContrato }: { dataContrato: string }) {
  const dt = new Date(dataContrato + "T00:00:00");
  const prazo5  = new Date(dt.getFullYear() + 5,  dt.getMonth(), dt.getDate());
  const prazo10 = new Date(dt.getFullYear() + 10, dt.getMonth(), dt.getDate());
  const agora   = new Date();

  const mesesRestantes5 = Math.max(0,
    (prazo5.getFullYear() - agora.getFullYear()) * 12 +
    (prazo5.getMonth() - agora.getMonth())
  );

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const urgente = mesesRestantes5 < 24;

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: urgente ? "#FFFBEB" : "var(--surface-2)",
        border: `1px solid ${urgente ? "var(--warning-bdr)" : "var(--bdr)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 flex-shrink-0"
          style={{ color: urgente ? "var(--warning)" : "var(--text-3)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: urgente ? "var(--warning)" : "var(--text-3)" }}>
          {urgente ? "Atenção: prazo se aproxima" : "Prazo para contestação"}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-3)" }}>Ação de danos (CDC, Art. 27)</span>
          <span className="font-semibold" style={{ color: urgente ? "var(--warning)" : "var(--text)" }}>
            até {fmt(prazo5)}
            {mesesRestantes5 > 0 && ` (${mesesRestantes5} meses)`}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--text-3)" }}>Revisão contratual (CC, Art. 205)</span>
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            até {fmt(prazo10)}
          </span>
        </div>
      </div>
      <p className="text-xs mt-2.5 leading-relaxed" style={{ color: "var(--text-4)" }}>
        A contestação de juros abusivos tem prazo legal. Quanto antes você agir, melhor sua posição.
      </p>
    </div>
  );
}

/* ── Componente principal ────────────────────────────────────────────────── */
export default function ResultadoAuditoria() {
  const [dados, setDados] = useState<RespostaAnalise | null>(null);
  const [erro,  setErro]  = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("auditoria_resultado");
    if (!raw) { setErro("Nenhuma análise encontrada. Preencha o formulário novamente."); return; }
    try { setDados(JSON.parse(raw) as RespostaAnalise); }
    catch { setErro("Erro ao carregar o resultado. Preencha o formulário novamente."); }
  }, []);

  if (erro) {
    return (
      <div className="text-center py-16">
        <p className="mb-4" style={{ color: "var(--text-3)" }}>{erro}</p>
        <a href="/auditoria" className="btn-navy inline-flex px-6 py-3 text-sm">Fazer nova análise</a>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto"
          style={{ borderColor: "var(--bdr)", borderTopColor: "var(--blue)" }} />
        <p className="text-sm" style={{ color: "var(--text-4)" }}>Carregando resultado...</p>
      </div>
    );
  }

  const { resultado, taxaBCB, contrato, geradoEm } = dados;
  const cfg    = STATUS_CFG[resultado.status];
  const acima  = resultado.status !== "DENTRO_DA_MEDIA";
  const totalCobrado = resultado.valorCorrigido + resultado.diferencaAbusiva;

  /* ── Taxas anuais equivalentes ───────────────────────────────────────── */
  const anualCobrada = taxaAnualEquiv(resultado.taxaCobrada);
  const anualBCB     = taxaBCB.taxaAnual; // já calculado no backend

  /* ── Multiplicador: "você pagou X vezes o valor justo" ─────────────── */
  const multiplicador = resultado.valorCorrigido > 0
    ? totalCobrado / resultado.valorCorrigido
    : 0;

  return (
    <div className="space-y-5">

      {/* ── Status principal ──────────────────────────────────────────── */}
      <div className="rounded-2xl p-5 border" style={{ background: cfg.bg, borderColor: cfg.bdr }}>
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: cfg.cor }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {acima
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />}
            </svg>
          </div>
          <div>
            <span
              className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full text-white mb-1.5"
              style={{ background: cfg.cor }}
            >
              {cfg.rotulo}
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
              {!acima ? (
                <>
                  <strong>Sua taxa está dentro da média</strong> para{" "}
                  {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()} no período informado.
                  Mesmo assim, você pode negociar condições melhores — bancos aceitam quando você conhece os números.
                </>
              ) : (
                <>
                  <strong>A taxa cobrada está acima da média oficial do Banco Central</strong>{" "}
                  para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()}.
                  Veja abaixo quanto isso representa em reais e o que você pode fazer.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Gráfico comparativo (mensal + anual) ─────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-3)" }}>
            Comparativo de taxas
          </h2>
          <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--surface-3)", color: "var(--text-4)" }}>
            {ROTULO_TIPO_CREDITO[contrato.tipoCredito]}
          </span>
        </div>
        <BarraComparativa taxaCobrada={resultado.taxaCobrada} taxaBCB={resultado.taxaMediaBCB} />
        <p className="mt-2 text-xs" style={{ color: "var(--text-4)" }}>
          Fonte: BCB · Série SGS {taxaBCB.codigoSerie} · Data base {taxaBCB.data}
        </p>
      </div>

      {/* ── Resumo financeiro ─────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
          Resumo financeiro
        </h2>

        <SummaryRow label="Tipo de crédito" value={ROTULO_TIPO_CREDITO[contrato.tipoCredito]} />
        <SummaryRow label="Valor principal financiado" value={brl(resultado.valorOriginal)} />
        <SummaryRow label="Período analisado" value={`${resultado.periodoMeses} meses`} />
        <SummaryRow
          label="Taxa cobrada pelo banco"
          value={`${pct(resultado.taxaCobrada)} a.m.`}
          valueColor="var(--danger)"
          sub={`Equivale a ${pct(anualCobrada, 1)} ao ano`}
        />
        <SummaryRow
          label="Média oficial do Banco Central"
          value={`${pct(resultado.taxaMediaBCB)} a.m.`}
          valueColor="var(--success)"
          sub={`Equivale a ${pct(anualBCB, 1)} ao ano`}
        />
        <SummaryRow
          label="Total que deveria ter pago (taxa BCB)"
          value={brl(resultado.valorCorrigido)}
          valueColor="var(--success)"
        />
        <SummaryRow
          label="Total cobrado com sua taxa"
          value={brl(totalCobrado)}
          valueColor="var(--danger)"
        />
        <SummaryRow
          label="Excesso da taxa contratada sobre a BCB"
          value={`${resultado.percentualExcesso > 0 ? "+" : ""}${pct(resultado.percentualExcesso)}`}
          valueColor={acima ? "var(--danger)" : "var(--success)"}
          sub={multiplicador > 1.05
            ? `Você pagou ${multiplicador.toFixed(1)}× mais do que seria justo`
            : undefined}
        />

        {acima && (
          <div
            className="flex items-center justify-between mt-4 rounded-xl p-4"
            style={{ background: "var(--danger-bg)", border: "2px solid var(--danger-bdr)" }}
          >
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>Diferença identificada</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                Valor que pode ter sido cobrado indevidamente
              </p>
            </div>
            <span className="text-xl font-bold ml-4 flex-shrink-0" style={{ color: "var(--danger)" }}>
              {brl(resultado.diferencaAbusiva)}
            </span>
          </div>
        )}
      </div>

      {/* ── Prazo de prescrição ───────────────────────────────────────── */}
      {acima && <PrescricaoCard dataContrato={contrato.dataContrato} />}

      {/* ── CTA — acima da média ──────────────────────────────────────── */}
      {acima && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{ borderColor: "var(--navy-mid)" }}
        >
          {/* Header do card CTA */}
          <div className="px-5 py-5" style={{ background: "linear-gradient(135deg, #0D1B2A, #1E3A5F)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.50)" }}>
              O que essa análise significa para você
            </p>
            <h3 className="text-xl font-bold leading-tight mb-2" style={{ color: "#fff" }}>
              Você pode ter pago{" "}
              <span style={{ color: "#60A5FA" }}>{brl(resultado.diferencaAbusiva)}</span>{" "}
              a mais do que deveria.
            </h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              {resultado.percentualExcesso > 50
                ? `Sua taxa é ${pct(resultado.percentualExcesso)} acima da média — enquadrada como potencialmente abusiva pelo CDC.`
                : `Sua taxa está ${pct(resultado.percentualExcesso)} acima da referência do Banco Central.`}
            </p>
          </div>

          {/* Corpo */}
          <div className="p-5 space-y-4" style={{ background: "var(--surface)" }}>

            {/* Duas opções */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--surface-2)", border: "1px solid var(--bdr)", opacity: 0.55 }}
              >
                <p className="text-xs font-bold uppercase mb-1.5" style={{ color: "var(--text-4)" }}>
                  Opção A
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
                  Fechar essa página e continuar pagando o mesmo.
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ background: "var(--surface-3)", border: "2px solid var(--blue)" }}
              >
                <p className="text-xs font-bold uppercase mb-1.5" style={{ color: "var(--blue)" }}>
                  Opção B
                </p>
                <p className="text-xs font-semibold leading-relaxed" style={{ color: "var(--text)" }}>
                  Usar o relatório completo para questionar o banco com documentação.
                </p>
              </div>
            </div>

            {/* O que está incluído */}
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--surface-2)", border: "1px solid var(--bdr)" }}
            >
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "var(--text-3)" }}>
                O Relatório Completo inclui:
              </p>
              <ul className="space-y-2.5">
                {[
                  { icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", text: "Cálculo detalhado com fórmula de juros compostos" },
                  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", text: "Requerimento Administrativo pronto para assinar e enviar" },
                  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", text: "Referências legais: CDC, Súmula 297 STJ e BC" },
                  { icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z", text: "Guia de negociação com o banco passo a passo" },
                ].map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-2)" }}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA principal */}
            <div className="text-center pt-1">
              <a
                href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
                className="btn-cta btn-pulse inline-flex w-full sm:w-auto py-4 px-8 text-base"
              >
                Quero o Relatório — R$&nbsp;19,90
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="mt-2 text-xs" style={{ color: "var(--text-4)" }}>
                Garantia incondicional de 7 dias. Se não ficar satisfeito, devolvemos tudo.
              </p>
              <p className="mt-1 text-xs font-medium" style={{ color: "var(--text-3)" }}>
                Acesso imediato por e-mail &nbsp;·&nbsp; PDF pronto para imprimir ou enviar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA — dentro da média ─────────────────────────────────────── */}
      {!acima && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ background: "var(--surface-3)", borderColor: "var(--bdr)" }}
        >
          <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
            Sua taxa está na média — mas você pode conseguir melhor
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>
            O relatório completo inclui o cálculo detalhado e orientações práticas para negociar
            uma taxa mais baixa. Bancos reduzem para clientes que chegam preparados.
          </p>
          <a href={process.env.NEXT_PUBLIC_CHECKOUT_URL} className="btn-navy inline-flex px-6 py-3 text-sm">
            Ver Relatório Completo — R$&nbsp;19,90
          </a>
          <p className="mt-2 text-xs" style={{ color: "var(--text-4)" }}>Garantia de 7 dias</p>
        </div>
      )}

      {/* ── O que fazer agora ─────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-3)" }}>
          O que você pode fazer agora (mesmo sem pagar nada)
        </h2>
        <div className="space-y-4">
          {[
            {
              num: "1",
              title: "Negocie diretamente com o banco",
              body: "Mostre os números desta análise. Solicite revisão do contrato por escrito e guarde o protocolo. Bancos costumam ceder quando percebem que o cliente conhece os dados do Banco Central.",
            },
            {
              num: "2",
              title: "Registre uma reclamação formal",
              body: "consumidor.gov.br e o PROCON do seu estado recebem reclamações contra instituições financeiras. Canais gratuitos com alto índice de resolução — especialmente para juros abusivos.",
            },
            {
              num: "3",
              title: "Consulte um advogado especializado",
              body: "Para contestação judicial, um advogado de direito do consumidor pode avaliar revisional ou repetição de indébito. Muitos trabalham com honorários condicionados ao resultado.",
            },
          ].map(({ num, title, body }) => (
            <div key={num} className="flex gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ background: "var(--navy-mid)" }}
              >
                {num}
              </div>
              <div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "var(--text)" }}>{title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ───────────────────────────────────────────────── */}
      <p className="text-xs leading-relaxed px-1" style={{ color: "var(--text-4)" }}>
        Análise baseada na comparação entre a taxa informada e a taxa média do Banco Central
        (série SGS {taxaBCB.codigoSerie}, referência {taxaBCB.data}). Taxas anuais calculadas
        por equivalência em juros compostos. Não constitui parecer jurídico ou financeiro.{" "}
        <span>Gerado em {new Date(geradoEm).toLocaleString("pt-BR")}.</span>
      </p>
    </div>
  );
}
