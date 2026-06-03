/**
 * ai-analysis.ts — v3
 * Modelo: nvidia/llama-3.1-nemotron-70b-instruct (melhor modelo de instrução da NVIDIA)
 * Gera laudo jurídico-financeiro ultra-detalhado para o relatório PDF de 8 páginas.
 */

import type { RespostaAnalise } from "@/types";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Configuração ─────────────────────────────────────────────────────────────

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MODEL           = "nvidia/llama-3.1-nemotron-70b-instruct";
const TIMEOUT_MS      = 55_000;   // 55s — dentro do limite Vercel
const MAX_TOKENS      = 4_096;    // conteúdo completo e detalhado

// ─── Interface completa ───────────────────────────────────────────────────────

export interface AnaliseIA {
  // Diagnóstico Geral
  diagnostico:          string;   // 4-5 frases técnicas do caso
  riscoJuridico:        string;   // "ALTO — justificativa"
  nivelRisco:           "BAIXO" | "MÉDIO" | "ALTO";
  probabilidadeSucesso: string;   // "ALTA (75-85%) — justificativa"

  // Fundamentação Legal
  fundamentacaoLegal:   string;   // 3 parágrafos separados por \n\n
  precedentesJudiciais: string[]; // [3] súmulas/acórdãos específicos
  direitosConsumidor:   string[]; // [5] direitos concretos com base legal

  // Análise Financeira
  impactoFinanceiro:    string;   // 2-3 parágrafos
  cenarioRestituicao:   string;   // 2 parágrafos

  // Estratégia
  estrategiaCompleta:   string;   // 4 parágrafos
  roteirNegociacao:     string;   // script completo com 6+ parágrafos
  canaisRecomendados:   string[]; // [4] canais específicos com instruções

  // Plano de Ação
  acoes7Dias:           string[]; // [3] ações urgentes
  acoes30Dias:          string[]; // [3] ações do 1º mês
  acoes90Dias:          string[]; // [3] ações dos 3 meses

  // Alertas & Prazos
  alertasEspeciais:     string[]; // [5] alertas específicos do caso
  prazosCriticos:       string;   // prazos prescricionais e urgência

  // Resumo
  estimativaEconomia:   string;
  geradoPor:            string;
}

// ─── Referências legais por tipo de crédito ──────────────────────────────────

const REF_LEGAL: Record<string, string> = {
  cartao_rotativo:  "Resolução BCB 96/2021 (juros rotativos) e Lei 14.131/2021",
  cheque_especial:  "Resolução CMN 4.765/2019 (limite de 8% a.m. no cheque especial)",
  consignado:       "Lei 10.820/2003 e IN INSS 28/2008 (limites de margem consignável)",
  pessoal:          "Súmula 382/STJ e Resolução BCB 4.197/2013 (CET obrigatório)",
  cartao_parcelado: "Resolução BCB 96/2021 e normas de transparência no parcelamento de fatura",
};

// ─── Montagem do prompt ───────────────────────────────────────────────────────

function montarPrompt(dados: RespostaAnalise): string {
  const { resultado, taxaBCB, contrato, instituicao, nome } = dados;

  const tipo      = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const excesso   = resultado.percentualExcesso.toFixed(2);
  const difBRL    = resultado.diferencaAbusiva.toLocaleString("pt-BR",
                      { style: "currency", currency: "BRL" });
  const taxaCobr  = resultado.taxaCobrada.toFixed(4);
  const taxaBCBm  = resultado.taxaMediaBCB.toFixed(4);
  const difPP     = (resultado.taxaCobrada - resultado.taxaMediaBCB).toFixed(4);
  const taxaAnual = ((Math.pow(1 + resultado.taxaCobrada / 100, 12) - 1) * 100).toFixed(2);
  const valorOrig = resultado.valorOriginal.toLocaleString("pt-BR",
                      { style: "currency", currency: "BRL" });
  const meses     = resultado.periodoMeses;
  const dataRef   = new Date(contrato.dataContrato).toLocaleDateString("pt-BR",
                      { month: "long", year: "numeric" });
  const refLegal  = REF_LEGAL[contrato.tipoCredito] ?? "CDC arts. 6ºV, 39V, 51IV; Súmula 297/STJ";

  return `Você é Dr. Roberto Fonseca, advogado sênior com 20 anos de experiência exclusiva em direito bancário e do consumidor no Brasil. Produziu mais de 8.000 laudos técnicos, é professor da FGV Direito e conhece profundamente as táticas de negociação de todos os grandes bancos brasileiros.

═══ DADOS REAIS DO CASO — USE APENAS ESSES NÚMEROS ═══

Cliente: ${nome}
Banco / Instituição: ${instituicao}
Modalidade: ${tipo}
Principal financiado: ${valorOrig}
Taxa cobrada pela instituição: ${taxaCobr}% a.m. (${taxaAnual}% a.a. efetivo)
Taxa média do mercado — BCB série SGS ${taxaBCB.codigoSerie}: ${taxaBCBm}% a.m.
Excesso sobre a média BCB: ${excesso}% (diferença de ${difPP}pp ao mês)
Diferença financeira total apurada: ${difBRL} ao longo de ${meses} meses
Legislação específica aplicável: ${refLegal}
Data de referência do contrato: ${dataRef}

═══ INSTRUÇÃO: PRODUZA O LAUDO EM JSON — RETORNE SOMENTE O JSON ═══

{
  "diagnostico": "ESCREVA 4-5 frases técnicas de diagnóstico preciso deste caso específico. Mencione ${nome}, ${instituicao}, ${tipo}, taxa de ${taxaCobr}% a.m. versus referência BCB de ${taxaBCBm}% a.m., excesso de ${excesso}% e diferença de ${difBRL}. Explique o impacto prático dessa diferença para o cliente.",

  "riscoJuridico": "FORMATO OBRIGATÓRIO: 'ALTO — [justificativa de 1 frase baseada nos dados reais do caso]' OU 'MÉDIO — [justificativa]' OU 'BAIXO — [justificativa]'",

  "nivelRisco": "ALTO ou MÉDIO ou BAIXO (somente uma dessas três palavras)",

  "probabilidadeSucesso": "FORMATO: 'ALTA (75-85%) — [justificativa específica para este caso]' OU 'MÉDIA (50-65%) — ...' OU 'BAIXA (30-45%) — ...'",

  "fundamentacaoLegal": "ESCREVA 3 PARÁGRAFOS separados por dois saltos de linha. PARÁGRAFO 1: Base legal primária — cite ${refLegal} e CDC arts. 6ºV, 39V, 51IV explicando como cada norma se aplica a ${tipo}. PARÁGRAFO 2: Jurisprudência — Súmula 297/STJ (CDC aplicável a bancos), acórdãos do STJ sobre taxas abusivas em ${tipo}, precedentes favoráveis ao consumidor. PARÁGRAFO 3: Aplicação concreta — como ${nome} usa o excesso de ${excesso}% sobre a taxa BCB como fundamento jurídico contra ${instituicao}, o que deve provar e como.",

  "precedentesJudiciais": [
    "STJ — [Súmula ou REsp específico com número]: [ementa resumida em 2 linhas diretamente aplicável a ${tipo}]",
    "STJ — [Acórdão ou Súmula]: [ementa sobre taxas abusivas ou revisão contratual bancária em 2 linhas]",
    "TJ ou STJ — [Decisão]: [caso análogo de revisão de ${tipo} contra banco com resultado favorável ao consumidor em 2 linhas]"
  ],

  "direitosConsumidor": [
    "Direito à informação plena: art. 6º, III, CDC — [como ${instituicao} deve ter informado sobre a taxa e o CET deste contrato]",
    "Direito à revisão de cláusulas onerosas: art. 6º, V, CDC — [quais cláusulas deste contrato de ${tipo} podem ser revistas]",
    "Proteção contra vantagem excessiva: art. 39, V, CDC — [como o excesso de ${excesso}% configura vantagem manifestamente excessiva]",
    "Nulidade de cláusulas abusivas: art. 51, IV, CDC — [o que pode ser declarado nulo neste contrato com ${instituicao}]",
    "Acesso a canais de reclamação: Res. BCB 4.433/2015 (ouvidoria obrigatória) — [como exercer esse direito contra ${instituicao}]"
  ],

  "impactoFinanceiro": "ESCREVA 2-3 PARÁGRAFOS. PARÁGRAFO 1: O que ${difBRL} representa concretamente — salários mínimos equivalentes, meses de pagamento, o que esse valor compraria. PARÁGRAFO 2: Como ${difPP}pp a mais ao mês se transforma em ${difBRL} em ${meses} meses pela força dos juros compostos — explique de forma acessível para leigos. PARÁGRAFO 3 (inclua): Oportunidade de custo — o que o consumidor poderia ter feito com esse valor ou como ele impactou o endividamento.",

  "cenarioRestituicao": "ESCREVA 2 PARÁGRAFOS. PARÁGRAFO 1: O que é possível conseguir concretamente — abatimento no saldo devedor atual, devolução de valores pagos a mais nos últimos 5 anos, redução das parcelas futuras — específico para ${tipo} com ${instituicao} com estimativas realistas. PARÁGRAFO 2: Vias disponíveis por ordem de facilidade — negociação direta (mais rápida), ouvidoria (10 dias úteis), consumidor.gov.br, Procon, JEC (sem advogado até 40 salários mínimos), ação judicial — com vantagens e tempo médio de cada uma.",

  "estrategiaCompleta": "ESCREVA 4 PARÁGRAFOS DISTINTOS. PARÁGRAFO 1: Perfil de ${instituicao} — como esse banco costuma responder a pedidos de revisão de ${tipo}, receptividade histórica, argumentos que costumam usar para negar. PARÁGRAFO 2: Abordagem inicial — canal exato, horário, postura recomendada, documentos a ter em mãos, linguagem a usar. PARÁGRAFO 3: Escalada — se sem resposta em 10 dias, como acionar a ouvidoria, Procon e consumidor.gov.br simultaneamente. PARÁGRAFO 4: Argumento central irrefutável — como apresentar a comparação BCB (${taxaBCBm}% vs ${taxaCobr}%) como dado oficial do próprio governo que o banco não pode contestar.",

  "roteirNegociacao": "ESCREVA SCRIPT COMPLETO com no mínimo 6 parágrafos numerados. (1) Abertura: como se identificar, tom de voz, o que pedir imediatamente (falar com setor de renegociação/retenção). (2) Apresentação do laudo: como mencionar os dados do BCB de forma simples e impactante sem usar termos técnicos. (3) Resposta à objeção 'a taxa é contratual': argumento assertivo com base no CDC. (4) Resposta à objeção 'não podemos alterar': como mencionar o direito de revisão e os órgãos reguladores. (5) Solicitação de escalada: o que dizer exatamente para falar com supervisor ou registrar na ouvidoria. (6) Encerramento: como registrar protocolo, confirmar prazo de retorno e próximos passos se não houver resposta.",

  "canaisRecomendados": [
    "${instituicao} — Atendimento / Retenção: [número de telefone geral ou SAC, app ou site] — Solicitar: [palavras exatas para pedir renegociação da taxa de ${tipo}]",
    "${instituicao} — Ouvidoria: [como acessar — site/telefone], prazo de 10 dias úteis (obrigatório por lei) — Apresentar: [quais dados e documentos]",
    "consumidor.gov.br: registrar contra ${instituicao} em [categoria exata no site] — Descrever: [o que escrever na reclamação para ter mais chances de resposta]",
    "Banco Central — Registrato e Ouvidoria (www.bcb.gov.br/ouvidoria): usar quando ${instituicao} não resolver — [o que reportar e como, prazo de resposta]"
  ],

  "acoes7Dias": [
    "Reunir documentação: [lista específica — contrato assinado, extratos dos últimos 3 meses, comprovantes de pagamento, CET se disponível]",
    "Primeiro contato formal com ${instituicao}: [canal preferencial + o que dizer + como registrar o protocolo de atendimento]",
    "Abrir reclamação no consumidor.gov.br contra ${instituicao}: [passo a passo simplificado e o que incluir na descrição para maximizar resposta]"
  ],

  "acoes30Dias": [
    "Se sem retorno satisfatório em 10 dias: acionar ouvidoria do ${instituicao} — [como fazer, número de protocolo anterior a mencionar]",
    "Organizar dossiê documental: [quais comunicações salvar, como fazer print/PDF das conversas, protocolo de cada atendimento]",
    "Consultar Procon estadual: [como agendar — presencial ou online — o que levar, valores típicos de mediação para ${tipo}]"
  ],

  "acoes90Dias": [
    "JEC — Juizado Especial Cível: [como protocolar a ação, o que apresentar como prova — este laudo + extratos + protocolos anteriores, valor da causa de até ${difBRL}]",
    "Advogado especializado em direito bancário: [o que procurar, onde encontrar (OAB, Procon, indicações), honorários típicos, modalidade de êxito]",
    "Monitorar prescrição: calcular data exata com base em ${dataRef} — prazo de 5 anos significa que a ação deve ser ajuizada antes de [ano aproximado de prescrição]"
  ],

  "alertasEspeciais": [
    "ATENÇÃO — Risco específico de ${tipo}: [alerta importante sobre característica particular desta modalidade que o consumidor precisa saber]",
    "PRAZO CRÍTICO: o contrato referente a ${dataRef} prescreve para revisão judicial em 5 anos — não deixe para a última hora",
    "CUIDADO — Armadilha de renegociação: bancos frequentemente oferecem 'refinanciamento' que parece vantajoso mas aumenta o prazo e o total pago — compare o CET antes de aceitar qualquer proposta",
    "DOCUMENTAÇÃO URGENTE: solicite por escrito ao ${instituicao} o extrato completo do contrato com amortização mês a mês e o CET — você tem esse direito pela Res. BCB 3.517/2007",
    "SCORE DE CRÉDITO: o processo de revisão NÃO afeta negativamente seu score — registrar reclamações em órgãos reguladores é um direito e não resulta em negativação"
  ],

  "prazosCriticos": "Detalhes precisos dos prazos: (1) Prescrição para ação revisional — CDC art. 27: 5 anos a partir de cada pagamento; CC art. 206 §5º I: 5 anos — considerando ${dataRef}, monitorar com atenção. (2) Ouvidoria do banco: prazo obrigatório de 10 dias úteis (Res. BCB 4.433/2015 — descumprimento pode ser reportado ao BCB). (3) consumidor.gov.br: empresa tem 10 dias corridos para responder. (4) Procon: mediação em geral em 30-60 dias. (5) JEC: sentença em média em 6-18 meses. (6) Urgência: quanto mais cedo agir, mais períodos de pagamento dentro do prazo prescricional poderão ser considerados.",

  "estimativaEconomia": "Com base na diferença comprovada de ${difBRL} (excesso de ${excesso}% sobre a taxa BCB de ${taxaBCBm}% a.m.), o potencial de economia — seja por abatimento no saldo devedor, devolução de valores ou redução de parcelas futuras — pode chegar a ${difBRL}, dependendo da via escolhida e da receptividade de ${instituicao} à negociação.",

  "geradoPor": "NVIDIA NIM — nvidia/llama-3.1-nemotron-70b-instruct"
}

REGRAS ABSOLUTAS — VIOLAÇÃO INVALIDA O LAUDO:
1. RETORNE SOMENTE O JSON VÁLIDO — zero texto fora do JSON
2. Use EXATAMENTE os números fornecidos: taxa ${taxaCobr}%, BCB ${taxaBCBm}%, excesso ${excesso}%, diferença ${difBRL}
3. Todo conteúdo em português brasileiro formal e acessível — sem legalês excessivo
4. alertasEspeciais: EXATAMENTE 5 itens no array
5. precedentesJudiciais: EXATAMENTE 3 itens no array
6. direitosConsumidor: EXATAMENTE 5 itens no array
7. acoes7Dias, acoes30Dias, acoes90Dias: EXATAMENTE 3 itens cada
8. canaisRecomendados: EXATAMENTE 4 itens no array
9. fundamentacaoLegal e estrategiaCompleta: MÍNIMO 3 parágrafos cada
10. roteirNegociacao: MÍNIMO 5 parágrafos numerados`;
}

// ─── Chamada à API NVIDIA ─────────────────────────────────────────────────────

async function chamarNVIDIA(prompt: string): Promise<string> {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY não configurada.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method:  "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       MODEL,
        messages:    [{ role: "user", content: prompt }],
        temperature: 0.25,      // baixo para consistência e precisão
        max_tokens:  MAX_TOKENS,
        top_p:       0.9,
      }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      throw new Error(`NVIDIA API ${resp.status}: ${err.slice(0, 300)}`);
    }

    const json = await resp.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    return json.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timer);
  }
}

// ─── Parse seguro do JSON ─────────────────────────────────────────────────────

function parseAnalise(raw: string): AnaliseIA | null {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const p = JSON.parse(match[0]) as Partial<AnaliseIA>;

    const fixArray = (v: unknown, tam: number, fallback: string): string[] => {
      let arr = Array.isArray(v) ? (v as string[]) : [String(v ?? fallback)];
      while (arr.length < tam) arr.push(fallback);
      return arr.slice(0, tam);
    };

    const nivel = (["BAIXO", "MÉDIO", "ALTO"] as const)
      .find(n => String(p.nivelRisco ?? "").toUpperCase().includes(n)) ?? "MÉDIO";

    return {
      diagnostico:          p.diagnostico          ?? "Análise personalizada não disponível.",
      riscoJuridico:        p.riscoJuridico        ?? `${nivel} — avalie com profissional especializado.`,
      nivelRisco:           nivel,
      probabilidadeSucesso: p.probabilidadeSucesso ?? "MÉDIA (50-65%) — depende do caso concreto.",
      fundamentacaoLegal:   p.fundamentacaoLegal   ?? "CDC arts. 6º V, 39 V, 51 IV; Súmula 297/STJ.",
      precedentesJudiciais: fixArray(p.precedentesJudiciais, 3, "Consulte jurisprudência atualizada do STJ."),
      direitosConsumidor:   fixArray(p.direitosConsumidor,   5, "Consulte o CDC para seus direitos completos."),
      impactoFinanceiro:    p.impactoFinanceiro    ?? "Análise de impacto financeiro não disponível.",
      cenarioRestituicao:   p.cenarioRestituicao   ?? "Consulte um advogado para cenários de restituição.",
      estrategiaCompleta:   p.estrategiaCompleta   ?? "Solicite revisão formal por escrito ao banco.",
      roteirNegociacao:     p.roteirNegociacao     ?? "Apresente os dados do BCB e peça revisão da taxa.",
      canaisRecomendados:   fixArray(p.canaisRecomendados, 4, "Consulte o site do banco."),
      acoes7Dias:           fixArray(p.acoes7Dias,   3, "Reúna os documentos do contrato."),
      acoes30Dias:          fixArray(p.acoes30Dias,  3, "Acione a ouvidoria do banco."),
      acoes90Dias:          fixArray(p.acoes90Dias,  3, "Avalie acesso ao Juizado Especial Cível."),
      alertasEspeciais:     fixArray(p.alertasEspeciais, 5, "Guarde todos os comprovantes de pagamento."),
      prazosCriticos:       p.prazosCriticos        ?? "Prazo prescricional geral: 5 anos (CDC art. 27).",
      estimativaEconomia:   p.estimativaEconomia    ?? "Consulte advogado para estimar a economia.",
      geradoPor:            p.geradoPor             ?? MODEL,
    };
  } catch {
    return null;
  }
}

// ─── Fallback completo ────────────────────────────────────────────────────────

function fallbackAnalise(dados: RespostaAnalise): AnaliseIA {
  const { resultado, contrato, taxaBCB, instituicao, nome } = dados;
  const tipo   = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const difBRL = resultado.diferencaAbusiva.toLocaleString("pt-BR",
                   { style: "currency", currency: "BRL" });
  const excs   = resultado.percentualExcesso.toFixed(2);
  const meses  = resultado.periodoMeses;

  const nivelMap: Record<string, "BAIXO" | "MÉDIO" | "ALTO"> = {
    DENTRO_DA_MEDIA:        "BAIXO",
    ACIMA_DA_MEDIA:         "MÉDIO",
    POTENCIALMENTE_ABUSIVO: "ALTO",
  };
  const nivel = nivelMap[resultado.status] ?? "MÉDIO";

  return {
    diagnostico:
      `A análise comparativa do contrato de ${tipo.toLowerCase()} firmado com ${instituicao} identificou que ` +
      `a taxa mensal de juros cobrada (${resultado.taxaCobrada.toFixed(4)}% a.m.) supera em ${excs}% a taxa média ` +
      `divulgada pelo Banco Central do Brasil para a mesma modalidade (${resultado.taxaMediaBCB.toFixed(4)}% a.m., ` +
      `série SGS ${taxaBCB.codigoSerie}). Ao longo de ${meses} meses, essa diferença resultou em uma cobrança ` +
      `adicional de ${difBRL}, calculada pelo regime de juros compostos (M = P × (1+i)ⁿ). ` +
      `O caso apresenta fundamentos jurídicos relevantes para revisão contratual com base no Código de Defesa do Consumidor.`,

    riscoJuridico:
      nivel === "ALTO"
        ? `ALTO — excesso de ${excs}% sobre a taxa BCB configura fundamento sólido para contestação.`
        : nivel === "MÉDIO"
        ? `MÉDIO — taxa acima da média; recomendável negociar revisão com base nos dados do BCB.`
        : `BAIXO — taxa dentro da média de mercado; avalie custo-benefício antes de contestar.`,

    nivelRisco: nivel,

    probabilidadeSucesso:
      nivel === "ALTO" ? "ALTA (70-80%) — excesso expressivo e fundamentação jurídica sólida."
      : nivel === "MÉDIO" ? "MÉDIA (50-60%) — possível negociar, resultado depende do banco."
      : "BAIXA (30-40%) — taxa dentro da média; menos fundamentos para revisão.",

    fundamentacaoLegal:
      `O Código de Defesa do Consumidor (Lei 8.078/90), aplicável às instituições financeiras ` +
      `por força da Súmula 297 do Superior Tribunal de Justiça, garante ao consumidor o direito ` +
      `à modificação de cláusulas contratuais que estabeleçam prestações desproporcionais (art. 6º, V) ` +
      `e proíbe ao fornecedor exigir vantagem manifestamente excessiva (art. 39, V). ` +
      `Cláusulas que gerem desequilíbrio expressivo podem ser declaradas nulas (art. 51, IV).\n\n` +
      `A jurisprudência do STJ consolidou o entendimento de que as taxas de juros em contratos ` +
      `bancários podem ser revistas quando demonstrado abuso, não se aplicando a limitação ` +
      `constitucional de 12% ao ano, mas sendo possível a revisão quando comprovada a abusividade ` +
      `por comparação com as médias do mercado divulgadas pelo Banco Central (REsp 1.061.530/RS, ` +
      `Recurso Repetitivo, e Súmula 382/STJ para crédito pessoal).\n\n` +
      `No caso em análise, a diferença de ${excs}% acima da taxa média BCB para ${tipo.toLowerCase()} ` +
      `constitui indício concreto de onerosidade excessiva. ${nome} pode utilizar os dados oficiais ` +
      `do SGS/BCB (série ${taxaBCB.codigoSerie}) como prova documental idônea, de fonte governamental, ` +
      `para fundamentar pedido administrativo de revisão junto a ${instituicao} e, se necessário, ` +
      `ação judicial no Juizado Especial Cível.`,

    precedentesJudiciais: [
      "STJ — Súmula 297: 'O Código de Defesa do Consumidor é aplicável às instituições financeiras.' — Fundamento central para revisão de contratos bancários.",
      "STJ — REsp 1.061.530/RS (Recurso Repetitivo): 'É possível a revisão das taxas de juros quando comprovada a onerosidade excessiva por comparação com as médias de mercado.' — Precedente vinculante.",
      "STJ — Súmula 382: 'A estipulação de juros remuneratórios superiores a 12% ao ano, por si só, não indica abusividade — mas a comparação com a média BCB é o critério adequado.' — Parâmetro de análise.",
    ],

    direitosConsumidor: [
      "Direito à informação plena: art. 6º, III, CDC — o banco deve informar claramente a taxa efetiva (CET) antes da contratação.",
      "Direito à revisão de cláusulas onerosas: art. 6º, V, CDC — cláusulas com prestações desproporcionais podem ser revistas judicialmente.",
      "Proteção contra vantagem excessiva: art. 39, V, CDC — é vedado cobrar vantagem manifestamente excessiva do consumidor.",
      "Nulidade de cláusulas abusivas: art. 51, IV, CDC — cláusulas que estabelecem obrigações iníquas ou abusivas são nulas de pleno direito.",
      "Acesso à ouvidoria: Res. BCB 4.433/2015 — toda instituição financeira deve ter ouvidoria com prazo de 10 dias úteis para resposta obrigatória.",
    ],

    impactoFinanceiro:
      `A diferença de ${difBRL} representa um impacto concreto e mensurável no orçamento de ${nome}. ` +
      `Em termos práticos, esse valor equivale a vários meses de pagamentos realizados exclusivamente ` +
      `para remunerar uma taxa acima do que o mercado pratica, sem contraprestação equivalente. ` +
      `É dinheiro que poderia ter sido direcionado para quitação de dívidas, investimento ou consumo.\n\n` +
      `O mecanismo dos juros compostos amplifica exponencialmente pequenas diferenças de taxa ao longo ` +
      `do tempo. Uma diferença de apenas ${(resultado.taxaCobrada - resultado.taxaMediaBCB).toFixed(4)}pp ` +
      `ao mês, aparentemente pequena, resulta em uma cobrança adicional de ${difBRL} ao final de ` +
      `${meses} meses — pois a diferença incide mês a mês sobre um saldo crescente.`,

    cenarioRestituicao:
      `Em um cenário de negociação bem-sucedida com ${instituicao}, é possível obter: ` +
      `(a) abatimento direto no saldo devedor atual; (b) devolução de parte dos valores ` +
      `pagos a mais nos últimos 5 anos, por meio de crédito na conta; ou (c) redução ` +
      `nas parcelas futuras para adequação à taxa de mercado. O resultado dependerá ` +
      `da receptividade do banco e da solidez dos documentos apresentados.\n\n` +
      `As vias disponíveis, em ordem crescente de complexidade, são: (1) negociação direta ` +
      `com o banco (mais rápida, resultado em até 30 dias); (2) consumidor.gov.br — prazo ` +
      `de 10 dias corridos; (3) Procon estadual — mediação gratuita; (4) Juizado Especial ` +
      `Cível — sem advogado obrigatório para causas até 40 salários mínimos, sentença em ` +
      `6-18 meses; (5) ação judicial ordinária — quando o valor justificar honorários advocatícios.`,

    estrategiaCompleta:
      `${instituicao} é uma das maiores instituições do país e, como tal, possui estruturas ` +
      `formalizadas de atendimento e ouvidoria. Em geral, o banco responde a pedidos de revisão ` +
      `de ${tipo.toLowerCase()} com mais receptividade quando o cliente apresenta dados concretos ` +
      `e documentação organizada, em vez de apenas reclamar verbalmente.\n\n` +
      `A abordagem inicial mais eficaz é contato direto pelo canal de retenção ou atendimento ` +
      `preferencial, com os dados do laudo em mãos. Apresente a comparação BCB com naturalidade: ` +
      `"segundo dados oficiais do Banco Central, a taxa média para meu tipo de crédito era de ` +
      `${resultado.taxaMediaBCB.toFixed(4)}% a.m., e meu contrato prevê ${resultado.taxaCobrada.toFixed(4)}% a.m." ` +
      `Solicite revisão e peça proposta formal por escrito.\n\n` +
      `Se não houver resposta satisfatória em 10 dias, acione simultaneamente a ouvidoria do banco ` +
      `e registre reclamação no consumidor.gov.br. Isso cria um registro formal e pressão institucional. ` +
      `A maioria dos grandes bancos responde com mais agilidade quando há registro em plataformas públicas ` +
      `que afetam sua reputação e métricas de atendimento regulatório.\n\n` +
      `O argumento central e irrefutável é a taxa BCB: são dados oficiais do governo brasileiro, ` +
      `públicos, verificáveis e atualizados mensalmente. O banco não pode contestar a fonte — ` +
      `pode apenas apresentar justificativas para sua política de precificação. Use isso como âncora ` +
      `de todo o processo de negociação.`,

    roteirNegociacao:
      `(1) ABERTURA: "Bom dia/tarde, meu nome é [nome completo] e sou cliente do [banco] com o contrato ` +
      `número [número]. Preciso falar com o setor de renegociação ou retenção sobre meu contrato de ` +
      `${tipo.toLowerCase()}. Por favor, me conecte com esse setor."\n\n` +
      `(2) APRESENTAÇÃO: "Realizei uma análise comparativa da minha taxa utilizando os dados oficiais ` +
      `do Banco Central do Brasil. A taxa média do mercado para meu tipo de crédito era de ` +
      `${resultado.taxaMediaBCB.toFixed(4)}% ao mês no período do meu contrato, e estou sendo cobrado ` +
      `${resultado.taxaCobrada.toFixed(4)}% ao mês — uma diferença de ${excs}% acima da média. ` +
      `Isso representa ${difBRL} a mais ao longo do contrato. Quero solicitar formalmente a revisão."\n\n` +
      `(3) OBJEÇÃO 'A TAXA É CONTRATUAL': "Entendo que a taxa está no contrato, mas o Código de Defesa ` +
      `do Consumidor — aplicável a bancos pela Súmula 297 do STJ — garante ao consumidor o direito de ` +
      `revisar cláusulas que estabeleçam prestações desproporcionais em relação ao mercado. ` +
      `Os dados do Banco Central são a referência oficial para essa comparação."\n\n` +
      `(4) OBJEÇÃO 'NÃO PODEMOS ALTERAR': "Compreendo sua posição, mas preciso que isso fique ` +
      `registrado. Peço que abra uma ocorrência formal e me forneça o número de protocolo. ` +
      `Também vou registrar uma reclamação na ouvidoria do banco, que tem prazo de 10 dias úteis ` +
      `para resposta obrigatória pela regulamentação do Banco Central."\n\n` +
      `(5) ESCALADA: "Por favor, transfira para o supervisor ou me informe como acionar a ouvidoria. ` +
      `Tenho todos os documentos organizados e pretendo utilizar também o consumidor.gov.br ` +
      `e o Banco Central se necessário."\n\n` +
      `(6) ENCERRAMENTO: "Antes de encerrar, preciso do número de protocolo desta conversa, ` +
      `seu nome e matrícula, e a data prevista para retorno. Vou aguardar o prazo combinado ` +
      `e caso não haja retorno, seguirei com os canais regulatórios disponíveis."`,

    canaisRecomendados: [
      `${instituicao} — SAC / Atendimento: consulte o número no verso do cartão ou site oficial — Solicitar: "revisão de taxa por comparação com a média do Banco Central para ${tipo.toLowerCase()}"`,
      `${instituicao} — Ouvidoria: acesse pelo site oficial (Fale Conosco > Ouvidoria) — prazo obrigatório de 10 dias úteis (Res. BCB 4.433/2015) — Apresentar protocolo do SAC + dados do BCB`,
      `consumidor.gov.br: registrar reclamação contra ${instituicao} na categoria "Crédito e Financiamento > Taxas e encargos" — mencionar a diferença de ${difBRL} e o número da série BCB ${taxaBCB.codigoSerie}`,
      `Banco Central — Ouvidoria (www.bcb.gov.br/acessoinformacao/ouvidoria): usar se o banco não resolver — reportar descumprimento de norma regulatória — resposta em até 30 dias`,
    ],

    acoes7Dias: [
      `Reunir documentação completa: contrato original assinado, extratos dos últimos 3 meses, todos os comprovantes de pagamento e, se disponível, o CET (Custo Efetivo Total) informado na contratação`,
      `Contato formal com ${instituicao}: ligar para o SAC e solicitar revisão da taxa com base nos dados do BCB — registrar o protocolo de atendimento e o nome do atendente`,
      `Registrar reclamação no consumidor.gov.br: preencher com dados do contrato, taxa cobrada (${resultado.taxaCobrada.toFixed(4)}%) vs. taxa BCB (${resultado.taxaMediaBCB.toFixed(4)}%) e diferença de ${difBRL}`,
    ],

    acoes30Dias: [
      `Se sem retorno satisfatório em 10 dias: acionar a ouvidoria de ${instituicao} — mencionar o protocolo do SAC e que o prazo regulatório de 10 dias úteis será monitorado`,
      `Documentar todas as comunicações: salvar prints das conversas digitais, anotar datas e nomes de atendentes, arquivar protocolo de cada canal acionado`,
      `Consultar Procon estadual: agendar atendimento (presencial ou online) com todos os documentos e protocolos anteriores para mediação gratuita`,
    ],

    acoes90Dias: [
      `JEC — Juizado Especial Cível: protocolar ação com valor de causa de até ${difBRL} — apresentar este laudo + extratos + todos os protocolos de tentativas anteriores como prova documental`,
      `Buscar advogado especializado em direito bancário: OAB ou indicações do Procon — solicitar orçamento com honorários de êxito (sem custo inicial) para causas de revisão contratual`,
      `Monitorar prescrição: a ação revisional deve ser ajuizada no prazo de 5 anos — com base em ${dataRef}, acompanhe o prazo com atenção e não deixe para a última hora`,
    ],

    alertasEspeciais: [
      `ATENÇÃO: em renegociações de ${tipo.toLowerCase()}, o banco pode oferecer "portabilidade" ou "refinanciamento" que parece vantajoso mas aumenta o prazo e o valor total — sempre compare o CET completo antes de assinar qualquer proposta`,
      `PRAZO CRÍTICO: o prazo prescricional de 5 anos começa a contar da data de cada pagamento — cobranças realizadas há mais de 5 anos não podem ser recuperadas judicialmente`,
      `CUIDADO: nunca assine qualquer documento que contenha cláusula de "quitação de obrigações" ou "renúncia de direitos" — essa linguagem pode invalidar futuras reclamações`,
      `DOCUMENTAÇÃO URGENTE: solicite por escrito ao ${instituicao} o extrato completo com amortização mês a mês e o CET — você tem esse direito pela Resolução BCB 3.517/2007`,
      `SCORE DE CRÉDITO: registrar reclamações em órgãos reguladores NÃO afeta negativamente seu score — o processo de revisão é um direito e não resulta em negativação ou bloqueio de crédito`,
    ],

    prazosCriticos:
      `Prazo prescricional para ação revisional: 5 anos a partir de cada pagamento (CDC art. 27 e CC art. 206 §5º I). ` +
      `Ouvidoria do banco: resposta obrigatória em 10 dias úteis (Res. BCB 4.433/2015). ` +
      `consumidor.gov.br: empresa tem 10 dias corridos. ` +
      `JEC: sentença em 6-18 meses. ` +
      `Ação judicial ordinária: 2-4 anos. ` +
      `Considerando o contrato de ${dataRef}, o prazo prescricional deve ser monitorado com atenção nos próximos anos.`,

    estimativaEconomia:
      `Com base na diferença comprovada de ${difBRL} (excesso de ${excs}% sobre a taxa BCB), ` +
      `o potencial de economia — por abatimento no saldo, devolução de valores ou redução de parcelas — ` +
      `pode chegar a ${difBRL} mediante negociação com ${instituicao} ou ação no JEC.`,

    geradoPor: "Análise estrutural automatizada (fallback)",
  };
}

// ─── Exportação pública ───────────────────────────────────────────────────────

export async function gerarAnaliseIA(dados: RespostaAnalise): Promise<AnaliseIA> {
  try {
    const prompt = montarPrompt(dados);
    const raw    = await chamarNVIDIA(prompt);
    const parsed = parseAnalise(raw);

    if (parsed) {
      console.log(`[ai-analysis] Análise gerada — risco: ${parsed.nivelRisco} — modelo: ${MODEL}`);
      return parsed;
    }

    console.warn("[ai-analysis] JSON inválido retornado — usando fallback rico.");
    return fallbackAnalise(dados);

  } catch (err) {
    console.error("[ai-analysis] Erro:", err instanceof Error ? err.message : err);
    return fallbackAnalise(dados);
  }
}
