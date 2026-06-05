import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { LessonType } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const body = await req.json();
  const { moduleId, title, slug, type, order, content,
    durationMin, scripture, prayer, exercise, audioUrl, videoUrl } = body;

  if (!moduleId || !title || !slug || !content) {
    return NextResponse.json({ error: "moduleId, title, slug e content são obrigatórios" }, { status: 400 });
  }

  const lessonType = (Object.values(LessonType).includes(type) ? type : LessonType.TEACHING) as LessonType;

  const lesson = await db.lesson.create({
    data: {
      moduleId,
      title,
      slug,
      type: lessonType,
      order: order ?? 1,
      content,
      durationMin: durationMin ? Number(durationMin) : null,
      scripture: scripture || null,
      prayer: prayer || null,
      exercise: exercise || null,
      audioUrl: audioUrl || null,
      videoUrl: videoUrl || null,
    },
  });

  return NextResponse.json({ id: lesson.id, slug: lesson.slug });
}
