import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { generateSessionSummary } from "@/lib/ai/therapist";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const therapySession = await db.therapySession.findUnique({
    where: { id, userId: session.userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!therapySession) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ session: therapySession });
}

// Generate or refresh the summary for a session
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const therapySession = await db.therapySession.findUnique({
    where: { id, userId: session.userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!therapySession) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (therapySession.messages.length < 4) {
    return NextResponse.json({ summary: null });
  }

  const messages = therapySession.messages.map((m) => ({
    role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  const summary = await generateSessionSummary(messages);

  await db.therapySession.update({
    where: { id },
    data: { summary },
  });

  return NextResponse.json({ summary });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { title, mood, moodEnd } = await req.json();

  const updated = await db.therapySession.update({
    where: { id, userId: session.userId },
    data: {
      ...(title !== undefined && { title }),
      ...(mood !== undefined && { mood }),
      ...(moodEnd !== undefined && { moodEnd }),
    },
  });

  return NextResponse.json({ session: updated });
}
