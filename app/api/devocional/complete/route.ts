import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { recordPresence } from "@/lib/presence";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dateOnly = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  // Ledger específico do devocional (a página marca "devocional feito hoje").
  await db.devotionalLog.upsert({
    where: { userId_date: { userId: session.userId, date: dateOnly } },
    update: {},
    create: { userId: session.userId, date: dateOnly },
  });

  // Conta como presença do dia → streak unificado (devocional OU Rafa OU diário).
  const streak = await recordPresence(session.userId, now);

  return NextResponse.json({ ok: true, streak });
}
