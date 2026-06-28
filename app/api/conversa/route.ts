import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { isGardenKey } from "@/lib/garden";
import { generateConversationReflection } from "@/lib/ai/therapist";

const clean = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

// POST = preparar uma conversa (antes). Verdade + honra.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => null);
  const preserve = clean(b?.preserve);
  const fear = clean(b?.fear);
  const otherPreserve = clean(b?.otherPreserve);
  const howTruth = clean(b?.howTruth);
  if (!preserve && !fear && !otherPreserve && !howTruth) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }
  const gardenKey = typeof b?.gardenKey === "string" && isGardenKey(b.gardenKey) ? b.gardenKey : null;

  const conv = await db.conversation.create({
    data: {
      userId: session.userId,
      withWhom: clean(b?.withWhom),
      topic: clean(b?.topic),
      gardenKey,
      preserve,
      fear,
      otherPreserve,
      howTruth,
    },
  });

  return NextResponse.json({ id: conv.id });
}

// PATCH = debriefar (depois) + reflexão da Rafa sobre o arco.
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const b = await req.json().catch(() => null);
  const id = typeof b?.id === "string" ? b.id : "";
  const locale = typeof b?.locale === "string" ? b.locale : "pt";
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const existing = await db.conversation.findFirst({
    where: { id, userId: session.userId },
  });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const learnedSelf = clean(b?.learnedSelf);
  const learnedOther = clean(b?.learnedOther);
  const closeness = ["closer", "distant", "same"].includes(b?.closeness) ? b.closeness : null;

  const reflection = await generateConversationReflection(
    session.name,
    {
      withWhom: existing.withWhom,
      preserve: existing.preserve,
      fear: existing.fear,
      otherPreserve: existing.otherPreserve,
      howTruth: existing.howTruth,
      learnedSelf,
      learnedOther,
      closeness,
    },
    locale,
  );

  await db.conversation.update({
    where: { id },
    data: {
      status: "DONE",
      learnedSelf,
      learnedOther,
      closeness,
      reflection,
      conversedAt: new Date(),
    },
  });

  return NextResponse.json({ reflection });
}
