/**
 * track.ts — utilitário de rastreamento duplo (browser + CAPI)
 *
 * Cada chamada:
 *  1. Dispara fbq() no browser com um event_id único
 *  2. Chama /api/meta-events com o MESMO event_id para o CAPI
 *
 * O Meta deduplica automaticamente — nenhum evento é contado duas vezes.
 *
 * Uso (dentro de Client Components):
 *   import { track, trackCustom } from "@/lib/track"
 *   track("Lead", { content_name: "Formulário" })
 *   trackCustom("EtapaFormulario", { etapa: 1 })
 */

type FbqWindow = Window & {
  fbq?: (cmd: string, event: string, params?: object, opts?: object) => void;
};

/* ── ID de evento único para deduplicação ─────────────────────────────────── */
function genId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/* ── Lê um cookie pelo nome ───────────────────────────────────────────────── */
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const v = `; ${document.cookie}`;
  const parts = v.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

/* ── Dispara fbq() no browser ─────────────────────────────────────────────── */
function browserFbq(
  cmd: string,
  eventName: string,
  params: object,
  eventId: string
) {
  const w = typeof window !== "undefined" ? (window as FbqWindow) : null;
  if (w?.fbq) {
    w.fbq(cmd, eventName, params, { eventID: eventId });
  }
}

/* ── Envia para o CAPI via rota interna ───────────────────────────────────── */
async function capiPost(payload: object): Promise<void> {
  try {
    await fetch("/api/meta-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* silencioso — rastreamento nunca deve quebrar a UX */
  }
}

/* ── API pública ─────────────────────────────────────────────────────────── */

/**
 * Evento padrão do Meta (Purchase, Lead, ViewContent, AddToCart, etc.)
 * @param eventName  Nome do evento padrão do Meta
 * @param customData Parâmetros adicionais (value, currency, content_name…)
 * @param email      E-mail do usuário (não hasheado — o servidor faz o hash)
 */
export function track(
  eventName: string,
  customData?: Record<string, unknown>,
  email?: string
): void {
  if (typeof window === "undefined") return;

  const eventId = genId();
  const sourceUrl = window.location.href;

  browserFbq("track", eventName, customData ?? {}, eventId);
  void capiPost({
    event_name: eventName,
    event_id: eventId,
    event_source_url: sourceUrl,
    custom_data: customData,
    user_data: {
      fbc: getCookie("_fbc"),
      fbp: getCookie("_fbp"),
      em:  email,
    },
  });
}

/**
 * Evento personalizado (não usa os padrões do catálogo do Meta)
 * Ex: trackCustom("EtapaFormulario", { etapa: 2 })
 */
export function trackCustom(
  eventName: string,
  customData?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  const eventId = genId();
  const sourceUrl = window.location.href;

  browserFbq("trackCustom", eventName, customData ?? {}, eventId);
  void capiPost({
    event_name: eventName,
    event_id: eventId,
    event_source_url: sourceUrl,
    custom_data: customData,
    user_data: {
      fbc: getCookie("_fbc"),
      fbp: getCookie("_fbp"),
    },
  });
}
