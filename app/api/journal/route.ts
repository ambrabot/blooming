import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { recordPresence } from "@/lib/presence";
import { isGardenKey } from "@/lib/garden";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    title, content, gratitude, scripture, insight, mood, promptId, moduleId,
    pEvent, pEmotion, pEmpathy, pDynamic, gardenKey,
  } = await req.json();

  const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

  if (!content?.trim()) {
    return NextResponse.json({ error: "Conteúdo obrigatório" }, { status: 400 });
  }

  const entry = await db.journalEntry.create({
    data: {
      userId: session.userId,
      title: title || null,
      content,
      gratitude: gratitude || null,
      scripture: scripture || null,
      insight: insight || null,
      mood: mood ? Number(mood) : null,
      promptId: promptId || null,
      moduleId: moduleId || null,
      pEvent: clean(pEvent),
      pEmotion: clean(pEmotion),
      pEmpathy: clean(pEmpathy),
      pDynamic: clean(pDynamic),
      gardenKey: typeof gardenKey === "string" && isGardenKey(gardenKey) ? gardenKey : null,
    },
  });

  // Escrever no diário conta como presença do dia → streak unificado + milestones.
  await recordPresence(session.userId).catch(() => {});

  return NextResponse.json({ id: entry.id });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entries = await db.journalEntry.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      mood: true,
      createdAt: true,
      cyclePhase: true,
      insight: true,
    },
    take: 50,
  });

  return NextResponse.json({ entries });
}
