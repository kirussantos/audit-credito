/**
 * pdf-generator.ts — v4
 * Layout ultra-denso: margens reduzidas, header 44px, fontes 8px,
 * duas colunas onde possível, espaçamento mínimo, 8 páginas cheias.
 */

import PDFDocument from "pdfkit";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import type { AnaliseIA } from "@/lib/ai-analysis";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Paleta ───────────────────────────────────────────────────────────────────

const C = {
  primary:   "#1B4F72",
  accent:    "#2E86C1",
  accentL:   "#AED6F1",
  dark:      "#1C2833",
  success:   "#1E8449",
  successL:  "#D5F5E3",
  warning:   "#B7770D",
  warningL:  "#FEF9E7",
  danger:    "#C0392B",
  dangerL:   "#FADBD8",
  gray:      "#5D6D7E",
  lightGray: "#CCD1D1",
  bgGray:    "#F4F6F7",
  bgBlue:    "#EBF5FB",
  white:     "#FFFFFF",
  text:      "#1C2833",
} as const;

const STATUS_CFG: Record<StatusAuditoria, { cor: string; bg: string; rotulo: string }> = {
  DENTRO_DA_MEDIA:        { cor: C.success, bg: C.successL, rotulo: "DENTRO DA MÉDIA DE MERCADO"    },
  ACIMA_DA_MEDIA:         { cor: C.warning, bg: C.warningL, rotulo: "ACIMA DA MÉDIA DE MERCADO"     },
  POTENCIALMENTE_ABUSIVO: { cor: C.danger,  bg: C.dangerL,  rotulo: "POTENCIALMENTE ACIMA DA MÉDIA" },
};

const RISCO_COR: Record<string, string> = { ALTO: C.danger, MÉDIO: C.warning, BAIXO: C.success };

// ─── Formatadores ─────────────────────────────────────────────────────────────

const brl  = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct  = (v: number, d = 4) => `${v.toFixed(d)}%`;
const fmtD = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const fmtMY = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

// ─── Layout ───────────────────────────────────────────────────────────────────

const W        = 595.28;
const H        = 841.89;
const MARGIN   = 36;           // era 50 → mais espaço para conteúdo
const CW       = W - MARGIN * 2; // ≈ 523px
const TOTAL    = 8;
const HEADER_H = 44;           // era 110 → compacto
const FOOTER_H = 26;
const BODY_TOP = HEADER_H + 10; // início do conteúdo após header
const BODY_BOT = H - FOOTER_H - 6; // fim antes do rodapé
// bottom:0 → desabilita auto-page-break do PDFKit.
// Cada página é adicionada manualmente; guards em BODY_BOT evitam overflow.
const PAGE_OPTS = { margins: { top: 0, bottom: 0, left: MARGIN, right: MARGIN } };

// Fontes
const F = { h1: 11, h2: 9, body: 8, small: 7, label: 7.5, mono: 7.5 };
// Espaçamentos
const S = { sect: 14, row: 12.5, gap: 5, para: 4 };

// ─── Primitivos ───────────────────────────────────────────────────────────────

function cabecalho(doc: PDFKit.PDFDocument, titulo: string, pag: number) {
  // Faixa azul compacta
  doc.rect(0, 0, W, HEADER_H).fill(C.primary);
  doc.rect(0, HEADER_H - 3, W, 3).fill(C.accent);

  // Logo
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(13)
    .text("AuditCrédito", MARGIN, 12, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(6.5)
    .text("Laudo Técnico de Auditoria de Crédito", MARGIN, 27, { lineBreak: false });

  // Título + página (direita)
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
    .text(titulo, MARGIN, 13, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(F.small)
    .text(`Pág. ${pag} / ${TOTAL}`, MARGIN, 28, { width: CW, align: "right", lineBreak: false });

  doc.fillColor(C.text);
  doc.y = BODY_TOP;
}

function rodape(doc: PDFKit.PDFDocument, id: string) {
  const y = H - FOOTER_H;
  doc.rect(0, y, W, FOOTER_H).fill(C.bgGray);
  doc.rect(0, y, W, 1).fill(C.lightGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(6)
    .text(
      `Documento informativo — não constitui parecer jurídico ou financeiro.  ·  ID: ${id.slice(0,12).toUpperCase()}  ·  AuditCrédito  ·  Fonte BCB: api.bcb.gov.br`,
      MARGIN, y + 9, { width: CW, align: "center", lineBreak: false },
    );
}

/** Barra de seção compacta */
function sec(doc: PDFKit.PDFDocument, titulo: string, cor = C.primary) {
  if (doc.y >= BODY_BOT - 22) return;
  const y = doc.y;
  doc.rect(MARGIN, y, CW, S.sect).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
    .text(titulo.toUpperCase(), MARGIN + 6, y + 3.5, { lineBreak: false });
  doc.fillColor(C.text);
  doc.y = y + S.sect + 4;
}

/** Parágrafo compacto */
function par(doc: PDFKit.PDFDocument, texto: string, fs = F.body, w = CW, x = MARGIN) {
  if (!texto?.trim() || doc.y >= BODY_BOT - 12) return;
  doc.font("Helvetica").fontSize(fs).fillColor(C.text)
    .text(texto.trim(), x, doc.y, { width: w, align: "justify" });
  doc.y += S.para;
}

/** Multi-parágrafo dividido por \n\n */
function pars(doc: PDFKit.PDFDocument, texto: string, fs = F.body, w = CW, x = MARGIN) {
  if (!texto?.trim()) return;
  for (const p of texto.split(/\n\n+/).filter(s => s.trim())) par(doc, p, fs, w, x);
}

/** Linha de tabela alternada */
function row(
  doc: PDFKit.PDFDocument,
  label: string,
  valor: string,
  alt: boolean,
  w = CW,
  x = MARGIN,
) {
  if (doc.y >= BODY_BOT - 14) return;
  if (alt) doc.rect(x, doc.y, w, S.row).fill(C.bgGray);
  const ry = doc.y + 2.5;
  doc.fillColor(C.gray).font("Helvetica").fontSize(F.label)
    .text(label, x + 5, ry, { lineBreak: false });
  doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.label)
    .text(valor, x + 5, ry, { width: w - 10, align: "right", lineBreak: false });
  doc.y += S.row;
  doc.fillColor(C.text);
}

/** Caixa de destaque com borda lateral — altura medida com heightOfString */
function box(
  doc: PDFKit.PDFDocument,
  texto: string,
  corBorda: string,
  corFundo: string,
  fs = F.body,
  w = CW,
  x = MARGIN,
) {
  if (!texto?.trim() || doc.y >= BODY_BOT - 28) return;
  const innerW = w - 20;
  const textH  = doc.font("Helvetica").fontSize(fs).heightOfString(texto.trim(), { width: innerW });
  const h      = textH + 14;
  const y      = doc.y;
  doc.rect(x, y, w, h).fill(corFundo);
  doc.rect(x, y, 3, h).fill(corBorda);
  doc.fillColor(C.text).font("Helvetica").fontSize(fs)
    .text(texto.trim(), x + 10, y + 7, { width: innerW, align: "justify" });
  doc.y = y + h + S.gap;
  doc.fillColor(C.text);
}

/** Badge horizontal largo */
function badge(doc: PDFKit.PDFDocument, texto: string, cor: string, h = 22) {
  const y = doc.y;
  doc.rect(MARGIN, y, CW, h).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
    .text(texto, MARGIN, y + (h - F.h2) / 2, { width: CW, align: "center", lineBreak: false });
  doc.y = y + h + S.gap;
  doc.fillColor(C.text);
}

/** Item de lista com bullet colorido compacto */
function item(doc: PDFKit.PDFDocument, texto: string, cor = C.accent, x = MARGIN, w = CW) {
  if (doc.y >= BODY_BOT - 12) return;
  const y = doc.y;
  doc.fillColor(cor).font("Helvetica-Bold").fontSize(F.body)
    .text("•", x + 2, y, { lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
    .text(texto, x + 12, y, { width: w - 14 });
  doc.y += 2;
}

/** Item numerado compacto */
function itemNum(doc: PDFKit.PDFDocument, n: number, texto: string, cor = C.accent, x = MARGIN, w = CW) {
  if (doc.y >= BODY_BOT - 16) return;
  const y = doc.y;
  doc.rect(x, y, 16, 14).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
    .text(String(n), x, y + 2.5, { width: 16, align: "center", lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
    .text(texto, x + 20, y, { width: w - 22 });
  doc.y += 2;
}

// ─── PÁGINA 1 — Capa ──────────────────────────────────────────────────────────

function paginaCapa(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, geradoEm, id, contrato, instituicao, nome, taxaBCB } = dados;
  const cfg          = STATUS_CFG[resultado.status];
  const taxaAnualCobr = ((Math.pow(1 + resultado.taxaCobrada / 100, 12) - 1) * 100).toFixed(2);
  const tipo         = ROTULO_TIPO_CREDITO[contrato.tipoCredito];

  // ── Hero premium ──────────────────────────────────────────────────────────
  doc.rect(0, 0, W, 140).fill(C.primary);
  doc.rect(0, 128, W, 12).fill(C.accent);

  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(22)
    .text("AuditCrédito", MARGIN, 22, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8.5)
    .text("Ferramenta educacional independente de análise de crédito", MARGIN, 48, { lineBreak: false });
  doc.fillColor(C.white).font("Helvetica").fontSize(F.small)
    .text("LAUDO TÉCNICO PERSONALIZADO", MARGIN, 22, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(6.5)
    .text("Gerado com análise de Inteligência Artificial", MARGIN, 34, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(16)
    .text("Relatório de Análise Comparativa de Taxas de Crédito", MARGIN, 72, { width: CW, align: "center" });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(7.5)
    .text("Diagnóstico jurídico e financeiro com base em dados públicos do Banco Central do Brasil",
      MARGIN, 92, { width: CW, align: "center", lineBreak: false });

  doc.y = 152;

  // ── Dados do cliente (2 colunas) ─────────────────────────────────────────
  const COL1W = CW * 0.52;
  const COL2W = CW - COL1W - 8;
  const COL2X = MARGIN + COL1W + 8;
  const cardH = 88;
  const cardY = doc.y;

  doc.rect(MARGIN, cardY, COL1W, cardH).fill(C.bgGray);
  doc.rect(MARGIN, cardY, 3, cardH).fill(C.accent);
  doc.rect(COL2X, cardY, COL2W, cardH).fill(C.bgGray);
  doc.rect(COL2X, cardY, 3, cardH).fill(C.primary);

  const colInfo1: [string, string][] = [
    ["Cliente",         nome],
    ["Instituição",     instituicao],
    ["Modalidade",      tipo],
    ["Valor financiado",brl(resultado.valorOriginal)],
    ["Período",         `${resultado.periodoMeses} meses`],
  ];
  const colInfo2: [string, string][] = [
    ["Data referência", fmtMY(contrato.dataContrato)],
    ["Data da análise", fmtD(geradoEm)],
    ["Série BCB (SGS)", String(taxaBCB.codigoSerie)],
    ["Taxa referência", pct(resultado.taxaMediaBCB, 4) + " a.m."],
    ["ID do laudo",     id.slice(0, 10).toUpperCase()],
  ];

  const rowGap = 15;
  let ry = cardY + 8;
  for (const [lbl, val] of colInfo1) {
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
      .text(lbl + ":", MARGIN + 7, ry, { lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small)
      .text(val, MARGIN + 7, ry, { width: COL1W - 12, align: "right", lineBreak: false });
    ry += rowGap;
  }
  ry = cardY + 8;
  for (const [lbl, val] of colInfo2) {
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
      .text(lbl + ":", COL2X + 7, ry, { lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small)
      .text(val, COL2X + 7, ry, { width: COL2W - 12, align: "right", lineBreak: false });
    ry += rowGap;
  }

  doc.y = cardY + cardH + 8;

  // ── 3 KPI boxes ──────────────────────────────────────────────────────────
  const kpiH = 60;
  const kpiW = (CW - 12) / 3;
  const kpiY = doc.y;
  const kpis: [string, string, string, string][] = [
    ["TAXA COBRADA", pct(resultado.taxaCobrada, 2) + " a.m.", taxaAnualCobr + "% a.a. efetivo", C.danger],
    ["TAXA BCB (REFERÊNCIA)", pct(resultado.taxaMediaBCB, 2) + " a.m.", taxaBCB.data + " · SGS " + taxaBCB.codigoSerie, C.success],
    ["DIFERENÇA APURADA", brl(resultado.diferencaAbusiva), pct(resultado.percentualExcesso, 2) + " de excesso", C.warning],
  ];

  for (let i = 0; i < kpis.length; i++) {
    const [tit, val, sub, cor] = kpis[i];
    const kx = MARGIN + i * (kpiW + 6);
    doc.rect(kx, kpiY, kpiW, kpiH).fill(cor);
    doc.fillColor(C.white).font("Helvetica").fontSize(6)
      .text(tit, kx + 7, kpiY + 7, { width: kpiW - 14, lineBreak: false });
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(14)
      .text(val, kx + 7, kpiY + 18, { width: kpiW - 14, lineBreak: false });
    doc.fillColor("#FFFFFF99").font("Helvetica").fontSize(5.5)
      .text(sub, kx + 7, kpiY + 46, { width: kpiW - 14, lineBreak: false });
  }
  doc.y = kpiY + kpiH + 7;

  // ── Status badge ─────────────────────────────────────────────────────────
  badge(doc, `RESULTADO: ${cfg.rotulo}`, cfg.cor, 24);

  // ── O que está no laudo (2 colunas) ──────────────────────────────────────
  sec(doc, "O que Está Neste Laudo");
  const CON1X = MARGIN, CON1W = CW * 0.5 - 4;
  const CON2X = MARGIN + CW * 0.5 + 4, CON2W = CW * 0.5 - 4;
  const conteudo1 = [
    "Comparativo visual de taxas (BCB vs cobrada)",
    "Cálculo de juros compostos M = P × (1+i)ⁿ",
    "Diagnóstico jurídico personalizado por IA",
    "Fundamentação legal (CDC, STJ, BCB)",
  ];
  const conteudo2 = [
    "Roteiro de negociação com o banco",
    "Plano de ação em 3 fases (7, 30 e 90 dias)",
    "Alertas específicos do seu caso",
    "Modelo de Requerimento Administrativo",
  ];
  const startCon = doc.y;
  for (const t of conteudo1) item(doc, t, C.accent, CON1X, CON1W);
  const endCon = doc.y;
  doc.y = startCon;
  for (const t of conteudo2) item(doc, t, C.primary, CON2X, CON2W);
  doc.y = Math.max(endCon, doc.y) + 4;

  // ── Disclaimer ───────────────────────────────────────────────────────────
  const discY = doc.y;
  doc.rect(MARGIN, discY, CW, 42).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(6.5)
    .text(
      "DOCUMENTO INFORMATIVO — Este laudo não constitui parecer jurídico, contábil ou financeiro. " +
      "A análise compara a taxa informada com a taxa média divulgada mensalmente pelo Banco Central do Brasil " +
      "para a mesma modalidade. As orientações têm caráter exclusivamente educacional e informativo. " +
      "Para ações legais formais, consulte um advogado especializado em direito do consumidor bancário.",
      MARGIN + 8, discY + 8, { width: CW - 16, align: "justify" },
    );
  doc.y = discY + 50;

  // ── Garantia ─────────────────────────────────────────────────────────────
  const garY = doc.y;
  doc.rect(MARGIN, garY, CW, 28).fill(C.successL);
  doc.rect(MARGIN, garY, 3, 28).fill(C.success);
  doc.fillColor(C.success).font("Helvetica-Bold").fontSize(F.body)
    .text("Garantia de 7 dias:", MARGIN + 10, garY + 5, { lineBreak: false });
  doc.fillColor(C.dark).font("Helvetica").fontSize(F.body)
    .text(" Se por qualquer motivo não ficar satisfeito, solicite reembolso integral em até 7 dias corridos — sem perguntas.",
      MARGIN + 10, garY + 5, { continued: false, width: CW - 18 });

  rodape(doc, id);
}

// ─── PÁGINA 2 — Diagnóstico Financeiro ───────────────────────────────────────

function paginaDiagnosticoFinanceiro(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, taxaBCB, contrato, id } = dados;
  const cfg           = STATUS_CFG[resultado.status];
  const taxaAnualCobr = (Math.pow(1 + resultado.taxaCobrada / 100, 12) - 1) * 100;
  const valorCobrado  = resultado.valorOriginal * Math.pow(1 + resultado.taxaCobrada / 100, resultado.periodoMeses);
  const valorBCB      = resultado.valorCorrigido;
  const tipo          = ROTULO_TIPO_CREDITO[contrato.tipoCredito];

  cabecalho(doc, "Diagnóstico Financeiro", 2);

  // ── Comparativo visual (barras horizontais) ───────────────────────────────
  sec(doc, "Comparativo Visual de Taxas — Dados Oficiais Banco Central do Brasil");

  const BAR_L = 150, BAR_V = 80, BAR_A = CW - BAR_L - BAR_V;
  const maxT  = Math.max(resultado.taxaCobrada, resultado.taxaMediaBCB) * 1.15;

  const drawBar = (label: string, sub: string, taxa: number, cor: string) => {
    const barW = (taxa / maxT) * BAR_A;
    const y    = doc.y;
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.label)
      .text(label, MARGIN, y + 2, { width: BAR_L - 6, lineBreak: false });
    doc.fillColor(C.gray).font("Helvetica").fontSize(6)
      .text(sub, MARGIN, y + 12, { width: BAR_L - 6, lineBreak: false });
    doc.rect(MARGIN + BAR_L, y, BAR_A, 22).fill("#EAECEE");
    doc.rect(MARGIN + BAR_L, y, barW, 22).fill(cor);
    // Valor dentro da barra se couber, fora se não
    const valTxt = pct(taxa, 4) + " a.m.";
    doc.fillColor(barW > 50 ? C.white : C.text).font("Helvetica-Bold").fontSize(F.body)
      .text(valTxt, MARGIN + BAR_L + BAR_A + 4, y + 5, { lineBreak: false });
    doc.y = y + 28;
    doc.fillColor(C.text);
  };

  drawBar(`Taxa cobrada — ${dados.instituicao}`, taxaAnualCobr.toFixed(2) + "% ao ano efetivo",
    resultado.taxaCobrada, C.danger);
  drawBar(`Taxa média BCB — ${tipo}`, `Série SGS ${taxaBCB.codigoSerie} · ${taxaBCB.data}`,
    resultado.taxaMediaBCB, C.success);
  drawBar("Excesso sobre a média BCB", pct(resultado.percentualExcesso, 2) + " acima da referência",
    resultado.taxaCobrada - resultado.taxaMediaBCB, C.warning);

  doc.y += 3;

  // ── Tabela de dados + Cálculo (2 colunas) ────────────────────────────────
  const C1W = CW * 0.48, C2W = CW - C1W - 8, C2X = MARGIN + C1W + 8;
  const tableTop = doc.y;

  // Col 1 — Dados do contrato
  sec(doc, "Dados do Contrato Analisado");
  const linhasTabela: [string, string, boolean][] = [
    ["Modalidade de crédito",    tipo,                                                false],
    ["Banco / Instituição",      dados.instituicao,                                   true ],
    ["Valor principal (P)",      brl(resultado.valorOriginal),                        false],
    ["Taxa cobrada (i)",         pct(resultado.taxaCobrada, 4) + " a.m.",             true ],
    ["Taxa BCB referência",      pct(resultado.taxaMediaBCB, 4) + " a.m.",            false],
    ["Período (n)",              resultado.periodoMeses + " meses",                   true ],
    ["Data de referência",       taxaBCB.data,                                        false],
    ["Série SGS utilizada",      String(taxaBCB.codigoSerie),                         true ],
    ["Diferença de taxa",        pct(resultado.taxaCobrada - resultado.taxaMediaBCB, 4) + " a.m.", false],
    ["Excesso percentual",       pct(resultado.percentualExcesso, 2),                 true ],
  ];

  for (const [lbl, val, alt] of linhasTabela) {
    row(doc, lbl, val, alt, C1W, MARGIN);
  }

  const col1End = doc.y;

  // Col 2 — Cálculo de juros compostos
  doc.y = tableTop;
  // Ajuste manual para segunda coluna
  const secY2 = doc.y;
  doc.rect(C2X, secY2, C2W, S.sect).fill(C.primary);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
    .text("CÁLCULO — M = P × (1+i)ⁿ", C2X + 6, secY2 + 3.5, { lineBreak: false });
  doc.y = secY2 + S.sect + 4;

  // Fórmula
  const fY = doc.y;
  doc.rect(C2X, fY, C2W, 20).fill(C.bgGray);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.body)
    .text(`P = ${brl(resultado.valorOriginal)}  ·  n = ${resultado.periodoMeses} meses`,
      C2X + 4, fY + 5, { width: C2W - 8, align: "center", lineBreak: false });
  doc.y = fY + 26;

  // Resultados
  const calRows: [string, string, string][] = [
    ["Com taxa cobrada\n" + pct(resultado.taxaCobrada, 4) + " a.m.",
     brl(valorCobrado), C.danger],
    ["Com taxa BCB\n" + pct(resultado.taxaMediaBCB, 4) + " a.m. (justo)",
     brl(valorBCB), C.success],
    ["Diferença\napurada",
     brl(Math.abs(resultado.diferencaAbusiva)), C.warning],
  ];

  for (const [lbl, val, cor] of calRows) {
    const ry = doc.y;
    const rh = 34;
    doc.rect(C2X, ry, C2W, rh).fill(cor + "15");
    doc.rect(C2X, ry, 3, rh).fill(cor);
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
      .text(lbl, C2X + 8, ry + 5, { width: C2W * 0.6, lineBreak: false });
    doc.fillColor(cor).font("Helvetica-Bold").fontSize(10)
      .text(val, C2X + 8, ry + 12, { width: C2W - 14, align: "right", lineBreak: false });
    doc.y = ry + rh + 3;
    doc.fillColor(C.text);
  }

  // Projeção de prazo prescricional
  const presc = new Date(contrato.dataContrato);
  presc.setFullYear(presc.getFullYear() + 5);
  const prescStr = presc.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const noteY = doc.y;
  doc.rect(C2X, noteY, C2W, 22).fill(C.dangerL);
  doc.rect(C2X, noteY, 3, 22).fill(C.danger);
  doc.fillColor(C.danger).font("Helvetica-Bold").fontSize(F.small)
    .text("PRAZO PRESCRICIONAL:", C2X + 7, noteY + 4, { lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.small)
    .text(" 5 anos (CDC art. 27) — vence aprox. " + prescStr,
      C2X + 7, noteY + 14, { width: C2W - 14, lineBreak: false });
  doc.y = noteY + 28;

  // Estatísticas rápidas
  const stats: [string, string][] = [
    ["Diferença/mês média",   brl(resultado.diferencaAbusiva / resultado.periodoMeses)],
    ["Taxa anual cobrada",    taxaAnualCobr.toFixed(2) + "% a.a."],
    ["Excesso a.a.",          (((1 + resultado.taxaCobrada/100)**12 - (1 + resultado.taxaMediaBCB/100)**12)*100).toFixed(2) + "% a.a."],
  ];
  for (let i = 0; i < stats.length; i++) {
    row(doc, stats[i][0], stats[i][1], i % 2 === 0, C2W, C2X);
  }

  doc.y = Math.max(col1End, doc.y) + 5;

  // ── Status badge ─────────────────────────────────────────────────────────
  badge(doc, `STATUS: ${cfg.rotulo}  ·  Excesso de ${pct(resultado.percentualExcesso, 2)} sobre a taxa BCB`, cfg.cor, 22);

  // ── Interpretação dos dados ───────────────────────────────────────────────
  sec(doc, "Interpretação dos Dados");
  const interp = `A diferença de ${pct(resultado.taxaCobrada - resultado.taxaMediaBCB, 4)} ao mês entre ` +
    `a taxa cobrada (${pct(resultado.taxaCobrada, 4)} a.m.) e a taxa média de mercado divulgada pelo ` +
    `Banco Central (${pct(resultado.taxaMediaBCB, 4)} a.m.) resultou em uma cobrança adicional de ` +
    `${brl(resultado.diferencaAbusiva)} ao longo de ${resultado.periodoMeses} meses. ` +
    `Pelos critérios do STJ (REsp 1.061.530/RS) e do CDC (art. 39, V), taxas significativamente ` +
    `superiores à média de mercado constituem fundamento para pedido de revisão contratual. ` +
    `A fonte dos dados de referência é a API pública do Banco Central do Brasil (SGS, série ${taxaBCB.codigoSerie}), ` +
    `de natureza governamental e plenamente verificável.`;
  par(doc, interp, F.body);

  rodape(doc, id);
}

// ─── PÁGINA 3 — Laudo Jurídico Parte 1 ───────────────────────────────────────

function paginaLaudoJuridico1(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;
  const riscoColor = RISCO_COR[ai.nivelRisco] ?? C.warning;

  cabecalho(doc, "Laudo Jurídico — Parte 1", 3);

  // ── Risco + probabilidade (lado a lado) ──────────────────────────────────
  const rH = 30;
  const rY = doc.y;
  const rW1 = CW * 0.58, rW2 = CW - rW1 - 6;
  const rX2 = MARGIN + rW1 + 6;

  doc.rect(MARGIN, rY, rW1, rH).fill(riscoColor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
    .text("RISCO JURÍDICO: " + ai.riscoJuridico, MARGIN + 6, rY + 5, { width: rW1 - 10, lineBreak: false });

  doc.rect(rX2, rY, rW2, rH).fill(C.bgBlue);
  doc.rect(rX2, rY, 3, rH).fill(C.accent);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.small)
    .text("Prob. de Êxito: " + ai.probabilidadeSucesso, rX2 + 8, rY + 5, { width: rW2 - 12, lineBreak: false });

  doc.y = rY + rH + 6;

  // ── Diagnóstico do caso ───────────────────────────────────────────────────
  sec(doc, "Diagnóstico Técnico do Caso");
  pars(doc, ai.diagnostico, F.body);

  // ── Fundamentação legal ───────────────────────────────────────────────────
  sec(doc, "Fundamentação Jurídica Aplicável");
  pars(doc, ai.fundamentacaoLegal, F.body);

  // ── Precedentes (layout com heightOfString) ───────────────────────────────
  sec(doc, "Precedentes Judiciais Relevantes");
  for (let i = 0; i < ai.precedentesJudiciais.length; i++) {
    if (doc.y >= BODY_BOT - 30) break;
    const py   = doc.y;
    const txtW = CW - 28;
    const ph   = doc.font("Helvetica").fontSize(F.body).heightOfString(ai.precedentesJudiciais[i], { width: txtW }) + 14;
    doc.rect(MARGIN, py, CW, ph).fill(i % 2 === 0 ? C.bgGray : C.white);
    doc.rect(MARGIN, py, 3, ph).fill(C.primary);
    doc.rect(MARGIN + 3, py, 18, ph).fill(C.primary + "22");
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
      .text(String(i + 1), MARGIN + 3, py + (ph - F.label) / 2, { width: 18, align: "center", lineBreak: false });
    doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
      .text(ai.precedentesJudiciais[i], MARGIN + 24, py + 7, { width: txtW });
    doc.y = py + ph + 3;
    doc.fillColor(C.text);
  }

  rodape(doc, id);
}

// ─── PÁGINA 4 — Laudo Jurídico Parte 2 ───────────────────────────────────────

function paginaLaudoJuridico2(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Laudo Jurídico — Parte 2", 4);

  // ── Direitos do consumidor (2 colunas) ────────────────────────────────────
  sec(doc, "Direitos do Consumidor Identificados Neste Caso");
  const dC1X = MARGIN, dC1W = CW * 0.5 - 4;
  const dC2X = MARGIN + CW * 0.5 + 4, dC2W = CW * 0.5 - 4;

  const dir = ai.direitosConsumidor;
  const maxDir = Math.ceil(dir.length / 2);
  const col1Dir = dir.slice(0, maxDir);
  const col2Dir = dir.slice(maxDir);

  const startDir = doc.y;
  for (let i = 0; i < col1Dir.length; i++) {
    itemNum(doc, i + 1, col1Dir[i], C.primary, dC1X, dC1W);
  }
  const endDir1 = doc.y;
  doc.y = startDir;
  for (let i = 0; i < col2Dir.length; i++) {
    itemNum(doc, maxDir + i + 1, col2Dir[i], C.accent, dC2X, dC2W);
  }
  doc.y = Math.max(endDir1, doc.y) + 6;

  // ── Impacto financeiro ────────────────────────────────────────────────────
  sec(doc, "Impacto Financeiro Detalhado");
  pars(doc, ai.impactoFinanceiro, F.body);

  // ── Cenário de restituição ────────────────────────────────────────────────
  sec(doc, "Cenários de Restituição e Recuperação");
  pars(doc, ai.cenarioRestituicao, F.body);

  // ── Estimativa de economia (altura com heightOfString) ───────────────────
  if (doc.y < BODY_BOT - 40 && ai.estimativaEconomia?.trim()) {
    const econY    = doc.y;
    const econInW  = CW - 16;
    const econTxtH = doc.font("Helvetica").fontSize(F.body).heightOfString(ai.estimativaEconomia, { width: econInW });
    const econH    = econTxtH + 22;
    doc.rect(MARGIN, econY, CW, econH).fill(C.successL);
    doc.rect(MARGIN, econY, 3, econH).fill(C.success);
    doc.fillColor(C.success).font("Helvetica-Bold").fontSize(F.label)
      .text("ESTIMATIVA DE ECONOMIA:", MARGIN + 8, econY + 5, { lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica").fontSize(F.body)
      .text(ai.estimativaEconomia, MARGIN + 8, econY + 16, { width: econInW });
    doc.y = econY + econH + 6;
  }

  // ── Vias disponíveis (tabela compacta) ───────────────────────────────────
  sec(doc, "Vias de Contestação — Da Mais Simples à Mais Formal");
  const vias: [string, string, string][] = [
    ["1ª via", "Negociação direta",      "Contato por SAC/app · resultado em até 30 dias · sem custo"],
    ["2ª via", "Ouvidoria do banco",     "Obrigatória por lei · prazo de 10 dias úteis · gratuita"],
    ["3ª via", "consumidor.gov.br",      "Registro online · empresa tem 10 dias corridos para responder"],
    ["4ª via", "Procon estadual",        "Mediação gratuita · resultado em 30-60 dias"],
    ["5ª via", "JEC (Juizado Especial)", "Sem advogado até 40 salários mínimos · sentença em 6-18 meses"],
    ["6ª via", "Ação judicial",          "Com advogado · para valores elevados · resultado em 1-4 anos"],
  ];
  const viasCores = [C.success, C.success, C.accent, C.accent, C.warning, C.warning];
  for (let i = 0; i < vias.length; i++) {
    const [num, nome, desc] = vias[i];
    const vy = doc.y;
    const vh = 18;
    doc.rect(MARGIN, vy, CW, vh).fill(i % 2 === 0 ? C.bgGray : C.white);
    doc.rect(MARGIN, vy, 28, vh).fill(viasCores[i]);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
      .text(num, MARGIN, vy + 4, { width: 28, align: "center", lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small)
      .text(nome, MARGIN + 32, vy + 4, { width: 110, lineBreak: false });
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
      .text(desc, MARGIN + 146, vy + 4, { width: CW - 150, lineBreak: false });
    doc.y = vy + vh + 1;
    doc.fillColor(C.text);
  }

  rodape(doc, id);
}

// ─── PÁGINA 5 — Estratégia de Negociação ─────────────────────────────────────

function paginaEstrategia(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Estratégia de Negociação", 5);

  // ── Estratégia completa ───────────────────────────────────────────────────
  sec(doc, "Estratégia Personalizada para Este Caso");
  pars(doc, ai.estrategiaCompleta, F.body);

  doc.y += 3;

  // ── Canais recomendados (2×2 grid) ───────────────────────────────────────
  sec(doc, "Canais Recomendados — Por Ordem de Eficácia");

  const canais = ai.canaisRecomendados;
  const canaisCores = [C.primary, C.accent, C.warning, C.success];
  const GW = (CW - 6) / 2;
  const GH_BASE = 62;

  for (let i = 0; i < Math.min(4, canais.length); i += 2) {
    const gy = doc.y;
    for (let j = 0; j < 2; j++) {
      const idx = i + j;
      if (idx >= canais.length) break;
      const gx  = MARGIN + j * (GW + 6);
      const cor = canaisCores[idx % 4];
      const txt = canais[idx];
      const gh  = Math.max(GH_BASE, Math.ceil(txt.length / 48) * (F.body + 2.5) + 24);

      doc.rect(gx, gy, GW, gh).fill(C.bgGray);
      doc.rect(gx, gy, GW, 18).fill(cor);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.label)
        .text(`${idx + 1}º CANAL`, gx + 7, gy + 4, { lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
        .text(txt, gx + 7, gy + 23, { width: GW - 14 });
    }
    // Avança a altura do maior card nesta linha (simplificado)
    doc.y = gy + GH_BASE + (canais[i]?.length > 220 ? 20 : 0) + 6;
    doc.fillColor(C.text);
  }

  rodape(doc, id);
}

// ─── PÁGINA 6 — Roteiro de Negociação ────────────────────────────────────────

function paginaRoteiro(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Roteiro de Negociação", 6);

  // Instrução
  const instY = doc.y;
  doc.rect(MARGIN, instY, CW, 18).fill(C.bgBlue);
  doc.rect(MARGIN, instY, 3, 18).fill(C.accent);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.small)
    .text("Use este roteiro ao ligar ou ir pessoalmente ao banco. Adapte com seus dados (nome, contrato, CPF).",
      MARGIN + 8, instY + 4, { lineBreak: false });
  doc.y = instY + 22;

  sec(doc, "Script Completo — Diálogo de Negociação com o Banco");

  // Renderizar roteiro numerado
  const roteiro = ai.roteirNegociacao;
  const secoes  = roteiro.split(/(?=\(\d+\)|\d+\.\s)/).filter(s => s.trim());

  if (secoes.length > 1) {
    for (const s of secoes) {
      if (doc.y >= BODY_BOT - 30) break;
      const match = s.match(/^[(\[]?(\d+)[)\.]?\s*(.*)/s);
      if (match) {
        const num   = match[1];
        const cont  = match[2].trim();
        const y     = doc.y;
        const contW = CW - 30;
        const sh    = doc.font("Helvetica").fontSize(F.body).heightOfString(cont, { width: contW }) + 12;

        doc.rect(MARGIN, y, CW, sh).fill(parseInt(num) % 2 === 0 ? C.bgGray : C.white);
        doc.rect(MARGIN, y, 3, sh).fill(C.primary);
        doc.rect(MARGIN + 3, y, 20, sh).fill(C.primary + "18");
        doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
          .text(num, MARGIN + 3, y + (sh - F.label) / 2, { width: 20, align: "center", lineBreak: false });
        doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
          .text(cont, MARGIN + 26, y + 6, { width: contW, align: "justify" });
        doc.y = y + sh + 2;
        doc.fillColor(C.text);
      } else {
        par(doc, s, F.body);
      }
    }
  } else {
    pars(doc, roteiro, F.body);
  }

  // Prazos críticos (se houver espaço)
  if (doc.y < BODY_BOT - 60) {
    doc.y += 4;
    sec(doc, "Prazos Críticos — Não Deixe Para Depois", C.danger);
    box(doc, ai.prazosCriticos, C.danger, C.dangerL, F.body);
  }

  rodape(doc, id);
}

// ─── PÁGINA 7 — Plano de Ação ─────────────────────────────────────────────────

function paginaPlanoAcao(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Plano de Ação Completo", 7);

  // ── Timeline 3 fases (horizontal) ────────────────────────────────────────
  sec(doc, "Linha do Tempo — O Que Fazer em Cada Fase");

  const fases: [string, string[], string, string][] = [
    ["SEMANA 1\nÂÇÕES URGENTES",   ai.acoes7Dias,  C.danger,  C.dangerL],
    ["MÊS 1\nPRIORITÁRIAS",        ai.acoes30Dias, C.warning, C.warningL],
    ["MESES 2-3\nCONSOLIDAÇÃO",    ai.acoes90Dias, C.accent,  C.bgBlue],
  ];

  const FW = (CW - 10) / 3;

  // Calcular alturas reais por texto (chars/36 = linhas estimadas)
  const lineHAcao = 10;
  const acaoMinH  = 20;
  const getAcaoH  = (t: string) => Math.max(acaoMinH, Math.ceil(t.length / 36) * lineHAcao + 4) + 3;
  const colHeight = (acoes: string[]) => acoes.reduce((s, a) => s + getAcaoH(a), 0);
  const maxColH   = Math.max(...fases.map(([, a]) => colHeight(a)));

  // Cap para caber na página (deixa espaço para alertas abaixo)
  const availH  = Math.min(maxColH, BODY_BOT - doc.y - 140);
  const totalH  = Math.max(availH, acaoMinH * 3);

  // Headers das fases
  const hY = doc.y;
  for (let i = 0; i < 3; i++) {
    const fx = MARGIN + i * (FW + 5);
    doc.rect(fx, hY, FW, 28).fill(fases[i][2]);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.label)
      .text(fases[i][0], fx + 5, hY + 4, { width: FW - 10, align: "center" });
  }
  doc.y = hY + 28;

  // Fundo dos painéis
  const acaoStartY = doc.y;
  for (let i = 0; i < 3; i++) {
    const fx = MARGIN + i * (FW + 5);
    doc.rect(fx, acaoStartY, FW, totalH + 8).fill(fases[i][3]);
  }

  // Ações em cada coluna (parar em BODY_BOT - 10 para não vazar)
  for (let i = 0; i < 3; i++) {
    const fx    = MARGIN + i * (FW + 5);
    const acoes = fases[i][1];
    const cor   = fases[i][2];
    let ay      = acaoStartY + 5;

    for (const acao of acoes) {
      if (ay >= BODY_BOT - 30) break;
      doc.fillColor(cor).font("Helvetica-Bold").fontSize(F.body)
        .text("›", fx + 5, ay, { lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(F.small)
        .text(acao, fx + 15, ay, { width: FW - 20 });
      ay += getAcaoH(acao);
    }
  }
  doc.y = acaoStartY + totalH + 14;
  doc.fillColor(C.text);

  // ── Alertas especiais ─────────────────────────────────────────────────────
  sec(doc, "Alertas Específicos do Seu Caso", C.danger);

  const alertasCores = [C.warningL, C.bgGray];
  for (let i = 0; i < ai.alertasEspeciais.length; i++) {
    if (doc.y >= BODY_BOT - 22) break;
    const alerta  = ai.alertasEspeciais[i];
    const ay      = doc.y;
    const alertaW = CW - 30;
    const ah      = doc.font("Helvetica").fontSize(F.body).heightOfString(alerta, { width: alertaW }) + 12;

    doc.rect(MARGIN, ay, CW, ah).fill(alertasCores[i % 2]);
    doc.rect(MARGIN, ay, 3, ah).fill(C.danger);
    doc.fillColor(C.warning).font("Helvetica-Bold").fontSize(F.small)
      .text(`! ${i + 1}`, MARGIN + 6, ay + 4, { lineBreak: false });
    doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
      .text(alerta, MARGIN + 24, ay + 6, { width: alertaW });

    doc.y = ay + ah + 2;
    doc.fillColor(C.text);
  }

  // Prazos (se não couberam na pág 6)
  if (doc.y < BODY_BOT - 50) {
    doc.y += 4;
    sec(doc, "Prazos Críticos e Prescrição", C.danger);
    box(doc, ai.prazosCriticos, C.danger, C.dangerL, F.body);
  }

  rodape(doc, id);
}

// ─── PÁGINA 8 — Modelo de Requerimento + Referências ─────────────────────────

function paginaRequerimentoReferencias(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { id, nome, instituicao, resultado, contrato, taxaBCB } = dados;
  const tipo    = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const dataRef = fmtMY(contrato.dataContrato);

  cabecalho(doc, "Modelo de Requerimento + Referências", 8);

  // Instrução
  const instY = doc.y;
  doc.rect(MARGIN, instY, CW, 16).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
    .text("Preencha os campos [COLCHETES]. Envie por e-mail, app do banco ou Correios com AR. Guarde comprovante.",
      MARGIN + 6, instY + 4, { lineBreak: false });
  doc.y = instY + 20;

  sec(doc, "Modelo de Requerimento Administrativo — Personalizável");

  // Carta monospace compacta
  const carta = [
    `À ${instituicao}`,
    `Setor de Revisão Contratual / Ouvidoria`,
    ``,
    `Ref.: Pedido de revisão de taxa de juros — ${tipo}`,
    `[CIDADE], ${fmtD(new Date().toISOString())}`,
    ``,
    `Eu, ${nome}, portador(a) do CPF nº [SEU CPF], cliente desta`,
    `instituição, venho solicitar a revisão do contrato de ${tipo.toLowerCase()} firmado`,
    `em ${dataRef}, valor de ${brl(resultado.valorOriginal)}, taxa de ${pct(resultado.taxaCobrada, 4)} a.m.`,
    ``,
    `Consulta à API pública do BCB (SGS ${taxaBCB.codigoSerie}) indica taxa média`,
    `de ${pct(resultado.taxaMediaBCB, 4)} a.m. no período — diferença de ${pct(resultado.percentualExcesso, 2)},`,
    `totalizando ${brl(resultado.diferencaAbusiva)} a mais em ${resultado.periodoMeses} meses.`,
    ``,
    `Com fundamento nos arts. 6º, V; 39, V; e 51, IV, do CDC (Lei 8.078/90),`,
    `aplicável por força da Súmula 297 do STJ, solicito revisão formal das`,
    `condições pactuadas e nova proposta com taxa de mercado BCB.`,
    ``,
    `Aguardo resposta em até 5 dias úteis.`,
    ``,
    `Atenciosamente,`,
    `${nome}   CPF: [SEU CPF]   Fone: [TELEFONE]   E-mail: [EMAIL]`,
  ];

  const lineH  = 10.5;
  const cartaH = carta.length * lineH + 16;
  const cartaY = doc.y;

  doc.rect(MARGIN, cartaY, CW, cartaH).fill(C.bgGray);
  doc.rect(MARGIN, cartaY, 3, cartaH).fill(C.accent);
  doc.y = cartaY + 8;

  doc.font("Courier").fontSize(F.mono).fillColor(C.text);
  for (const linha of carta) {
    doc.text(linha === "" ? " " : linha, MARGIN + 10, doc.y,
      { width: CW - 16, lineBreak: false });
    doc.y += lineH;
  }
  doc.y = cartaY + cartaH + 10;

  // ── Recursos gratuitos (2 colunas) ───────────────────────────────────────
  sec(doc, "Fontes e Recursos Gratuitos");

  const refs: [string, string, string][] = [
    ["API do BCB (SGS)",        `api.bcb.gov.br/dados/serie/bcdata.sgs.${taxaBCB.codigoSerie}/dados`, C.primary],
    ["consumidor.gov.br",       "www.consumidor.gov.br",                                               C.accent ],
    ["Ouvidoria do BCB",        "www.bcb.gov.br/acessoinformacao/ouvidoria",                           C.primary],
    ["Calculadora do Cidadão",  "www3.bcb.gov.br/CALCJUROS/",                                         C.accent ],
    ["CDC — Lei 8.078/90",      "www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",              C.success],
    ["Súmula 297 STJ",          "stj.jus.br (buscar: Súmula 297)",                                    C.success],
  ];

  const rC1W = CW * 0.5 - 4, rC2W = CW * 0.5 - 4;
  const rC2X = MARGIN + CW * 0.5 + 4;
  const refY = doc.y;

  for (let i = 0; i < refs.length; i++) {
    const [lbl, url, cor] = refs[i];
    const rx = i % 2 === 0 ? MARGIN : rC2X;
    const rw = i % 2 === 0 ? rC1W : rC2W;
    const ry = refY + Math.floor(i / 2) * 20;

    doc.rect(rx, ry, rw, 18).fill(i % 4 < 2 ? C.bgGray : C.white);
    doc.rect(rx, ry, 3, 18).fill(cor);
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small)
      .text(lbl, rx + 7, ry + 3, { lineBreak: false });
    doc.fillColor(C.accent).font("Helvetica").fontSize(F.small)
      .text(url, rx + 7, ry + 11, { width: rw - 12, lineBreak: false });
  }
  doc.y = refY + Math.ceil(refs.length / 2) * 20 + 8;
  doc.fillColor(C.text);

  // ── Nota final ───────────────────────────────────────────────────────────
  const notaY = doc.y;
  doc.rect(MARGIN, notaY, CW, 34).fill(C.bgBlue);
  doc.rect(MARGIN, notaY, 3, 34).fill(C.accent);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
    .text("Próximos passos recomendados:", MARGIN + 8, notaY + 5, { lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.small)
    .text(
      "1) Reúna toda a documentação do contrato  ·  2) Contate o banco com os dados deste laudo  ·  " +
      "3) Registre a reclamação no consumidor.gov.br  ·  4) Se sem resposta em 10 dias, acione a ouvidoria",
      MARGIN + 8, notaY + 16, { width: CW - 16 },
    );

  rodape(doc, id);
}

// ─── Exportação principal ─────────────────────────────────────────────────────

export async function gerarRelatorioPDF(dados: RespostaAnalise): Promise<Buffer> {
  const { gerarAnaliseIA } = await import("@/lib/ai-analysis");
  const ai = dados.analiseIA ?? (await gerarAnaliseIA(dados));

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      ...PAGE_OPTS,
      info: {
        Title:    "Laudo Técnico de Auditoria de Crédito — AuditCrédito",
        Author:   "AuditCrédito — Ferramenta educacional independente",
        Subject:  "Análise comparativa de taxas de crédito com diagnóstico jurídico por IA",
        Creator:  "AuditCrédito + NVIDIA NIM",
        Keywords: "juros, crédito, banco central, análise, CDC, revisão contratual",
      },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data",  (c: Buffer) => chunks.push(c));
    doc.on("end",   ()          => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    paginaCapa(doc, dados);
    doc.addPage(PAGE_OPTS); paginaDiagnosticoFinanceiro(doc, dados);
    doc.addPage(PAGE_OPTS); paginaLaudoJuridico1(doc, dados, ai);
    doc.addPage(PAGE_OPTS); paginaLaudoJuridico2(doc, dados, ai);
    doc.addPage(PAGE_OPTS); paginaEstrategia(doc, dados, ai);
    doc.addPage(PAGE_OPTS); paginaRoteiro(doc, dados, ai);
    doc.addPage(PAGE_OPTS); paginaPlanoAcao(doc, dados, ai);
    doc.addPage(PAGE_OPTS); paginaRequerimentoReferencias(doc, dados);

    doc.end();
  });
}
