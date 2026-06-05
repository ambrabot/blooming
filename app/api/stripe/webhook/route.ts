import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import Stripe from "stripe";

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

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[Stripe webhook] signature error:", message);
    return NextResponse.json({ error: message }, { status: 400 });
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

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
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
    await db.milestone.create({
      data: {
        userId,
        type: "MODULE_STARTED",
        moduleId,
        title: "Primeira jornada começou ✨",
        description: "Você adquiriu seu primeiro módulo. A cura começa com um passo.",
      },
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
