import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { AssessmentType, QuestionInputType } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { type, order, text, subtext, category, inputType, options, scriptureRef } =
    await req.json();

  if (!text || !category) {
    return NextResponse.json({ error: "text e category são obrigatórios" }, { status: 400 });
  }

  const q = await db.assessmentQuestion.create({
    data: {
      type: type as AssessmentType,
      order: Number(order),
      text,
      subtext: subtext || null,
      category,
      inputType: inputType as QuestionInputType,
      options: options ?? null,
      scriptureRef: scriptureRef || null,
    },
  });

  return NextResponse.json({ id: q.id });
}
