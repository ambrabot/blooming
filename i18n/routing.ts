import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // pt = mercado Brasil (BRL) · en = EUA (USD) · es = América Latina hispânica (USD)
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
  // pt (idioma original) fica sem prefixo: /dashboard. en/es ganham prefixo: /en/dashboard.
  // Mantém todas as URLs PT existentes byte-idênticas — zero link quebrado para o público atual.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
