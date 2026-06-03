/**
 * preview-email.mjs — v4
 * Layout ultra-denso: margens 36px, header 44px, fontes 8px, 2 colunas.
 * Uso: node scripts/preview-email.mjs
 */

import { config }           from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath }    from "url";
import PDFDocument          from "pdfkit";
import { Resend }           from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

// ─── Dados de teste ───────────────────────────────────────────────────────────

const DADOS = {
  id:          "preview-demo-v4",
  nome:        "Carlos Oliveira Santos",
  email:       "elberagenciamkt@gmail.com",
  instituicao: "Banco Bradesco S.A.",
  contrato: {
    tipoCredito:       "pessoal",
    valorOriginal:     18500,
    taxaMensalCobrada: 4.35,
    dataContrato:      "2023-09-01",
    periodoMeses:      36,
  },
  taxaBCB: { codigoSerie: 20719, tipoCredito: "pessoal", data: "09/2023", taxaMensal: 2.82, taxaAnual: 39.71 },
  resultado: {
    valorOriginal:     18500,
    valorCorrigido:    32104.20,
    diferencaAbusiva:  6347.80,
    percentualExcesso: 54.26,
    taxaCobrada:       4.35,
    taxaMediaBCB:      2.82,
    periodoMeses:      36,
    status:            "POTENCIALMENTE_ABUSIVO",
  },
  geradoEm: new Date().toISOString(),
};

const brl  = v => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct  = (v, d=4) => `${v.toFixed(d)}%`;
const fmtD = iso => new Date(iso).toLocaleDateString("pt-BR", { day:"2-digit", month:"long", year:"numeric" });
const fmtMY= iso => new Date(iso).toLocaleDateString("pt-BR", { month:"long", year:"numeric" });

// ─── Paleta ───────────────────────────────────────────────────────────────────

const C = {
  primary:"#1B4F72",  accent:"#2E86C1",   accentL:"#AED6F1",
  dark:"#1C2833",     success:"#1E8449",  successL:"#D5F5E3",
  warning:"#B7770D",  warningL:"#FEF9E7", danger:"#C0392B",
  dangerL:"#FADBD8",  gray:"#5D6D7E",     lightGray:"#CCD1D1",
  bgGray:"#F4F6F7",   bgBlue:"#EBF5FB",   white:"#FFFFFF",
  text:"#1C2833",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const W = 595.28, H = 841.89;
const MARGIN  = 36;
const CW      = W - MARGIN * 2;  // ≈ 523px
const TOTAL   = 8;
const HEADER_H = 44;
const FOOTER_H = 26;
const BODY_TOP = HEADER_H + 10;
const BODY_BOT = H - FOOTER_H - 6;
// bottom:0 → desabilita auto-page-break do PDFKit; páginas adicionadas manualmente.
const PAGE_OPTS = { margins: { top: 0, bottom: 0, left: MARGIN, right: MARGIN } };

const F = { h1: 11, h2: 9, body: 8, small: 7, label: 7.5, mono: 7.5 };
const S = { sect: 14, row: 12.5, gap: 5, para: 4 };

// ─── Primitivos ───────────────────────────────────────────────────────────────

function cabecalho(doc, titulo, pag) {
  doc.rect(0, 0, W, HEADER_H).fill(C.primary);
  doc.rect(0, HEADER_H - 3, W, 3).fill(C.accent);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(13)
    .text("AuditCrédito", MARGIN, 12, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(6.5)
    .text("Laudo Técnico de Auditoria de Crédito", MARGIN, 27, { lineBreak: false });
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
    .text(titulo, MARGIN, 13, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(F.small)
    .text(`Pág. ${pag} / ${TOTAL}`, MARGIN, 28, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.text);
  doc.y = BODY_TOP;
}

function rodape(doc, id) {
  const y = H - FOOTER_H;
  doc.rect(0, y, W, FOOTER_H).fill(C.bgGray);
  doc.rect(0, y, W, 1).fill(C.lightGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(6)
    .text(
      `Documento informativo — não constitui parecer jurídico ou financeiro.  ·  ID: ${id.slice(0,12).toUpperCase()}  ·  AuditCrédito  ·  Fonte BCB: api.bcb.gov.br`,
      MARGIN, y + 9, { width: CW, align: "center", lineBreak: false }
    );
}

function sec(doc, titulo, cor = C.primary) {
  if (doc.y >= BODY_BOT - 22) return;
  const y = doc.y;
  doc.rect(MARGIN, y, CW, S.sect).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
    .text(titulo.toUpperCase(), MARGIN + 6, y + 3.5, { lineBreak: false });
  doc.fillColor(C.text);
  doc.y = y + S.sect + 4;
}

function par(doc, texto, fs = F.body, w = CW, x = MARGIN) {
  if (!texto?.trim() || doc.y >= BODY_BOT - 12) return;
  doc.font("Helvetica").fontSize(fs).fillColor(C.text)
    .text(texto.trim(), x, doc.y, { width: w, align: "justify" });
  doc.y += S.para;
}

function pars(doc, texto, fs = F.body, w = CW, x = MARGIN) {
  if (!texto?.trim()) return;
  for (const p of texto.split(/\n\n+/).filter(s => s.trim())) par(doc, p, fs, w, x);
}

function row(doc, label, valor, alt, w = CW, x = MARGIN) {
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

function box(doc, texto, corBorda, corFundo, fs = F.body, w = CW, x = MARGIN) {
  if (doc.y >= BODY_BOT - 28) return;
  const h = Math.max(20, Math.ceil((texto.length / ((w - 18) / (fs * 0.55))) + 1) * (fs + 3) + 8);
  const y = doc.y;
  doc.rect(x, y, w, h).fill(corFundo);
  doc.rect(x, y, 3, h).fill(corBorda);
  doc.fillColor(C.text).font("Helvetica").fontSize(fs)
    .text(texto.trim(), x + 10, y + 5, { width: w - 16, align: "justify" });
  doc.y = y + h + S.gap;
  doc.fillColor(C.text);
}

function badge(doc, texto, cor, h = 22) {
  const y = doc.y;
  doc.rect(MARGIN, y, CW, h).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
    .text(texto, MARGIN, y + (h - F.h2) / 2, { width: CW, align: "center", lineBreak: false });
  doc.y = y + h + S.gap;
  doc.fillColor(C.text);
}

function itemBullet(doc, texto, cor = C.accent, x = MARGIN, w = CW) {
  if (doc.y >= BODY_BOT - 12) return;
  const y = doc.y;
  doc.fillColor(cor).font("Helvetica-Bold").fontSize(F.body).text("•", x + 2, y, { lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.body).text(texto, x + 12, y, { width: w - 14 });
  doc.y += 2;
}

function itemNum(doc, n, texto, cor = C.accent, x = MARGIN, w = CW) {
  if (doc.y >= BODY_BOT - 16) return;
  const y = doc.y;
  doc.rect(x, y, 16, 14).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
    .text(String(n), x, y + 2.5, { width: 16, align: "center", lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
    .text(texto, x + 20, y, { width: w - 22 });
  doc.y += 2;
}

// ─── NVIDIA NIM — análise IA ─────────────────────────────────────────────────

async function gerarAnaliseIA() {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY não configurado");

  const d = DADOS, r = d.resultado;
  const difPP = (r.taxaCobrada - r.taxaMediaBCB).toFixed(4);
  const taxaAnual = ((Math.pow(1 + r.taxaCobrada/100, 12) - 1)*100).toFixed(2);

  const prompt = `Você é Dr. Roberto Fonseca, advogado sênior com 20 anos de experiência em direito bancário e do consumidor no Brasil.

DADOS REAIS DO CASO:
Cliente: ${d.nome}
Banco: ${d.instituicao}
Modalidade: Crédito Pessoal
Principal: ${brl(r.valorOriginal)}
Taxa cobrada: ${pct(r.taxaCobrada,4)} a.m. (${taxaAnual}% a.a.)
Taxa BCB (SGS ${d.taxaBCB.codigoSerie}): ${pct(r.taxaMediaBCB,4)} a.m.
Excesso: ${pct(r.percentualExcesso,2)} (${difPP}pp ao mês)
Diferença total: ${brl(r.diferencaAbusiva)} em ${r.periodoMeses} meses
Referência: ${fmtMY(d.contrato.dataContrato)}

RETORNE SOMENTE JSON VÁLIDO:
{
  "diagnostico": "4-5 frases técnicas: ${d.nome}, ${d.instituicao}, taxa ${pct(r.taxaCobrada,4)} vs BCB ${pct(r.taxaMediaBCB,4)}, excesso ${pct(r.percentualExcesso,2)}, diferença ${brl(r.diferencaAbusiva)}, impacto prático",
  "riscoJuridico": "ALTO — justificativa específica 1 frase baseada nos dados reais",
  "nivelRisco": "ALTO",
  "probabilidadeSucesso": "ALTA (75-85%) — justificativa específica para este caso",
  "fundamentacaoLegal": "PARÁGRAFO 1: Súmula 382/STJ, CDC arts. 6ºV 39V 51IV, Res. BCB 4.197/2013.\\n\\nPARÁGRAFO 2: Súmula 297/STJ, REsp 1.061.530/RS, jurisprudência sobre crédito pessoal.\\n\\nPARÁGRAFO 3: Como ${d.nome} usa o excesso de ${pct(r.percentualExcesso,2)} como argumento vs ${d.instituicao}.",
  "precedentesJudiciais": [
    "STJ — Súmula 297: CDC aplicável a instituições financeiras — fundamento para revisão de contrato bancário",
    "STJ — REsp 1.061.530/RS (Recurso Repetitivo): taxas podem ser revistas quando comprovada onerosidade excessiva vs. médias BCB",
    "STJ — Súmula 382: comparação com média BCB é critério adequado para avaliação de abusividade em crédito pessoal"
  ],
  "direitosConsumidor": [
    "Direito à informação plena: art. 6º, III, CDC — ${d.instituicao} devia ter informado o CET antes da contratação",
    "Direito à revisão de cláusulas onerosas: art. 6º, V, CDC — taxa ${pct(r.taxaCobrada,2)} vs média ${pct(r.taxaMediaBCB,2)} é desproporcional",
    "Proteção contra vantagem excessiva: art. 39, V, CDC — excesso de ${pct(r.percentualExcesso,2)} configura vantagem manifestamente excessiva",
    "Nulidade de cláusulas abusivas: art. 51, IV, CDC — cláusulas de taxa desproporcionais são nulas de pleno direito",
    "Acesso à ouvidoria obrigatória: Res. BCB 4.433/2015 — ${d.instituicao} tem 10 dias úteis para responder"
  ],
  "impactoFinanceiro": "PARÁGRAFO 1: O que ${brl(r.diferencaAbusiva)} representa concretamente para ${d.nome} — salários mínimos equivalentes, meses de pagamento, poder de compra alternativo.\\n\\nPARÁGRAFO 2: Como ${difPP}pp ao mês se transformam em ${brl(r.diferencaAbusiva)} em ${r.periodoMeses} meses pelo efeito exponencial dos juros compostos.",
  "cenarioRestituicao": "PARÁGRAFO 1: O que é possível conseguir com ${d.instituicao} — abatimento no saldo, devolução de valores pagos a mais, redução de parcelas futuras.\\n\\nPARÁGRAFO 2: Vias disponíveis em ordem: negociação direta, ouvidoria, consumidor.gov.br, Procon, JEC (sem advogado até 40 salários mínimos), ação judicial.",
  "estrategiaCompleta": "PARÁGRAFO 1: Perfil de ${d.instituicao} em negociações de crédito pessoal.\\n\\nPARÁGRAFO 2: Abordagem inicial recomendada e linguagem eficaz.\\n\\nPARÁGRAFO 3: Como escalar se sem resposta em 10 dias.\\n\\nPARÁGRAFO 4: Argumento irrefutável usando os dados oficiais do BCB.",
  "roteirNegociacao": "(1) Abertura: como se identificar e pedir setor de renegociação.\\n\\n(2) Apresentação: como mencionar os dados BCB de forma simples e impactante.\\n\\n(3) Objeção taxa contratual: resposta com base no CDC.\\n\\n(4) Objeção não podemos alterar: como mencionar direito de revisão e órgãos.\\n\\n(5) Escalada: como pedir supervisor e protocolo formal.\\n\\n(6) Encerramento: protocolo, nome do atendente, prazo de retorno.",
  "canaisRecomendados": [
    "${d.instituicao} — SAC / Retenção: consultar número no verso do cartão ou site — solicitar revisão de taxa de crédito pessoal com base em dados BCB",
    "${d.instituicao} — Ouvidoria: site oficial (Fale Conosco > Ouvidoria) — prazo obrigatório 10 dias úteis — apresentar protocolo SAC + dados BCB",
    "consumidor.gov.br: categoria Crédito e Financiamento > Taxas — mencionar diferença de ${brl(r.diferencaAbusiva)} e série BCB ${d.taxaBCB.codigoSerie}",
    "Banco Central — Ouvidoria (bcb.gov.br/acessoinformacao/ouvidoria) — usar se banco não resolver — reportar descumprimento regulatório"
  ],
  "acoes7Dias": [
    "Reunir: contrato assinado, extratos dos últimos 3 meses, todos os comprovantes de pagamento e CET se disponível",
    "Contato formal com ${d.instituicao}: ligar para SAC, solicitar revisão da taxa, registrar protocolo de atendimento",
    "Abrir reclamação no consumidor.gov.br contra ${d.instituicao} com os dados BCB e diferença de ${brl(r.diferencaAbusiva)}"
  ],
  "acoes30Dias": [
    "Se sem resposta em 10 dias: acionar ouvidoria do ${d.instituicao} com o protocolo do SAC",
    "Documentar tudo: prints de conversas, datas, nomes de atendentes, protocolo de cada canal",
    "Consultar Procon estadual presencialmente ou online com todos os documentos"
  ],
  "acoes90Dias": [
    "JEC: protocolar ação com valor de causa ${brl(r.diferencaAbusiva)} — apresentar laudo + extratos + protocolos como prova",
    "Advogado especializado em direito bancário: buscar via OAB, solicitar honorários de êxito sem custo inicial",
    "Monitorar prescrição: contrato ${fmtMY(d.contrato.dataContrato)}, prazo de 5 anos — acompanhar com atenção"
  ],
  "alertasEspeciais": [
    "ATENÇÃO: propostas de refinanciamento do banco podem parecer vantajosas mas geralmente aumentam o prazo e o total — compare sempre o CET completo",
    "PRAZO CRÍTICO: prescrição de 5 anos conta a partir de cada pagamento — pagamentos mais antigos podem perder proteção judicial",
    "CUIDADO: nunca assine documento com cláusula de quitação de obrigações sem revisar cada linha com atenção",
    "DOCUMENTAÇÃO: solicite ao ${d.instituicao} o extrato completo com amortização mês a mês — direito garantido pela Res. BCB 3.517/2007",
    "SCORE: registrar reclamações em órgãos reguladores NÃO afeta negativamente o score de crédito — é um direito"
  ],
  "prazosCriticos": "Prescrição revisional: 5 anos (CDC art. 27 / CC art. 206 §5º I) a partir de cada pagamento. Ouvidoria: 10 dias úteis obrigatórios (Res. BCB 4.433/2015). consumidor.gov.br: 10 dias corridos. Procon: mediação em 30-60 dias. JEC: sentença em 6-18 meses. Contrato de ${fmtMY(d.contrato.dataContrato)}: monitorar prazo prescricional.",
  "estimativaEconomia": "Com base na diferença comprovada de ${brl(r.diferencaAbusiva)} (excesso de ${pct(r.percentualExcesso,2)} sobre a taxa BCB de ${pct(r.taxaMediaBCB,4)} a.m.), o potencial de recuperação mediante negociação com ${d.instituicao} ou ação no JEC pode chegar a ${brl(r.diferencaAbusiva)}, dependendo da via escolhida.",
  "geradoPor": "NVIDIA NIM — meta/llama-3.3-70b-instruct"
}

REGRAS ABSOLUTAS: JSON válido APENAS. Números reais. alertasEspeciais=5. precedentesJudiciais=3. direitosConsumidor=5. acoes*=3 cada. canaisRecomendados=4.`;

  const resp = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.25, max_tokens: 4096, top_p: 0.9,
    }),
  });

  if (!resp.ok) throw new Error(`NVIDIA API ${resp.status}: ${await resp.text()}`);
  const json = await resp.json();
  const raw  = json.choices?.[0]?.message?.content ?? "";
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("JSON não encontrado na resposta IA");
  return JSON.parse(match[0]);
}

// ─── Geração do PDF v4 ────────────────────────────────────────────────────────

function gerarPDF(ai) {
  return new Promise((resolve, reject) => {
    const d   = DADOS;
    const r   = d.resultado;
    const doc = new PDFDocument({ size: "A4", ...PAGE_OPTS, bufferPages: true });
    const chunks = [];
    doc.on("data", c => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const taxaAnualCobr  = ((Math.pow(1 + r.taxaCobrada/100, 12) - 1)*100).toFixed(2);
    const valorCobrado   = r.valorOriginal * Math.pow(1 + r.taxaCobrada/100, r.periodoMeses);
    const riscoColor     = { ALTO: C.danger, MÉDIO: C.warning, BAIXO: C.success }[ai.nivelRisco] ?? C.warning;
    const statusCor      = { POTENCIALMENTE_ABUSIVO: C.danger, ACIMA_DA_MEDIA: C.warning, DENTRO_DA_MEDIA: C.success }[r.status];
    const statusLabel    = { POTENCIALMENTE_ABUSIVO:"POTENCIALMENTE ACIMA DA MÉDIA", ACIMA_DA_MEDIA:"ACIMA DA MÉDIA", DENTRO_DA_MEDIA:"DENTRO DA MÉDIA" }[r.status];

    // ════════════════════════════════════════════════════
    // P1 — CAPA
    // ════════════════════════════════════════════════════

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
        MARGIN, 95, { width: CW, align: "center", lineBreak: false });

    doc.y = 152;

    // Dados cliente 2 colunas
    const COL1W = CW * 0.52, COL2W = CW - COL1W - 8, COL2X = MARGIN + COL1W + 8;
    const cardH = 88, cardY = doc.y;
    doc.rect(MARGIN, cardY, COL1W, cardH).fill(C.bgGray);
    doc.rect(MARGIN, cardY, 3, cardH).fill(C.accent);
    doc.rect(COL2X, cardY, COL2W, cardH).fill(C.bgGray);
    doc.rect(COL2X, cardY, 3, cardH).fill(C.primary);

    const info1 = [["Cliente", d.nome],["Instituição", d.instituicao],["Modalidade", "Crédito Pessoal"],["Valor financiado", brl(r.valorOriginal)],["Período", r.periodoMeses+" meses"]];
    const info2 = [["Data referência", fmtMY(d.contrato.dataContrato)],["Data da análise", fmtD(d.geradoEm)],["Série BCB (SGS)", String(d.taxaBCB.codigoSerie)],["Taxa referência", pct(r.taxaMediaBCB,4)+" a.m."],["ID do laudo", d.id.slice(0,10).toUpperCase()]];

    let ry = cardY + 8;
    for (const [lbl, val] of info1) {
      doc.fillColor(C.gray).font("Helvetica").fontSize(F.small).text(lbl+":", MARGIN+7, ry, { lineBreak:false });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small).text(val, MARGIN+7, ry, { width:COL1W-12, align:"right", lineBreak:false });
      ry += 15;
    }
    ry = cardY + 8;
    for (const [lbl, val] of info2) {
      doc.fillColor(C.gray).font("Helvetica").fontSize(F.small).text(lbl+":", COL2X+7, ry, { lineBreak:false });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small).text(val, COL2X+7, ry, { width:COL2W-12, align:"right", lineBreak:false });
      ry += 15;
    }
    doc.y = cardY + cardH + 8;

    // KPI 3 boxes
    const kpiH = 60, kpiW = (CW - 12) / 3, kpiY = doc.y;
    const kpis = [
      ["TAXA COBRADA", pct(r.taxaCobrada,2)+" a.m.", taxaAnualCobr+"% a.a. efetivo", C.danger],
      ["TAXA BCB (REFERÊNCIA)", pct(r.taxaMediaBCB,2)+" a.m.", d.taxaBCB.data+" · SGS "+d.taxaBCB.codigoSerie, C.success],
      ["DIFERENÇA APURADA", brl(r.diferencaAbusiva), pct(r.percentualExcesso,2)+" de excesso", C.warning],
    ];
    for (let i=0; i<3; i++) {
      const [t,v,s,cor] = kpis[i], kx = MARGIN + i*(kpiW+6);
      doc.rect(kx, kpiY, kpiW, kpiH).fill(cor);
      doc.fillColor(C.white).font("Helvetica").fontSize(6).text(t, kx+7, kpiY+7, { width:kpiW-14, lineBreak:false });
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(14).text(v, kx+7, kpiY+18, { width:kpiW-14, lineBreak:false });
      doc.fillColor("#FFFFFF99").font("Helvetica").fontSize(5.5).text(s, kx+7, kpiY+46, { width:kpiW-14, lineBreak:false });
    }
    doc.y = kpiY + kpiH + 7;

    badge(doc, "RESULTADO: " + statusLabel, statusCor, 24);

    // O que está no laudo (2 cols)
    sec(doc, "O que Está Neste Laudo");
    const C1X = MARGIN, C1W = CW*0.5-4, C2Xx = MARGIN+CW*0.5+4, C2Wx = CW*0.5-4;
    const items1 = ["Comparativo visual de taxas (BCB vs cobrada)","Cálculo de juros compostos M = P × (1+i)ⁿ","Diagnóstico jurídico personalizado por IA","Fundamentação legal (CDC, STJ, BCB)"];
    const items2 = ["Roteiro de negociação com o banco","Plano de ação em 3 fases (7, 30 e 90 dias)","Alertas específicos do seu caso","Modelo de Requerimento Administrativo"];
    const conY = doc.y;
    for (const t of items1) itemBullet(doc, t, C.accent, C1X, C1W);
    const endC1 = doc.y;
    doc.y = conY;
    for (const t of items2) itemBullet(doc, t, C.primary, C2Xx, C2Wx);
    doc.y = Math.max(endC1, doc.y) + 4;

    // Disclaimer
    const discY = doc.y;
    doc.rect(MARGIN, discY, CW, 40).fill(C.bgGray);
    doc.fillColor(C.gray).font("Helvetica").fontSize(6.5)
      .text("DOCUMENTO INFORMATIVO — Este laudo não constitui parecer jurídico, contábil ou financeiro. " +
        "A análise compara a taxa informada com a taxa média divulgada mensalmente pelo Banco Central do Brasil para a mesma modalidade. " +
        "As orientações têm caráter exclusivamente educacional. Para ações legais formais, consulte um advogado especializado.",
        MARGIN+8, discY+8, { width:CW-16, align:"justify" });
    doc.y = discY + 48;

    // Garantia
    const garY = doc.y;
    doc.rect(MARGIN, garY, CW, 26).fill(C.successL);
    doc.rect(MARGIN, garY, 3, 26).fill(C.success);
    doc.fillColor(C.success).font("Helvetica-Bold").fontSize(F.body)
      .text("Garantia de 7 dias:", MARGIN+10, garY+4, { lineBreak:false });
    doc.fillColor(C.dark).font("Helvetica").fontSize(F.body)
      .text(" Se por qualquer motivo não ficar satisfeito, solicite reembolso integral em até 7 dias corridos — sem perguntas.",
        MARGIN+10, garY+4, { width:CW-18 });

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P2 — DIAGNÓSTICO FINANCEIRO
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Diagnóstico Financeiro", 2);

    sec(doc, "Comparativo Visual de Taxas — Dados Oficiais Banco Central do Brasil");
    const BAR_L = 150, BAR_V = 80, BAR_A = CW - BAR_L - BAR_V;
    const maxT  = Math.max(r.taxaCobrada, r.taxaMediaBCB) * 1.15;
    const barras = [
      ["Taxa cobrada — "+d.instituicao, parseFloat(taxaAnualCobr).toFixed(2)+"% ao ano efetivo", r.taxaCobrada, C.danger],
      ["Taxa média BCB — Crédito Pessoal", "Série SGS "+d.taxaBCB.codigoSerie+" · "+d.taxaBCB.data, r.taxaMediaBCB, C.success],
      ["Excesso sobre a média BCB", pct(r.percentualExcesso,2)+" acima da referência", r.taxaCobrada - r.taxaMediaBCB, C.warning],
    ];
    for (const [lbl, sub, taxa, cor] of barras) {
      const bW = (taxa/maxT)*BAR_A, y = doc.y;
      doc.fillColor(C.gray).font("Helvetica").fontSize(F.label).text(lbl, MARGIN, y+2, { width:BAR_L-6, lineBreak:false });
      doc.fillColor(C.gray).font("Helvetica").fontSize(6).text(sub, MARGIN, y+12, { width:BAR_L-6, lineBreak:false });
      doc.rect(MARGIN+BAR_L, y, BAR_A, 22).fill("#EAECEE");
      doc.rect(MARGIN+BAR_L, y, bW, 22).fill(cor);
      doc.fillColor(bW > 50 ? C.white : C.text).font("Helvetica-Bold").fontSize(F.body)
        .text(pct(taxa,4)+" a.m.", MARGIN+BAR_L+BAR_A+4, y+5, { lineBreak:false });
      doc.y = y + 28; doc.fillColor(C.text);
    }
    doc.y += 3;

    // Tabela + Cálculo 2 colunas
    const TC1W = CW*0.48, TC2W = CW-TC1W-8, TC2X = MARGIN+TC1W+8;
    const tableTop = doc.y;

    // Col 1 tabela
    const s1Y = doc.y;
    doc.rect(MARGIN, s1Y, TC1W, S.sect).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
      .text("DADOS DO CONTRATO ANALISADO", MARGIN+6, s1Y+3.5, { lineBreak:false });
    doc.y = s1Y + S.sect + 4;

    const tRows = [
      ["Modalidade", "Crédito Pessoal", false],
      ["Banco / Instituição", d.instituicao, true],
      ["Valor principal (P)", brl(r.valorOriginal), false],
      ["Taxa cobrada (i)", pct(r.taxaCobrada,4)+" a.m.", true],
      ["Taxa BCB referência", pct(r.taxaMediaBCB,4)+" a.m.", false],
      ["Período (n)", r.periodoMeses+" meses", true],
      ["Data de referência", d.taxaBCB.data, false],
      ["Série SGS utilizada", String(d.taxaBCB.codigoSerie), true],
      ["Diferença de taxa", pct(r.taxaCobrada - r.taxaMediaBCB, 4)+" a.m.", false],
      ["Excesso percentual", pct(r.percentualExcesso,2), true],
    ];
    for (const [lbl, val, alt] of tRows) row(doc, lbl, val, alt, TC1W, MARGIN);
    const col1End = doc.y;

    // Col 2 cálculo
    doc.y = tableTop;
    const s2Y = doc.y;
    doc.rect(TC2X, s2Y, TC2W, S.sect).fill(C.primary);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small)
      .text("CÁLCULO — M = P × (1+i)ⁿ", TC2X+6, s2Y+3.5, { lineBreak:false });
    doc.y = s2Y + S.sect + 4;

    const fY = doc.y;
    doc.rect(TC2X, fY, TC2W, 20).fill(C.bgGray);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.body)
      .text(`P = ${brl(r.valorOriginal)}  ·  n = ${r.periodoMeses} meses`, TC2X+4, fY+5, { width:TC2W-8, align:"center", lineBreak:false });
    doc.y = fY + 26;

    const calRows = [
      ["Com taxa cobrada\n"+pct(r.taxaCobrada,4)+" a.m.", brl(valorCobrado), C.danger],
      ["Com taxa BCB\n"+pct(r.taxaMediaBCB,4)+" a.m. (justo)", brl(r.valorCorrigido), C.success],
      ["Diferença\napurada", brl(r.diferencaAbusiva), C.warning],
    ];
    for (const [lbl, val, cor] of calRows) {
      const cy = doc.y, ch = 34;
      doc.rect(TC2X, cy, TC2W, ch).fill(cor+"15");
      doc.rect(TC2X, cy, 3, ch).fill(cor);
      doc.fillColor(C.gray).font("Helvetica").fontSize(F.small).text(lbl, TC2X+8, cy+5, { width:TC2W*0.6, lineBreak:false });
      doc.fillColor(cor).font("Helvetica-Bold").fontSize(10).text(val, TC2X+8, cy+12, { width:TC2W-14, align:"right", lineBreak:false });
      doc.y = cy + ch + 3; doc.fillColor(C.text);
    }

    // Prazo prescricional
    const presc = new Date(d.contrato.dataContrato);
    presc.setFullYear(presc.getFullYear() + 5);
    const prescStr = presc.toLocaleDateString("pt-BR", { month:"long", year:"numeric" });
    const noteY = doc.y;
    doc.rect(TC2X, noteY, TC2W, 22).fill(C.dangerL);
    doc.rect(TC2X, noteY, 3, 22).fill(C.danger);
    doc.fillColor(C.danger).font("Helvetica-Bold").fontSize(F.small)
      .text("PRAZO PRESCRICIONAL:", TC2X+7, noteY+4, { lineBreak:false });
    doc.fillColor(C.text).font("Helvetica").fontSize(F.small)
      .text(" 5 anos — vence aprox. "+prescStr, TC2X+7, noteY+14, { width:TC2W-14, lineBreak:false });
    doc.y = noteY + 28;

    const stats = [
      ["Diferença/mês média", brl(r.diferencaAbusiva / r.periodoMeses)],
      ["Taxa anual cobrada", parseFloat(taxaAnualCobr).toFixed(2)+"% a.a."],
    ];
    for (let i=0; i<stats.length; i++) row(doc, stats[i][0], stats[i][1], i%2===0, TC2W, TC2X);

    doc.y = Math.max(col1End, doc.y) + 5;
    badge(doc, "STATUS: "+statusLabel+"  ·  Excesso de "+pct(r.percentualExcesso,2)+" sobre a taxa BCB", statusCor, 22);

    sec(doc, "Interpretação dos Dados");
    par(doc, `A diferença de ${pct(r.taxaCobrada - r.taxaMediaBCB, 4)} a.m. entre a taxa cobrada (${pct(r.taxaCobrada,4)} a.m.) e a taxa média BCB (${pct(r.taxaMediaBCB,4)} a.m.) resultou em ${brl(r.diferencaAbusiva)} a mais ao longo de ${r.periodoMeses} meses. Pelos critérios do STJ (REsp 1.061.530/RS) e do CDC (art. 39, V), taxas significativamente superiores à média de mercado constituem fundamento para pedido de revisão contratual. A fonte dos dados é a API pública do Banco Central do Brasil (SGS, série ${d.taxaBCB.codigoSerie}) — governamental e verificável.`, F.body);

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P3 — LAUDO JURÍDICO PARTE 1
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Laudo Jurídico — Parte 1", 3);

    // Risco + probabilidade lado a lado
    const rH = 30, rY = doc.y;
    const rW1 = CW*0.58, rW2 = CW-rW1-6, rX2 = MARGIN+rW1+6;
    doc.rect(MARGIN, rY, rW1, rH).fill(riscoColor);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.h2)
      .text("RISCO JURÍDICO: "+ai.riscoJuridico, MARGIN+6, rY+5, { width:rW1-10, lineBreak:false });
    doc.rect(rX2, rY, rW2, rH).fill(C.bgBlue);
    doc.rect(rX2, rY, 3, rH).fill(C.accent);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.small)
      .text("Prob. de Êxito: "+ai.probabilidadeSucesso, rX2+8, rY+5, { width:rW2-12, lineBreak:false });
    doc.y = rY + rH + 6;

    sec(doc, "Diagnóstico Técnico do Caso");
    pars(doc, ai.diagnostico, F.body);

    sec(doc, "Fundamentação Jurídica Aplicável");
    pars(doc, ai.fundamentacaoLegal, F.body);

    sec(doc, "Precedentes Judiciais Relevantes");
    for (let i=0; i<(ai.precedentesJudiciais||[]).length; i++) {
      const py = doc.y;
      const ph = Math.max(22, Math.ceil(ai.precedentesJudiciais[i].length/72)*(F.body+3)+10);
      doc.rect(MARGIN, py, CW, ph).fill(i%2===0 ? C.bgGray : C.white);
      doc.rect(MARGIN, py, 3, ph).fill(C.primary);
      doc.rect(MARGIN+3, py, 18, ph).fill(C.primary+"22");
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
        .text(String(i+1), MARGIN+3, py+(ph-F.label)/2, { width:18, align:"center", lineBreak:false });
      doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
        .text(ai.precedentesJudiciais[i], MARGIN+24, py+5, { width:CW-28 });
      doc.y = py + ph + 3; doc.fillColor(C.text);
    }

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P4 — LAUDO JURÍDICO PARTE 2
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Laudo Jurídico — Parte 2", 4);

    // Direitos 2 colunas
    sec(doc, "Direitos do Consumidor Identificados Neste Caso");
    const dir = ai.direitosConsumidor || [];
    const half = Math.ceil(dir.length/2);
    const dC1X = MARGIN, dC1W = CW*0.5-4, dC2X = MARGIN+CW*0.5+4, dC2W = CW*0.5-4;
    const startDir = doc.y;
    for (let i=0; i<half; i++) itemNum(doc, i+1, dir[i], C.primary, dC1X, dC1W);
    const endD1 = doc.y;
    doc.y = startDir;
    for (let i=half; i<dir.length; i++) itemNum(doc, i+1, dir[i], C.accent, dC2X, dC2W);
    doc.y = Math.max(endD1, doc.y) + 6;

    sec(doc, "Impacto Financeiro Detalhado");
    pars(doc, ai.impactoFinanceiro, F.body);

    sec(doc, "Cenários de Restituição e Recuperação");
    pars(doc, ai.cenarioRestituicao, F.body);

    const econY = doc.y;
    const econH = Math.max(28, Math.ceil(ai.estimativaEconomia.length/80)*(F.body+3)+12);
    doc.rect(MARGIN, econY, CW, econH).fill(C.successL);
    doc.rect(MARGIN, econY, 3, econH).fill(C.success);
    doc.fillColor(C.success).font("Helvetica-Bold").fontSize(F.label).text("ESTIMATIVA DE ECONOMIA:", MARGIN+8, econY+5, { lineBreak:false });
    doc.fillColor(C.dark).font("Helvetica").fontSize(F.body).text(ai.estimativaEconomia, MARGIN+8, econY+16, { width:CW-16 });
    doc.y = econY + econH + 6;

    // Vias disponíveis
    sec(doc, "Vias de Contestação — Da Mais Simples à Mais Formal");
    const vias = [
      ["1ª via", "Negociação direta",      "SAC/app do banco · resultado em até 30 dias · sem custo", C.success],
      ["2ª via", "Ouvidoria do banco",     "Obrigatória por lei · 10 dias úteis · gratuita", C.success],
      ["3ª via", "consumidor.gov.br",      "Registro online · 10 dias corridos para resposta", C.accent],
      ["4ª via", "Procon estadual",        "Mediação gratuita · 30-60 dias", C.accent],
      ["5ª via", "JEC (Juizado Especial)", "Sem advogado até 40 sal. mín. · sentença em 6-18 meses", C.warning],
      ["6ª via", "Ação judicial",          "Com advogado · para valores elevados · 1-4 anos", C.warning],
    ];
    for (let i=0; i<vias.length; i++) {
      const [num,nome,desc,cor] = vias[i], vy = doc.y, vh = 17;
      doc.rect(MARGIN, vy, CW, vh).fill(i%2===0 ? C.bgGray : C.white);
      doc.rect(MARGIN, vy, 28, vh).fill(cor);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.small).text(num, MARGIN, vy+4, { width:28, align:"center", lineBreak:false });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small).text(nome, MARGIN+32, vy+4, { width:110, lineBreak:false });
      doc.fillColor(C.gray).font("Helvetica").fontSize(F.small).text(desc, MARGIN+146, vy+4, { width:CW-150, lineBreak:false });
      doc.y = vy + vh + 1; doc.fillColor(C.text);
    }

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P5 — ESTRATÉGIA DE NEGOCIAÇÃO
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Estratégia de Negociação", 5);

    sec(doc, "Estratégia Personalizada para Este Caso");
    pars(doc, ai.estrategiaCompleta, F.body);
    doc.y += 3;

    sec(doc, "Canais Recomendados — Por Ordem de Eficácia");
    const canais = ai.canaisRecomendados || [];
    const canaisCores = [C.primary, C.accent, C.warning, C.success];
    const GW = (CW-6)/2, GH_BASE = 62;
    for (let i=0; i<Math.min(4,canais.length); i+=2) {
      const gy = doc.y;
      for (let j=0; j<2; j++) {
        const idx = i+j;
        if (idx >= canais.length) break;
        const gx = MARGIN + j*(GW+6), cor = canaisCores[idx%4], txt = canais[idx];
        const gh = Math.max(GH_BASE, Math.ceil(txt.length/48)*(F.body+2.5)+24);
        doc.rect(gx, gy, GW, gh).fill(C.bgGray);
        doc.rect(gx, gy, GW, 18).fill(cor);
        doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.label).text(`${idx+1}º CANAL`, gx+7, gy+4, { lineBreak:false });
        doc.fillColor(C.text).font("Helvetica").fontSize(F.body).text(txt, gx+7, gy+23, { width:GW-14 });
      }
      doc.y = gy + GH_BASE + (canais[i]?.length > 220 ? 20 : 0) + 6;
      doc.fillColor(C.text);
    }

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P6 — ROTEIRO DE NEGOCIAÇÃO
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Roteiro de Negociação", 6);

    const instY6 = doc.y;
    doc.rect(MARGIN, instY6, CW, 18).fill(C.bgBlue);
    doc.rect(MARGIN, instY6, 3, 18).fill(C.accent);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.small)
      .text("Use este roteiro ao ligar ou ir pessoalmente ao banco. Adapte com seus dados (nome, contrato, CPF).", MARGIN+8, instY6+4, { lineBreak:false });
    doc.y = instY6 + 22;

    sec(doc, "Script Completo — Diálogo de Negociação com o Banco");
    const roteiro = ai.roteirNegociacao || "";
    const secoes  = roteiro.split(/(?=\(\d+\)|\d+\.\s)/).filter(s => s.trim());

    if (secoes.length > 1) {
      for (const s of secoes) {
        const match = s.match(/^[(\[]?(\d+)[)\.]?\s*(.*)/s);
        if (match) {
          const num = match[1], cont = match[2].trim();
          const y = doc.y, sh = Math.max(22, Math.ceil(cont.length/74)*(F.body+2)+10);
          doc.rect(MARGIN, y, CW, sh).fill(parseInt(num)%2===0 ? C.bgGray : C.white);
          doc.rect(MARGIN, y, 3, sh).fill(C.primary);
          doc.rect(MARGIN+3, y, 20, sh).fill(C.primary+"18");
          doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
            .text(num, MARGIN+3, y+(sh-F.label)/2, { width:20, align:"center", lineBreak:false });
          doc.fillColor(C.text).font("Helvetica").fontSize(F.body)
            .text(cont, MARGIN+26, y+5, { width:CW-30, align:"justify" });
          doc.y = y + sh + 2; doc.fillColor(C.text);
        } else { par(doc, s, F.body); }
      }
    } else { pars(doc, roteiro, F.body); }

    if (doc.y < BODY_BOT - 60) {
      doc.y += 4;
      sec(doc, "Prazos Críticos — Não Deixe Para Depois", C.danger);
      box(doc, ai.prazosCriticos, C.danger, C.dangerL, F.body);
    }

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P7 — PLANO DE AÇÃO
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Plano de Ação Completo", 7);

    sec(doc, "Linha do Tempo — O Que Fazer em Cada Fase");
    const fases = [
      ["SEMANA 1\nÂÇÕES URGENTES",   ai.acoes7Dias||[],  C.danger,  C.dangerL],
      ["MÊS 1\nPRIORITÁRIAS",        ai.acoes30Dias||[], C.warning, C.warningL],
      ["MESES 2-3\nCONSOLIDAÇÃO",    ai.acoes90Dias||[], C.accent,  C.bgBlue],
    ];
    const FW = (CW-10)/3;

    // Calcular alturas reais por item (evita caixas undersized)
    const lineHAcao = 10, acaoMinH = 20;
    const getAcaoH  = t => Math.max(acaoMinH, Math.ceil(t.length/36)*lineHAcao+4)+3;
    const colHeight = acoes => acoes.reduce((s,a) => s+getAcaoH(a), 0);
    const maxColH   = Math.max(...fases.map(([,a]) => colHeight(a)));
    const availH    = Math.min(maxColH, BODY_BOT - doc.y - 140);
    const totalH7   = Math.max(availH, acaoMinH*3);

    // Headers
    const hY7 = doc.y;
    for (let i=0; i<3; i++) {
      const fx = MARGIN + i*(FW+5);
      doc.rect(fx, hY7, FW, 28).fill(fases[i][2]);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(F.label)
        .text(fases[i][0], fx+5, hY7+4, { width:FW-10, align:"center" });
    }
    doc.y = hY7 + 28;

    // Fundos dos painéis
    const acaoStartY = doc.y;
    for (let i=0; i<3; i++) {
      const fx = MARGIN + i*(FW+5);
      doc.rect(fx, acaoStartY, FW, totalH7+8).fill(fases[i][3]);
    }

    // Conteúdo das ações
    for (let i=0; i<3; i++) {
      const fx = MARGIN + i*(FW+5), acoes = fases[i][1], cor = fases[i][2];
      let ay = acaoStartY + 5;
      for (const acao of acoes) {
        if (ay >= BODY_BOT - 30) break;
        doc.fillColor(cor).font("Helvetica-Bold").fontSize(F.body).text("›", fx+5, ay, { lineBreak:false });
        doc.fillColor(C.text).font("Helvetica").fontSize(F.small).text(acao, fx+15, ay, { width:FW-20 });
        ay += getAcaoH(acao);
      }
    }
    doc.y = acaoStartY + totalH7 + 14; doc.fillColor(C.text);

    sec(doc, "Alertas Específicos do Seu Caso", C.danger);
    const alertas = ai.alertasEspeciais || [];
    const altCores = [C.warningL, C.bgGray];
    for (let i=0; i<alertas.length; i++) {
      const ay = doc.y, ah = Math.max(18, Math.ceil(alertas[i].length/86)*(F.body+2)+9);
      doc.rect(MARGIN, ay, CW, ah).fill(altCores[i%2]);
      doc.rect(MARGIN, ay, 3, ah).fill(C.danger);
      doc.fillColor(C.warning).font("Helvetica-Bold").fontSize(F.small).text(`! ${i+1}`, MARGIN+6, ay+4, { lineBreak:false });
      doc.fillColor(C.text).font("Helvetica").fontSize(F.body).text(alertas[i], MARGIN+24, ay+4, { width:CW-30 });
      doc.y = ay + ah + 2; doc.fillColor(C.text);
    }

    if (doc.y < BODY_BOT - 50) {
      doc.y += 4;
      sec(doc, "Prazos Críticos e Prescrição", C.danger);
      box(doc, ai.prazosCriticos, C.danger, C.dangerL, F.body);
    }

    rodape(doc, d.id);

    // ════════════════════════════════════════════════════
    // P8 — REQUERIMENTO + REFERÊNCIAS
    // ════════════════════════════════════════════════════

    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Modelo de Requerimento + Referências", 8);

    const instY8 = doc.y;
    doc.rect(MARGIN, instY8, CW, 16).fill(C.bgGray);
    doc.fillColor(C.gray).font("Helvetica").fontSize(F.small)
      .text("Preencha os campos [COLCHETES]. Envie por e-mail, app do banco ou Correios com AR. Guarde comprovante.", MARGIN+6, instY8+4, { lineBreak:false });
    doc.y = instY8 + 20;

    sec(doc, "Modelo de Requerimento Administrativo — Personalizável");

    const carta = [
      `À ${d.instituicao}`,
      `Setor de Revisão Contratual / Ouvidoria`,
      ``,
      `Ref.: Pedido de revisão de taxa de juros — Crédito Pessoal`,
      `[CIDADE], ${fmtD(d.geradoEm)}`,
      ``,
      `Eu, ${d.nome}, portador(a) do CPF nº [SEU CPF], cliente desta`,
      `instituição, venho solicitar a revisão do contrato de crédito pessoal firmado`,
      `em ${fmtMY(d.contrato.dataContrato)}, valor de ${brl(r.valorOriginal)}, taxa de ${pct(r.taxaCobrada,4)} a.m.`,
      ``,
      `Consulta à API pública do BCB (SGS ${d.taxaBCB.codigoSerie}) indica taxa média`,
      `de ${pct(r.taxaMediaBCB,4)} a.m. no período — diferença de ${pct(r.percentualExcesso,2)},`,
      `totalizando ${brl(r.diferencaAbusiva)} a mais em ${r.periodoMeses} meses.`,
      ``,
      `Com fundamento nos arts. 6º, V; 39, V; e 51, IV, do CDC (Lei 8.078/90),`,
      `aplicável por força da Súmula 297 do STJ, solicito revisão formal das`,
      `condições pactuadas e nova proposta com taxa de mercado BCB.`,
      ``,
      `Aguardo resposta em até 5 dias úteis.`,
      ``,
      `Atenciosamente,`,
      `${d.nome}   CPF: [SEU CPF]   Fone: [TELEFONE]   E-mail: [EMAIL]`,
    ];

    const lineH8 = 10.5, cartaH8 = carta.length * lineH8 + 16, cartaY8 = doc.y;
    doc.rect(MARGIN, cartaY8, CW, cartaH8).fill(C.bgGray);
    doc.rect(MARGIN, cartaY8, 3, cartaH8).fill(C.accent);
    doc.y = cartaY8 + 8;
    doc.font("Courier").fontSize(F.mono).fillColor(C.text);
    for (const linha of carta) {
      doc.text(linha === "" ? " " : linha, MARGIN+10, doc.y, { width:CW-16, lineBreak:false });
      doc.y += lineH8;
    }
    doc.y = cartaY8 + cartaH8 + 10;

    sec(doc, "Fontes e Recursos Gratuitos");
    const refs = [
      ["API do BCB (SGS)", `api.bcb.gov.br/dados/serie/bcdata.sgs.${d.taxaBCB.codigoSerie}/dados`, C.primary],
      ["consumidor.gov.br", "www.consumidor.gov.br", C.accent],
      ["Ouvidoria do BCB", "www.bcb.gov.br/acessoinformacao/ouvidoria", C.primary],
      ["Calculadora do Cidadão", "www3.bcb.gov.br/CALCJUROS/", C.accent],
      ["CDC — Lei 8.078/90", "www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm", C.success],
      ["Súmula 297 STJ", "stj.jus.br (buscar: Súmula 297)", C.success],
    ];
    const rC1W8 = CW*0.5-4, rC2W8 = CW*0.5-4, rC2X8 = MARGIN+CW*0.5+4;
    const refY8 = doc.y;
    for (let i=0; i<refs.length; i++) {
      const [lbl, url, cor] = refs[i];
      const rx = i%2===0 ? MARGIN : rC2X8, rw = i%2===0 ? rC1W8 : rC2W8;
      const ry8 = refY8 + Math.floor(i/2)*20;
      doc.rect(rx, ry8, rw, 18).fill(i%4<2 ? C.bgGray : C.white);
      doc.rect(rx, ry8, 3, 18).fill(cor);
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(F.small).text(lbl, rx+7, ry8+3, { lineBreak:false });
      doc.fillColor(C.accent).font("Helvetica").fontSize(F.small).text(url, rx+7, ry8+11, { width:rw-12, lineBreak:false });
    }
    doc.y = refY8 + Math.ceil(refs.length/2)*20 + 8;
    doc.fillColor(C.text);

    const notaY8 = doc.y;
    doc.rect(MARGIN, notaY8, CW, 34).fill(C.bgBlue);
    doc.rect(MARGIN, notaY8, 3, 34).fill(C.accent);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(F.label)
      .text("Próximos passos recomendados:", MARGIN+8, notaY8+5, { lineBreak:false });
    doc.fillColor(C.text).font("Helvetica").fontSize(F.small)
      .text("1) Reúna a documentação do contrato  ·  2) Contate o banco com os dados deste laudo  ·  3) Registre no consumidor.gov.br  ·  4) Se sem resposta em 10 dias, acione a ouvidoria",
        MARGIN+8, notaY8+16, { width:CW-16 });

    rodape(doc, d.id);
    doc.end();
  });
}

// ─── Email HTML ───────────────────────────────────────────────────────────────

function htmlEmail(nome) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F2F3F4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F3F4;padding:24px 0">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
<tr><td style="background:#1B4F72;padding:22px 36px">
  <p style="margin:0;color:#fff;font-size:18px;font-weight:700">AuditCrédito</p>
  <p style="margin:4px 0 0;color:#AED6F1;font-size:11px">Ferramenta educacional independente</p>
</td></tr>
<tr><td style="padding:28px 36px">
  <h1 style="margin:0 0 8px;color:#1C2833;font-size:18px">Seu relatório está pronto, ${nome.split(" ")[0]}!</h1>
  <p style="margin:0 0 16px;color:#5D6D7E;font-size:13px">Seu laudo de 8 páginas com análise jurídica completa está em anexo.</p>
  <div style="background:#EBF5FB;border-left:4px solid #2E86C1;padding:14px 18px;margin-bottom:20px;border-radius:4px">
    <p style="margin:0 0 8px;color:#1B4F72;font-size:12px;font-weight:700">📄 O laudo contém:</p>
    <ul style="margin:0;padding-left:18px;color:#1C2833;font-size:12px;line-height:1.9">
      <li>Comparativo visual de taxas com dados oficiais BCB</li>
      <li>Diagnóstico jurídico personalizado por IA</li>
      <li>Fundamentação legal (CDC, Súmula 297/STJ)</li>
      <li>Roteiro completo de negociação com o banco</li>
      <li>Plano de ação em 3 fases (7, 30 e 90 dias)</li>
      <li>Modelo de Requerimento Administrativo pronto para envio</li>
    </ul>
  </div>
  <div style="background:#FEF9E7;border-radius:6px;padding:12px 16px">
    <p style="margin:0;color:#D35400;font-size:11px"><strong>Garantia de 7 dias:</strong> Se não ficar satisfeito, solicite reembolso integral dentro de 7 dias corridos.</p>
  </div>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("🚀 Gerando preview AuditCrédito v4 — Layout Ultra-Denso\n");

  console.log("1️⃣  NVIDIA NIM — meta/llama-3.3-70b-instruct...");
  let ai;
  try {
    ai = await gerarAnaliseIA();
    console.log(`   ✅ Análise gerada! Risco: ${ai.nivelRisco} — Probabilidade: ${ai.probabilidadeSucesso?.slice(0,4)}`);
  } catch (err) {
    console.warn("   ⚠️  IA falhou, usando análise padrão:", err.message);
    ai = {
      diagnostico: `A análise do contrato de crédito pessoal firmado com ${DADOS.instituicao} identificou taxa de ${pct(DADOS.resultado.taxaCobrada,4)} a.m., superando em ${pct(DADOS.resultado.percentualExcesso,2)} a taxa média BCB de ${pct(DADOS.resultado.taxaMediaBCB,4)} a.m. (série SGS ${DADOS.taxaBCB.codigoSerie}). Ao longo de ${DADOS.resultado.periodoMeses} meses, a diferença resultou em ${brl(DADOS.resultado.diferencaAbusiva)} de sobrecarga financeira. O caso apresenta fundamentos para revisão com base no CDC e jurisprudência do STJ.`,
      riscoJuridico: "ALTO — excesso de "+pct(DADOS.resultado.percentualExcesso,2)+" sobre a taxa BCB constitui fundamento sólido",
      nivelRisco: "ALTO",
      probabilidadeSucesso: "ALTA (70-80%) — excesso expressivo e fundamentação jurídica sólida",
      fundamentacaoLegal: "O CDC (Lei 8.078/90), aplicável às instituições financeiras pela Súmula 297/STJ, garante revisão de cláusulas desproporcionais (art. 6º, V) e proíbe vantagem excessiva (art. 39, V).\n\nO STJ consolidou que taxas bancárias podem ser revistas quando demonstrado abuso por comparação com médias BCB (REsp 1.061.530/RS).\n\nNo caso em análise, o excesso de "+pct(DADOS.resultado.percentualExcesso,2)+" sobre a série SGS "+DADOS.taxaBCB.codigoSerie+" constitui prova documental idônea para pedido de revisão.",
      precedentesJudiciais: ["STJ — Súmula 297: CDC aplicável às instituições financeiras","STJ — REsp 1.061.530/RS: revisão possível quando comprovada onerosidade excessiva vs médias BCB","STJ — Súmula 382: comparação com média BCB é critério adequado para avaliação de abusividade"],
      direitosConsumidor: ["Direito à informação plena: art. 6º, III, CDC","Direito à revisão de cláusulas onerosas: art. 6º, V, CDC","Proteção contra vantagem excessiva: art. 39, V, CDC","Nulidade de cláusulas abusivas: art. 51, IV, CDC","Acesso à ouvidoria obrigatória: Res. BCB 4.433/2015"],
      impactoFinanceiro: `A diferença de ${brl(DADOS.resultado.diferencaAbusiva)} representa meses de pagamento que foram além do que o mercado pratica.\n\nO efeito dos juros compostos amplifica pequenas diferenças de taxa: ${pct(DADOS.resultado.taxaCobrada - DADOS.resultado.taxaMediaBCB,4)} a mais ao mês resultaram em ${brl(DADOS.resultado.diferencaAbusiva)} extras em ${DADOS.resultado.periodoMeses} meses.`,
      cenarioRestituicao: `Em negociação com ${DADOS.instituicao}, é possível obter abatimento no saldo devedor ou devolução de valores pagos a mais.\n\nVias: negociação direta, ouvidoria (10 dias úteis), consumidor.gov.br, Procon, JEC (sem advogado até 40 salários mínimos).`,
      estrategiaCompleta: `O ${DADOS.instituicao} possui estrutura formal de atendimento e responde melhor a pedidos com documentação organizada.\n\nAbordagem inicial: canal de retenção com os dados BCB em mãos, apresentar comparação de forma objetiva.\n\nEscalada: se sem resposta em 10 dias, acionar ouvidoria e consumidor.gov.br simultaneamente.\n\nArgumento central: dados oficiais do Banco Central não podem ser contestados pelo banco — use-os como âncora.`,
      roteirNegociacao: `(1) Abertura: identificar-se e pedir setor de renegociação/retenção.\n\n(2) Apresentação: mencionar dados BCB de forma simples — "a taxa média do BCB para meu crédito era ${pct(DADOS.resultado.taxaMediaBCB,2)}% e estou pagando ${pct(DADOS.resultado.taxaCobrada,2)}%".\n\n(3) Objeção taxa contratual: citar CDC e Súmula 297/STJ.\n\n(4) Objeção não podemos alterar: pedir registro formal e protocolo.\n\n(5) Escalada: solicitar supervisor e abertura de ouvidoria.\n\n(6) Encerramento: obter protocolo, nome e prazo de retorno.`,
      canaisRecomendados: [`${DADOS.instituicao} — SAC: consultar número no site ou verso do cartão`,`${DADOS.instituicao} — Ouvidoria: site oficial, prazo 10 dias úteis obrigatórios`,"consumidor.gov.br: categoria Crédito e Financiamento > Taxas","Banco Central — Ouvidoria (bcb.gov.br): se banco não resolver"],
      acoes7Dias: ["Reunir contrato, extratos e comprovantes de pagamento","Ligar para SAC do banco e registrar protocolo","Abrir reclamação no consumidor.gov.br com os dados BCB"],
      acoes30Dias: ["Acionar ouvidoria se sem resposta em 10 dias","Documentar todas as comunicações e protocolos","Consultar Procon estadual com todos os documentos"],
      acoes90Dias: ["Protocolar ação no JEC com laudo + extratos + protocolos","Buscar advogado especializado via OAB (honorários de êxito)","Monitorar prazo prescricional de 5 anos"],
      alertasEspeciais: ["ATENÇÃO: refinanciamento pode aumentar o custo total — compare sempre o CET","PRAZO: prescrição de 5 anos conta da data de cada pagamento","CUIDADO: nunca assine quitação de obrigações sem revisar","DOCUMENTAÇÃO: solicite extrato com amortização mês a mês ao banco","SCORE: reclamar em órgãos reguladores NÃO afeta negativamente o score"],
      prazosCriticos: "Prescrição: 5 anos (CDC art. 27). Ouvidoria: 10 dias úteis. consumidor.gov.br: 10 dias corridos. JEC: 6-18 meses.",
      estimativaEconomia: `Potencial de recuperação de até ${brl(DADOS.resultado.diferencaAbusiva)} mediante negociação ou ação judicial.`,
      geradoPor: "Fallback — meta/llama-3.3-70b-instruct indisponível",
    };
  }

  console.log("\n2️⃣  Gerando PDF de 8 páginas (layout ultra-denso)...");
  const pdfBuffer = await gerarPDF(ai);
  console.log(`   ✅ PDF gerado: ${(pdfBuffer.length / 1024).toFixed(1)} KB`);

  console.log("\n3️⃣  Enviando para elberagenciamkt@gmail.com via Resend...");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from:    "AuditCrédito <noreply@auditcredito.com.br>",
    to:      ["elberagenciamkt@gmail.com"],
    subject: "Preview v4 — Laudo Ultra-Denso 8 Páginas",
    html:    htmlEmail(DADOS.nome),
    attachments: [{ filename: "auditcredito-preview-v4.pdf", content: pdfBuffer }],
  });

  if (error) throw new Error("Resend error: " + JSON.stringify(error));

  console.log(`   ✅ Email enviado! ID: ${data.id}`);
  console.log(`\n🎉 Preview enviado para elberagenciamkt@gmail.com`);
  console.log(`   Layout v4: Margens 36px · Header 44px · Fontes 8px · 2 colunas`);
  console.log(`   Risco: ${ai.nivelRisco} | ${ai.probabilidadeSucesso?.slice(0,4)}`);
})();
