/* ═══════════════════════════════════════════════════════════════
   GA4 — Google Analytics 4
   Measurement ID: G-SZR3HCNHRJ
   Property: audit---credito (p535134534)
═══════════════════════════════════════════════════════════════ */

export const GA4_ID = "G-SZR3HCNHRJ";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

type GtagParams = Record<string, string | number | boolean | string[] | object | undefined>;

/** Envia evento customizado para o GA4 */
export function gtagEvent(eventName: string, params?: GtagParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}

/** Envia page_view manual (para rotas SPA).
 *  @param sessionUtms  Query string com UTM params capturados na entrada
 *                      (preserva atribuição de fonte em toda a sessão SPA)
 */
export function gtagPageView(url: string, title?: string, sessionUtms?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  /* Mescla UTMs da sessão de entrada nos parâmetros do page_view */
  const utmParams: GtagParams = {};
  if (sessionUtms) {
    const parsed = new URLSearchParams(sessionUtms);
    parsed.forEach((v, k) => { utmParams[k] = v; });
  }

  window.gtag("config", GA4_ID, {
    page_path: url,
    ...(title ? { page_title: title } : {}),
    ...utmParams,
  });
}

/* ── Helpers de eventos específicos do AuditCrédito ───────────────────── */

/** Usuário interagiu com o formulário pela primeira vez */
export function ga4FormStart() {
  gtagEvent("form_start", { form_name: "auditoria" });
}

/** Tipo de crédito selecionado */
export function ga4SelectCreditType(tipo: string) {
  gtagEvent("select_item", {
    item_list_name: "tipo_credito",
    items: tipo,
  });
}

/** Etapa 1 completa → avança para etapa 2 */
export function ga4StepComplete(step: number, stepName: string) {
  gtagEvent("tutorial_complete", { step, step_name: stepName });
  // GA4 standard: generate_lead
  if (step === 1) {
    gtagEvent("generate_lead", { value: 0, currency: "BRL", source: "formulario_auditoria" });
  }
}

/** Formulário submetido */
export function ga4FormSubmit(params: { tipo_credito: string; instituicao: string; valor_divida: number }) {
  gtagEvent("submit", {
    form_name: "auditoria",
    tipo_credito: params.tipo_credito,
    instituicao: params.instituicao,
    valor_divida: Math.round(params.valor_divida),
  });
}

/** Página de resultado visualizada */
export function ga4ViewResultado(status: string, valorDivida: number) {
  gtagEvent("view_item", {
    item_list_name: "resultado_auditoria",
    status_resultado: status,
    valor_divida: Math.round(valorDivida),
  });
}

/** Botão de checkout clicado */
export function ga4BeginCheckout() {
  gtagEvent("begin_checkout", {
    currency: "BRL",
    value: 19.90,
    items: [{ item_id: "relatorio-completo", item_name: "Relatório Completo AuditCrédito", price: 19.90, quantity: 1 }],
  });
}

/** Compra concluída — evento de ecommerce padrão GA4 */
export function ga4Purchase(transactionId?: string) {
  gtagEvent("purchase", {
    transaction_id: transactionId ?? `ac_${Date.now()}`,
    currency: "BRL",
    value: 19.90,
    items: [{ item_id: "relatorio-completo", item_name: "Relatório Completo AuditCrédito", price: 19.90, quantity: 1 }],
  });
}
