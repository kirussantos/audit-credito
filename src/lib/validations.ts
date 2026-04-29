import { z } from "zod";

export const TIPOS_CREDITO_OPTIONS = [
  { value: "pessoal",          label: "Crédito Pessoal" },
  { value: "cheque_especial",  label: "Cheque Especial" },
  { value: "consignado",       label: "Crédito Consignado" },
  { value: "cartao_rotativo",  label: "Cartão de Crédito — Rotativo" },
  { value: "cartao_parcelado", label: "Cartão de Crédito — Parcelado" },
] as const;

const anoAtual = new Date().getFullYear();

export const schemaFormulario = z.object({
  nome: z
    .string()
    .min(3,  "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),

  email: z.string().email("Informe um e-mail válido"),

  tipoCredito: z.enum(
    ["pessoal", "cheque_especial", "consignado", "cartao_rotativo", "cartao_parcelado"],
    { message: "Selecione o tipo de crédito" }
  ),

  instituicao: z
    .string()
    .min(2,  "Informe o nome do banco ou instituição")
    .max(100, "Nome muito longo"),

  valorDivida: z
    .number({ message: "Informe o valor da dívida" })
    .min(100,         "Valor mínimo: R$ 100,00")
    .max(10_000_000,  "Valor máximo: R$ 10.000.000,00"),

  taxaJurosMensal: z
    .number({ message: "Informe a taxa de juros" })
    .min(0.1, "Taxa mínima: 0,1% ao mês")
    .max(30,  "Taxa máxima: 30% ao mês"),

  dataContrato: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, "Formato esperado: MM/AAAA")
    .refine((val) => {
      const [mm, aaaa] = val.split("/").map(Number);
      return mm >= 1 && mm <= 12 && aaaa >= 1990 && aaaa <= anoAtual;
    }, "Data de contrato inválida"),

  mesesAtraso: z
    .number({ message: "Informe o período em meses" })
    .int("Use número inteiro de meses")
    .min(1,   "Mínimo: 1 mês")
    .max(360,  "Máximo: 360 meses (30 anos)"),
});

export type FormularioData = z.infer<typeof schemaFormulario>;
