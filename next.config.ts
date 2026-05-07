import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control",   value: "on" },
  { key: "X-Frame-Options",          value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: GTM (carrega externamente), GA4, Meta Pixel
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://ssl.google-analytics.com https://www.google-analytics.com https://connect.facebook.net https://snap.licdn.com",
      // script-src-elem: CSP Level 3 — controla elementos <script> inline e externos
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://ssl.google-analytics.com https://www.google-analytics.com https://connect.facebook.net https://snap.licdn.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Pixels de rastreamento (img + beacon)
      "img-src 'self' data: blob: https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com https://www.facebook.com https://stats.g.doubleclick.net",
      // Conexões: BCB, Firebase, GA4 (incluindo endpoints regionais), Meta CAPI
      "connect-src 'self' https://api.bcb.gov.br https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://www.google-analytics.com https://ssl.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://region1.analytics.google.com https://www.googletagmanager.com https://stats.g.doubleclick.net https://www.facebook.com https://graph.facebook.com",
      "frame-src https://www.googletagmanager.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin", "pdfkit"],

  async headers() {
    return [
      {
        // Aplica a todas as rotas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
