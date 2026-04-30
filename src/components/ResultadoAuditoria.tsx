"use client";

import { useEffect, useState } from "react";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

/* ─── Formatadores ───────────────────────────────────────────────────────────── */
const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (v: number) => `${v.toFixed(2)}%`;

/* ─── Status config ──────────────────────────────────────────────────────────── */
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

/* ─── Barra comparativa ─────────────────────────────────────────────────────── */
function BarraComparativa({ taxaCobrada, taxaBCB }: { taxaCobrada: number; taxaBCB: number }) {
  const max = Math.max(taxaCobrada, taxaBCB, 0.01);
  const wCobrada = Math.max(Math.round((taxaCobrada / max) * 100), 6);
  const wBCB     = Math.max(Math.round((taxaBCB     / max) * 100), 6);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span style={{ color: "var(--text-3)" }}>Taxa cobrada pelo banco</span>
          <span className="font-bold" style={{ color: "#DC2626" }}>{pct(taxaCobrada)} a.m.</span>
        </div>
        <div
          className="h-10 rounded-xl overflow-hidden"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-xl flex items-center justify-end pr-3 text-white text-xs font-bold anim-bar"
            style={{ width: `${wCobrada}%`, background: "linear-gradient(90deg, #DC2626, #EF4444)", minWidth: "3rem" }}
          >
            {pct(taxaCobrada)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span style={{ color: "var(--text-3)" }}>Média do Banco Central</span>
          <span className="font-bold" style={{ color: "#16A34A" }}>{pct(taxaBCB)} a.m.</span>
        </div>
        <div
          className="h-10 rounded-xl overflow-hidden"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="h-full rounded-xl flex items-center justify-end pr-3 text-white text-xs font-bold anim-bar"
            style={{ width: `${wBCB}%`, background: "linear-gradient(90deg, #16A34A, #22C55E)", minWidth: "3rem", animationDelay: "0.15s" }}
          >
            {pct(taxaBCB)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Linha do resumo financeiro ────────────────────────────────────────────── */
function SummaryRow({ label, value, valueColor, bold = false }: {
  label: string; value: string; valueColor?: string; bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: "var(--bdr)" }}>
      <span className="text-sm" style={{ color: "var(--text-3)" }}>{label}</span>
      <span
        className={`text-sm ${bold ? "font-bold text-base" : "font-semibold"}`}
        style={{ color: valueColor ?? "var(--text)" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Componente principal ──────────────────────────────────────────────────── */
export default function ResultadoAuditoria() {
  const [dados, setDados] = useState<RespostaAnalise | null>(null);
  const [erro, setErro]   = useState<string | null>(null);

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
        <a href="/auditoria" className="btn-navy inline-flex px-6 py-3 text-sm">
          Fazer nova análise
        </a>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="text-center py-16 space-y-3">
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin mx-auto"
          style={{ borderColor: "var(--bdr)", borderTopColor: "var(--blue)" }}
        />
        <p className="text-sm" style={{ color: "var(--text-4)" }}>Carregando resultado...</p>
      </div>
    );
  }

  const { resultado, taxaBCB, contrato, geradoEm } = dados;
  const cfg          = STATUS_CFG[resultado.status];
  const acima        = resultado.status !== "DENTRO_DA_MEDIA";
  const totalCobrado = resultado.valorCorrigido + resultado.diferencaAbusiva;

  return (
    <div className="space-y-5">

      {/* ── Status principal ─────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 border"
        style={{ background: cfg.bg, borderColor: cfg.bdr }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: cfg.cor }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              {acima
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              }
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
                  Mesmo dentro da média, você pode negociar condições melhores — bancos aceitam.
                </>
              ) : (
                <>
                  <strong>A taxa cobrada está acima da média oficial do Banco Central</strong>{" "}
                  para {ROTULO_TIPO_CREDITO[contrato.tipoCredito].toLowerCase()}.
                  Veja abaixo o quanto isso representou em reais no seu bolso.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Gráfico comparativo ─────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <h2
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-3)" }}
        >
          Comparativo de taxas — {ROTULO_TIPO_CREDITO[contrato.tipoCredito]}
        </h2>
        <BarraComparativa taxaCobrada={resultado.taxaCobrada} taxaBCB={resultado.taxaMediaBCB} />
        <p className="mt-3 text-xs" style={{ color: "var(--text-4)" }}>
          Referência BCB: série SGS {taxaBCB.codigoSerie} · data base {taxaBCB.data}
        </p>
      </div>

      {/* ── Resumo financeiro ───────────────────────────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <h2
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: "var(--text-3)" }}
        >
          Resumo financeiro
        </h2>

        <SummaryRow label="Tipo de crédito" value={ROTULO_TIPO_CREDITO[contrato.tipoCredito]} />
        <SummaryRow label="Valor principal" value={brl(resultado.valorOriginal)} />
        <SummaryRow label="Período analisado" value={`${resultado.periodoMeses} meses`} />
        <SummaryRow
          label={`Total com taxa cobrada (${pct(resultado.taxaCobrada)} a.m.)`}
          value={brl(totalCobrado)}
          valueColor="var(--danger)"
        />
        <SummaryRow
          label={`Total com taxa média BCB (${pct(resultado.taxaMediaBCB)} a.m.)`}
          value={brl(resultado.valorCorrigido)}
          valueColor="var(--success)"
        />
        <SummaryRow
          label="Excesso percentual sobre a taxa BCB"
          value={`${resultado.percentualExcesso > 0 ? "+" : ""}${pct(resultado.percentualExcesso)}`}
          valueColor={acima ? "var(--danger)" : "var(--success)"}
        />

        {acima && (
          <div
            className="flex items-center justify-between mt-3 rounded-xl p-4"
            style={{ background: "var(--danger-bg)", border: "2px solid var(--danger-bdr)" }}
          >
            <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
              Diferença identificada
            </span>
            <span className="text-xl font-bold" style={{ color: "var(--danger)" }}>
              {brl(resultado.diferencaAbusiva)}
            </span>
          </div>
        )}
      </div>

      {/* ── CTA — acima da média ────────────────────────────────────────── */}
      {acima && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-2xl border-2 overflow-hidden"
          style={{ borderColor: "var(--navy-mid)" }}
        >
          {/* Header do card CTA */}
          <div
            className="px-5 py-4"
            style={{ background: "linear-gradient(135deg, #0D1B2A, #1E3A5F)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
              O que isso significa para você
            </p>
            <h3 className="text-lg sm:text-xl font-bold leading-tight" style={{ color: "#fff" }}>
              Você pagou{" "}
              <span style={{ color: "#60A5FA" }}>{brl(resultado.diferencaAbusiva)}</span>{" "}
              a mais do que deveria.
            </h3>
          </div>

          {/* Corpo do card CTA */}
          <div className="p-5 space-y-5" style={{ background: "var(--surface)" }}>
            {/* Duas escolhas */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-4 opacity-50"
                style={{ background: "var(--surface-2)", border: "1px solid var(--bdr)" }}
              >
                <p className="text-xs font-bold uppercase mb-1.5" style={{ color: "var(--text-4)" }}>
                  Opção A
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-3)" }}>
                  Fechar essa página e continuar como se nada tivesse acontecido.
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
                  Pegar o relatório e ter o documento para questionar o banco.
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
              <ul className="space-y-2">
                {[
                  "Cálculo detalhado com fórmula de juros compostos",
                  "Requerimento Administrativo pronto para assinar e enviar",
                  "Referências legais (CDC + Súmula 297 STJ)",
                  "Guia de negociação passo a passo",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-2)" }}>
                    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Botão */}
            <div className="text-center">
              <a
                href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
                className="btn-cta btn-pulse inline-flex w-full sm:w-auto py-4 px-8 text-base"
              >
                Quero o Relatório — R$&nbsp;19,90
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <p className="mt-3 text-xs" style={{ color: "var(--text-4)" }}>
                Garantia incondicional de 7 dias. Não ficou satisfeito? Devolvemos tudo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── CTA — dentro da média ───────────────────────────────────────── */}
      {!acima && process.env.NEXT_PUBLIC_CHECKOUT_URL && (
        <div
          className="rounded-2xl border p-5 text-center"
          style={{ background: "var(--surface-3)", borderColor: "var(--bdr)" }}
        >
          <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
            Sua taxa está na média — mas você pode negociar melhor
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--text-3)" }}>
            O relatório completo inclui o cálculo detalhado e orientações para negociar
            condições ainda melhores com o banco.
          </p>
          <a
            href={process.env.NEXT_PUBLIC_CHECKOUT_URL}
            className="btn-navy inline-flex px-6 py-3 text-sm"
          >
            Ver Relatório Completo — R$&nbsp;19,90
          </a>
          <p className="mt-2 text-xs" style={{ color: "var(--text-4)" }}>Garantia de 7 dias</p>
        </div>
      )}

      {/* ── O que fazer agora (sem links externos) ──────────────────────── */}
      <div className="rounded-2xl border p-5" style={{ background: "var(--surface)", borderColor: "var(--bdr)" }}>
        <h2
          className="text-xs font-bold uppercase tracking-widest mb-4"
          style={{ color: "var(--text-3)" }}
        >
          O que você pode fazer agora
        </h2>

        <div className="space-y-4">
          {[
            {
              num: "1",
              title: "Negocie diretamente com o banco",
              body: "Apresente os números que você acabou de ver. Solicite revisão do contrato por escrito e guarde o protocolo. Bancos negociam quando percebem que o cliente conhece seus direitos.",
            },
            {
              num: "2",
              title: "Registre uma reclamação formal",
              body: "O consumidor.gov.br e o PROCON do seu estado recebem reclamações contra instituições financeiras. Canais gratuitos com alto índice de resolução.",
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

      {/* ── Disclaimer ──────────────────────────────────────────────────── */}
      <p className="text-xs leading-relaxed px-1" style={{ color: "var(--text-4)" }}>
        Análise baseada na comparação entre a taxa informada e a taxa média do Banco Central
        (série SGS {taxaBCB.codigoSerie}, referência {taxaBCB.data}). Não constitui parecer
        jurídico, financeiro ou legal.{" "}
        <span style={{ color: "var(--bdr-2)" }}>
          Gerado em {new Date(geradoEm).toLocaleString("pt-BR")}.
        </span>
      </p>
    </div>
  );
}
