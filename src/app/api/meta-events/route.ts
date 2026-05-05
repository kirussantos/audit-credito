/**
 * POST /api/meta-events
 *
 * Proxy para a Meta Conversions API.
 * O cliente envia o evento aqui logo após disparar o fbq() no browser;
 * o servidor reencaminha para o Meta com IP, user-agent e event_id
 * idêntico — permitindo deduplicação automática no Gerenciador de Eventos.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendCAPIEvent, sha256 } from "@/lib/meta-capi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    /* Extrai dados de contexto que o servidor consegue capturar com precisão */
    const ip = (
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      ""
    ).split(",")[0].trim();
    const ua = req.headers.get("user-agent") ?? "";

    /* Hash do e-mail se fornecido pelo cliente */
    const hashedEmail = body.user_data?.em
      ? sha256(body.user_data.em as string)
      : undefined;

    await sendCAPIEvent({
      event_name:       body.event_name ?? body.eventName,
      event_id:         body.event_id   ?? body.eventId,
      event_source_url: body.event_source_url ?? body.sourceUrl ?? "",
      custom_data:      body.custom_data ?? body.customData,
      user_data: {
        client_ip_address: ip || undefined,
        client_user_agent: ua || undefined,
        fbc: body.user_data?.fbc ?? body.fbc,
        fbp: body.user_data?.fbp ?? body.fbp,
        em:  hashedEmail,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/meta-events]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
