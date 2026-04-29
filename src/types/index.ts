// ─── BCB API ──────────────────────────────────────────────────────────────────

export type TipoCredito =
  | "pessoal"
  | "cheque_especial"
  | "consignado"
  | "cartao_rotativo"
  | "cartao_parcelado";

export interface RegistroBCB {
  data: string;   // "dd/MM/yyyy"
  valor: string;  // taxa em % a.m. como string
}

export interface TaxaBCB {
  codigoSerie: number;
  tipoCredito: TipoCredito;
  data: string;
  taxaMensal: number;   // % a.m.
  taxaAnual: number;    // % a.a. equivalente
}

// ─── Cálculos ─────────────────────────────────────────────────────────────────

export type StatusAuditoria =
  | "DENTRO_DA_MEDIA"
  | "ACIMA_DA_MEDIA"
  | "POTENCIALMENTE_ABUSIVO";

export interface ResultadoCalculo {
  valorOriginal: number;
  valorCorrigido: number;      // valor que deveria ter sido cobrado com a taxa BCB
  diferencaAbusiva: number;    // valorCobrado - valorCorrigido
  percentualExcesso: number;   // (taxaCobrada - taxaMediaBCB) / taxaMediaBCB * 100
  taxaCobrada: number;         // % a.m. contratada
  taxaMediaBCB: number;        // % a.m. referência BCB
  periodoMeses: number;
  status: StatusAuditoria;
}

// ─── Formulário / Auditoria ───────────────────────────────────────────────────

export interface DadosContrato {
  tipoCredito: TipoCredito;
  valorOriginal: number;
  taxaMensalCobrada: number;   // % a.m.
  dataContrato: string;        // "yyyy-MM-dd"
  periodoMeses: number;
}

export interface AuditoriaCompleta {
  contrato: DadosContrato;
  taxaBCB: TaxaBCB;
  resultado: ResultadoCalculo;
  geradoEm: string;            // ISO datetime
}

// ─── Resposta da API /calcular ────────────────────────────────────────────────

export interface RespostaAnalise {
  id: string;
  nome: string;
  email: string;
  instituicao: string;
  contrato: DadosContrato;
  taxaBCB: TaxaBCB;
  resultado: ResultadoCalculo;
  geradoEm: string;
}

// ─── Cache interno ────────────────────────────────────────────────────────────

export interface EntradaCache {
  dados: RegistroBCB[];
  expiraEm: number;            // timestamp ms
}
