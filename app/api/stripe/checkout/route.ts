import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { routing } from "@/i18n/routing";
import { MARKET_BY_LOCALE, moduleChargeForLocale } from "@/lib/i18n/pricing";
import { stripeForMarket } from "@/lib/stripe/accounts";
import { localizeModule } from "@/lib/i18n/content";
import { localePath } from "@/lib/i18n/format";
import type Stripe from "stripe";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Locale do checkout Stripe (idioma da página de pagamento).
const STRIPE_LOCALE: Record<string, Stripe.Checkout.SessionCreateParams.Locale> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
};

// "Acesso vitalício" por idioma (entra na descrição do produto no Stripe).
const LIFETIME: Record<string, string> = {
  pt: "Acesso vitalício",
  en: "Lifetime access",
  es: "Acceso de por vida",
};

// Mensagem de "moeda ainda não disponível" — só dispara em en/es enquanto a conta
// USD (AmBRA) não está provisionada. Em pt a conta BR sempre existe.
const USD_SOON: Record<string, string> = {
  pt: "Pagamento indisponível no momento. Tente novamente em instantes.",
  en: "USD checkout is launching soon — payment isn't available yet. Please check back shortly.",
  es: "El pago en USD se habilitará muy pronto. Vuelve a intentarlo en breve.",
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const moduleId: string | undefined = body?.moduleId;
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId obrigatório" }, { status: 400 });
  }

  // Locale válido (default pt) → define mercado, moeda e conta Stripe.
  const loc = (routing.locales as readonly string[]).includes(body?.locale)
    ? (body.locale as string)
    : "pt";
  const market = MARKET_BY_LOCALE[loc as keyof typeof MARKET_BY_LOCALE];

  // Conta Stripe do mercado. US fica dormente até a key da AmBRA existir → 503.
  const stripe = stripeForMarket(market);
  if (!stripe) {
    return NextResponse.json({ error: USD_SOON[loc] ?? USD_SOON.pt }, { status: 503 });
  }

  const modRaw =
    loc !== "pt"
      ? await db.module.findUnique({
          where: { id: moduleId, isActive: true },
          include: { translations: { where: { locale: loc } } },
        })
      : await db.module.findUnique({ where: { id: moduleId, isActive: true } });
  if (!modRaw) {
    return NextResponse.json({ error: "Módulo não encontrado" }, { status: 404 });
  }
  const mod = localizeModule(modRaw, loc);

  // Moeda + valor cobrado segundo o mercado (pt→BRL, en/es→USD). Sempre igual ao
  // que a UI mostra via formatModulePrice.
  const charge = moduleChargeForLocale(mod.priceInCents, loc);

  // Already purchased — return early with localized success redirect
  const existing = await db.modulePurchase.findFirst({
    where: { userId: session.userId, moduleId, status: "COMPLETED" },
  });
  if (existing) {
    return NextResponse.json(
      { url: `${BASE_URL}${localePath(loc, `/modulos/${mod.slug}`)}` },
      { status: 200 },
    );
  }

  // Upsert pending purchase (avoid duplicates from double-clicks)
  const purchase = await db.modulePurchase.upsert({
    where: { userId_moduleId: { userId: session.userId, moduleId } },
    create: {
      userId: session.userId,
      moduleId,
      amountPaid: charge.unitAmount,
      currency: charge.currency.toUpperCase(),
      status: "PENDING",
    },
    update: {
      amountPaid: charge.unitAmount,
      currency: charge.currency.toUpperCase(),
      status: "PENDING",
    },
  });

  const successPath = localePath(loc, `/modulos/${mod.slug}`);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: charge.currency,
    customer_email: session.email,
    line_items: [
      {
        price_data: {
          currency: charge.currency,
          unit_amount: charge.unitAmount,
          product_data: {
            name: `BLOOMING — ${mod.title}`,
            description: mod.subtitle
              ? `${mod.subtitle} · ${LIFETIME[loc] ?? LIFETIME.pt}`
              : mod.description.slice(0, 120),
            images: [],
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      purchaseId: purchase.id,
      userId: session.userId,
      moduleId,
      moduleSlug: mod.slug,
    },
    allow_promotion_codes: true,
    success_url: `${BASE_URL}${successPath}?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}${successPath}?cancelled=1`,
    locale: STRIPE_LOCALE[loc] ?? "pt-BR",
  });

  await db.modulePurchase.update({
    where: { id: purchase.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
