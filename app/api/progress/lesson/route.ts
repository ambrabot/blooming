import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { lessonId, moduleId } = await req.json();

  // Sempre derivar o progress do usuário da sessão (nunca de um id do body —
  // evita IDOR: gravar progresso na conta de outro usuário).
  const progress = await db.userProgress.upsert({
    where: { userId_moduleId: { userId: session.userId, moduleId } },
    create: { userId: session.userId, moduleId },
    update: {},
  });

  // Upsert lesson progress
  await db.lessonProgress.upsert({
    where: { progressId_lessonId: { progressId: progress.id, lessonId } },
    create: { progressId: progress.id, lessonId, completedAt: new Date() },
    update: { completedAt: new Date() },
  });

  // Update percent complete
  const [totalLessons, completedCount] = await Promise.all([
    db.lesson.count({ where: { moduleId } }),
    db.lessonProgress.count({
      where: { progressId: progress.id, completedAt: { not: null } },
    }),
  ]);

  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  await db.userProgress.update({
    where: { id: progress.id },
    data: {
      percentComplete: pct,
      ...(pct === 100 && { completedAt: new Date() }),
    },
  });

  // Award milestone if module completed (no idioma da conta)
  if (pct === 100) {
    const u = await db.user.findUnique({ where: { id: session.userId }, select: { language: true } });
    const loc = u?.language === "en" ? "en" : u?.language === "es" ? "es" : "pt";
    const M = {
      pt: { title: "Módulo concluído!", description: "Você completou todas as lições deste módulo." },
      en: { title: "Module completed!", description: "You finished every lesson in this module." },
      es: { title: "¡Módulo completado!", description: "Completaste todas las lecciones de este módulo." },
    }[loc];
    await db.milestone.upsert({
      where: {
        // Use a synthetic unique check — create only if not exists
        id: `module-complete-${session.userId}-${moduleId}`,
      },
      create: {
        id: `module-complete-${session.userId}-${moduleId}`,
        userId: session.userId,
        type: "MODULE_COMPLETED",
        moduleId,
        title: M.title,
        description: M.description,
      },
      update: {},
    }).catch(() => {
      // Milestone may already exist — ignore
    });
  }

  return NextResponse.json({ ok: true, percentComplete: pct });
}
