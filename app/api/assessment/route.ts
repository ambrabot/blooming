import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { analyzeAssessment } from "@/lib/ai/therapist";
import { AssessmentType } from "@/lib/generated/prisma";
import { routing } from "@/i18n/routing";
import { localizeModule } from "@/lib/i18n/content";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, answers, locale = "pt" } = await req.json();
  // answers: Record<questionId, value>

  const assessmentType = (type as AssessmentType) ?? AssessmentType.INITIAL;

  // Fetch questions to build human-readable answers
  const questionIds = Object.keys(answers);
  const questions = await db.assessmentQuestion.findMany({
    where: { id: { in: questionIds } },
  });

  const readableAnswers: Record<string, string> = {};
  for (const q of questions) {
    readableAnswers[q.text] = answers[q.id];
  }

  // Get available modules for recommendations (localizados no idioma da conta).
  const modulesRaw =
    locale !== "pt"
      ? await db.module.findMany({
          where: { isActive: true },
          include: { translations: { where: { locale } } },
        })
      : await db.module.findMany({ where: { isActive: true } });
  const modules = modulesRaw.map((m) => localizeModule(m, locale));

  const modulesForAI = modules.map((m) => ({
    slug: m.slug,
    title: m.title,
    description: m.description.slice(0, 150),
  }));

  // Create assessment record
  const assessment = await db.assessment.create({
    data: {
      userId: session.userId,
      type: assessmentType,
      answers: {
        create: questions.map((q) => ({
          questionId: q.id,
          value: answers[q.id] ?? "",
        })),
      },
    },
  });

  // Analyze with AI
  const analysis = await analyzeAssessment(readableAnswers, modulesForAI, locale);

  // Save report and recommendations
  await db.assessment.update({
    where: { id: assessment.id },
    data: {
      report: analysis.report,
      score: { primaryNeeds: analysis.primaryNeeds },
      completedAt: new Date(),
      recommendations: {
        create: analysis.recommendedModules.map((r) => {
          const mod = modules.find((m) => m.slug === r.slug);
          return {
            moduleId: mod?.id ?? modules[0].id,
            priority: r.priority,
            reason: r.reason,
          };
        }),
      },
    },
  });

  // O idioma escolhido no onboarding vira o idioma da conta (UI + Rafa) — o
  // "dono" do idioma. Login futuro reidrata o cookie a partir daqui.
  if ((routing.locales as readonly string[]).includes(locale)) {
    await db.user.update({ where: { id: session.userId }, data: { language: locale } });
  }

  return NextResponse.json({
    assessmentId: assessment.id,
    report: analysis.report,
    // Enriquece com título + emoji localizados (a UI mostrava o slug cru).
    recommendations: analysis.recommendedModules.map((r) => {
      const mod = modules.find((m) => m.slug === r.slug);
      return {
        slug: r.slug,
        priority: r.priority,
        reason: r.reason,
        title: mod?.title ?? r.slug,
        emoji: mod?.iconEmoji ?? "",
      };
    }),
  });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const latest = await db.assessment.findFirst({
    where: { userId: session.userId, type: AssessmentType.INITIAL },
    orderBy: { createdAt: "desc" },
    include: {
      recommendations: {
        include: { module: true },
        orderBy: { priority: "asc" },
      },
    },
  });

  return NextResponse.json({ assessment: latest });
}
