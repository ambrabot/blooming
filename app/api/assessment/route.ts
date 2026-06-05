import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { analyzeAssessment } from "@/lib/ai/therapist";
import { AssessmentType } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, answers } = await req.json();
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

  // Get available modules for recommendations
  const modules = await db.module.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, title: true, description: true },
  });

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
  const analysis = await analyzeAssessment(readableAnswers, modulesForAI);

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

  return NextResponse.json({
    assessmentId: assessment.id,
    report: analysis.report,
    recommendations: analysis.recommendedModules,
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
