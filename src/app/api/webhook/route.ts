import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/firebase";
import type { Firestore } from "firebase-admin/firestore";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface EventoNormalizado {
  email:      string;
  analiseId:  string;   // pode ser vazio — ver fallback abaixo
  aprovado:   boolean;
  plataforma: string;
  nome:       string;
}

// ─── Normalização de payload ──────────────────────────────────────────────────
// Suporta Kiwify e Hotmart sem hardcoding de plataforma.

function normalizarPayload(body: Record<string, unknown>): EventoNormalizado | null {

  // ── Kiwify ──
  // { order_status: "paid", customer: { email, name }, tracking: { utm_content } }
  if (typeof body.order_status === "string") {
    const customer  = body.customer as Record<string, unknown> | undefined;
    const tracking  = body.tracking as Record<string, unknown> | undefined;
    const email     = typeof customer?.email === "string" ? customer.email.trim() : "";
    const nome      = typeof customer?.name  === "string" ? customer.name.trim()  : "Cliente";
    const analiseId = typeof tracking?.utm_content === "string"
      ? tracking.utm_content.trim() : "";
    const aprovado  = body.order_status === "paid";
    if (email) return { email, analiseId, aprovado, plataforma: "kiwify", nome };
  }

  // ── Hotmart ──
  // { event: "PURCHASE_APPROVED", data: { buyer: { email, name }, purchase: { tracking_source_id } } }
  if (typeof body.event === "string") {
    const data      = body.data as Record<string, unknown> | undefined;
    const buyer     = data?.buyer as Record<string, unknown> | undefined;
    const purchase  = data?.purchase as Record<string, unknown> | undefined;
    const email     = typeof buyer?.email === "string" ? buyer.email.trim() : "";
    const nome      = typeof buyer?.name  === "string" ? buyer.name.trim()  : "Cliente";
    const analiseId = typeof purchase?.tracking_source_id === "string"
      ? purchase.tracking_source_id.trim() : "";
    const aprovado  = body.event === "PURCHASE_APPROVED";
    if (email) return { email, analiseId, aprovado, plataforma: "hotmart", nome };
  }

  // ── Genérico ──
  if (typeof body.email === "string") {
    return {
      email:      body.email.trim(),
      analiseId:  typeof body.analise_id === "string" ? body.analise_id.trim() : "",
      aprovado:   body.status === "approved" || body.status === "paid",
      plataforma: "generico",
      nome:       typeof body.nome === "string" ? body.nome.trim() : "Cliente",
    };
  }

  return null;
}

// ─── Validação do secret ──────────────────────────────────────────────────────

function validarSecret(req: NextRequest): boolean {
  const secret = process.env.CHECKOUT_WEBHOOK_SECRET;
  if (!secret) return true;

  if (req.headers.get("Hottok") === secret)       return true;
  const tokenParam = new URL(req.url).searchParams.get("token");
  if (tokenParam === secret)                       return true;
  if (req.headers.get("X-Webhook-Token") === secret) return true;

  return false;
}

// ─── Busca analise por email (fallback quando utm_content vazio) ───────────────

async function buscarAnaliseIdPorEmail(
  email: string,
  db: Firestore,
): Promise<string | null> {
  try {
    const snap = await db.collection("analises")
      .where("email", "==", email)
      .where("status", "==", "pendente")
      .orderBy("geradoEm", "desc")
      .limit(1)
      .get();

    if (!snap.empty) {
      return snap.docs[0].id;
    }
  } catch (err) {
    console.error("[webhook] Erro ao buscar analise por email:", err);
  }
  return null;
}

// ─── Disparo do email ─────────────────────────────────────────────────────────

async function dispararEmail(
  req: NextRequest,
  analiseId: string,
  email: string,
  nome: string,
): Promise<void> {
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3001";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const url   = `${proto}://${host}/api/enviar-email`;

  const resp = await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ analiseId, email, nome }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(`HTTP ${resp.status}: ${JSON.stringify(err)}`);
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const recebidoEm = new Date().toISOString();

  if (!validarSecret(req)) {
    console.warn(`[webhook] ${recebidoEm} — secret inválido`);
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Corpo inválido." }, { status: 400 });
  }

  console.log(`[webhook] ${recebidoEm} — chaves: ${Object.keys(body).join(", ")}`);

  const evento = normalizarPayload(body);

  if (!evento) {
    console.warn("[webhook] payload não reconhecido");
    return NextResponse.json({ message: "Evento ignorado." }, { status: 200 });
  }

  if (!evento.aprovado) {
    console.log(`[webhook] evento não é pagamento aprovado — ignorando`);
    return NextResponse.json({ message: "Evento não é aprovação de pagamento." });
  }

  const db = getDb();
  let analiseId = evento.analiseId;

  // ── Fallback: buscar por email se utm_content veio vazio ──────────────────
  if (!analiseId && db) {
    console.warn(`[webhook] utm_content vazio — buscando análise pelo email`);
    const encontrado = await buscarAnaliseIdPorEmail(evento.email, db);
    if (encontrado) {
      analiseId = encontrado;
      console.log(`[webhook] Análise encontrada por email: ${analiseId}`);
    }
  }

  // ── Atualizar Firestore ───────────────────────────────────────────────────
  if (db && analiseId) {
    try {
      await db.collection("analises").doc(analiseId).update({
        status:         "pago",
        pagoEm:         recebidoEm,
        emailPagador:   evento.email,
        nomePagador:    evento.nome,
        plataformaPgto: evento.plataforma,
      });
      console.log(`[webhook] Firestore atualizado: ${analiseId} → pago`);
    } catch (err) {
      console.error("[webhook] Erro ao atualizar Firestore:", err);
      // Continua — não bloqueia o envio do email
    }
  }

  // ── Disparar email ────────────────────────────────────────────────────────
  if (analiseId) {
    try {
      await dispararEmail(req, analiseId, evento.email, evento.nome);
      console.log(`[webhook] Email disparado para ${evento.email}`);
    } catch (err) {
      console.error("[webhook] Falha no email:", err);
      // Retorna 200 mesmo assim — Kiwify não faz retry em erros internos de entrega
    }
  } else {
    // Sem analiseId mesmo após fallback → entrega genérica com link
    console.warn(`[webhook] Sem analiseId — enviando email de acesso genérico`);
    try {
      await dispararEmailGenerico(req, evento.email, evento.nome);
    } catch (err) {
      console.error("[webhook] Erro no email genérico:", err);
    }
  }

  return NextResponse.json({ message: "Processado com sucesso.", analiseId });
}

// ─── Email genérico (quando não há analiseId) ─────────────────────────────────

async function dispararEmailGenerico(
  req: NextRequest,
  email: string,
  nome: string,
): Promise<void> {
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "localhost:3001";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  const url   = `${proto}://${host}/api/enviar-email-acesso`;

  await fetch(url, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ email, nome }),
  });
}
