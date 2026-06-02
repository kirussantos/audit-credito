import PDFDocument from "pdfkit";
import type { RespostaAnalise, StatusAuditoria } from "@/types";
import type { AnaliseIA } from "@/lib/ai-analysis";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Paleta ───────────────────────────────────────────────────────────────────

const C = {
  primary:   "#1B4F72",
  accent:    "#2E86C1",
  dark:      "#1C2833",
  success:   "#1E8449",
  warning:   "#D35400",
  danger:    "#C0392B",
  gray:      "#5D6D7E",
  lightGray: "#D5D8DC",
  bgGray:    "#F2F3F4",
  white:     "#FFFFFF",
  text:      "#1C2833",
} as const;

const STATUS_CFG: Record<StatusAuditoria, { cor: string; rotulo: string }> = {
  DENTRO_DA_MEDIA:        { cor: C.success, rotulo: "DENTRO DA MÉDIA" },
  ACIMA_DA_MEDIA:         { cor: C.warning, rotulo: "ACIMA DA MÉDIA" },
  POTENCIALMENTE_ABUSIVO: { cor: C.danger,  rotulo: "POTENCIALMENTE ACIMA DA MÉDIA" },
};

// ─── Formatadores ─────────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const pct = (v: number, casas = 2) => `${v.toFixed(casas)}%`;

const fmtData = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });

// ─── Constantes de layout ─────────────────────────────────────────────────────

const W        = 595.28; // largura A4 em pontos
const H        = 841.89; // altura A4
const MARGIN   = 50;
const CW       = W - MARGIN * 2; // largura do conteúdo
const HEADER_H = 110;

// ─── Helpers de desenho ───────────────────────────────────────────────────────

function cabecalhoPagina(
  doc: PDFKit.PDFDocument,
  titulo: string,
  pagina: number,
  total: number,
) {
  // Barra superior
  doc.rect(0, 0, W, HEADER_H).fill(C.primary);

  // Marca
  doc.fillColor(C.white)
    .font("Helvetica-Bold").fontSize(16)
    .text("AuditCrédito", MARGIN, 28, { lineBreak: false });

  doc.fillColor("#AED6F1")
    .font("Helvetica").fontSize(8.5)
    .text("Ferramenta educacional independente", MARGIN, 50, { lineBreak: false });

  // Título da seção (direita)
  doc.fillColor(C.white)
    .font("Helvetica-Bold").fontSize(11)
    .text(titulo, MARGIN, 32, { width: CW, align: "right", lineBreak: false });

  // Paginação
  doc.fillColor("#AED6F1")
    .font("Helvetica").fontSize(8)
    .text(`${pagina} / ${total}`, MARGIN, 50, { width: CW, align: "right", lineBreak: false });

  // Reset cor e posição
  doc.fillColor(C.text);
  doc.y = HEADER_H + 24;
}

function rodapePagina(doc: PDFKit.PDFDocument, id: string) {
  const y = H - 38;
  doc.rect(0, y - 4, W, 42).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
    .text(
      `Documento informativo. Não constitui parecer jurídico.  |  ID ${id}  |  AuditCrédito`,
      MARGIN, y + 6,
      { width: CW, align: "center", lineBreak: false },
    );
  doc.fillColor(C.text);
}

function secao(doc: PDFKit.PDFDocument, titulo: string) {
  doc.moveDown(0.6);
  doc.rect(MARGIN, doc.y, CW, 22).fill(C.primary);
  doc.fillColor(C.white)
    .font("Helvetica-Bold").fontSize(10)
    .text(titulo.toUpperCase(), MARGIN + 10, doc.y - 16, { lineBreak: false });
  doc.fillColor(C.text);
  doc.y += 10;
  doc.moveDown(0.5);
}

function linhaTabela(
  doc: PDFKit.PDFDocument,
  label: string,
  valor: string,
  fundo = false,
) {
  if (fundo) doc.rect(MARGIN, doc.y, CW, 20).fill(C.bgGray);
  const y = doc.y + 5;
  doc.fillColor(C.gray).font("Helvetica").fontSize(9)
    .text(label, MARGIN + 8, y, { lineBreak: false });
  doc.fillColor(C.text).font("Helvetica-Bold").fontSize(9)
    .text(valor, MARGIN + 8, y, { width: CW - 16, align: "right", lineBreak: false });
  doc.fillColor(C.text);
  doc.y += 22;
}

function paragrafo(doc: PDFKit.PDFDocument, texto: string, opts?: object) {
  doc.font("Helvetica").fontSize(9.5).fillColor(C.text)
    .text(texto, MARGIN, doc.y, { width: CW, align: "justify", ...opts });
  doc.moveDown(0.5);
}

function itemLista(doc: PDFKit.PDFDocument, texto: string, indente = 0) {
  const x = MARGIN + indente;
  doc.font("Helvetica").fontSize(9.5).fillColor(C.text)
    .text(`• ${texto}`, x, doc.y, { width: CW - indente, indent: 10 });
  doc.moveDown(0.3);
}

function divisor(doc: PDFKit.PDFDocument) {
  doc.moveDown(0.4);
  doc.rect(MARGIN, doc.y, CW, 0.5).fill(C.lightGray);
  doc.moveDown(0.6);
}

// ─── PÁGINA 1 — Capa ─────────────────────────────────────────────────────────

function paginaCapa(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, geradoEm, id } = dados;
  const cfg = STATUS_CFG[resultado.status];

  // Barra primária (maior na capa)
  doc.rect(0, 0, W, 160).fill(C.primary);

  // Acento decorativo
  doc.rect(0, 135, W, 25).fill(C.accent);

  // Marca
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(22)
    .text("AuditCrédito", MARGIN, 40, { lineBreak: false });
  doc.fillColor("#AED6F1").font("Helvetica").fontSize(10)
    .text("Ferramenta educacional independente", MARGIN, 68, { lineBreak: false });

  // Título principal
  doc.y = 200;
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(19)
    .text("Relatório de Análise Comparativa", MARGIN, doc.y, {
      width: CW, align: "center",
    });
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(19)
    .text("de Taxas de Juros", MARGIN, doc.y, { width: CW, align: "center" });

  doc.moveDown(0.6);
  doc.fillColor(C.gray).font("Helvetica").fontSize(11)
    .text(
      "Análise baseada em dados públicos do Banco Central do Brasil",
      MARGIN, doc.y, { width: CW, align: "center" },
    );

  // Linha divisória
  doc.moveDown(1.2);
  doc.rect(MARGIN + 80, doc.y, CW - 160, 1.5).fill(C.accent);
  doc.moveDown(1.4);

  // Card de informações
  const cardY = doc.y;
  doc.rect(MARGIN, cardY, CW, 145).fill(C.bgGray);
  doc.rect(MARGIN, cardY, 4, 145).fill(C.accent);

  doc.y = cardY + 16;
  const linhas: [string, string][] = [
    ["Data da análise",     fmtData(geradoEm)],
    ["Identificador",       id.toUpperCase()],
    ["Tipo de crédito",     ROTULO_TIPO_CREDITO[dados.contrato.tipoCredito]],
    ["Instituição",         dados.instituicao],
    ["Valor analisado",     brl(resultado.valorOriginal)],
    ["Período",             `${resultado.periodoMeses} meses`],
  ];
  for (const [label, val] of linhas) {
    doc.fillColor(C.gray).font("Helvetica").fontSize(9)
      .text(label + ":", MARGIN + 20, doc.y, { lineBreak: false });
    doc.fillColor(C.text).font("Helvetica-Bold").fontSize(9)
      .text(val, MARGIN + 20, doc.y, { width: CW - 40, align: "right", lineBreak: false });
    doc.y += 19;
  }

  // Badge de status
  doc.moveDown(1.8);
  const badgeY = doc.y;
  doc.rect(MARGIN, badgeY, CW, 38).fill(cfg.cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(12)
    .text(`RESULTADO: ${cfg.rotulo}`, MARGIN, badgeY + 12, {
      width: CW, align: "center", lineBreak: false,
    });
  doc.y = badgeY + 50;

  // Disclaimer da capa
  doc.moveDown(1.5);
  doc.rect(MARGIN, doc.y, CW, 52).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(8)
    .text(
      "DOCUMENTO INFORMATIVO — Não constitui parecer jurídico, financeiro ou legal. " +
      "Esta análise compara a taxa informada pelo usuário com a taxa média divulgada " +
      "pelo Banco Central do Brasil para o mesmo tipo de crédito. Recomenda-se consultar " +
      "um advogado ou o Procon para ações formais.",
      MARGIN + 10, doc.y + 8,
      { width: CW - 20, align: "justify" },
    );

  rodapePagina(doc, id);
}

// ─── PÁGINA 2 — Resumo da análise ────────────────────────────────────────────

function paginaResumo(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, taxaBCB, contrato, instituicao, id } = dados;
  const cfg = STATUS_CFG[resultado.status];
  const valorCobradoTotal = resultado.valorCorrigido + resultado.diferencaAbusiva;

  cabecalhoPagina(doc, "Resumo da Análise", 2, 5);

  secao(doc, "Dados informados pelo usuário");

  linhaTabela(doc, "Tipo de crédito",   ROTULO_TIPO_CREDITO[contrato.tipoCredito], false);
  linhaTabela(doc, "Banco / Instituição", instituicao, true);
  linhaTabela(doc, "Valor financiado (principal)", brl(resultado.valorOriginal), false);
  linhaTabela(doc, "Taxa de juros informada", `${pct(resultado.taxaCobrada)} ao mês`, true);
  linhaTabela(doc, "Período analisado", `${resultado.periodoMeses} meses`, false);
  linhaTabela(doc, "Data de referência do contrato",
    new Date(contrato.dataContrato).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    true);

  secao(doc, "Taxa de Referência — Banco Central do Brasil");

  linhaTabela(doc, "Série utilizada (SGS/BCB)", `${taxaBCB.codigoSerie} — ${ROTULO_TIPO_CREDITO[taxaBCB.tipoCredito]}`, false);
  linhaTabela(doc, "Taxa média do período", `${pct(taxaBCB.taxaMensal)} ao mês`, true);
  linhaTabela(doc, "Taxa anual equivalente", `${pct(taxaBCB.taxaAnual)} ao ano`, false);
  linhaTabela(doc, "Data base da taxa BCB", taxaBCB.data, true);
  linhaTabela(doc, "Fonte", "api.bcb.gov.br/dados/serie/bcdata.sgs", false);

  secao(doc, "Cálculo de Juros Compostos (M = P × (1 + i)ⁿ)");

  doc.moveDown(0.3);
  // Fórmula
  doc.rect(MARGIN, doc.y, CW, 28).fill(C.bgGray);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(10)
    .text(
      `M = ${brl(resultado.valorOriginal)} × (1 + i)^${resultado.periodoMeses}`,
      MARGIN, doc.y + 8, { width: CW, align: "center", lineBreak: false },
    );
  doc.y += 40;

  linhaTabela(doc, `Com taxa cobrada (${pct(resultado.taxaCobrada)} a.m.)`,
    brl(valorCobradoTotal), false);
  linhaTabela(doc, `Com taxa média BCB (${pct(resultado.taxaMediaBCB)} a.m.)`,
    brl(resultado.valorCorrigido), true);

  divisor(doc);

  // Resultado destacado
  const resY = doc.y;
  doc.rect(MARGIN, resY, CW, 60).fill(cfg.cor + "22"); // cor com transparência simulada
  doc.rect(MARGIN, resY, 4, 60).fill(cfg.cor);
  doc.y = resY + 10;

  doc.fillColor(C.text).font("Helvetica").fontSize(9)
    .text("Diferença identificada:", MARGIN + 14, doc.y, { lineBreak: false });
  doc.fillColor(cfg.cor).font("Helvetica-Bold").fontSize(14)
    .text(brl(Math.abs(resultado.diferencaAbusiva)), MARGIN + 14, doc.y,
      { width: CW - 28, align: "right", lineBreak: false });
  doc.y += 22;

  doc.fillColor(C.text).font("Helvetica").fontSize(9)
    .text("Excesso percentual sobre a taxa BCB:", MARGIN + 14, doc.y, { lineBreak: false });
  doc.fillColor(cfg.cor).font("Helvetica-Bold").fontSize(10)
    .text(`+${pct(resultado.percentualExcesso)}`, MARGIN + 14, doc.y,
      { width: CW - 28, align: "right", lineBreak: false });
  doc.y += 22;

  doc.fillColor(C.text);
  doc.moveDown(1);

  // Badge status
  doc.rect(MARGIN, doc.y, CW, 30).fill(cfg.cor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(11)
    .text(`STATUS: ${cfg.rotulo}`, MARGIN, doc.y + 9,
      { width: CW, align: "center", lineBreak: false });
  doc.y += 42;

  rodapePagina(doc, id);
}

// ─── PÁGINA 3 — Análise Personalizada por IA ─────────────────────────────────

function paginaAnaliseIA(doc: PDFKit.PDFDocument, dados: RespostaAnalise, ai: AnaliseIA) {
  const { id } = dados;

  cabecalhoPagina(doc, "Análise Personalizada — IA", 3, 6);

  // Badge de risco
  const risco = ai.riscoJuridico.toUpperCase();
  const riscoColor = risco.startsWith("ALTO") ? C.danger
    : risco.startsWith("MÉDIO") ? C.warning
    : C.success;

  const badgeY = doc.y;
  doc.rect(MARGIN, badgeY, CW, 30).fill(riscoColor);
  doc.fillColor(C.white).font("Helvetica-Bold").fontSize(10)
    .text(`RISCO JURÍDICO: ${ai.riscoJuridico}`, MARGIN, badgeY + 9,
      { width: CW, align: "center", lineBreak: false });
  doc.y = badgeY + 42;

  secao(doc, "Parecer Técnico Personalizado");
  paragrafo(doc, ai.parecer);

  secao(doc, "Fundamentação Legal Aplicável");
  paragrafo(doc, ai.fundamentacao);

  secao(doc, "Estratégia de Negociação Recomendada");
  paragrafo(doc, ai.estrategiaNeg);

  // Ação urgente — destaque
  secao(doc, "Ação Prioritária — Próximos 7 Dias");
  const acaoY = doc.y;
  doc.rect(MARGIN, acaoY, CW, 52).fill(C.bgGray);
  doc.rect(MARGIN, acaoY, 4, 52).fill(C.accent);
  doc.fillColor(C.text).font("Helvetica").fontSize(9.5)
    .text(ai.acaoRecomendada, MARGIN + 14, acaoY + 10,
      { width: CW - 24, align: "justify" });
  doc.y = acaoY + 64;

  // Alertas especiais
  secao(doc, "Alertas Específicos do Seu Caso");
  for (const alerta of ai.alertasEspeciais) {
    itemLista(doc, alerta);
  }

  // Estimativa de economia
  if (ai.estimativaEconomia) {
    divisor(doc);
    const econY = doc.y;
    doc.rect(MARGIN, econY, CW, 28).fill(C.success + "22");
    doc.rect(MARGIN, econY, 4, 28).fill(C.success);
    doc.fillColor(C.success).font("Helvetica-Bold").fontSize(10)
      .text(ai.estimativaEconomia, MARGIN + 14, econY + 7,
        { width: CW - 24, lineBreak: false });
    doc.y = econY + 38;
  }

  // Rodapé IA
  doc.moveDown(0.8);
  doc.fillColor(C.gray).font("Helvetica").fontSize(7.5)
    .text(
      `Análise gerada por ${ai.geradoPor} com base nos dados informados. ` +
      "Não substitui orientação de advogado especializado.",
      MARGIN, doc.y, { width: CW, align: "center" },
    );

  rodapePagina(doc, id);
}

// ─── PÁGINA 4 — Detalhamento técnico (era página 3) ──────────────────────────

function paginaDetalhamento(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { resultado, id } = dados;

  cabecalhoPagina(doc, "Detalhamento Técnico", 4, 6);

  secao(doc, "O que é a taxa média do Banco Central?");
  paragrafo(doc,
    "O Banco Central do Brasil (BCB) divulga mensalmente, pelo Sistema Gerenciador de " +
    "Séries Temporais (SGS), as taxas médias de juros praticadas pelas instituições " +
    "financeiras em diferentes modalidades de crédito. Esses dados são calculados com " +
    "base nas operações efetivamente contratadas no período e representam a média " +
    "ponderada pelo volume das operações."
  );
  paragrafo(doc,
    "A taxa utilizada nesta análise foi obtida diretamente da API pública do BCB, " +
    `série SGS ${dados.taxaBCB.codigoSerie}, correspondente a ` +
    `${ROTULO_TIPO_CREDITO[dados.contrato.tipoCredito].toLowerCase()}, ` +
    `com data de referência ${dados.taxaBCB.data}.`
  );

  secao(doc, "Como funciona o cálculo de juros compostos?");
  paragrafo(doc,
    "Juros compostos são calculados sobre o montante acumulado, ou seja, os juros " +
    "incidem sobre o capital inicial mais os juros já acumulados nos períodos anteriores. " +
    "A fórmula utilizada nesta análise é:"
  );
  doc.rect(MARGIN, doc.y, CW, 26).fill(C.bgGray);
  doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(10.5)
    .text("M = P × (1 + i)ⁿ", MARGIN, doc.y + 7, { width: CW, align: "center", lineBreak: false });
  doc.y += 38;

  doc.font("Helvetica").fontSize(9).fillColor(C.gray)
    .text("Onde: M = Montante final   |   P = Principal (capital inicial)   |   i = Taxa de juros (decimal)   |   n = Número de períodos",
      MARGIN, doc.y, { width: CW, align: "center" });
  doc.moveDown(0.8);

  doc.fillColor(C.text).font("Helvetica").fontSize(9.5)
    .text(
      `Aplicado a esta análise: P = ${brl(resultado.valorOriginal)}, ` +
      `n = ${resultado.periodoMeses} meses.`,
      MARGIN, doc.y, { width: CW }
    );
  doc.moveDown(0.7);

  secao(doc, "Estar acima da média NÃO é automaticamente ilegal");
  paragrafo(doc,
    "É importante compreender que a taxa média divulgada pelo BCB é uma referência " +
    "estatística — não um teto legal. Uma taxa acima da média pode decorrer de fatores " +
    "como: perfil de risco do tomador, modalidade específica do produto, prazo da " +
    "operação e política comercial da instituição."
  );
  paragrafo(doc,
    "A ilegalidade ou abusividade de uma taxa de juros depende de análise jurídica " +
    "individualizada, considerando o tipo de contrato, a legislação aplicável e as " +
    "circunstâncias específicas da relação contratual. Esta ferramenta NÃO faz esse " +
    "julgamento — apenas apresenta a comparação com dados públicos."
  );

  secao(doc, "Taxa abusiva × Taxa acima da média");
  paragrafo(doc,
    "Taxa acima da média: estatisticamente superior à média das operações do sistema " +
    "financeiro, sem necessariamente configurar abuso. Pode ser legítima dependendo " +
    "das condições contratuais e do perfil do crédito."
  );
  paragrafo(doc,
    "Taxa abusiva: conceito jurídico que requer demonstração de que a taxa é " +
    "desproporcional, viola a boa-fé objetiva ou coloca o consumidor em desvantagem " +
    "exagerada (CDC, art. 51, IV). A configuração de abusividade exige avaliação " +
    "por profissional habilitado."
  );

  secao(doc, "Referências legais relevantes");
  itemLista(doc,
    "Súmula 297 do STJ: o CDC é aplicável às instituições financeiras."
  );
  itemLista(doc,
    "CDC, art. 6º, V: direito à modificação de cláusulas contratuais " +
    "que estabeleçam prestações desproporcionais."
  );
  itemLista(doc,
    "CDC, art. 39, V: é vedado ao fornecedor exigir do consumidor vantagem " +
    "manifestamente excessiva."
  );
  itemLista(doc,
    "CDC, art. 51, IV: são nulas as cláusulas que estabeleçam obrigações " +
    "consideradas iníquas ou abusivas."
  );
  itemLista(doc,
    "Lei 8.078/90 (CDC) e Resoluções do Banco Central regulam as operações " +
    "de crédito ao consumidor no Brasil."
  );

  rodapePagina(doc, id);
}

// ─── PÁGINA 4 — Orientações e próximos passos ────────────────────────────────

function paginaOrientacoes(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { id, instituicao, nome, contrato, resultado } = dados;

  cabecalhoPagina(doc, "Orientações e Próximos Passos", 5, 6);

  secao(doc, "Como negociar diretamente com o banco");
  itemLista(doc, "Reúna seu contrato e os comprovantes de pagamentos realizados.");
  itemLista(doc, "Acesse o site ou app da instituição e localize o canal de renegociação ou central de atendimento.");
  itemLista(doc, "Apresente esta análise comparativa como fundamento para solicitar revisão das condições.");
  itemLista(doc, "Solicite proposta por escrito e compare com as condições atuais antes de aceitar.");
  itemLista(doc, "Guarde comprovante de todas as comunicações (e-mail, protocolo de atendimento).");

  secao(doc, "Como registrar reclamação nos órgãos de defesa do consumidor");
  paragrafo(doc, "Se a negociação direta não for satisfatória, as instâncias abaixo são gratuitas:");
  itemLista(doc, "consumidor.gov.br — plataforma federal com prazo de resposta pela empresa (acesse: www.consumidor.gov.br).", 10);
  itemLista(doc, "Procon do seu estado — órgão estadual de defesa do consumidor com poder de mediação e autuação.", 10);
  itemLista(doc, "Ouvidoria do Banco Central — para reclamações não resolvidas contra instituições financeiras " +
    "(acesse: www.bcb.gov.br/acessoinformacao/ouvidoria).", 10);
  itemLista(doc, "Juizado Especial Cível (JEC) — para causas de até 40 salários mínimos, sem advogado obrigatório.", 10);

  secao(doc, "Quando procurar um advogado");
  paragrafo(doc,
    "Recomenda-se consultar um advogado especializado em direito do consumidor ou " +
    "bancário quando: a diferença identificada for significativa; o banco negar a " +
    "revisão; houver cláusulas contratuais dúbias; ou quando houver interesse em " +
    "ação judicial de revisão contratual."
  );

  divisor(doc);

  // Modelo de requerimento
  secao(doc, "Modelo de Requerimento Administrativo");
  doc.rect(MARGIN, doc.y, CW, 16).fill(C.bgGray);
  doc.fillColor(C.gray).font("Helvetica").fontSize(8)
    .text(
      "Preencha os campos em [COLCHETES] com suas informações antes de enviar.",
      MARGIN + 8, doc.y + 4, { lineBreak: false },
    );
  doc.y += 24;

  const tipoCredito = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const dataRef = new Date(contrato.dataContrato)
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  const modelo = [
    `À ${instituicao}`,
    `Setor de Atendimento ao Cliente / Ouvidoria`,
    ``,
    `Ref.: Pedido de revisão de taxa de juros — ${tipoCredito}`,
    ``,
    `[CIDADE], [DATA]`,
    ``,
    `Eu, ${nome}, portador(a) do CPF nº [SEU CPF], cliente desta instituição,`,
    `venho, por meio deste, solicitar a revisão das condições do contrato de`,
    `${tipoCredito.toLowerCase()} firmado em ${dataRef}, no valor de ${brl(resultado.valorOriginal)},`,
    `no qual consta taxa de ${pct(resultado.taxaCobrada)} ao mês.`,
    ``,
    `Conforme consulta à API pública do Banco Central do Brasil (série SGS`,
    `${dados.taxaBCB.codigoSerie}), a taxa média para esta modalidade no`,
    `período de referência era de ${pct(resultado.taxaMediaBCB)} ao mês,`,
    `representando diferença de ${pct(resultado.percentualExcesso)} acima da média de mercado.`,
    ``,
    `Com fundamento no art. 6º, V, e art. 39, V, do Código de Defesa do Consumidor`,
    `(Lei 8.078/90), solicito revisão das condições pactuadas e nova proposta`,
    `adequada às taxas praticadas pelo mercado.`,
    ``,
    `Aguardo resposta no prazo de 5 (cinco) dias úteis.`,
    ``,
    `Atenciosamente,`,
    ``,
    `${nome}`,
    `CPF: [SEU CPF]`,
    `E-mail: [SEU E-MAIL]`,
    `Telefone: [SEU TELEFONE]`,
  ];

  doc.rect(MARGIN, doc.y, CW, modelo.length * 13 + 16).fill(C.bgGray);
  doc.rect(MARGIN, doc.y, 3, modelo.length * 13 + 16).fill(C.accent);

  const modeloY = doc.y + 8;
  doc.font("Helvetica").fontSize(8).fillColor(C.text);
  for (const linha of modelo) {
    doc.text(linha === "" ? " " : linha, MARGIN + 12, modeloY + (modelo.indexOf(linha) * 13),
      { width: CW - 24, lineBreak: false });
  }
  doc.y = modeloY + modelo.length * 13 + 12;

  rodapePagina(doc, id);
}

// ─── PÁGINA 5 — Referências ───────────────────────────────────────────────────

function paginaReferencias(doc: PDFKit.PDFDocument, dados: RespostaAnalise) {
  const { id, taxaBCB } = dados;

  cabecalhoPagina(doc, "Referências e Glossário", 6, 6);

  secao(doc, "Fontes e links úteis");

  const links: [string, string][] = [
    ["API SGS — Banco Central do Brasil",
     `https://api.bcb.gov.br/dados/serie/bcdata.sgs.${taxaBCB.codigoSerie}/dados?formato=json`],
    ["Portal de Dados Abertos do BCB", "https://dadosabertos.bcb.gov.br/"],
    ["Calculadora do Cidadão — BCB", "https://www3.bcb.gov.br/CALCJUROS/"],
    ["consumidor.gov.br", "https://www.consumidor.gov.br/"],
    ["PROCON — Encontre o do seu estado", "https://www.consumidor.gov.br/pages/conteudo/publico/5"],
    ["Ouvidoria do Banco Central", "https://www.bcb.gov.br/acessoinformacao/ouvidoria"],
    ["Texto completo do CDC (Lei 8.078/90)", "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm"],
    ["Súmula 297 do STJ", "https://www.stj.jus.br/docs_internet/revista/eletronica/stj-revista-sumulas-2011_26_capSumula297.pdf"],
  ];

  for (const [label, url] of links) {
    doc.fillColor(C.text).font("Helvetica-Bold").fontSize(9)
      .text(label, MARGIN, doc.y, { lineBreak: false });
    doc.y += 13;
    doc.fillColor(C.accent).font("Helvetica").fontSize(8)
      .text(url, MARGIN + 10, doc.y, { width: CW - 10 });
    doc.moveDown(0.4);
  }

  secao(doc, "Glossário de termos financeiros");

  const glossario: [string, string][] = [
    ["Taxa de juros (% a.m.)",
     "Percentual cobrado mensalmente sobre o saldo devedor. Expressa o custo do dinheiro no tempo."],
    ["Juros compostos",
     "Regime em que os juros de cada período são incorporados ao capital para o cálculo dos juros seguintes (juros sobre juros)."],
    ["Taxa anual efetiva",
     "Equivalente anual da taxa mensal, calculada por (1 + i_m)^12 - 1. Representa o custo real anual da operação."],
    ["Taxa média BCB",
     "Média ponderada das taxas de todas as operações daquela modalidade, divulgada mensalmente pelo Banco Central."],
    ["SGS",
     "Sistema Gerenciador de Séries Temporais do Banco Central do Brasil. Armazena e disponibiliza dados históricos de indicadores econômicos."],
    ["CDC",
     "Código de Defesa do Consumidor (Lei Federal 8.078/1990). Principal instrumento de proteção nas relações de consumo, inclusive serviços financeiros."],
    ["Procon",
     "Órgão estadual de proteção e defesa do consumidor. Pode mediar conflitos, aplicar multas e orientar consumidores gratuitamente."],
    ["Revisão contratual",
     "Pedido formal para renegociar as condições de um contrato (taxa, prazo, valor). Pode ser feita administrativamente ou via ação judicial."],
  ];

  for (const [termo, def] of glossario) {
    const y = doc.y;
    doc.rect(MARGIN, y, CW, 1).fill(C.lightGray);
    doc.y = y + 6;
    doc.fillColor(C.primary).font("Helvetica-Bold").fontSize(9)
      .text(termo, MARGIN, doc.y, { continued: true });
    doc.fillColor(C.text).font("Helvetica").fontSize(9)
      .text(`  ${def}`, { width: CW });
    doc.moveDown(0.3);
  }

  rodapePagina(doc, id);
}

// ─── Exportação principal ─────────────────────────────────────────────────────

export async function gerarRelatorioPDF(dados: RespostaAnalise): Promise<Buffer> {
  // Importa gerador de IA dinamicamente (server-only)
  const { gerarAnaliseIA } = await import("@/lib/ai-analysis");
  const ai = dados.analiseIA ?? (await gerarAnaliseIA(dados));

  return new Promise((resolve, reject) => {
    const pageOpts = { margins: { top: 0, bottom: 40, left: MARGIN, right: MARGIN } };

    const doc = new PDFDocument({
      size: "A4",
      ...pageOpts,
      info: {
        Title:    "Relatório de Análise Comparativa de Taxas de Juros",
        Author:   "AuditCrédito",
        Subject:  "Análise educacional de taxas de crédito com IA",
        Creator:  "AuditCrédito — Ferramenta educacional independente",
        Keywords: "juros, crédito, banco central, análise, comparativo, IA",
      },
      bufferPages: true,
    });

    const chunks: Buffer[] = [];
    doc.on("data",  (chunk: Buffer) => chunks.push(chunk));
    doc.on("end",   ()              => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Página 1 — Capa
    paginaCapa(doc, dados);

    // Página 2 — Resumo da Análise
    doc.addPage(pageOpts);
    paginaResumo(doc, dados);

    // Página 3 — Análise Personalizada por IA (NOVA)
    doc.addPage(pageOpts);
    paginaAnaliseIA(doc, dados, ai);

    // Página 4 — Detalhamento Técnico
    doc.addPage(pageOpts);
    paginaDetalhamento(doc, dados);

    // Página 5 — Orientações e Próximos Passos
    doc.addPage(pageOpts);
    paginaOrientacoes(doc, dados);

    // Página 6 — Referências e Glossário
    doc.addPage(pageOpts);
    paginaReferencias(doc, dados);

    doc.end();
  });
}
