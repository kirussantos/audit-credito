import type { ResultadoCalculo, StatusAuditoria } from "@/types";

// ─── Juros compostos ──────────────────────────────────────────────────────────

/**
 * Montante pelo regime de juros compostos.
 * M = P * (1 + i)^n
 * @param principal  valor principal (P)
 * @param taxaMensal taxa em % a.m. (ex.: 5 para 5%)
 * @param meses      número de períodos mensais (n)
 */
export function montanteJurosCompostos(
  principal: number,
  taxaMensal: number,
  meses: number
): number {
  if (principal <= 0) throw new RangeError("Principal deve ser positivo");
  if (taxaMensal < 0)  throw new RangeError("Taxa não pode ser negativa");
  if (meses <= 0)      throw new RangeError("Meses deve ser positivo");

  return principal * Math.pow(1 + taxaMensal / 100, meses);
}

// ─── Diferença entre taxas ────────────────────────────────────────────────────

/**
 * Calcula a diferença entre o que foi cobrado e o que deveria ter sido cobrado
 * com base na taxa média BCB.
 *
 * @param valorDivida  valor financiado original (P)
 * @param taxaCobrada  taxa mensal contratada em % a.m.
 * @param taxaBCB      taxa média BCB para o mesmo tipo e período em % a.m.
 * @param mesesAtraso  número de meses financiados / em atraso
 */
export function calcularDiferencaJuros(
  valorDivida: number,
  taxaCobrada: number,
  taxaBCB: number,
  mesesAtraso: number
): Pick<ResultadoCalculo, "valorCorrigido" | "diferencaAbusiva" | "percentualExcesso" | "status"> {
  const montanteCobrado   = montanteJurosCompostos(valorDivida, taxaCobrada, mesesAtraso);
  const montanteReferencia = montanteJurosCompostos(valorDivida, taxaBCB,     mesesAtraso);

  const diferencaAbusiva = montanteCobrado - montanteReferencia;

  // Excesso calculado sobre a taxa — não sobre o valor — para refletir o custo
  // real do crédito independente do prazo.
  const percentualExcesso =
    taxaBCB > 0
      ? ((taxaCobrada - taxaBCB) / taxaBCB) * 100
      : 0;

  const status: StatusAuditoria =
    percentualExcesso <= 10  ? "DENTRO_DA_MEDIA"
    : percentualExcesso <= 50 ? "ACIMA_DA_MEDIA"
    : "POTENCIALMENTE_ABUSIVO";

  return {
    valorCorrigido:   arredondar(montanteReferencia),
    diferencaAbusiva: arredondar(diferencaAbusiva),
    percentualExcesso: arredondar(percentualExcesso),
    status,
  };
}

// ─── Resultado completo ───────────────────────────────────────────────────────

/**
 * Retorna o ResultadoCalculo completo para exibição no relatório.
 */
export function calcularValorCorrigido(
  valorOriginal: number,
  taxaContratada: number,   // % a.m.
  taxaMediaBCB: number,     // % a.m.
  periodoMeses: number
): ResultadoCalculo {
  const parcial = calcularDiferencaJuros(
    valorOriginal,
    taxaContratada,
    taxaMediaBCB,
    periodoMeses
  );

  return {
    valorOriginal:     arredondar(valorOriginal),
    taxaCobrada:       arredondar(taxaContratada),
    taxaMediaBCB:      arredondar(taxaMediaBCB),
    periodoMeses,
    ...parcial,
  };
}

// ─── Utilitário ───────────────────────────────────────────────────────────────

function arredondar(valor: number, casas = 2): number {
  const fator = Math.pow(10, casas);
  return Math.round(valor * fator) / fator;
}
