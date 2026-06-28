import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import Stripe from "stripe";
import { webhookSecrets } from "@/lib/stripe/accounts";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

// Must be raw body — Next.js parses JSON by default, but Stripe needs raw bytes
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // Verifica contra os segredos das DUAS contas (BR + US/AmBRA): eventos podem vir
  // de qualquer uma. A verificação é só criptográfica (independe da conta da key).
  let event: Stripe.Event | null = null;
  let lastError = "Webhook signature verification failed";
  for (const secret of webhookSecrets()) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, secret);
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : lastError;
    }
  }
  if (!event) {
    console.error("[Stripe webhook] signature error:", lastError);
    return NextResponse.json({ error: lastError }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "checkout.session.expired":
        await handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
        break;

      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error("[Stripe webhook] handler error:", err);
    // Return 200 so Stripe doesn't retry — log and investigate manually
    return NextResponse.json({ error: "Handler error" }, { status: 200 });
  }

  return NextResponse.json({ received: true });
}

// Lê o fim do período pago de forma defensiva (o campo migrou entre versões da API).
function periodEnd(sub: Stripe.Subscription): Date | null {
  const s = sub as unknown as {
    current_period_end?: number;
    items?: { data?: { current_period_end?: number }[] };
  };
  const ts = s.current_period_end ?? s.items?.data?.[0]?.current_period_end;
  return ts ? new Date(ts * 1000) : null;
}

function mapSubStatus(stripeStatus: Stripe.Subscription.Status): "ACTIVE" | "PAST_DUE" | "CANCELED" {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "ACTIVE";
  if (stripeStatus === "past_due") return "PAST_DUE";
  return "CANCELED";
}

async function handleSubscriptionChange(sub: Stripe.Subscription) {
  await db.user.updateMany({
    where: { subscriptionId: sub.id },
    data: {
      subscriptionStatus: mapSubStatus(sub.status),
      subscriptionCurrentPeriodEnd: periodEnd(sub),
    },
  });
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  await db.user.updateMany({
    where: { subscriptionId: sub.id },
    data: { subscriptionStatus: "CANCELED" },
  });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Assinatura (modo recorrente) — ativa e sai.
  if (session.mode === "subscription") {
    const userId = session.metadata?.userId;
    const subscriptionId =
      typeof session.subscription === "string" ? session.subscription : null;
    if (!userId || !subscriptionId) return;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionId,
        subscriptionStatus: mapSubStatus(sub.status),
        subscriptionCurrentPeriodEnd: periodEnd(sub),
        ...(typeof session.customer === "string"
          ? { stripeCustomerId: session.customer }
          : {}),
      },
    });
    console.log(`[Stripe webhook] Subscription ${subscriptionId} active for user ${userId}`);
    return;
  }

  const { purchaseId, userId, moduleId, moduleSlug } = session.metadata ?? {};
  if (!purchaseId) {
    console.warn("[Stripe webhook] checkout.session.completed missing purchaseId");
    return;
  }

  // Idempotent — if already completed, skip
  const existing = await db.modulePurchase.findUnique({ where: { id: purchaseId } });
  if (!existing || existing.status === "COMPLETED") return;

  await db.modulePurchase.update({
    where: { id: purchaseId },
    data: {
      status: "COMPLETED",
      stripePaymentId: typeof session.payment_intent === "string"
        ? session.payment_intent
        : null,
      purchasedAt: new Date(),
    },
  });

  if (!userId || !moduleId) return;

  // Initialize UserProgress for the module
  await db.userProgress.upsert({
    where: { userId_moduleId: { userId, moduleId } },
    create: { userId, moduleId },
    update: {},
  });

  // Award first-purchase milestone
  const purchaseCount = await db.modulePurchase.count({
    where: { userId, status: "COMPLETED" },
  });

  if (purchaseCount === 1) {
    const u = await db.user.findUnique({ where: { id: userId }, select: { language: true } });
    const loc = u?.language === "en" ? "en" : u?.language === "es" ? "es" : "pt";
    const M = {
      pt: { title: "Primeira jornada começou", description: "Você adquiriu seu primeiro módulo. A cura começa com um passo." },
      en: { title: "Your first journey has begun", description: "You acquired your first module. Healing begins with one step." },
      es: { title: "Tu primera jornada comenzó", description: "Adquiriste tu primer módulo. La sanidad empieza con un paso." },
    }[loc];
    await db.milestone.create({
      data: { userId, type: "MODULE_STARTED", moduleId, title: M.title, description: M.description },
    }).catch(() => {}); // ignore if already exists
  }

  console.log(`[Stripe webhook] Purchase ${purchaseId} completed for user ${userId}, module ${moduleSlug}`);
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const { purchaseId } = session.metadata ?? {};
  if (!purchaseId) return;

  await db.modulePurchase.updateMany({
    where: { id: purchaseId, status: "PENDING" },
    data: { status: "FAILED" },
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const paymentIntentId = typeof charge.payment_intent === "string"
    ? charge.payment_intent
    : null;
  if (!paymentIntentId) return;

  await db.modulePurchase.updateMany({
    where: { stripePaymentId: paymentIntentId },
    data: { status: "REFUNDED" },
  });

  console.log(`[Stripe webhook] Refund processed for payment ${paymentIntentId}`);
}
