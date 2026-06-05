import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId } = await req.json();
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId obrigatório" }, { status: 400 });
  }

  const mod = await db.module.findUnique({ where: { id: moduleId, isActive: true } });
  if (!mod) {
    return NextResponse.json({ error: "Módulo não encontrado" }, { status: 404 });
  }

  // Already purchased — return early with success redirect
  const existing = await db.modulePurchase.findFirst({
    where: { userId: session.userId, moduleId, status: "COMPLETED" },
  });
  if (existing) {
    return NextResponse.json(
      { url: `${BASE_URL}/modulos/${mod.slug}` },
      { status: 200 },
    );
  }

  // Upsert pending purchase (avoid duplicates from double-clicks)
  const purchase = await db.modulePurchase.upsert({
    where: { userId_moduleId: { userId: session.userId, moduleId } },
    create: {
      userId: session.userId,
      moduleId,
      amountPaid: mod.priceInCents,
      currency: "BRL",
      status: "PENDING",
    },
    update: {
      amountPaid: mod.priceInCents,
      status: "PENDING",
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "brl",
    customer_email: session.email,
    line_items: [
      {
        price_data: {
          currency: "brl",
          unit_amount: mod.priceInCents,
          product_data: {
            name: `BLOOMING — ${mod.title}`,
            description: mod.subtitle
              ? `${mod.subtitle} · Acesso vitalício`
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
    success_url: `${BASE_URL}/modulos/${mod.slug}?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/modulos/${mod.slug}?cancelled=1`,
    locale: "pt-BR",
  });

  await db.modulePurchase.update({
    where: { id: purchase.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
