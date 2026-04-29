import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";

// ─── Normalização de payload ──────────────────────────────────────────────────
// Suporta Kiwify e Hotmart sem hardcoding de plataforma.

interface EventoNormalizado {
  email:     string;
  analiseId: string;
  aprovado:  boolean;
  plataforma: string;
}

function normalizarPayload(body: Record<string, unknown>): EventoNormalizado | null {
  // ── Kiwify ──
  // { order_status: "paid", customer: { email }, tracking: { utm_content } }
  if (typeof body.order_status === "string") {
    const customer = body.customer as Record<string, unknown> | undefined;
    const tracking = body.tracking as Record<string, unknown> | undefined;
    const email     = typeof customer?.email === "string" ? customer.email : "";
    const analiseId = typeof tracking?.utm_content === "string" ? tracking.utm_content : "";
    const aprovado  = body.order_status === "paid";
    if (email && analiseId) return { email, analiseId, aprovado, plataforma: "kiwify" };
  }

  // ── Hotmart ──
  // { event: "PURCHASE_APPROVED", data: { buyer: { email }, purchase: { tracking_source_id } } }
  if (typeof body.event === "string") {
    const data     = body.data as Record<string, unknown> | undefined;
    const buyer    = data?.buyer as Record<string, unknown> | undefined;
    const purchase = data?.purchase as Record<string, unknown> | undefined;
    const email     = typeof buyer?.email === "string" ? buyer.email : "";
    const analiseId = typeof purchase?.tracking_source_id === "string"
      ? purchase.tracking_source_id : "";
    const aprovado  = body.event === "PURCHASE_APPROVED";
    if (email && analiseId) return { email, analiseId, aprovado, plataforma: "hotmart" };
  }

  // ── Genérico ── { email, analise_id, status: "approved" }
  if (typeof body.email === "string" && typeof body.analise_id === "string") {
    return {
      email:      body.email,
      analiseId:  body.analise_id,
      aprovado:   body.status === "approved" || body.status === "paid",
      plataforma: "generico",
    };
  }

  return null;
}

// ─── Validação do secret ──────────────────────────────────────────────────────

function validarSecret(req: NextRequest): boolean {
  const secret = process.env.CHECKOUT_WEBHOOK_SECRET;
  if (!secret) return true; // sem secret configurado → aceitar em dev

  // Hotmart: header Hottok
  if (req.headers.get("Hottok") === secret) return true;

  // Kiwify / genérico: query param token
  const tokenParam = new URL(req.url).searchParams.get("token");
  if (tokenParam === secret) return true;

  // Header genérico X-Webhook-Token
  if (req.headers.get("X-Webhook-Token") === secret) return true;

  return false;
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const recebidoEm = new Date().toISOString();

  // Validar secret
  if (!validarSecret(req)) {
    console.warn(`[webhook] ${recebidoEm} — secret inválido`);
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  // Ler corpo
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  // Log sem dados pessoais — apenas chaves presentes no payload
  console.log(`[webhook] ${recebidoEm} — chaves recebidas: ${Object.keys(body).join(", ")}`);

  const evento = normalizarPayload(body);

  if (!evento) {
    console.warn("[webhook] payload não reconhecido");
    // Retorna 200 para evitar reenvios pela plataforma
    return NextResponse.json({ message: "Evento ignorado." }, { status: 200 });
  }

  console.log(`[webhook] ${evento.plataforma} | analise=${evento.analiseId} | aprovado=${evento.aprovado}`);

  if (!evento.aprovado) {
    return NextResponse.json({ message: "Evento não é aprovação de pagamento." });
  }

  // Atualizar Firestore
  const db = getDb();
  if (db) {
    try {
      await db.collection("analises").doc(evento.analiseId).update({
        status:     "pago",
        pagoEm:     recebidoEm,
        emailPagador: evento.email,
      });
      console.log(`[webhook] Firestore atualizado: ${evento.analiseId} → pago`);
    } catch (err) {
      console.error("[webhook] Erro ao atualizar Firestore:", err);
    }
  }

  // Disparar entrega do email com o PDF
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3001";
    const proto = req.headers.get("x-forwarded-proto") ?? "http";
    const emailUrl = `${proto}://${host}/api/enviar-email`;

    const respEmail = await fetch(emailUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analiseId: evento.analiseId, email: evento.email }),
    });

    if (!respEmail.ok) {
      const err = await respEmail.json().catch(() => ({}));
      console.error("[webhook] Falha no envio de email:", err);
    } else {
      console.log(`[webhook] Email disparado para ${evento.email}`);
    }
  } catch (err) {
    console.error("[webhook] Erro ao chamar /api/enviar-email:", err);
  }

  return NextResponse.json({ message: "Processado com sucesso." });
}
