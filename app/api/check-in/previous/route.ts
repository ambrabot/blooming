import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const last = await db.assessment.findFirst({
    where: { userId: session.userId, type: "PERIODIC", completedAt: { not: null } },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, score: true },
  });

  return NextResponse.json({
    lastCheckIn: last?.createdAt ?? null,
    scores: (last?.score as Record<string, number> | null) ?? null,
  });
}
