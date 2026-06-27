import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { generateJournalReflection } from "@/lib/ai/therapist";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entryId, content, locale = "pt" } = await req.json();

  const reflection = await generateJournalReflection(content, session.name, locale);

  if (entryId) {
    await db.journalEntry.update({
      where: { id: entryId, userId: session.userId },
      data: { aiReflection: reflection },
    });
  }

  return NextResponse.json({ reflection });
}
