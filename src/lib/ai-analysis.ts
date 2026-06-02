/**
 * ai-analysis.ts
 * Integração com NVIDIA NIM para geração de análise jurídica/financeira
 * personalizada via modelo meta/llama-3.1-405b-instruct.
 *
 * Retorna um bloco de texto estruturado que é inserido na Página 3 do PDF.
 */

import type { RespostaAnalise } from "@/types";
import { ROTULO_TIPO_CREDITO } from "@/config/constants";

// ─── Constantes ───────────────────────────────────────────────────────────────

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MODEL           = "meta/llama-3.3-70b-instruct";   // rápido + excelente PT-BR
const TIMEOUT_MS      = 28_000;                            // 28s (dentro do limite Next.js)

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AnaliseIA {
  parecer:           string;   // Parágrafo principal de parecer (2–3 frases)
  riscoJuridico:     string;   // Avaliação do risco (BAIXO / MÉDIO / ALTO)
  fundamentacao:     string;   // Base legal resumida
  estrategiaNeg:     string;   // Estratégia de negociação personalizada
  acaoRecomendada:   string;   // Próximo passo mais urgente
  alertasEspeciais:  string[]; // Até 3 alertas específicos do caso
  estimativaEconomia:string;   // Ex: "Potencial redução de R$ X na dívida"
  geradoPor:         string;   // Identificação do modelo
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function montarPrompt(dados: RespostaAnalise): string {
  const { resultado, taxaBCB, contrato, instituicao, nome } = dados;
  const tipo       = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const excesso    = resultado.percentualExcesso.toFixed(2);
  const difBRL     = resultado.diferencaAbusiva.toLocaleString("pt-BR",
    { style: "currency", currency: "BRL" });
  const taxaCobr   = resultado.taxaCobrada.toFixed(4);
  const taxaBCBm   = resultado.taxaMediaBCB.toFixed(4);
  const valorOrig  = resultado.valorOriginal.toLocaleString("pt-BR",
    { style: "currency", currency: "BRL" });
  const meses      = resultado.periodoMeses;
  const status     = resultado.status;

  const dataRef = new Date(contrato.dataContrato).toLocaleDateString("pt-BR",
    { month: "long", year: "numeric" });

  return `Você é um especialista sênior em direito do consumidor bancário e finanças pessoais no Brasil, com 20 anos de experiência em revisão de contratos de crédito.

DADOS DO CASO:
- Cliente: ${nome}
- Tipo de crédito: ${tipo}
- Instituição financeira: ${instituicao}
- Valor financiado: ${valorOrig}
- Período analisado: ${meses} meses
- Data do contrato: ${dataRef}
- Taxa cobrada pela instituição: ${taxaCobr}% ao mês
- Taxa média do mercado (BCB, série ${taxaBCB.codigoSerie}): ${taxaBCBm}% ao mês
- Excesso sobre a média: ${excesso}%
- Diferença financeira apurada: ${difBRL}
- Status da auditoria: ${status}

TAREFA:
Analise este caso com profundidade e retorne um JSON EXATO com as seguintes chaves (sem texto fora do JSON):

{
  "parecer": "Parágrafo de 3 frases com parecer técnico personalizado para este caso específico. Mencione o tipo de crédito, o banco, o excesso percentual e a diferença em reais. Seja direto e informativo.",
  "riscoJuridico": "BAIXO, MÉDIO ou ALTO — com justificativa de 1 frase baseada no excesso percentual e tipo de crédito.",
  "fundamentacao": "Liste em 2-3 frases os artigos do CDC (art. 6º V, 39 V, 51 IV), Súmula 297 STJ e qualquer outra norma aplicável especificamente a ${tipo.toLowerCase()} no Brasil.",
  "estrategiaNeg": "Estratégia de negociação em 3-4 frases específica para este banco e tipo de crédito. Inclua o argumento principal a usar, o canal de atendimento mais eficaz e a postura recomendada.",
  "acaoRecomendada": "Uma única ação concreta e urgente que o cliente deve tomar nos próximos 7 dias, com detalhes práticos.",
  "alertasEspeciais": ["Alerta 1 específico deste caso", "Alerta 2 específico deste caso", "Alerta 3 específico deste caso"],
  "estimativaEconomia": "Frase de 1 linha sobre a economia potencial baseada nos ${difBRL} de diferença apurada.",
  "geradoPor": "NVIDIA NIM — ${MODEL}"
}

REGRAS CRÍTICAS:
1. Retorne SOMENTE o JSON válido, sem markdown, sem texto antes ou depois
2. Não use aspas simples dentro dos valores — use aspas duplas apenas na estrutura JSON
3. Baseie-se nos dados reais fornecidos — NÃO invente números
4. Escreva TODO o conteúdo em português brasileiro formal mas acessível
5. Seja específico ao tipo de crédito "${tipo}" e à instituição "${instituicao}"
6. Para CARTÃO DE CRÉDITO ROTATIVO: mencione a Resolução BCB 96/2021
7. Para CHEQUE ESPECIAL: mencione o limite de 8% ao mês (Resolução CMN 4.765/2019)
8. Para CONSIGNADO: mencione os limites da Lei 10.820/2003
9. Para CRÉDITO PESSOAL: mencione a Súmula 382 do STJ sobre juros
10. alertasEspeciais deve ter EXATAMENTE 3 itens no array`;
}

// ─── Chamada à API ────────────────────────────────────────────────────────────

async function chamarNVIDIA(prompt: string): Promise<string> {
  const key = process.env.NVIDIA_API_KEY;
  if (!key) throw new Error("NVIDIA_API_KEY não configurada.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:       MODEL,
        messages:    [{ role: "user", content: prompt }],
        temperature: 0.3,   // Baixo para respostas consistentes
        max_tokens:  1200,
        top_p:       0.9,
      }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      throw new Error(`NVIDIA API ${resp.status}: ${err.slice(0, 200)}`);
    }

    const json = await resp.json() as {
      choices: Array<{ message: { content: string } }>;
    };

    return json.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timer);
  }
}

// ─── Parse seguro do JSON retornado ──────────────────────────────────────────

function parseAnalise(raw: string): AnaliseIA | null {
  // Extrai bloco JSON (às vezes o modelo adiciona texto extra)
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]) as Partial<AnaliseIA>;

    // Garantir que alertasEspeciais é um array de 3 itens
    let alertas = parsed.alertasEspeciais ?? [];
    if (!Array.isArray(alertas)) alertas = [String(alertas)];
    while (alertas.length < 3) alertas.push("Guarde todos os comprovantes de pagamento.");
    alertas = alertas.slice(0, 3);

    return {
      parecer:           parsed.parecer           ?? "Análise personalizada não disponível.",
      riscoJuridico:     parsed.riscoJuridico     ?? "MÉDIO",
      fundamentacao:     parsed.fundamentacao     ?? "CDC arts. 6º, 39 e 51; Súmula 297 STJ.",
      estrategiaNeg:     parsed.estrategiaNeg     ?? "Solicite revisão formal por escrito ao banco.",
      acaoRecomendada:   parsed.acaoRecomendada   ?? "Acesse o consumidor.gov.br e registre sua reclamação.",
      alertasEspeciais:  alertas,
      estimativaEconomia:parsed.estimativaEconomia ?? "",
      geradoPor:         parsed.geradoPor          ?? MODEL,
    };
  } catch {
    return null;
  }
}

// ─── Fallback estático ────────────────────────────────────────────────────────

function fallbackAnalise(dados: RespostaAnalise): AnaliseIA {
  const { resultado, contrato } = dados;
  const tipo  = ROTULO_TIPO_CREDITO[contrato.tipoCredito];
  const difBRL = resultado.diferencaAbusiva.toLocaleString("pt-BR",
    { style: "currency", currency: "BRL" });

  const riscoMap: Record<string, string> = {
    DENTRO_DA_MEDIA:        "BAIXO — taxa dentro da média de mercado do BCB.",
    ACIMA_DA_MEDIA:         "MÉDIO — taxa acima da média, recomendável negociar revisão.",
    POTENCIALMENTE_ABUSIVO: "ALTO — diferença expressiva; fundamentação sólida para contestação.",
  };

  return {
    parecer: `A análise comparativa identificou que a taxa de ${tipo.toLowerCase()} contratada é `
      + `${resultado.percentualExcesso.toFixed(1)}% superior à média divulgada pelo Banco Central `
      + `do Brasil para o mesmo período. A diferença financeira apurada é de ${difBRL}, calculada `
      + `pela metodologia de juros compostos (M = P × (1+i)ⁿ) com base nos dados SGS/BCB.`,
    riscoJuridico:     riscoMap[resultado.status] ?? "MÉDIO — avalie com advogado especializado.",
    fundamentacao:     "CDC art. 6º, V (modificação de cláusulas onerosas); art. 39, V "
      + "(vantagem manifestamente excessiva); art. 51, IV (nulidade de cláusulas abusivas); "
      + "Súmula 297/STJ (CDC aplicável a instituições financeiras).",
    estrategiaNeg:     "Solicite o demonstrativo completo do contrato por escrito. "
      + "Apresente a comparação com a taxa média BCB como argumento central. "
      + "Utilize os canais de ouvidoria antes de acionar órgãos externos.",
    acaoRecomendada:   "Registre uma reclamação formal no consumidor.gov.br (gratuito, prazo "
      + "de resposta obrigatório de 10 dias pela instituição).",
    alertasEspeciais: [
      "Guarde todos os extratos e comprovantes de pagamento do contrato.",
      "Solicite ao banco o CET (Custo Efetivo Total) contratado por escrito.",
      "O prazo prescricional para revisão contratual é de 5 anos (CC, art. 206, §5º, I).",
    ],
    estimativaEconomia: `Potencial economia/restituição de até ${difBRL} com revisão da taxa.`,
    geradoPor:          "Análise estrutural (fallback)",
  };
}

// ─── Função pública ───────────────────────────────────────────────────────────

export async function gerarAnaliseIA(dados: RespostaAnalise): Promise<AnaliseIA> {
  try {
    const prompt = montarPrompt(dados);
    const raw    = await chamarNVIDIA(prompt);
    const parsed = parseAnalise(raw);

    if (parsed) {
      console.log("[ai-analysis] Análise IA gerada com sucesso.");
      return parsed;
    }

    console.warn("[ai-analysis] JSON inválido retornado — usando fallback.");
    return fallbackAnalise(dados);

  } catch (err) {
    console.error("[ai-analysis] Erro:", err instanceof Error ? err.message : err);
    return fallbackAnalise(dados);
  }
}
