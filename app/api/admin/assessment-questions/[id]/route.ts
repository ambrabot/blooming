import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { AssessmentType, QuestionInputType } from "@/lib/generated/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const { type, order, text, subtext, category, inputType, options, scriptureRef } =
    await req.json();

  await db.assessmentQuestion.update({
    where: { id },
    data: {
      ...(type !== undefined && { type: type as AssessmentType }),
      ...(order !== undefined && { order: Number(order) }),
      ...(text !== undefined && { text }),
      ...(subtext !== undefined && { subtext: subtext || null }),
      ...(category !== undefined && { category }),
      ...(inputType !== undefined && { inputType: inputType as QuestionInputType }),
      ...(options !== undefined && { options }),
      ...(scriptureRef !== undefined && { scriptureRef: scriptureRef || null }),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;

  const answerCount = await db.assessmentAnswer.count({ where: { questionId: id } });
  if (answerCount > 0) {
    return NextResponse.json(
      { error: `Pergunta tem ${answerCount} resposta(s) — não pode ser deletada.` },
      { status: 409 },
    );
  }

  await db.assessmentQuestion.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
