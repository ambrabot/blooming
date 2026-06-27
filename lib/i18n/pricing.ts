import type { Locale } from "@/i18n/routing";

export type Market = "BR" | "US";
export type Currency = "BRL" | "USD";

/** pt = Brasil (BRL) · en = EUA (USD) · es = LatAm hispânico (USD). */
export const MARKET_BY_LOCALE: Record<Locale, Market> = {
  pt: "BR",
  en: "US",
  es: "US",
};

export const CURRENCY_BY_LOCALE: Record<Locale, Currency> = {
  pt: "BRL",
  en: "USD",
  es: "USD",
};

/**
 * Preços USD provisórios por nível (em centavos), mapeados a partir do valor BRL
 * do módulo. A Fase 5 (Stripe) substitui isto por Stripe Prices reais em USD.
 */
const USD_CENTS_BY_BRL_CENTS: Record<number, number> = {
  9700: 1900, // R$97  → US$19
  12700: 2700, // R$127 → US$27
  14700: 2900, // R$147 → US$29
};

function brlCentsToUsdCents(brlCents: number): number {
  const mapped = USD_CENTS_BY_BRL_CENTS[brlCents];
  if (mapped) return mapped;
  // Fallback proporcional (~5.1 BRL/USD), arredondado para US$ inteiro.
  return Math.round(brlCents / 5.1 / 100) * 100;
}

/**
 * Moeda + valor (em centavos) que será efetivamente COBRADO no checkout, segundo
 * o mercado do locale. pt → BRL (preço do módulo) · en/es → USD (mapeado). Garante
 * que o valor cobrado é o mesmo que `formatModulePrice` mostra na tela.
 */
export function moduleChargeForLocale(
  brlCents: number,
  locale: string,
): { currency: "brl" | "usd"; unitAmount: number } {
  const loc: Locale = locale === "en" ? "en" : locale === "es" ? "es" : "pt";
  if (CURRENCY_BY_LOCALE[loc] === "USD") {
    return { currency: "usd", unitAmount: brlCentsToUsdCents(brlCents) };
  }
  return { currency: "brl", unitAmount: brlCents };
}

/** Formata o preço de um módulo na moeda do mercado do locale. */
export function formatModulePrice(brlCents: number, locale: string): string {
  const loc: Locale = locale === "en" ? "en" : locale === "es" ? "es" : "pt";
  if (CURRENCY_BY_LOCALE[loc] === "BRL") {
    return (brlCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  const usdCents = brlCentsToUsdCents(brlCents);
  const intlLocale = loc === "es" ? "es" : "en-US";
  return (usdCents / 100).toLocaleString(intlLocale, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
