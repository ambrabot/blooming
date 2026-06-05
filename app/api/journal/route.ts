import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, gratitude, scripture, insight, mood, promptId, moduleId } =
    await req.json();

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
    },
  });

  // Check for journal streak milestones
  const entryCount = await db.journalEntry.count({ where: { userId: session.userId } });
  const streakMilestones = [7, 30, 90];
  if (streakMilestones.includes(entryCount)) {
    await db.milestone.create({
      data: {
        userId: session.userId,
        type: "JOURNAL_STREAK",
        title: `${entryCount} dias de diário`,
        description: `Você completou ${entryCount} entradas no diário. Isso é consistência.`,
        metadata: { count: entryCount },
      },
    });
  }

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
