import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { UserRole } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { slug, title, subtitle, description, iconEmoji, priceInCents, order,
    isActive, hebrewWord, systemPromptAddition, audience } = body;

  if (!slug || !title || !description) {
    return NextResponse.json({ error: "slug, title e description são obrigatórios" }, { status: 400 });
  }

  const mod = await db.module.create({
    data: {
      slug,
      title,
      subtitle: subtitle || null,
      description,
      iconEmoji: iconEmoji || "📖",
      colorClass: "text-amber-700",
      priceInCents: priceInCents ?? 9700,
      order: order ?? 99,
      isActive: isActive ?? true,
      hebrewWord: hebrewWord || null,
      systemPromptAddition: systemPromptAddition || null,
      audience: audience ?? [UserRole.WOMAN],
    },
  });

  return NextResponse.json({ slug: mod.slug });
}
