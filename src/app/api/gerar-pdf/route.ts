import { NextRequest, NextResponse } from "next/server";
import { gerarRelatorioPDF } from "@/lib/pdf-generator";
import { getDb } from "@/lib/firebase";
import type { RespostaAnalise } from "@/types";

export async function POST(req: NextRequest) {
  // Lê o corpo uma única vez
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  const id = typeof body?.id === "string" ? body.id : undefined;
  if (!id) {
    return NextResponse.json({ message: "ID da análise é obrigatório." }, { status: 400 });
  }

  let dadosAnalise: RespostaAnalise | null = null;

  // Com Firestore configurado: verifica pagamento antes de gerar
  const db = getDb();
  if (db) {
    const snap = await db.collection("analises").doc(id).get();

    if (!snap.exists) {
      return NextResponse.json({ message: "Análise não encontrada." }, { status: 404 });
    }

    const doc = snap.data() as RespostaAnalise & { status?: string };

    if (doc.status !== "pago") {
      return NextResponse.json(
        { message: "Pagamento não confirmado para esta análise." },
        { status: 402 },
      );
    }

    dadosAnalise = doc;
  }

  // Sem Firestore (dev/demo): aceita dados completos direto no corpo da requisição
  if (!dadosAnalise) {
    if (body?.resultado && body?.contrato) {
      dadosAnalise = body as unknown as RespostaAnalise;
    } else {
      return NextResponse.json(
        { message: "Dados da análise não disponíveis. Configure o Firebase ou envie os dados completos no corpo." },
        { status: 422 },
      );
    }
  }

  const buffer = await gerarRelatorioPDF(dadosAnalise);
  const nomeArquivo = `auditcredito-relatorio-${id.slice(0, 8)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type":        "application/pdf",
      "Content-Disposition": `attachment; filename="${nomeArquivo}"`,
      "Content-Length":      buffer.length.toString(),
      "Cache-Control":       "no-store",
    },
  });
}
