import { NextRequest, NextResponse } from "next/server";
import { getTaxaMediaPeriodo } from "@/lib/bcb-api";

export const maxDuration = 60; // permite pré-geração IA em background
import { calcularValorCorrigido } from "@/lib/calculos";
import { getDb } from "@/lib/firebase";
import { schemaFormulario } from "@/lib/validations";
import type { RespostaAnalise } from "@/types";

// Pré-gera a análise IA em background após salvar no Firestore
// Isso garante que, quando o cliente pagar, o PDF já tem a análise pronta
async function preGerarAnaliseIA(id: string, resposta: RespostaAnalise): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    const { gerarAnaliseIA } = await import("@/lib/ai-analysis");
    const analiseIA = await gerarAnaliseIA(resposta);
    await db.collection("analises").doc(id).update({ analiseIA });
    console.log(`[calcular] analiseIA pré-gerada para ${id}`);
  } catch (err) {
    console.error("[calcular] Falha ao pré-gerar analiseIA:", err);
  }
}

// ─── Rate limiting em memória (por processo) ──────────────────────────────────
// Para produção com múltiplos workers, substituir por Redis.

const JANELA_MS  = 60 * 60 * 1_000; // 1 hora
const MAX_REQ    = 10;

const limites = new Map<string, { contagem: number; resetaEm: number }>();

function checarRateLimit(ip: string): boolean {
  const agora = Date.now();
  const entrada = limites.get(ip);

  if (!entrada || entrada.resetaEm < agora) {
    limites.set(ip, { contagem: 1, resetaEm: agora + JANELA_MS });
    return true;
  }
  if (entrada.contagem >= MAX_REQ) return false;
  entrada.contagem++;
  return true;
}

function ipDaRequisicao(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "desconhecido"
  );
}

// ─── Converte "MM/AAAA" → "AAAA-MM-01" ───────────────────────────────────────

function parsearDataContrato(dataForm: string): string {
  const [mm, aaaa] = dataForm.split("/");
  return `${aaaa}-${mm.padStart(2, "0")}-01`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Rate limit
  const ip = ipDaRequisicao(req);
  if (!checarRateLimit(ip)) {
    return NextResponse.json(
      { message: "Limite de consultas atingido. Tente novamente em 1 hora." },
      { status: 429 }
    );
  }

  // Parse e validação do corpo
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = schemaFormulario.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Dados inválidos.", erros: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const {
    nome, email, tipoCredito, instituicao,
    valorDivida, taxaJurosMensal, dataContrato, mesesAtraso,
  } = parsed.data;

  const dataISO = parsearDataContrato(dataContrato);

  // Consulta BCB
  let taxaBCB;
  try {
    taxaBCB = await getTaxaMediaPeriodo(tipoCredito, dataISO);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao consultar o Banco Central.";
    return NextResponse.json({ message: msg }, { status: 502 });
  }

  // Cálculo
  const resultado = calcularValorCorrigido(
    valorDivida,
    taxaJurosMensal,
    taxaBCB.taxaMensal,
    mesesAtraso
  );

  const id       = crypto.randomUUID();
  const geradoEm = new Date().toISOString();

  const resposta: RespostaAnalise = {
    id,
    nome,
    email,
    instituicao,
    contrato: {
      tipoCredito,
      valorOriginal: valorDivida,
      taxaMensalCobrada: taxaJurosMensal,
      dataContrato: dataISO,
      periodoMeses: mesesAtraso,
    },
    taxaBCB,
    resultado,
    geradoEm,
  };

  // Persistência no Firestore (opcional — não bloqueia resposta)
  const db = getDb();
  if (db) {
    db.collection("analises").doc(id).set({
      ...resposta,
      ip,
      status: "pendente",
    })
    .then(() => {
      // Fire-and-forget: pré-gerar análise IA em background
      // Quando o cliente pagar, o Firestore já tem analiseIA → PDF gerado em segundos
      preGerarAnaliseIA(id, resposta);
    })
    .catch((err) => {
      console.error("[firestore] Falha ao salvar análise:", err);
    });
  }

  return NextResponse.json(resposta);
}
