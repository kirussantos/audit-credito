import type { EntradaCache, RegistroBCB, TaxaBCB, TipoCredito } from "@/types";

// ─── Mapeamento de séries SGS ─────────────────────────────────────────────────

const SERIES_BCB: Record<TipoCredito, number> = {
  pessoal:          25433,
  cheque_especial:  20714,
  consignado:       25435,
  cartao_rotativo:  20622,  // série SGS oficial — retorna % a.m. (~52-55%)
  cartao_parcelado: 20623,  // série SGS oficial — retorna % a.m. (~20-21%)
};

const BASE_URL = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";
const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;
// Cache válido por 1 hora — dados BCB são atualizados mensalmente
const CACHE_TTL_MS = 60 * 60 * 1_000;

// ─── Cache em memória (processo) ─────────────────────────────────────────────

const cache = new Map<string, EntradaCache>();

function chaveCache(codigo: number, dataInicio: string, dataFim: string): string {
  return `${codigo}:${dataInicio}:${dataFim}`;
}

// ─── Fetch com timeout e retry ────────────────────────────────────────────────

async function fetchComTimeout(url: string, tentativa = 1): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (tentativa < MAX_RETRIES) {
      // Aguarda 500ms antes de retry
      await new Promise((r) => setTimeout(r, 500));
      return fetchComTimeout(url, tentativa + 1);
    }
    throw err;
  }
}

// ─── Função principal de busca ────────────────────────────────────────────────

/**
 * Consulta a API SGS do Banco Central para uma série temporal.
 * Retorna os registros dentro do intervalo [dataInicio, dataFim] no formato
 * "dd/MM/yyyy".
 */
export async function fetchTaxaBCB(
  codigoSerie: number,
  dataInicio: string,
  dataFim: string
): Promise<RegistroBCB[]> {
  const chave = chaveCache(codigoSerie, dataInicio, dataFim);
  const agora = Date.now();

  const cached = cache.get(chave);
  if (cached && cached.expiraEm > agora) {
    return cached.dados;
  }

  const url =
    `${BASE_URL}.${codigoSerie}/dados` +
    `?formato=json&dataInicial=${dataInicio}&dataFinal=${dataFim}`;

  const res = await fetchComTimeout(url);

  if (!res.ok) {
    throw new Error(
      `BCB API erro ${res.status} para série ${codigoSerie}: ${res.statusText}`
    );
  }

  const dados: RegistroBCB[] = await res.json();

  if (!Array.isArray(dados) || dados.length === 0) {
    throw new Error(
      `BCB API não retornou dados para série ${codigoSerie} no período ${dataInicio} – ${dataFim}`
    );
  }

  cache.set(chave, { dados, expiraEm: agora + CACHE_TTL_MS });
  return dados;
}

// ─── Taxa média para tipo de crédito e mês do contrato ────────────────────────

/**
 * Retorna a taxa média BCB (% a.m.) para o tipo de crédito no mês da data do
 * contrato.
 *
 * Estratégia de busca (em ordem de prioridade):
 *  1. Janela ampla: 4 meses antes → 1 mês depois do contrato. Cobre o atraso
 *     de publicação do BCB (~2 meses) para contratos recentes.
 *  2. Fallback "ultimo/3": se a janela inteira cair no futuro (contrato do mês
 *     corrente ou posterior sem dados publicados), usa os 3 últimos registros
 *     disponíveis da série — garantindo que a API nunca retorne 404.
 */
export async function getTaxaMediaPeriodo(
  tipoCredito: TipoCredito,
  dataContrato: string   // "yyyy-MM-dd"
): Promise<TaxaBCB> {
  const codigo = SERIES_BCB[tipoCredito];
  const dt = new Date(dataContrato + "T00:00:00");

  // Janela ampla: 4 meses antes → 1 mês depois do contrato
  // (atraso típico de publicação BCB: 1–2 meses)
  const inicio = new Date(dt.getFullYear(), dt.getMonth() - 4, 1);
  const fim    = new Date(dt.getFullYear(), dt.getMonth() + 2, 0);

  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

  // Tenta busca por intervalo; em caso de 404 (dados ainda não publicados pelo
  // BCB), faz fallback para os últimos 3 registros disponíveis da série.
  let registros: RegistroBCB[];
  try {
    registros = await fetchTaxaBCB(codigo, fmt(inicio), fmt(fim));
  } catch {
    // Fallback: BCB não publicou dados para este período ainda
    const urlFallback = `${BASE_URL}.${codigo}/dados/ultimo/3?formato=json`;
    const chaveFallback = `${codigo}:ultimo:3`;
    const agora = Date.now();

    const cached = cache.get(chaveFallback);
    if (cached && cached.expiraEm > agora) {
      registros = cached.dados;
    } else {
      const res = await fetchComTimeout(urlFallback);
      if (!res.ok) {
        throw new Error(
          `BCB API indisponível para série ${codigo}. Tente novamente em instantes.`
        );
      }
      const dados: RegistroBCB[] = await res.json();
      if (!Array.isArray(dados) || dados.length === 0) {
        throw new Error(`BCB API não retornou dados para série ${codigo}.`);
      }
      cache.set(chaveFallback, { dados, expiraEm: agora + CACHE_TTL_MS });
      registros = dados;
    }
  }

  // Seleciona o registro mais próximo (antes ou igual) à data do contrato
  const dataContratoParsed = dt.getTime();

  const parseDataBCB = (s: string): number => {
    const [dia, mes, ano] = s.split("/").map(Number);
    return new Date(ano, mes - 1, dia).getTime();
  };

  const validos = registros
    .map((r) => ({ ...r, ts: parseDataBCB(r.data) }))
    .filter((r) => r.ts <= dataContratoParsed)
    .sort((a, b) => b.ts - a.ts);

  const registro = validos[0] ?? registros[registros.length - 1];

  const taxaMensal = parseFloat(registro.valor.replace(",", "."));

  if (isNaN(taxaMensal) || taxaMensal <= 0) {
    throw new Error(
      `Taxa inválida retornada pelo BCB para série ${codigo}: "${registro.valor}"`
    );
  }

  // Taxa anual equivalente: (1 + i_m)^12 - 1
  const taxaAnual = (Math.pow(1 + taxaMensal / 100, 12) - 1) * 100;

  return {
    codigoSerie: codigo,
    tipoCredito,
    data: registro.data,
    taxaMensal: Math.round(taxaMensal * 10000) / 10000,
    taxaAnual:  Math.round(taxaAnual  * 10000) / 10000,
  };
}
