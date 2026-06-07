import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { hasActiveSubscription } from "@/lib/subscription";
import Stripe from "stripe";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-05-27.dahlia",
  });

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_SUBSCRIPTION_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Assinatura não configurada" },
      { status: 500 },
    );
  }

  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Já assinante — manda para o portal de gerenciamento.
  if (hasActiveSubscription(user)) {
    return NextResponse.json(
      { url: `${BASE_URL}/perfil?assinatura=ativa` },
      { status: 200 },
    );
  }

  // Garante um Customer do Stripe vinculado à usuária (reusa se já existe).
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await db.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { userId: user.id, type: "subscription" },
    subscription_data: { metadata: { userId: user.id } },
    allow_promotion_codes: true,
    success_url: `${BASE_URL}/perfil?assinatura=sucesso&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/perfil?assinatura=cancelada`,
    locale: "pt-BR",
  });

  return NextResponse.json({ url: checkoutSession.url });
}
