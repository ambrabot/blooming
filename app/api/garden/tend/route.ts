import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { isGardenKey } from "@/lib/garden";

// Cultivar/regar um canteiro: a Jardineira marca como aquela área floresce (1-5)
// e, opcionalmente, uma linha do que está cultivando. É auto-cultivo (MVP) — sem
// julgamento, sem placar. Idempotente por (userId, key): upsert atualiza o estado.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const key = typeof body?.key === "string" ? body.key : "";
  if (!isGardenKey(key)) {
    return NextResponse.json({ error: "invalid_key" }, { status: 400 });
  }

  const flourishingRaw = Number(body?.flourishing);
  const flourishing =
    Number.isInteger(flourishingRaw) && flourishingRaw >= 1 && flourishingRaw <= 5
      ? flourishingRaw
      : null;
  if (flourishing === null) {
    return NextResponse.json({ error: "invalid_flourishing" }, { status: 400 });
  }

  const note =
    typeof body?.note === "string" && body.note.trim().length > 0
      ? body.note.trim().slice(0, 280)
      : null;

  const bed = await db.gardenBed.upsert({
    where: { userId_key: { userId: session.userId, key } },
    update: { flourishing, note, lastTendedAt: new Date() },
    create: { userId: session.userId, key, flourishing, note, lastTendedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    bed: {
      key: bed.key,
      flourishing: bed.flourishing,
      note: bed.note,
      lastTendedAt: bed.lastTendedAt,
    },
  });
}
