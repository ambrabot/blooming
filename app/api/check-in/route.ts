import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { respondInLanguage } from "@/lib/i18n/language";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SCALE_KEYS = ["mood_general", "spiritual_connection", "body_energy", "relationship_quality"];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { answers, locale = "pt" } = await req.json();

  // Fetch last PERIODIC assessment for trend comparison
  const last = await db.assessment.findFirst({
    where: { userId: session.userId, type: "PERIODIC", completedAt: { not: null } },
    orderBy: { createdAt: "desc" },
  });

  const prevScores = (last?.score as Record<string, number> | null) ?? null;

  // Compute current scores
  const currentScores: Record<string, number> = {};
  for (const key of SCALE_KEYS) {
    if (answers[key]) currentScores[key] = Number(answers[key]);
  }

  // Compute trends
  const trends: Record<string, number> = {};
  if (prevScores) {
    for (const key of SCALE_KEYS) {
      if (currentScores[key] !== undefined && prevScores[key] !== undefined) {
        trends[key] = currentScores[key] - prevScores[key];
      }
    }
  }

  // Save assessment
  const assessment = await db.assessment.create({
    data: {
      userId: session.userId,
      type: "PERIODIC",
      completedAt: new Date(),
      score: currentScores,
    },
  });

  // AI reflection — brief, warm, trend-aware
  const trendText = Object.keys(trends).length > 0
    ? `\n\nComparação com mês anterior: ${Object.entries(trends)
        .map(([k, v]) => `${k}: ${v > 0 ? "+" : ""}${v}`)
        .join(", ")}`
    : "";

  const answersText = Object.entries(answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  const aiRes = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 350,
    messages: [
      {
        role: "user",
        content: `Você é Rafa, terapeuta cristã do BLOOMING. ${session.name} acabou de fazer o check-in mensal.

Respostas:
${answersText}${trendText}

Escreva uma reflexão breve (3-4 parágrafos) que:
1. Acolhe onde a pessoa está
2. Nomeia algo positivo que você observa
3. Aponta uma área de atenção gentilmente
4. Termina com uma âncora bíblica ou palavra de encorajamento

Tom: íntimo, caloroso, direto. Fale com a pessoa, não sobre ela. ${respondInLanguage(locale)}`,
      },
    ],
  });

  const report = aiRes.content[0].type === "text" ? aiRes.content[0].text : "";

  await db.assessment.update({
    where: { id: assessment.id },
    data: { report },
  });

  return NextResponse.json({ report, trends });
}
