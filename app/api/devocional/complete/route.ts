import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { computeStreak } from "@/lib/streak";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const dateOnly = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  await db.devotionalLog.upsert({
    where: { userId_date: { userId: session.userId, date: dateOnly } },
    update: {},
    create: { userId: session.userId, date: dateOnly },
  });

  const logs = await db.devotionalLog.findMany({
    where: { userId: session.userId },
    select: { date: true },
  });
  const streak = computeStreak(
    logs.map((l) => l.date),
    now,
  );

  return NextResponse.json({ ok: true, streak });
}
