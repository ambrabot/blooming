import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { UserRole } from "@/lib/generated/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const { role } = await req.json();

  if (!Object.values(UserRole).includes(role as UserRole)) {
    return NextResponse.json({ error: "Role inválida" }, { status: 400 });
  }

  await db.user.update({
    where: { id },
    data: { role: role as UserRole },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  // Never delete yourself
  if (id === auth.userId) {
    return NextResponse.json({ error: "Não pode deletar sua própria conta" }, { status: 400 });
  }

  await db.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
