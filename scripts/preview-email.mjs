/**
 * preview-email.mjs — v3
 * Gera PDF de 8 páginas com análise IA (nvidia/llama-3.1-nemotron-70b-instruct)
 * e envia para elberagenciamkt@gmail.com como preview do produto final.
 *
 * Uso: node scripts/preview-email.mjs
 */

import { config }           from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath }    from "url";
import PDFDocument          from "pdfkit";
import { Resend }           from "resend";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

// ─── Dados de teste realistas ─────────────────────────────────────────────────

const DADOS = {
  id:         "preview-demo-v3",
  nome:       "Carlos Oliveira Santos",
  email:      "elberagenciamkt@gmail.com",
  instituicao:"Banco Bradesco S.A.",
  contrato: {
    tipoCredito:       "pessoal",
    valorOriginal:     18500,
    taxaMensalCobrada: 4.35,
    dataContrato:      "2023-09-01",
    periodoMeses:      36,
  },
  taxaBCB: {
    codigoSerie: 20719,
    tipoCredito: "pessoal",
    data:        "09/2023",
    taxaMensal:  2.82,
    taxaAnual:   39.71,
  },
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
const fmtD = iso => new Date(iso).toLocaleDateString("pt-BR",
               { day: "2-digit", month: "long", year: "numeric" });
const fmtMY= iso => new Date(iso).toLocaleDateString("pt-BR",
               { month: "long", year: "numeric" });

// ─── Paleta ───────────────────────────────────────────────────────────────────

const C = {
  primary:"#1B4F72", accent:"#2E86C1", accentL:"#85C1E9",
  success:"#1E8449", successL:"#EAFAF1",
  warning:"#D4750A", warningL:"#FEF9E7",
  danger:"#C0392B",  dangerL:"#FADBD8",
  gray:"#5D6D7E",    lightGray:"#D5D8DC",
  bgGray:"#F2F3F4",  bgBlue:"#EBF5FB",
  white:"#FFFFFF",   text:"#1C2833",
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const W = 595.28, H = 841.89, MARGIN = 50, CW = W - MARGIN * 2;
const TOTAL = 8;
const PAGE_OPTS = { margins: { top: 0, bottom: 40, left: MARGIN, right: MARGIN } };

// ─── Helpers PDF ──────────────────────────────────────────────────────────────

function cabecalho(doc, titulo, pag) {
  doc.rect(0, 0, W, 110).fill(C.primary);
  doc.rect(0, 104, W, 6).fill(C.accent);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(16)
    .text("AuditCrédito", MARGIN, 28, { lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
    .text("Laudo Técnico de Auditoria de Crédito", MARGIN, 50, { lineBreak: false });
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
    .text(titulo, MARGIN, 32, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
    .text(`Página ${pag} de ${TOTAL}`, MARGIN, 50, { width: CW, align: "right", lineBreak: false });
  doc.fillColor(C.text);
  doc.y = 130;
}

function rodape(doc, id) {
  const y = H - 36;
  doc.rect(0, y-4, W, 40).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(7)
    .text(`Documento informativo — não constitui parecer jurídico ou financeiro.  |  ID: ${id.toUpperCase()}  |  AuditCrédito`,
      MARGIN, y+8, { width: CW, align: "center", lineBreak: false });
  doc.fillColor(C.text);
}

function secao(doc, titulo, cor = C.primary) {
  doc.moveDown(0.4);
  const y = doc.y;
  doc.rect(MARGIN, y, CW, 22).fill(cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9.5)
    .text(titulo.toUpperCase(), MARGIN + 10, y + 6, { lineBreak: false });
  doc.fillColor(C.text);
  doc.y = y + 28;
}

function para(doc, texto, fs = 9.5) {
  if (!texto?.trim()) return;
  doc.font("Helvetica").fontSize(fs).fillColor(C.text)
    .text(texto.trim(), MARGIN, doc.y, { width: CW, align: "justify" });
  doc.moveDown(0.4);
}

function paras(doc, texto, fs = 9) {
  for (const p of texto.split(/\n\n+/).filter(x => x.trim())) para(doc, p, fs);
}

function itemNum(doc, n, txt) {
  const y = doc.y;
  doc.rect(MARGIN, y, 20, 20).fill(C.accent);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
    .text(String(n), MARGIN, y+4, { width: 20, align: "center", lineBreak: false });
  doc.fillColor(C.text).font("Helvetica").fontSize(9)
    .text(txt, MARGIN+28, y, { width: CW-28 });
  doc.moveDown(0.3);
}

function divisor(doc) {
  doc.moveDown(0.3);
  doc.rect(MARGIN, doc.y, CW, 0.5).fill(C.lightGray);
  doc.moveDown(0.4);
}

function caixa(doc, txt, corB, corF, fs=9) {
  const estH = Math.max(38, Math.ceil(txt.length/85)*13+20);
  const y = doc.y;
  doc.rect(MARGIN, y, CW, estH).fill(corF);
  doc.rect(MARGIN, y, 4, estH).fill(corB);
  doc.fillColor(C.text).font("Helvetica").fontSize(fs)
    .text(txt.trim(), MARGIN+14, y+10, { width: CW-24, align: "justify" });
  doc.y = y + estH + 8;
  doc.fillColor(C.text);
}

// ─── NVIDIA NIM — análise ultra-detalhada ─────────────────────────────────────

async function gerarAnaliseIA() {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY não configurado");

  const d = DADOS;
  const r = d.resultado;
  const difPP = (r.taxaCobrada - r.taxaMediaBCB).toFixed(4);
  const taxaAnual = ((Math.pow(1 + r.taxaCobrada/100, 12) - 1)*100).toFixed(2);

  const prompt = `Você é Dr. Roberto Fonseca, advogado sênior com 20 anos de experiência exclusiva em direito bancário e do consumidor no Brasil. Produziu mais de 8.000 laudos técnicos.

═══ DADOS REAIS DO CASO ═══

Cliente: ${d.nome}
Banco: ${d.instituicao}
Modalidade: Crédito Pessoal
Principal: R$ ${r.valorOriginal.toLocaleString("pt-BR", {minimumFractionDigits:2})}
Taxa cobrada: ${pct(r.taxaCobrada,4)} a.m. (${taxaAnual}% a.a. efetivo)
Taxa BCB (série SGS ${d.taxaBCB.codigoSerie}): ${pct(r.taxaMediaBCB,4)} a.m.
Excesso: ${pct(r.percentualExcesso,2)} acima da média BCB (${difPP}pp ao mês)
Diferença total: ${brl(r.diferencaAbusiva)} em ${r.periodoMeses} meses
Legislação: Súmula 382/STJ e Res. BCB 4.197/2013
Referência: ${fmtMY(d.contrato.dataContrato)}

RETORNE SOMENTE O JSON VÁLIDO:

{
  "diagnostico": "ESCREVA 4-5 frases técnicas precisas sobre este caso: ${d.nome}, ${d.instituicao}, taxa ${pct(r.taxaCobrada,4)} vs BCB ${pct(r.taxaMediaBCB,4)}, excesso ${pct(r.percentualExcesso,2)}, diferença ${brl(r.diferencaAbusiva)}.",
  "riscoJuridico": "ALTO — [justificativa específica 1 frase]",
  "nivelRisco": "ALTO",
  "probabilidadeSucesso": "ALTA (75-85%) — [justificativa]",
  "fundamentacaoLegal": "ESCREVA 3 PARÁGRAFOS (separados por \\n\\n): §1 Base legal: Súmula 382/STJ, CDC arts. 6ºV 39V 51IV, Res. BCB 4.197/2013. §2 Jurisprudência: Súmula 297/STJ, REsp 1.061.530/RS, precedentes STJ sobre crédito pessoal. §3 Aplicação ao caso ${d.nome} vs ${d.instituicao}: como usar o excesso de ${pct(r.percentualExcesso,2)} como argumento.",
  "precedentesJudiciais": [
    "STJ — Súmula 297: CDC aplicável a instituições financeiras — base para toda revisão de contrato bancário",
    "STJ — REsp 1.061.530/RS (Recurso Repetitivo): taxas podem ser revistas quando comprovada onerosidade excessiva vs. médias BCB",
    "STJ — Súmula 382: estipulação de juros superiores a 12% ao ano por si só não indica abusividade, mas a comparação com a média BCB é critério adequado para avaliação"
  ],
  "direitosConsumidor": [
    "Direito à informação plena: art. 6º, III, CDC — ${d.instituicao} deve ter informado o CET completo antes da contratação",
    "Direito à revisão de cláusulas onerosas: art. 6º, V, CDC — cláusulas com taxa ${pct(r.taxaCobrada,2)} vs média ${pct(r.taxaMediaBCB,2)} podem ser revistas",
    "Proteção contra vantagem excessiva: art. 39, V, CDC — excesso de ${pct(r.percentualExcesso,2)} configura vantagem manifestamente excessiva",
    "Nulidade de cláusulas abusivas: art. 51, IV, CDC — cláusulas de taxa desproporcionais são nulas de pleno direito",
    "Acesso à ouvidoria: Res. BCB 4.433/2015 — ${d.instituicao} tem prazo obrigatório de 10 dias úteis para responder"
  ],
  "impactoFinanceiro": "ESCREVA 2 PARÁGRAFOS: §1 O que ${brl(r.diferencaAbusiva)} representa na vida de ${d.nome} — salários mínimos, meses de pagamento, poder de compra. §2 Como ${difPP}pp ao mês se transformam em ${brl(r.diferencaAbusiva)} em ${r.periodoMeses} meses pelo efeito dos juros compostos.",
  "cenarioRestituicao": "ESCREVA 2 PARÁGRAFOS: §1 O que é possível conseguir com ${d.instituicao} — abatimento no saldo, devolução de valores, redução de parcelas futuras, com estimativas realistas. §2 Vias disponíveis em ordem: negociação direta, ouvidoria, consumidor.gov.br, Procon, JEC (sem advogado até 40 salários mínimos), ação judicial.",
  "estrategiaCompleta": "ESCREVA 4 PARÁGRAFOS: §1 Perfil do ${d.instituicao} em negociações de crédito pessoal. §2 Abordagem inicial recomendada. §3 Escalada se não resolver em 10 dias. §4 Como usar a comparação BCB como argumento irrefutável.",
  "roteirNegociacao": "ESCREVA SCRIPT COMPLETO 6 parágrafos numerados (1) Abertura (2) Apresentação dos dados do BCB (3) Resposta à objeção 'taxa contratual' (4) Resposta à objeção 'não podemos alterar' (5) Solicitação de escalada (6) Encerramento com protocolo.",
  "canaisRecomendados": [
    "${d.instituicao} — SAC 0800: [número] — Pedir: revisão de taxa de crédito pessoal com base em dados BCB",
    "${d.instituicao} — Ouvidoria: [site/telefone] — prazo obrigatório 10 dias úteis — apresentar protocolo SAC",
    "consumidor.gov.br — categoria 'Crédito e Financiamento > Taxas' — mencionar diferença de ${brl(r.diferencaAbusiva)} e série BCB ${d.taxaBCB.codigoSerie}",
    "Banco Central — Registrato/Ouvidoria (bcb.gov.br) — usar se ${d.instituicao} não resolver — reportar descumprimento de norma"
  ],
  "acoes7Dias": [
    "Reunir: contrato original, extratos dos últimos 3 meses, todos os comprovantes de pagamento e CET se disponível",
    "Ligar para o SAC do ${d.instituicao} e solicitar revisão da taxa — registrar o protocolo de atendimento",
    "Abrir reclamação no consumidor.gov.br contra ${d.instituicao} mencionando os dados do BCB e a diferença de ${brl(r.diferencaAbusiva)}"
  ],
  "acoes30Dias": [
    "Se sem retorno em 10 dias: acionar ouvidoria do ${d.instituicao} com o protocolo do SAC",
    "Salvar e organizar todos os registros: prints, datas, nomes de atendentes, protocolos",
    "Consultar Procon estadual com todos os documentos para mediação gratuita"
  ],
  "acoes90Dias": [
    "Protocolar ação no JEC com valor de causa ${brl(r.diferencaAbusiva)} — apresentar este laudo + extratos + protocolos como prova",
    "Buscar advogado especializado em direito bancário via OAB — honorários de êxito sem custo inicial",
    "Monitorar prazo prescricional: contrato de ${fmtMY(d.contrato.dataContrato)}, prescrição em 5 anos — acompanhar com atenção"
  ],
  "alertasEspeciais": [
    "ATENÇÃO: propostas de refinanciamento do banco podem parecer vantajosas mas aumentam o prazo total — compare sempre o CET completo",
    "PRAZO CRÍTICO: prescrição de 5 anos a partir de cada pagamento — pagamentos mais antigos perdem proteção judicial",
    "CUIDADO: nunca assine documento com cláusula de 'quitação de obrigações' sem revisar com calma",
    "DOCUMENTAÇÃO URGENTE: solicite ao ${d.instituicao} o extrato completo com amortização mês a mês — direito garantido pela Res. BCB 3.517/2007",
    "SCORE: registrar reclamações em órgãos reguladores NÃO afeta negativamente o score de crédito"
  ],
  "prazosCriticos": "Prescrição revisional: 5 anos (CDC art. 27 / CC art. 206 §5º I) a partir de cada pagamento. Ouvidoria: 10 dias úteis obrigatórios. consumidor.gov.br: 10 dias corridos. JEC: sentença em 6-18 meses. Contrato de ${fmtMY(d.contrato.dataContrato)}: monitorar prazo com atenção.",
  "estimativaEconomia": "Com base na diferença comprovada de ${brl(r.diferencaAbusiva)} (excesso de ${pct(r.percentualExcesso,2)} sobre a taxa BCB), o potencial de recuperação — por abatimento no saldo ou devolução — pode chegar a ${brl(r.diferencaAbusiva)} mediante negociação com ${d.instituicao} ou ação no JEC.",
  "geradoPor": "NVIDIA NIM — nvidia/llama-3.1-nemotron-70b-instruct"
}

REGRAS: JSON válido APENAS. Números reais: taxa ${pct(r.taxaCobrada,4)}, BCB ${pct(r.taxaMediaBCB,4)}, excesso ${pct(r.percentualExcesso,2)}, diff ${brl(r.diferencaAbusiva)}. alertasEspeciais=5 itens. precedentesJudiciais=3. direitosConsumidor=5. acoes*=3 cada. canaisRecomendados=4.`;

  const resp = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method:  "POST",
    headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
    body:    JSON.stringify({
      model:       "nvidia/llama-3.1-nemotron-70b-instruct",
      messages:    [{ role: "user", content: prompt }],
      temperature: 0.25,
      max_tokens:  4096,
      top_p:       0.9,
    }),
  });

  if (!resp.ok) throw new Error(`NVIDIA API ${resp.status}: ${await resp.text()}`);
  const json = await resp.json();
  const raw  = json.choices?.[0]?.message?.content ?? "";

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("JSON não encontrado na resposta");

  const ai = JSON.parse(match[0]);
  return ai;
}

// ─── Geração do PDF de 8 páginas ─────────────────────────────────────────────

function gerarPDF(ai) {
  return new Promise((resolve, reject) => {
    const d   = DADOS;
    const r   = d.resultado;
    const doc = new PDFDocument({ size: "A4", ...PAGE_OPTS, bufferPages: true });
    const chunks = [];
    doc.on("data", c => chunks.push(c));
    doc.on("end",  () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const taxaAnualCobr = ((Math.pow(1 + r.taxaCobrada/100, 12)-1)*100).toFixed(2);
    const riscoColor = { ALTO: C.danger, MÉDIO: C.warning, BAIXO: C.success }[ai.nivelRisco] ?? C.warning;
    const statusCor  = { POTENCIALMENTE_ABUSIVO: C.danger, ACIMA_DA_MEDIA: C.warning, DENTRO_DA_MEDIA: C.success }[r.status];
    const statusLabel= { POTENCIALMENTE_ABUSIVO: "POTENCIALMENTE ACIMA DA MÉDIA", ACIMA_DA_MEDIA: "ACIMA DA MÉDIA DE MERCADO", DENTRO_DA_MEDIA: "DENTRO DA MÉDIA DE MERCADO" }[r.status];

    // ── P1 — CAPA ──────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 180).fill(C.primary);
    doc.rect(0, 160, W, 20).fill(C.accent);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(26)
      .text("AuditCrédito", MARGIN, 40, { lineBreak: false });
    doc.fillColor(C.accentL).font("Helvetica").fontSize(10)
      .text("Ferramenta educacional independente de análise de crédito", MARGIN, 72, { lineBreak: false });
    doc.fillColor(C.white).font("Helvetica").fontSize(9)
      .text("LAUDO TÉCNICO PERSONALIZADO", MARGIN, 45, { width: CW, align: "right", lineBreak: false });
    doc.fillColor(C.accentL).font("Helvetica").fontSize(8)
      .text("Gerado com Inteligência Artificial NVIDIA NIM", MARGIN, 62, { width: CW, align: "right", lineBreak: false });

    doc.y = 210;
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
      .text("Relatório de Análise Comparativa", MARGIN, doc.y, { width: CW, align: "center" });
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(20)
      .text("de Taxas de Crédito", MARGIN, doc.y, { width: CW, align: "center" });
    doc.fillColor(C.gray).font("Helvetica").fontSize(10)
      .text("Diagnóstico jurídico e financeiro com base em dados públicos do Banco Central do Brasil",
        MARGIN, doc.y+4, { width: CW, align: "center" });

    doc.moveDown(0.8);
    doc.rect(MARGIN+60, doc.y, CW-120, 1.5).fill(C.accent);
    doc.moveDown(1.2);

    // Card de info
    const cY = doc.y;
    doc.rect(MARGIN, cY, CW, 150).fill(C.bgGray);
    doc.rect(MARGIN, cY, 4, 150).fill(C.accent);
    const linhas = [
      ["Cliente analisado",     d.nome],
      ["Instituição",           d.instituicao],
      ["Modalidade de crédito", "Crédito Pessoal"],
      ["Valor financiado",      brl(r.valorOriginal)],
      ["Período analisado",     r.periodoMeses + " meses"],
      ["Data de referência",    fmtMY(d.contrato.dataContrato)],
      ["Data da análise",       fmtD(d.geradoEm)],
      ["Identificador",         d.id.toUpperCase()],
    ];
    doc.y = cY + 12;
    for (const [label, val] of linhas) {
      doc.fillColor(C.gray).font("Helvetica").fontSize(8.5)
        .text(label + ":", MARGIN+16, doc.y, { lineBreak: false });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(8.5)
        .text(val, MARGIN+16, doc.y, { width: CW-32, align: "right", lineBreak: false });
      doc.y += 17;
    }

    // KPI boxes
    doc.moveDown(1.2);
    const kY = doc.y, kW = (CW-20)/3, kH = 72;
    const kpis = [
      ["TAXA COBRADA", pct(r.taxaCobrada,2)+" a.m.", taxaAnualCobr+"% ao ano", C.danger],
      ["TAXA BCB (REFERÊNCIA)", pct(r.taxaMediaBCB,2)+" a.m.", d.taxaBCB.data+" — SGS "+d.taxaBCB.codigoSerie, C.success],
      ["DIFERENÇA APURADA", brl(r.diferencaAbusiva), "excesso "+pct(r.percentualExcesso,2), C.warning],
    ];
    for (let i=0; i<3; i++) {
      const [t, v, s, cor] = kpis[i], kx = MARGIN + i*(kW+10);
      doc.rect(kx, kY, kW, kH).fill(cor);
      doc.fillColor(C.white).font("Helvetica").fontSize(7).text(t, kx+8, kY+8, { width: kW-16, lineBreak: false });
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(14).text(v, kx+8, kY+20, { width: kW-16, lineBreak: false });
      doc.fillColor(C.white).font("Helvetica").fontSize(7).text(s, kx+8, kY+50, { width: kW-16, lineBreak: false });
    }
    doc.y = kY + kH + 16;

    doc.rect(MARGIN, doc.y, CW, 34).fill(statusCor);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(12)
      .text("RESULTADO: " + statusLabel, MARGIN, doc.y+10, { width: CW, align: "center", lineBreak: false });
    doc.y += 50;

    doc.rect(MARGIN, doc.y, CW, 58).fill(C.bgGray);
    doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
      .text("DOCUMENTO INFORMATIVO — Este laudo não constitui parecer jurídico, contábil ou financeiro. " +
        "A análise compara a taxa informada com a taxa média pública do Banco Central do Brasil. " +
        "Para ações legais formais, consulte um advogado especializado em direito bancário.",
        MARGIN+12, doc.y+10, { width: CW-24, align: "justify" });
    rodape(doc, d.id);

    // ── P2 — DIAGNÓSTICO FINANCEIRO ────────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Diagnóstico Financeiro", 2);

    secao(doc, "Comparativo Visual de Taxas — Base: Dados Oficiais BCB");
    const BAR_L = 145, BAR_V = 75, BAR_A = CW - BAR_L - BAR_V;
    const maxT  = Math.max(r.taxaCobrada, r.taxaMediaBCB) * 1.1;
    const barras = [
      ["Taxa cobrada — " + d.instituicao, r.taxaCobrada, C.danger, taxaAnualCobr+"% ao ano efetivo"],
      ["Taxa média BCB — Crédito Pessoal", r.taxaMediaBCB, C.success, "Série SGS "+d.taxaBCB.codigoSerie+" — "+d.taxaBCB.data],
      ["Diferença (excesso)", r.taxaCobrada - r.taxaMediaBCB, C.warning, pct(r.percentualExcesso,2)+" acima da referência"],
    ];
    for (const [lbl, taxa, cor, sub] of barras) {
      const bW = (taxa/maxT)*BAR_A, y = doc.y;
      doc.fillColor(C.gray).font("Helvetica").fontSize(8.5).text(lbl, MARGIN, y+5, { width: BAR_L-8, lineBreak: false });
      doc.fillColor(C.gray).font("Helvetica").fontSize(7).text(sub, MARGIN, y+17, { width: BAR_L-8, lineBreak: false });
      doc.rect(MARGIN+BAR_L, y, BAR_A, 24).fill("#EAECEE");
      doc.rect(MARGIN+BAR_L, y, bW, 24).fill(cor);
      doc.fillColor(C.text).font("Helvetica-Bold").fontSize(9.5)
        .text(pct(taxa,4)+" a.m.", MARGIN+BAR_L+BAR_A+6, y+6, { lineBreak: false });
      doc.y = y + 32;
      doc.fillColor(C.text);
    }

    secao(doc, "Dados do Contrato Analisado");
    const tRows = [
      ["Tipo de crédito", "Crédito Pessoal", false],
      ["Banco / Instituição", d.instituicao, true],
      ["Valor principal (P)", brl(r.valorOriginal), false],
      ["Taxa cobrada (i cobrada)", pct(r.taxaCobrada,4)+" ao mês", true],
      ["Taxa BCB (i referência)", pct(r.taxaMediaBCB,4)+" ao mês", false],
      ["Período (n)", r.periodoMeses+" meses", true],
      ["Data de referência", d.taxaBCB.data, false],
      ["Série SGS/BCB utilizada", String(d.taxaBCB.codigoSerie), true],
    ];
    for (const [lbl, val, alt] of tRows) {
      if (alt) doc.rect(MARGIN, doc.y, CW, 20).fill(C.bgGray);
      const ry = doc.y+5;
      doc.fillColor(C.gray).font("Helvetica").fontSize(8.5).text(lbl, MARGIN+8, ry, { lineBreak: false });
      doc.fillColor(C.dark).font("Helvetica-Bold").fontSize(8.5)
        .text(val, MARGIN+8, ry, { width: CW-16, align: "right", lineBreak: false });
      doc.y += 22; doc.fillColor(C.text);
    }

    secao(doc, "Cálculo de Juros Compostos — M = P × (1 + i)ⁿ");
    const fY = doc.y;
    doc.rect(MARGIN, fY, CW, 30).fill(C.bgGray);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(11)
      .text(`M = ${brl(r.valorOriginal)} × (1 + i)^${r.periodoMeses}`, MARGIN, fY+8, { width: CW, align: "center", lineBreak: false });
    doc.y = fY + 38;

    const calc = [
      ["Com taxa cobrada ("+pct(r.taxaCobrada,4)+" a.m.)", brl(r.valorOriginal * Math.pow(1+r.taxaCobrada/100, r.periodoMeses)), C.danger],
      ["Com taxa BCB ("+pct(r.taxaMediaBCB,4)+" a.m.) — valor justo", brl(r.valorCorrigido), C.success],
      ["Diferença identificada", brl(r.diferencaAbusiva), C.warning],
    ];
    for (const [lbl, val, cor] of calc) {
      const ry = doc.y;
      doc.rect(MARGIN, ry, CW, 24).fill(cor+"18");
      doc.rect(MARGIN, ry, 4, 24).fill(cor);
      doc.fillColor(C.text).font("Helvetica").fontSize(9).text(lbl, MARGIN+12, ry+6, { lineBreak: false });
      doc.fillColor(cor).font("Helvetica-Bold").fontSize(11)
        .text(val, MARGIN, ry+5, { width: CW-8, align: "right", lineBreak: false });
      doc.y = ry + 30; doc.fillColor(C.text);
    }

    doc.moveDown(0.4);
    doc.rect(MARGIN, doc.y, CW, 32).fill(statusCor);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
      .text("STATUS: " + statusLabel + " — Excesso de " + pct(r.percentualExcesso,2) + " sobre a taxa BCB",
        MARGIN, doc.y+9, { width: CW, align: "center", lineBreak: false });
    doc.y += 44;
    rodape(doc, d.id);

    // ── P3 — LAUDO JURÍDICO PARTE 1 ────────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Laudo Jurídico — Parte 1", 3);

    const bY = doc.y;
    doc.rect(MARGIN, bY, CW, 36).fill(riscoColor);
    doc.fillColor(C.white).font("Helvetica-Bold").fontSize(13)
      .text("RISCO JURÍDICO: " + ai.riscoJuridico, MARGIN, bY+10, { width: CW, align: "center", lineBreak: false });
    doc.y = bY + 46;

    const pY = doc.y;
    doc.rect(MARGIN, pY, CW, 24).fill(C.bgBlue);
    doc.rect(MARGIN, pY, 4, 24).fill(C.accent);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
      .text("Probabilidade de Êxito: " + ai.probabilidadeSucesso, MARGIN+12, pY+6, { lineBreak: false });
    doc.y = pY + 34;

    secao(doc, "Diagnóstico Técnico do Caso");
    paras(doc, ai.diagnostico, 9.5);

    secao(doc, "Fundamentação Jurídica Aplicável");
    paras(doc, ai.fundamentacaoLegal, 9);

    secao(doc, "Precedentes Judiciais Relevantes");
    for (let i=0; i<(ai.precedentesJudiciais||[]).length; i++) {
      const y = doc.y;
      doc.rect(MARGIN, y, CW, 0.5).fill(C.lightGray); doc.y = y+6;
      doc.rect(MARGIN, doc.y, 24, 24).fill(C.primary);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(10)
        .text(String(i+1), MARGIN, doc.y+6, { width: 24, align: "center", lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
        .text(ai.precedentesJudiciais[i], MARGIN+32, doc.y, { width: CW-32 });
      doc.moveDown(0.3);
    }
    rodape(doc, d.id);

    // ── P4 — LAUDO JURÍDICO PARTE 2 ────────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Laudo Jurídico — Parte 2", 4);

    secao(doc, "Direitos do Consumidor Identificados Neste Caso");
    for (let i=0; i<(ai.direitosConsumidor||[]).length; i++) itemNum(doc, i+1, ai.direitosConsumidor[i]);

    divisor(doc);
    secao(doc, "Impacto Financeiro Detalhado");
    paras(doc, ai.impactoFinanceiro, 9);

    divisor(doc);
    secao(doc, "Cenários de Restituição e Recuperação");
    paras(doc, ai.cenarioRestituicao, 9);

    const eY = doc.y;
    doc.rect(MARGIN, eY, CW, 30).fill(C.successL);
    doc.rect(MARGIN, eY, 4, 30).fill(C.success);
    doc.fillColor(C.success).font("Helvetica-Bold").fontSize(10)
      .text(ai.estimativaEconomia, MARGIN+12, eY+8, { width: CW-24 });
    doc.y = eY + 40;
    rodape(doc, d.id);

    // ── P5 — ESTRATÉGIA DE NEGOCIAÇÃO ──────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Estratégia de Negociação", 5);

    secao(doc, "Estratégia Personalizada para Este Caso");
    paras(doc, ai.estrategiaCompleta, 9);

    divisor(doc);
    secao(doc, "Canais Recomendados — Por Ordem de Eficácia");
    const cores = [C.primary, C.accent, C.warning, C.success];
    const icons = ["1º", "2º", "3º", "4º"];
    for (let i=0; i<(ai.canaisRecomendados||[]).length; i++) {
      const txt = ai.canaisRecomendados[i], cor = cores[i%cores.length];
      const est = Math.max(44, Math.ceil(txt.length/90)*13+22), y = doc.y;
      doc.rect(MARGIN, y, CW, est).fill(C.bgGray);
      doc.rect(MARGIN, y, 40, est).fill(cor);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9).text(icons[i], MARGIN, y+est/2-8, { width: 40, align: "center", lineBreak: false });
      doc.fillColor(C.white).font("Helvetica").fontSize(7).text("CANAL", MARGIN, y+est/2+4, { width: 40, align: "center", lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(8.5).text(txt, MARGIN+48, y+8, { width: CW-56 });
      doc.y = y + est + 6; doc.fillColor(C.text);
    }
    rodape(doc, d.id);

    // ── P6 — ROTEIRO DE NEGOCIAÇÃO ─────────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Roteiro de Negociação", 6);

    const iY = doc.y;
    doc.rect(MARGIN, iY, CW, 28).fill(C.bgBlue);
    doc.rect(MARGIN, iY, 4, 28).fill(C.accent);
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8.5)
      .text("Use este script como guia ao ligar ou ir pessoalmente ao banco. Adapte com suas informações.",
        MARGIN+12, iY+8, { width: CW-24, lineBreak: false });
    doc.y = iY + 36;

    secao(doc, "Script Completo — Diálogo de Negociação com o Banco");

    const secoes = (ai.roteirNegociacao||"").split(/(?=\(\d+\))/).filter(s => s.trim());
    if (secoes.length > 1) {
      for (const s of secoes) {
        const m = s.match(/^\((\d+)\)\s*(.*)/s);
        if (m) {
          const y = doc.y;
          doc.rect(MARGIN, y, 26, 20).fill(C.primary);
          doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9)
            .text(m[1], MARGIN, y+5, { width: 26, align: "center", lineBreak: false });
          doc.fillColor(C.text).font("Helvetica").fontSize(8.5)
            .text(m[2].trim(), MARGIN+34, y, { width: CW-34, align: "justify" });
          doc.moveDown(0.4);
        } else { para(doc, s, 8.5); }
      }
    } else { paras(doc, ai.roteirNegociacao||"", 8.5); }

    if (doc.y < H - 120) {
      divisor(doc);
      secao(doc, "Prazos Críticos — Não Deixe Para Depois", C.danger);
      caixa(doc, ai.prazosCriticos||"", C.danger, C.dangerL, 8.5);
    }
    rodape(doc, d.id);

    // ── P7 — PLANO DE AÇÃO ─────────────────────────────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Plano de Ação Completo", 7);

    secao(doc, "Linha do Tempo — O Que Fazer em Cada Fase");
    const fases = [
      ["SEMANA 1 — AÇÕES URGENTES", ai.acoes7Dias,  C.danger,  C.dangerL],
      ["MÊS 1 — AÇÕES PRIORITÁRIAS", ai.acoes30Dias, C.warning, C.warningL],
      ["MESES 2-3 — AÇÕES SEGUINTES", ai.acoes90Dias, C.accent,  C.bgBlue],
    ];
    for (const [tit, acoes, cor, bg] of fases) {
      const blockY = doc.y;
      doc.rect(MARGIN, blockY, CW, 24).fill(cor);
      doc.fillColor(C.white).font("Helvetica-Bold").fontSize(9.5)
        .text(tit, MARGIN+10, blockY+6, { lineBreak: false });
      doc.y = blockY + 24;
      const acaoH = (acoes||[]).reduce((a,x)=>a+Math.max(20, Math.ceil(x.length/85)*12+12), 0)+12;
      doc.rect(MARGIN, doc.y, CW, acaoH).fill(bg);
      doc.y += 8;
      for (const acao of (acoes||[])) {
        const ay = doc.y;
        doc.fillColor(cor).font("Helvetica-Bold").fontSize(10).text("›", MARGIN+8, ay, { lineBreak: false });
        doc.fillColor(C.text).font("Helvetica").fontSize(8.5).text(acao, MARGIN+22, ay, { width: CW-30 });
        doc.moveDown(0.25);
      }
      doc.y = blockY + 24 + acaoH + 8; doc.fillColor(C.text);
    }

    divisor(doc);
    secao(doc, "Alertas Específicos do Seu Caso", C.danger);
    for (let i=0; i<(ai.alertasEspeciais||[]).length; i++) {
      const a = ai.alertasEspeciais[i], y = doc.y;
      const eH = Math.max(26, Math.ceil(a.length/90)*12+14);
      doc.rect(MARGIN, y, CW, eH).fill(i%2===0 ? C.warningL : C.bgGray);
      doc.rect(MARGIN, y, 4, eH).fill(C.warning);
      doc.fillColor(C.warning).font("Helvetica-Bold").fontSize(8).text("⚠ "+(i+1), MARGIN+8, y+4, { lineBreak: false });
      doc.fillColor(C.text).font("Helvetica").fontSize(8.5).text(a, MARGIN+28, y+4, { width: CW-36 });
      doc.y = y + eH + 4; doc.fillColor(C.text);
    }
    rodape(doc, d.id);

    // ── P8 — MODELO DE REQUERIMENTO + REFERÊNCIAS ──────────────────────────────
    doc.addPage(PAGE_OPTS);
    cabecalho(doc, "Modelo de Requerimento + Referências", 8);

    const instY2 = doc.y;
    doc.rect(MARGIN, instY2, CW, 22).fill(C.bgGray);
    doc.fillColor(C.gray).font("Helvetica").fontSize(8)
      .text("Preencha os campos em [COLCHETES] antes de enviar. Envie por e-mail, app do banco ou Correios com AR.",
        MARGIN+8, instY2+6, { lineBreak: false });
    doc.y = instY2 + 30;

    secao(doc, "Modelo de Requerimento Administrativo — Personalizável");

    const carta = [
      `À ${d.instituicao}`, `Setor de Revisão Contratual / Ouvidoria`, ``,
      `Ref.: Pedido formal de revisão de taxa de juros — Crédito Pessoal`, ``, `[CIDADE], [DATA]`, ``,
      `Eu, ${d.nome}, portador(a) do CPF nº [SEU CPF], cliente desta instituição,`,
      `venho, por meio deste requerimento, solicitar a revisão das condições do contrato de`,
      `crédito pessoal firmado em ${fmtMY(d.contrato.dataContrato)}, no valor de ${brl(r.valorOriginal)},`,
      `no qual consta taxa de juros de ${pct(r.taxaCobrada,4)} ao mês.`, ``,
      `Com base na API pública do Banco Central do Brasil (SGS, série ${d.taxaBCB.codigoSerie}),`,
      `a taxa média para Crédito Pessoal no período era de ${pct(r.taxaMediaBCB,4)} ao mês —`,
      `diferença de ${pct(r.percentualExcesso,2)} acima da referência, equivalente a ${brl(r.diferencaAbusiva)} no total.`, ``,
      `Com fundamento nos arts. 6º, V; 39, V; e 51, IV, do CDC (Lei 8.078/90),`,
      `aplicável às instituições financeiras pela Súmula 297 do STJ, solicito formalmente`,
      `a revisão das condições pactuadas e nova proposta com taxa adequada ao mercado.`, ``,
      `Aguardo resposta no prazo de 5 (cinco) dias úteis.`, ``, `Atenciosamente,`, ``,
      `${d.nome}`, `CPF: [SEU CPF]  |  Telefone: [SEU TELEFONE]  |  E-mail: [SEU E-MAIL]`,
    ];
    const lH = 11.5, cartaH = carta.length*lH+20, cartaY = doc.y;
    doc.rect(MARGIN, cartaY, CW, cartaH).fill(C.bgGray);
    doc.rect(MARGIN, cartaY, 3, cartaH).fill(C.accent);
    doc.y = cartaY + 10;
    doc.font("Courier").fontSize(7.8).fillColor(C.text);
    for (const linha of carta) {
      doc.text(linha||" ", MARGIN+12, doc.y, { width: CW-20, lineBreak: false });
      doc.y += lH;
    }
    doc.y = cartaY + cartaH + 14;

    secao(doc, "Fontes e Recursos Gratuitos");
    const refs = [
      ["API BCB (SGS)", `api.bcb.gov.br/dados/serie/bcdata.sgs.${d.taxaBCB.codigoSerie}/dados`],
      ["consumidor.gov.br", "www.consumidor.gov.br"],
      ["Ouvidoria BCB", "www.bcb.gov.br/acessoinformacao/ouvidoria"],
      ["Calculadora Cidadão", "www3.bcb.gov.br/CALCJUROS/"],
      ["Lei 8.078/90 — CDC", "www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"],
    ];
    for (const [lbl, url] of refs) {
      doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(8)
        .text(lbl + "  ", MARGIN, doc.y, { continued: true, lineBreak: false });
      doc.fillColor(C.accent).font("Helvetica").fontSize(8).text(url, { lineBreak: false });
      doc.y += 14;
    }

    // Atribuição IA
    doc.moveDown(0.5);
    doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
      .text(`Laudo gerado com ${ai.geradoPor}. Para fins educacionais — não substitui orientação jurídica profissional.`,
        MARGIN, doc.y, { width: CW, align: "center" });

    rodape(doc, d.id);
    doc.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Gerando preview AuditCrédito v3 — PDF 8 páginas\n");

  console.log("1️⃣  NVIDIA NIM — nvidia/llama-3.1-nemotron-70b-instruct...");
  const ai = await gerarAnaliseIA();
  console.log(`   ✅ Análise gerada! Risco: ${ai.nivelRisco} — Probabilidade: ${ai.probabilidadeSucesso?.split(" ")[0]}`);

  console.log("\n2️⃣  Gerando PDF de 8 páginas...");
  const pdf = await gerarPDF(ai);
  const kb  = (pdf.length / 1024).toFixed(1);
  console.log(`   ✅ PDF gerado: ${kb} KB`);

  console.log("\n3️⃣  Enviando para elberagenciamkt@gmail.com via Resend...");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const nome   = DADOS.nome.split(" ")[0];

  const { data, error } = await resend.emails.send({
    from:    "AuditCrédito <noreply@auditcredito.com.br>",
    to:      ["elberagenciamkt@gmail.com"],
    subject: `${nome}, seu Laudo de Auditoria está pronto — PDF 8 páginas em anexo`,
    html: `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F2F3F4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F3F4;padding:32px 0">
<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0"
  style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
<tr><td style="background:#1B4F72;padding:28px 40px">
  <p style="margin:0;color:#fff;font-size:20px;font-weight:700">AuditCrédito</p>
  <p style="margin:4px 0 0;color:#AED6F1;font-size:12px">Laudo Técnico de Auditoria de Crédito</p>
</td></tr>
<tr><td style="padding:36px 40px">
  <h1 style="margin:0 0 8px;color:#1C2833;font-size:22px;font-weight:700">
    ${nome}, seu Laudo está pronto!
  </h1>
  <p style="margin:0 0 20px;color:#5D6D7E;font-size:14px">
    Seu relatório de auditoria personalizado foi gerado com análise jurídica por Inteligência Artificial
    e está em anexo neste e-mail. São <strong>8 páginas</strong> com diagnóstico completo do seu caso.
  </p>
  <div style="background:#EBF5FB;border-left:4px solid #2E86C1;border-radius:4px;padding:16px 20px;margin-bottom:20px">
    <p style="margin:0 0 10px;color:#1B4F72;font-size:13px;font-weight:700">📄 O que está no PDF de 8 páginas</p>
    <ul style="margin:0;padding-left:20px;color:#1C2833;font-size:13px;line-height:2.1">
      <li><strong>Pág. 1:</strong> Capa com dados do contrato e 3 KPIs de taxa</li>
      <li><strong>Pág. 2:</strong> Diagnóstico financeiro com gráfico comparativo de taxas</li>
      <li><strong>Pág. 3:</strong> Laudo jurídico — diagnóstico, fundamentação e precedentes</li>
      <li><strong>Pág. 4:</strong> Direitos do consumidor, impacto financeiro e cenários</li>
      <li><strong>Pág. 5:</strong> Estratégia personalizada e canais recomendados</li>
      <li><strong>Pág. 6:</strong> Script completo de negociação com o banco</li>
      <li><strong>Pág. 7:</strong> Plano de ação (7 / 30 / 90 dias) + alertas</li>
      <li><strong>Pág. 8:</strong> Modelo de requerimento + referências legais</li>
    </ul>
  </div>
  <div style="background:#EAFAF1;border-radius:8px;padding:14px 20px;margin-bottom:20px">
    <p style="margin:0 0 8px;color:#1E8449;font-size:13px;font-weight:700">Diagnóstico do seu caso</p>
    <p style="margin:0;color:#1C2833;font-size:13px">
      Risco jurídico identificado: <strong style="color:#C0392B">${ai.nivelRisco}</strong> —
      Probabilidade de êxito: <strong>${ai.probabilidadeSucesso?.split(" ")[0]}</strong>
    </p>
  </div>
  <div style="background:#FEF9E7;border-radius:8px;padding:14px 20px">
    <p style="margin:0;color:#D35400;font-size:12px">
      <strong>Garantia de 7 dias:</strong> Se não ficar 100% satisfeito, responda este e-mail
      dentro de 7 dias corridos e faremos o reembolso integral.
    </p>
  </div>
</td></tr>
<tr><td style="background:#F2F3F4;padding:16px 40px">
  <p style="margin:0;color:#7F8C8D;font-size:11px;line-height:1.6">
    Análise gerada por ${ai.geradoPor}. Este documento é informativo e não constitui
    parecer jurídico ou financeiro. Para ações formais, consulte um advogado especializado.
  </p>
</td></tr>
</table></td></tr></table></body></html>`,
    attachments: [{
      filename: `auditcredito-laudo-${DADOS.id}.pdf`,
      content:  pdf,
    }],
  });

  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);

  console.log(`   ✅ Email enviado! ID: ${data.id}`);
  console.log(`\n🎉 Preview enviado para elberagenciamkt@gmail.com`);
  console.log(`   PDF de 8 páginas com análise completa por ${ai.geradoPor}`);
  console.log(`   Risco: ${ai.nivelRisco} | ${ai.probabilidadeSucesso?.split("—")[0]?.trim()}`);
}

main().catch(e => { console.error("\n❌ Erro:", e.message); process.exit(1); });
