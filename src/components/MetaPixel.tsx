"use client";

/**
 * MetaPixel.tsx
 *
 * • MetaPixelInit  — script inline que inicializa o fbq (colocar em layout.tsx)
 * • MetaPixelTracker — dispara PageView no CAPI a cada mudança de rota
 *   (o fbq no browser já escuta o history automaticamente)
 */

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1715448099449463";

/* ── Código de inicialização do Pixel (injetado como Script no layout) ──── */
export const META_PIXEL_INIT_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
fbq('track','PageView');
`.trim();

/* ── noscript fallback ─────────────────────────────────────────────────── */
export function MetaPixelNoscript() {
  return (
    <noscript>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}

/* ── Tracker de rotas — PageView via CAPI a cada navegação ────────────── */
function PageViewTracker() {
  const pathname    = usePathname();
  useSearchParams(); // re-renderiza quando os query params mudam
  const isFirst     = useRef(true);

  useEffect(() => {
    /*
     * Primeira carga: o script init já disparou fbq('track','PageView').
     * Enviamos só o CAPI para deduplicar.
     * Cargas subsequentes (navegação SPA): enviamos browser + CAPI.
     */
    const sourceUrl = window.location.href;
    const eventId   = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    if (!isFirst.current) {
      /* Navegação SPA — refaz o PageView no browser também */
      const w = window as Window & { fbq?: Function };
      w.fbq?.("track", "PageView", {}, { eventID: eventId });
    }
    isFirst.current = false;

    /* CAPI (sempre) */
    void fetch("/api/meta-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "PageView",
        event_id: eventId,
        event_source_url: sourceUrl,
      }),
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

/* ── Exportação principal — envolve o tracker em Suspense ─────────────── */
export function MetaPixelTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTracker />
    </Suspense>
  );
}
