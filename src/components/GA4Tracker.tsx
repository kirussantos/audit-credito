"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { gtagPageView } from "@/lib/ga4";

/* Rastreia mudanças de rota SPA — pula o primeiro render
   (gtag já dispara page_view no carregamento inicial) */
function Tracker() {
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const firstRender   = useRef(true);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    gtagPageView(url, document.title);
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
