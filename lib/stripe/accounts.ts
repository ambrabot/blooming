import Stripe from "stripe";

// Duas contas Stripe SEPARADAS (decisão travada — não cruza credenciais):
//   BR (DBA Wellness/HLC) cobra BRL · US (AmBRA Digital) cobra USD.
// O mercado USD fica DORMENTE até a key da AmBRA ser provisionada (modo beta):
// stripeForMarket("US") retorna null e o checkout devolve "em breve" em vez de
// cobrar na moeda/conta errada.
export type Market = "BR" | "US";

const API_VERSION = "2026-05-27.dahlia";

export function stripeForMarket(market: Market): Stripe | null {
  const key =
    market === "US" ? process.env.STRIPE_SECRET_KEY_US : process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: API_VERSION });
}

/** Segredos de webhook das duas contas — para verificar eventos de qualquer uma. */
export function webhookSecrets(): string[] {
  return [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_WEBHOOK_SECRET_US].filter(
    (s): s is string => Boolean(s),
  );
}
