/**
 * pdf-generator.ts — v3
 * Laudo Técnico de Auditoria de Crédito — 8 páginas A4
 * Conteúdo ultra-detalhado com análise IA, gráficos visuais e plano de ação completo.
 */

import PDFDocument from "pdfkit";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import type { AnaliseIA } from "@/lib/ai-analysis";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Paleta de cores ──────────────────────────────────────────────────────────

const C = {
  primary:   "#1B4F72",
  accent:    "#2E86C1",
  accentL:   "#85C1E9",
  dark:      "#1C2833",
  success:   "#1E8449",
  successL:  "#EAFAF1",
  warning:   "#D4750A",
  warningL:  "#FEF9E7",
  danger:    "#C0392B",
  dangerL:   "#FADBD8",
  gray:      "#5D6D7E",
  lightGray: "#D5D8DC",
  bgGray:    "#F2F3F4",
  bgBlue:    "#EBF5FB",
  white:     "#FFFFFF",
  text:      "#1C2833",
} as const;

const STATUS_CFG: Record<StatusAuditoria, { cor: string; bg: string; rotulo: string }> = {
  DENTRO_DA_MEDIA:        { cor: C.success, bg: C.successL, rotulo: "DENTRO DA MÉDIA DE MERCADO"    },
  ACIMA_DA_MEDIA:         { cor: C.warning, bg: C.warningL, rotulo: "ACIMA DA MÉDIA DE MERCADO"     },
  POTENCIALMENTE_ABUSIVO: { cor: C.danger,  bg: C.dangerL,  rotulo: "POTENCIALMENTE ACIMA DA MÉDIA" },
};

const RISCO_COR: Record<string, string> = {
  ALTO:  C.danger,
  MÉDIO: C.warning,
  BAIXO: C.success,
};

// ─── Formatadores ──────────────────────────────────────────────────────────────

const brl  = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct  = (v: number, d = 4) => `${v.toFixed(d)}%`;
const fmtD = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
const fmtMY = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

// ─── Layout ───────────────────────────────────────────────────────────────────

const W       = 595.28;
const H       = 841.89;
const MARGIN  = 50;
const CW      = W - MARGIN * 2;
const TOTAL   = 8;
const HEADER_H = 110;
const PAGE_OPTS = { margins: { top: 0, bottom: 40, left: MARGIN, right: MARGIN } };

// ─── Helpers visuais ─────────────────────────────────────────────────────────

function cabecalho(doc: PDFKit.PDFDocument, titulo: string, pag: number, total: number) {
  doc.rect(0, 0, W, HEADER_H).fill(C.primary);
  doc.rect(0, HEADER_H - 6, W, 6).fill(C.accent);

  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(16)
    .text("AuditCrédito", MARGIN, 28, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
    .text("Laudo Técnico de Auditoria de Crédito", MARGIN, 50, { lineBreak: false });

  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
    .text(titulo, MARGIN, 32, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
    .text(`Página ${pag} de ${total}`, MARGIN, 50, { width: CW, align: "right", lineBreak: false });

  doc.fillColor(C.text);
  doc.y = HEADER_H + 20;
}

function rodape(doc: PDFKit.PDFDocument, id: string) {
  const y = H - 36;
  doc.rect(0, y - 4, W, 40).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(7)
    .text(
      `Documento informativo — não constitui parecer jurídico ou financeiro.  |  ID: ${id.toUpperCase()}  |  AuditCrédito`,
      MARGIN, y + 8, { width: CW, align: "center", lineBreak: false },
    );
  doc.fillColor(C.text);
}

function secao(doc: PDFKit.PDFDocument, titulo: string, cor = C.primary) {
  doc.moveDown(0.5);
  const y = doc.y;
  doc.rect(MARGIN, y, CW, 22).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9.5)
    .text(titulo.toUpperCase(), MARGIN + 10, y + 6, { lineBreak: false });
  doc.fillColor(C.text);
  doc.y = y + 28;
}

function paragrafo(doc: PDFKit.PDFDocument, texto: string, fontSize = 9.5) {
  if (!texto?.trim()) return;
  doc.font("Helvetica").fontSize(fontSize).fillColor(C.text)
    .text(texto.trim(), MARGIN, doc.y, { width: CW, align: "justify" });
  doc.moveDown(0.4);
}

function paragrafosTexto(doc: PDFKit.PDFDocument, texto: string, fontSize = 9) {
  if (!texto?.trim()) return;
  const partes = texto.split(/\n\n+/).filter(p => p.trim());
  for (const p of partes) paragrafo(doc, p, fontSize);
}

function itemLista(doc: PDFKit.PDFDocument, texto: string, indente = 0) {
  const x = MARGIN + indente;
  doc.font("Helvetica").fontSize(9).fillColor(C.text)
    .text(`• ${texto}`, x, doc.y, { width: CW - indente, indent: 12 });
  doc.moveDown(0.3);
}

function itemNumerado(doc: PDFKit.PDFDocument, num: number, texto: string) {
  const numX = MARGIN;
  const textX = MARGIN + 28;
  const y = doc.y;

  doc.rect(numX, y, 20, 20).fill(C.accent);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
    .text(String(num), numX, y + 4, { width: 20, align: "center", lineBreak: false });

  doc.fillColor(C.text).font("Helvetica").fontSize(9)
    .text(texto, textX, y, { width: CW - 28 });
  doc.moveDown(0.3);
}

function divisor(doc: PDFKit.PDFDocument) {
  doc.moveDown(0.3);
  doc.rect(MARGIN, doc.y, CW, 0.5).fill(C.lightGray);
  doc.moveDown(0.4);
}

function caixaDestaque(
  doc: PDFKit.PDFDocument,
  texto: string,
  corBorda: string,
  corFundo: string,
  fontSize = 9,
) {
  const estimH = Math.max(40, Math.ceil(texto.length / 80) * 14 + 20);
  const y = doc.y;
  doc.rect(MARGIN, y, CW, estimH).fill(corFundo);
  doc.rect(MARGIN, y, 4, estimH).fill(corBorda);
  doc.fillColor(C.text).font("Helvetica").fontSize(fontSize)
    .text(texto.trim(), MARGIN + 14, y + 10, { width: CW - 24, align: "justify" });
  doc.y = y + estimH + 8;
  doc.fillColor(C.text);
}

function badgeGrande(doc: PDFKit.PDFDocument, texto: string, cor: string) {
  const y = doc.y;
  doc.rect(MARGIN, y, CW, 34).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(12)
    .text(texto, MARGIN, y + 10, { width: CW, align: "center", lineBreak: false });
  doc.y = y + 46;
  doc.fillColor(C.text);
}

// ─── PÁGINA 1 — Capa ──────────────────────────────────────────────────────────

function paginaCapa(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, geradoEm, id, contrato, instituicao, nome } = dados;
  const cfg = STATUS_CFG[resultado.status];
  const taxaAnualCobr = ((Math.pow(1 + resultado.taxaCobrada / 100, 12) - 1) * 100).toFixed(2);

  // Barra de topo premium
  doc.rect(0, 0, W, 180).fill(C.primary);
  doc.rect(0, 160, W, 20).fill(C.accent);

  // Logo
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(26)
    .text("AuditCrédito", MARGIN, 40, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(10)
    .text("Ferramenta educacional independente de análise de crédito", MARGIN, 72, { lineBreak: false });

  // Badge tipo doc (direita)
  doc.fillColor(C.white).font("Helvetica").fontSize(9)
    .text("LAUDO TÉCNICO PERSONALIZADO", MARGIN, 45, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
    .text("Gerado com análise de Inteligência Artificial", MARGIN, 62, { width: CW, align: "right", lineBreak: false });

  // Título principal
  doc.y = 210;
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
    .text("Relatório de Análise Comparativa", MARGIN, doc.y, { width: CW, align: "center" });
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
    .text("de Taxas de Crédito", MARGIN, doc.y, { width: CW, align: "center" });
  doc.fillColor(C.gray).font("Helvetica").fontSize(10)
    .text("Diagnóstico jurídico e financeiro com base em dados públicos do Banco Central do Brasil",
      MARGIN, doc.y + 4, { width: CW, align: "center" });

  // Linha decorativa
  doc.moveDown(0.8);
  doc.rect(MARGIN + 60, doc.y, CW - 120, 1.5).fill(C.accent);
  doc.moveDown(1.2);

  // Card de informações do cliente
  const cardY = doc.y;
  doc.rect(MARGIN, cardY, CW, 150).fill(C.bgGray);
  doc.rect(MARGIN, cardY, 4, 150).fill(C.accent);

  const linhas: [string, string][] = [
    ["Cliente analisado",    nome],
    ["Instituição",          instituicao],
    ["Modalidade de crédito", ROTULO_TIPO_CREDITO[contrato.tipoCredito]],
    ["Valor financiado",     brl(resultado.valorOriginal)],
    ["Período analisado",    `${resultado.periodoMeses} meses`],
    ["Data de referência",   fmtMY(contrato.dataContrato)],
    ["Data da análise",      fmtD(geradoEm)],
    ["Identificador",        id.slice(0, 12).toUpperCase()],
  ];

  doc.y = cardY + 12;
  for (const [label, val] of linhas) {
    doc.fillColor(C.gray).font("Helvetica").fontSize(8.5)
      .text(label + ":", MARGIN + 16, doc.y, { lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(8.5)
      .text(val, MARGIN + 16, doc.y, { width: CW - 32, align: "right", lineBreak: false });
    doc.y += 17;
  }

  // 3 KPI boxes
  doc.moveDown(1.2);
  const kpiY  = doc.y;
  const kpiW  = (CW - 20) / 3;
  const kpiH  = 72;
  const kpis: [string, string, string, string][] = [
    ["TAXA COBRADA", pct(resultado.taxaCobrada, 2) + " a.m.", taxaAnualCobr + "% ao ano", C.danger],
    ["TAXA BCB (REFERÊNCIA)", pct(resultado.taxaMediaBCB, 2) + " a.m.", dados.taxaBCB.data + " — SGS " + dados.taxaBCB.codigoSerie, C.success],
    ["DIFERENÇA APURADA", brl(resultado.diferencaAbusiva), "excesso de " + pct(resultado.percentualExcesso, 2), C.warning],
  ];

  for (let i = 0; i < kpis.length; i++) {
    const [titulo, valor, sub, cor] = kpis[i];
    const kx = MARGIN + i * (kpiW + 10);
    doc.rect(kx, kpiY, kpiW, kpiH).fill(cor);
    doc.fillColor(C.white).font("Helvetica").fontSize(7)
      .text(titulo, kx + 8, kpiY + 8, { width: kpiW - 16, lineBreak: false });
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(15)
      .text(valor, kx + 8, kpiY + 22, { width: kpiW - 16, lineBreak: false });
    doc.fillColor(C.white).font("Helvetica").fontSize(6.5)
      .text(sub, kx + 8, kpiY + 50, { width: kpiW - 16, lineBreak: false });
  }
  doc.y = kpiY + kpiH + 16;

  // Badge de status
  doc.rect(MARGIN, doc.y, CW, 34).fill(cfg.cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(12)
    .text(`RESULTADO: ${cfg.rotulo}`, MARGIN, doc.y + 10, { width: CW, align: "center", lineBreak: false });
  doc.y += 50;

  // Disclaimer da capa
  doc.rect(MARGIN, doc.y, CW, 58).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
    .text(
      "DOCUMENTO INFORMATIVO — Este laudo não constitui parecer jurídico, contábil ou financeiro. " +
      "A análise compara a taxa informada pelo usuário com a taxa média divulgada mensalmente pelo Banco Central do Brasil " +
      "para a mesma modalidade de crédito. As orientações contidas neste documento têm caráter educacional. " +
      "Para ações legais formais, consulte um advogado especializado.",
      MARGIN + 12, doc.y + 10, { width: CW - 24, align: "justify" },
    );

  rodape(doc, id);
}

// ─── PÁGINA 2 — Diagnóstico Financeiro ───────────────────────────────────────

function paginaDiagnosticoFinanceiro(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, taxaBCB, contrato, id } = dados;
  const cfg = STATUS_CFG[resultado.status];
  const taxaAnualCobr  = ((Math.pow(1 + resultado.taxaCobrada / 100, 12) - 1) * 100);
  const valorCobrado   = resultado.valorOriginal * Math.pow(1 + resultado.taxaCobrada / 100, resultado.periodoMeses);
  const valorBCB       = resultado.valorCorrigido;
  const difTotal       = resultado.diferencaAbusiva;

  cabecalho(doc, "Diagnóstico Financeiro", 2, TOTAL);

  // ── Comparativo visual de taxas ─────────────────────────────────────────────
  secao(doc, "Comparativo Visual de Taxas — Base: Dados Oficiais BCB", C.primary);

  const BAR_LABEL = 145;
  const BAR_VAL   = 75;
  const BAR_AREA  = CW - BAR_LABEL - BAR_VAL;
  const maxTaxa   = Math.max(resultado.taxaCobrada, resultado.taxaMediaBCB) * 1.1;

  const drawBarra = (label: string, taxa: number, cor: string, subtxt: string) => {
    const barW = (taxa / maxTaxa) * BAR_AREA;
    const y    = doc.y;

    // Label
    doc.fillColor(C.gray).font("Helvetica").fontSize(8.5)
      .text(label, MARGIN, y + 5, { width: BAR_LABEL - 8, lineBreak: false });
    doc.fillColor(C.gray).font("Helvetica").fontSize(7)
      .text(subtxt, MARGIN, y + 17, { width: BAR_LABEL - 8, lineBreak: false });

    // Trilho cinza
    doc.rect(MARGIN + BAR_LABEL, y, BAR_AREA, 24).fill("#EAECEE");

    // Barra colorida
    doc.rect(MARGIN + BAR_LABEL, y, barW, 24).fill(cor);

    // Valor na ponta
    doc.fillColor(C.text).font("Helvetica-Bold").fontSize(9.5)
      .text(pct(taxa, 4) + " a.m.", MARGIN + BAR_LABEL + BAR_AREA + 6, y + 6, { lineBreak: false });

    doc.y = y + 32;
    doc.fillColor(C.text);
  };

  drawBarra("Taxa cobrada por " + dados.instituicao, resultado.taxaCobrada, C.danger,
    taxaAnualCobr.toFixed(2) + "% ao ano efetivo");
  drawBarra("Taxa média BCB — " + ROTULO_TIPO_CREDITO[contrato.tipoCredito], resultado.taxaMediaBCB, C.success,
    "Série SGS " + taxaBCB.codigoSerie + " — " + taxaBCB.data);
  drawBarra("Diferença (excesso)", resultado.taxaCobrada - resultado.taxaMediaBCB, C.warning,
    pct(resultado.percentualExcesso, 2) + " acima da referência");

  doc.moveDown(0.3);

  // ── Tabela de dados ─────────────────────────────────────────────────────────
  secao(doc, "Dados do Contrato Analisado", C.primary);

  const rowH = 20;
  const linhasTabela: [string, string, boolean][] = [
    ["Tipo de crédito",              ROTULO_TIPO_CREDITO[contrato.tipoCredito],    false],
    ["Banco / Instituição",          dados.instituicao,                            true ],
    ["Valor principal (P)",          brl(resultado.valorOriginal),                 false],
    ["Taxa cobrada (i cobrada)",     pct(resultado.taxaCobrada, 4) + " ao mês",    true ],
    ["Taxa BCB (i referência)",      pct(resultado.taxaMediaBCB, 4) + " ao mês",   false],
    ["Período (n)",                  resultado.periodoMeses + " meses",            true ],
    ["Data de referência",           taxaBCB.data,                                false],
    ["Série SGS/BCB utilizada",      String(taxaBCB.codigoSerie),                  true ],
  ];

  for (const [label, valor, alt] of linhasTabela) {
    if (alt) doc.rect(MARGIN, doc.y, CW, rowH).fill(C.bgGray);
    const ry = doc.y + 5;
    doc.fillColor(C.gray).font("Helvetica").fontSize(8.5)
      .text(label, MARGIN + 8, ry, { lineBreak: false });
    doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(8.5)
      .text(valor, MARGIN + 8, ry, { width: CW - 16, align: "right", lineBreak: false });
    doc.y += rowH + 2;
    doc.fillColor(C.text);
  }

  // ── Cálculo de juros compostos ──────────────────────────────────────────────
  secao(doc, "Cálculo de Juros Compostos — M = P × (1 + i)ⁿ", C.primary);

  // Fórmula visual
  const fY = doc.y;
  doc.rect(MARGIN, fY, CW, 30).fill(C.bgGray);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(11)
    .text(
      `M = ${brl(resultado.valorOriginal)} × (1 + i)^${resultado.periodoMeses}`,
      MARGIN, fY + 8, { width: CW, align: "center", lineBreak: false },
    );
  doc.y = fY + 38;

  const linhasCal: [string, string, string][] = [
    ["Com taxa cobrada (" + pct(resultado.taxaCobrada, 4) + " a.m.)",
     brl(valorCobrado), C.danger],
    ["Com taxa BCB (" + pct(resultado.taxaMediaBCB, 4) + " a.m.) — valor justo",
     brl(valorBCB), C.success],
    ["Diferença identificada — sobra ao consumidor",
     brl(Math.abs(difTotal)), C.warning],
  ];

  for (const [label, valor, cor] of linhasCal) {
    const ry = doc.y;
    doc.rect(MARGIN, ry, CW, 24).fill(cor + "18");
    doc.rect(MARGIN, ry, 4, 24).fill(cor);
    doc.fillColor(C.text).font("Helvetica").fontSize(9)
      .text(label, MARGIN + 12, ry + 6, { lineBreak: false });
    doc.fillColor(cor).font("Helvetica-Bold").fontSize(11)
      .text(valor, MARGIN, ry + 5, { width: CW - 8, align: "right", lineBreak: false });
    doc.y = ry + 30;
    doc.fillColor(C.text);
  }

  // Badge de resultado
  doc.moveDown(0.4);
  doc.rect(MARGIN, doc.y, CW, 32).fill(cfg.cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
    .text(`STATUS: ${cfg.rotulo}  —  Excesso de ${pct(resultado.percentualExcesso, 2)} sobre a taxa BCB`,
      MARGIN, doc.y + 9, { width: CW, align: "center", lineBreak: false });
  doc.y += 44;

  rodape(doc, id);
}

// ─── PÁGINA 3 — Laudo Jurídico Parte 1 ───────────────────────────────────────

function paginaLaudoJuridico1(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;
  const riscoColor = RISCO_COR[ai.nivelRisco] ?? C.warning;

  cabecalho(doc, "Laudo Jurídico — Parte 1", 3, TOTAL);

  // Risco + probabilidade em destaque
  const badgeY = doc.y;
  doc.rect(MARGIN, badgeY, CW, 36).fill(riscoColor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(13)
    .text(`RISCO JURÍDICO: ${ai.riscoJuridico}`, MARGIN, badgeY + 10,
      { width: CW, align: "center", lineBreak: false });
  doc.y = badgeY + 46;

  const probY = doc.y;
  doc.rect(MARGIN, probY, CW, 24).fill(C.bgBlue);
  doc.rect(MARGIN, probY, 4, 24).fill(C.accent);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
    .text(`Probabilidade de Êxito: ${ai.probabilidadeSucesso}`,
      MARGIN + 12, probY + 6, { lineBreak: false });
  doc.y = probY + 34;

  // Diagnóstico do caso
  secao(doc, "Diagnóstico Técnico do Caso");
  paragrafosTexto(doc, ai.diagnostico, 9.5);

  // Fundamentação legal
  secao(doc, "Fundamentação Jurídica Aplicável");
  paragrafosTexto(doc, ai.fundamentacaoLegal, 9);

  // Precedentes judiciais
  secao(doc, "Precedentes Judiciais Relevantes");
  for (let i = 0; i < ai.precedentesJudiciais.length; i++) {
    const y = doc.y;
    doc.rect(MARGIN, y, CW, 0.5).fill(C.lightGray);
    doc.y = y + 6;

    // Número do precedente
    doc.rect(MARGIN, doc.y, 24, 24).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(10)
      .text(String(i + 1), MARGIN, doc.y + 6, { width: 24, align: "center", lineBreak: false });

    doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
      .text(ai.precedentesJudiciais[i], MARGIN + 32, doc.y, { width: CW - 32 });
    doc.moveDown(0.3);
  }

  rodape(doc, id);
}

// ─── PÁGINA 4 — Laudo Jurídico Parte 2 ───────────────────────────────────────

function paginaLaudoJuridico2(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Laudo Jurídico — Parte 2", 4, TOTAL);

  // Direitos do consumidor
  secao(doc, "Direitos do Consumidor Identificados Neste Caso");
  for (let i = 0; i < ai.direitosConsumidor.length; i++) {
    itemNumerado(doc, i + 1, ai.direitosConsumidor[i]);
  }

  divisor(doc);

  // Impacto financeiro
  secao(doc, "Impacto Financeiro Detalhado");
  paragrafosTexto(doc, ai.impactoFinanceiro, 9);

  divisor(doc);

  // Cenário de restituição
  secao(doc, "Cenários de Restituição e Recuperação");
  paragrafosTexto(doc, ai.cenarioRestituicao, 9);

  // Estimativa de economia em destaque
  doc.moveDown(0.3);
  const econY = doc.y;
  doc.rect(MARGIN, econY, CW, 30).fill(C.successL);
  doc.rect(MARGIN, econY, 4, 30).fill(C.success);
  doc.fillColor(C.success).font("Helvetica-Bold").fontSize(10)
    .text(ai.estimativaEconomia, MARGIN + 12, econY + 8, { width: CW - 24 });
  doc.y = econY + 40;

  rodape(doc, id);
}

// ─── PÁGINA 5 — Estratégia de Negociação ─────────────────────────────────────

function paginaEstrategia(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Estratégia de Negociação", 5, TOTAL);

  // Estratégia completa
  secao(doc, "Estratégia Personalizada para Este Caso");
  paragrafosTexto(doc, ai.estrategiaCompleta, 9);

  divisor(doc);

  // Canais recomendados
  secao(doc, "Canais Recomendados — Por Ordem de Eficácia");

  const canais = ai.canaisRecomendados;
  const canaisCores = [C.primary, C.accent, C.warning, C.success];
  const iconLabel   = ["1º", "2º", "3º", "4º"];

  for (let i = 0; i < canais.length; i++) {
    const y   = doc.y;
    const cor = canaisCores[i % canaisCores.length];
    const est = Math.max(44, Math.ceil(canais[i].length / 90) * 13 + 22);

    doc.rect(MARGIN, y, CW, est).fill(C.bgGray);
    doc.rect(MARGIN, y, 40, est).fill(cor);

    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
      .text(iconLabel[i], MARGIN, y + est / 2 - 8, { width: 40, align: "center", lineBreak: false });
    doc.fillColor(C.white).font("Helvetica").fontSize(7)
      .text("CANAL", MARGIN, y + est / 2 + 4, { width: 40, align: "center", lineBreak: false });

    doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
      .text(canais[i], MARGIN + 48, y + 8, { width: CW - 56 });

    doc.y = y + est + 6;
    doc.fillColor(C.text);
  }

  rodape(doc, id);
}

// ─── PÁGINA 6 — Roteiro de Negociação ────────────────────────────────────────

function paginaRoteiro(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Roteiro de Negociação", 6, TOTAL);

  // Instrução de uso
  const instY = doc.y;
  doc.rect(MARGIN, instY, CW, 28).fill(C.bgBlue);
  doc.rect(MARGIN, instY, 4, 28).fill(C.accent);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8.5)
    .text("Use este script como guia ao ligar ou ir pessoalmente ao banco. Adapte com suas informações pessoais.",
      MARGIN + 12, instY + 8, { width: CW - 24, lineBreak: false });
  doc.y = instY + 36;

  secao(doc, "Script Completo — Diálogo de Negociação com o Banco");

  // Renderizar roteiro com seções numeradas
  const roteiro = ai.roteirNegociacao;
  // Tentar dividir por marcadores (1), (2), etc.
  const secoes = roteiro.split(/(?=\(\d+\))/).filter(s => s.trim());

  if (secoes.length > 1) {
    for (const secao_ of secoes) {
      const match = secao_.match(/^\((\d+)\)\s*(.*)/s);
      if (match) {
        const num  = match[1];
        const cont = match[2].trim();
        const y    = doc.y;

        doc.rect(MARGIN, y, 26, 20).fill(C.primary);
        doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
          .text(num, MARGIN, y + 5, { width: 26, align: "center", lineBreak: false });

        doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
          .text(cont, MARGIN + 34, y, { width: CW - 34, align: "justify" });
        doc.moveDown(0.4);
      } else {
        paragrafo(doc, secao_, 8.5);
      }
    }
  } else {
    // Sem marcadores — renderizar como parágrafos normais
    paragrafosTexto(doc, roteiro, 8.5);
  }

  // Prazos críticos em destaque
  if (doc.y < H - 140) {
    divisor(doc);
    secao(doc, "Prazos Críticos — Não Deixe Para Depois", C.danger);
    caixaDestaque(doc, ai.prazosCriticos, C.danger, C.dangerL, 8.5);
  }

  rodape(doc, id);
}

// ─── PÁGINA 7 — Plano de Ação ─────────────────────────────────────────────────

function paginaPlanoAcao(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalho(doc, "Plano de Ação Completo", 7, TOTAL);

  // Timeline de ações
  secao(doc, "Linha do Tempo — O Que Fazer em Cada Fase");

  const fases: [string, string[], string, string][] = [
    ["SEMANA 1 — AÇÕES URGENTES",    ai.acoes7Dias,  C.danger,  C.dangerL],
    ["MÊS 1 — AÇÕES PRIORITÁRIAS",  ai.acoes30Dias, C.warning, C.warningL],
    ["MESES 2-3 — AÇÕES SEGUINTES", ai.acoes90Dias, C.accent,  C.bgBlue],
  ];

  for (const [titulo, acoes, cor, bg] of fases) {
    const blockY = doc.y;

    // Header da fase
    doc.rect(MARGIN, blockY, CW, 24).fill(cor);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9.5)
      .text(titulo, MARGIN + 10, blockY + 6, { lineBreak: false });
    doc.y = blockY + 24;

    // Ações
    const acaoH = acoes.reduce((acc, a) =>
      acc + Math.max(20, Math.ceil(a.length / 85) * 12 + 12), 0) + 12;

    doc.rect(MARGIN, doc.y, CW, acaoH).fill(bg);
    doc.y += 8;

    for (const acao of acoes) {
      const ay = doc.y;
      doc.fillColor(cor).font("Helvetica-Bold").fontSize(10)
        .text("›", MARGIN + 8, ay, { lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
        .text(acao, MARGIN + 22, ay, { width: CW - 30 });
      doc.moveDown(0.25);
    }

    doc.y = blockY + 24 + acaoH + 8;
    doc.fillColor(C.text);
  }

  divisor(doc);

  // Alertas especiais
  secao(doc, "Alertas Específicos do Seu Caso", C.danger);

  for (let i = 0; i < ai.alertasEspeciais.length; i++) {
    const alerta = ai.alertasEspeciais[i];
    const y      = doc.y;
    const estH   = Math.max(26, Math.ceil(alerta.length / 90) * 12 + 14);

    doc.rect(MARGIN, y, CW, estH).fill(i % 2 === 0 ? C.warningL : C.bgGray);
    doc.rect(MARGIN, y, 4, estH).fill(C.warning);

    doc.fillColor(C.warning).font("Helvetica-Bold").fontSize(8)
      .text(`⚠ ${i + 1}`, MARGIN + 8, y + 4, { lineBreak: false });
    doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
      .text(alerta, MARGIN + 28, y + 4, { width: CW - 36 });

    doc.y = y + estH + 4;
    doc.fillColor(C.text);
  }

  rodape(doc, id);
}

// ─── PÁGINA 8 — Modelo de Requerimento + Referências ─────────────────────────

function paginaRequerimentoReferencias(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { id, nome, instituicao, resultado, contrato, taxaBCB } = dados;
  const tipo    = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const dataRef = fmtMY(contrato.dataContrato);

  cabecalho(doc, "Modelo de Requerimento + Referências", 8, TOTAL);

  // Instrução
  const instY = doc.y;
  doc.rect(MARGIN, instY, CW, 22).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(8)
    .text("Preencha os campos em [COLCHETES] com seus dados antes de enviar. " +
      "Envie por e-mail, app do banco ou Correios com AR.",
      MARGIN + 8, instY + 6, { lineBreak: false });
  doc.y = instY + 30;

  secao(doc, "Modelo de Requerimento Administrativo — Personalizável");

  // Carta
  const carta = [
    `À ${instituicao}`,
    `Setor de Revisão Contratual / Ouvidoria`,
    ``,
    `Ref.: Pedido formal de revisão de taxa de juros — ${tipo}`,
    ``,
    `[CIDADE], [DATA]`,
    ``,
    `Eu, ${nome}, portador(a) do CPF nº [SEU CPF], cliente desta instituição,`,
    `venho, por meio deste requerimento, solicitar a revisão das condições do contrato de`,
    `${tipo.toLowerCase()} firmado em ${dataRef}, no valor de ${brl(resultado.valorOriginal)},`,
    `no qual consta taxa de juros de ${pct(resultado.taxaCobrada, 4)} ao mês.`,
    ``,
    `Com base em consulta à API pública do Banco Central do Brasil (SGS, série`,
    `${taxaBCB.codigoSerie}), a taxa média para esta modalidade no período era de`,
    `${pct(resultado.taxaMediaBCB, 4)} ao mês — diferença de ${pct(resultado.percentualExcesso, 2)}`,
    `acima da referência de mercado, correspondendo a ${brl(resultado.diferencaAbusiva)} no período total.`,
    ``,
    `Com fundamento nos arts. 6º, V; 39, V; e 51, IV, do Código de Defesa do Consumidor`,
    `(Lei 8.078/90), aplicável às instituições financeiras pela Súmula 297 do STJ, solicito`,
    `formalmente a revisão das condições pactuadas e nova proposta de acordo com a taxa`,
    `média de mercado divulgada pelo Banco Central do Brasil.`,
    ``,
    `Aguardo resposta formal no prazo de 5 (cinco) dias úteis.`,
    ``,
    `Atenciosamente,`,
    ``,
    `${nome}`,
    `CPF: [SEU CPF]  |  Telefone: [SEU TELEFONE]  |  E-mail: [SEU E-MAIL]`,
  ];

  const linhaH = 11.5;
  const cartaH = carta.length * linhaH + 20;
  const cartaY = doc.y;

  doc.rect(MARGIN, cartaY, CW, cartaH).fill(C.bgGray);
  doc.rect(MARGIN, cartaY, 3, cartaH).fill(C.accent);
  doc.y = cartaY + 10;

  doc.font("Courier").fontSize(7.8).fillColor(C.text);
  for (const linha of carta) {
    doc.text(linha === "" ? " " : linha, MARGIN + 12, doc.y,
      { width: CW - 20, lineBreak: false });
    doc.y += linhaH;
  }
  doc.y = cartaY + cartaH + 14;

  // Referências compactas
  secao(doc, "Fontes e Recursos Gratuitos", C.primary);

  const refs: [string, string][] = [
    ["API do BCB (SGS)",       `api.bcb.gov.br/dados/serie/bcdata.sgs.${taxaBCB.codigoSerie}/dados`],
    ["consumidor.gov.br",      "www.consumidor.gov.br"],
    ["Ouvidoria do BCB",       "www.bcb.gov.br/acessoinformacao/ouvidoria"],
    ["Calculadora do Cidadão", "www3.bcb.gov.br/CALCJUROS/"],
    ["Lei 8.078/90 — CDC",     "www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"],
  ];

  for (const [label, url] of refs) {
    const ry = doc.y;
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8)
      .text(label + "  ", MARGIN, ry, { continued: true, lineBreak: false });
    doc.fillColor(C.accent).font("Helvetica").fontSize(8)
      .text(url, { lineBreak: false });
    doc.y += 14;
  }

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
        Keywords: "juros, crédito, banco central, análise, CDC, revisão contratual, IA",
      },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data",  (c: Buffer) => chunks.push(c));
    doc.on("end",   ()          => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // P1 — Capa
    paginaCapa(doc, dados);

    // P2 — Diagnóstico Financeiro
    doc.addPage(PAGE_OPTS);
    paginaDiagnosticoFinanceiro(doc, dados);

    // P3 — Laudo Jurídico Parte 1
    doc.addPage(PAGE_OPTS);
    paginaLaudoJuridico1(doc, dados, ai);

    // P4 — Laudo Jurídico Parte 2
    doc.addPage(PAGE_OPTS);
    paginaLaudoJuridico2(doc, dados, ai);

    // P5 — Estratégia de Negociação
    doc.addPage(PAGE_OPTS);
    paginaEstrategia(doc, dados, ai);

    // P6 — Roteiro de Negociação
    doc.addPage(PAGE_OPTS);
    paginaRoteiro(doc, dados, ai);

    // P7 — Plano de Ação
    doc.addPage(PAGE_OPTS);
    paginaPlanoAcao(doc, dados, ai);

    // P8 — Requerimento + Referências
    doc.addPage(PAGE_OPTS);
    paginaRequerimentoReferencias(doc, dados);

    doc.end();
  });
}
