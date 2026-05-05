/**
 * meta-capi.ts — Server-side Meta Conversions API
 *
 * Duplica no servidor cada evento disparado pelo pixel no browser.
 * O Meta usa o `event_id` para deduplicar as duas origens — nunca
 * conta o mesmo evento duas vezes.
 *
 * Referência: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from "crypto";

const PIXEL_ID    = process.env.NEXT_PUBLIC_META_PIXEL_ID!;
const ACCESS_TOKEN = process.env.META_CAPI_TOKEN!;
const CAPI_URL     = `https://graph.facebook.com/v20.0/${PIXEL_ID}/events`;

export interface CAPIUserData {
  /** SHA-256 do e-mail em minúsculas, sem espaços */
  em?: string;
  /** Cookie _fbc (fbclid capturado na URL) */
  fbc?: string;
  /** Cookie _fbp (identificador de sessão do Pixel) */
  fbp?: string;
  client_ip_address?: string;
  client_user_agent?: string;
}

export interface CAPIEventPayload {
  event_name: string;
  event_id: string;
  event_source_url: string;
  custom_data?: Record<string, unknown>;
  user_data?: CAPIUserData;
}

/** Hash SHA-256 de um valor normalizado — obrigatório pelo Meta para e-mails */
export function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

/** Envia um evento para a Conversions API do Meta */
export async function sendCAPIEvent(payload: CAPIEventPayload): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.warn("[CAPI] Variáveis META_PIXEL_ID / META_CAPI_TOKEN não configuradas.");
    return;
  }

  const body = {
    data: [
      {
        event_name: payload.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.event_id,
        event_source_url: payload.event_source_url,
        action_source: "website",
        user_data: payload.user_data ?? {},
        custom_data: payload.custom_data ?? {},
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const res = await fetch(CAPI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[CAPI] Erro:", err);
    }
  } catch (err) {
    console.error("[CAPI] Falha de rede:", err);
  }
}
