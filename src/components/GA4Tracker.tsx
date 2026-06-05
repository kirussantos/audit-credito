"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { gtagPageView } from "@/lib/ga4";

/* UTM params da sessão — capturados no primeiro acesso e preservados
   durante toda a navegação SPA para atribuição correta de fonte de tráfego */
const UTM_KEYS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];
let sessionUtms: string | null = null;

function captureUtms(params: URLSearchParams): void {
  if (sessionUtms !== null) return;           // já capturou na entrada
  const utms = new URLSearchParams();
  let hasAny = false;
  UTM_KEYS.forEach(k => {
    const v = params.get(k);
    if (v) { utms.set(k, v); hasAny = true; }
  });
  sessionUtms = hasAny ? utms.toString() : "";
}

/* Rastreia mudanças de rota SPA — pula o primeiro render
   (o gtag dispara page_view no carregamento inicial via config) */
function Tracker() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const firstRender   = useRef(true);

  useEffect(() => {
    /* Na primeira renderização apenas captura os UTMs de entrada */
    if (firstRender.current) {
      firstRender.current = false;
      captureUtms(searchParams);
      return;
    }
    /* Nas navegações seguintes envia page_view com UTMs preservados */
    const qs = searchParams.toString();
    const url = pathname + (qs ? `?${qs}` : "");
    gtagPageView(url, document.title, sessionUtms ?? undefined);
  }, [pathname, searchParams]);

  return null;
}

export default function GA4Tracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
