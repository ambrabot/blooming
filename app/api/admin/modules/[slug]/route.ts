import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { slug } = await params;
  const body = await req.json();

  // Only allow safe fields to be updated — never the slug (PK alias)
  const { title, subtitle, description, iconEmoji, priceInCents, order,
    isActive, hebrewWord, systemPromptAddition } = body;

  const mod = await db.module.update({
    where: { slug },
    data: {
      ...(title !== undefined && { title }),
      ...(subtitle !== undefined && { subtitle }),
      ...(description !== undefined && { description }),
      ...(iconEmoji !== undefined && { iconEmoji }),
      ...(priceInCents !== undefined && { priceInCents }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive }),
      ...(hebrewWord !== undefined && { hebrewWord }),
      ...(systemPromptAddition !== undefined && { systemPromptAddition }),
    },
  });

  return NextResponse.json({ slug: mod.slug });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { slug } = await params;

  // Check no purchases exist before deleting
  const purchases = await db.modulePurchase.count({ where: { module: { slug }, status: "COMPLETED" } });
  if (purchases > 0) {
    return NextResponse.json(
      { error: `Módulo tem ${purchases} compra(s) — não pode ser deletado. Desative em vez disso.` },
      { status: 409 },
    );
  }

  await db.module.delete({ where: { slug } });
  return NextResponse.json({ ok: true });
}
