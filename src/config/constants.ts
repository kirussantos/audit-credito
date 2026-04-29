import type { TipoCredito } from "@/types";

export const ROTULO_TIPO_CREDITO: Record<TipoCredito, string> = {
  pessoal:          "Crédito Pessoal",
  cheque_especial:  "Cheque Especial",
  consignado:       "Crédito Consignado",
  cartao_rotativo:  "Cartão de Crédito — Rotativo",
  cartao_parcelado: "Cartão de Crédito — Parcelado",
};

export const LINKS_ORIENTACAO = {
  procon:          "https://www.consumidor.gov.br/pages/conteudo/publico/5",
  calculadora_bcb: "https://www3.bcb.gov.br/CALCJUROS/",
  consumidor_gov:  "https://www.consumidor.gov.br/",
  bcb_ouvidoria:   "https://www.bcb.gov.br/acessoinformacao/ouvidoria",
} as const;
