import type { Locale } from "@/i18n/routing";

// BCP-47 tag por locale, para Intl/toLocaleDateString.
// es → es-ES (formatação de data idêntica no mundo hispânico; mercado-alvo é LatAm).
const DATE_LOCALE: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

export function dateLocale(locale: string): string {
  return DATE_LOCALE[locale as Locale] ?? "pt-BR";
}

// Tag Open Graph (og:locale) por locale.
const OG_LOCALE: Record<Locale, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
};

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale as Locale] ?? "pt_BR";
}

// Tag hreflang (BCP-47) por locale, para alternates de SEO.
export const HREFLANG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

// Caminho do locale com a política localePrefix:"as-needed":
// pt (default) sem prefixo, en/es com prefixo. `path` deve começar com "/".
export function localePath(locale: string, path: string = "/"): string {
  const clean = path === "/" ? "" : path;
  return locale === "pt" ? clean || "/" : `/${locale}${clean}`;
}
