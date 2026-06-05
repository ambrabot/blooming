import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { db } from "@/lib/db/client";
import { LessonType } from "@/lib/generated/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  const body = await req.json();

  const { title, type, order, content, durationMin,
    scripture, prayer, exercise, audioUrl, videoUrl } = body;

  const lesson = await db.lesson.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(type !== undefined && {
        type: (Object.values(LessonType).includes(type) ? type : LessonType.TEACHING) as LessonType,
      }),
      ...(order !== undefined && { order }),
      ...(content !== undefined && { content }),
      ...(durationMin !== undefined && { durationMin: durationMin ? Number(durationMin) : null }),
      ...(scripture !== undefined && { scripture }),
      ...(prayer !== undefined && { prayer }),
      ...(exercise !== undefined && { exercise }),
      ...(audioUrl !== undefined && { audioUrl }),
      ...(videoUrl !== undefined && { videoUrl }),
    },
  });

  return NextResponse.json({ id: lesson.id });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  const { id } = await params;
  await db.lesson.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
