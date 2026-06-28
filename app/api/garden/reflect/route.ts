import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { isGardenKey } from "@/lib/garden";
import { generateGardenReflection } from "@/lib/ai/therapist";

// Motor de Evolução — gera (sob demanda) a reflexão de cultivo de um canteiro: a
// Rafa lê os registros do diário marcados àquela área (gardenKey) + o estado do
// canteiro e devolve uma observação de padrão (Constituição: não rótulo, pergunta,
// honra). Guarda no canteiro pra não regenerar a cada abertura.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const key = typeof body?.key === "string" ? body.key : "";
  const gardenName = typeof body?.gardenName === "string" ? body.gardenName : key;
  const locale = typeof body?.locale === "string" ? body.locale : "pt";
  if (!isGardenKey(key)) {
    return NextResponse.json({ error: "invalid_key" }, { status: 400 });
  }

  const [bed, entries] = await Promise.all([
    db.gardenBed.findUnique({
      where: { userId_key: { userId: session.userId, key } },
      select: { flourishing: true, note: true },
    }),
    db.journalEntry.findMany({
      where: { userId: session.userId, gardenKey: key },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { content: true },
    }),
  ]);

  const reflection = await generateGardenReflection(
    gardenName,
    session.name,
    { flourishing: bed?.flourishing ?? null, note: bed?.note ?? null },
    entries.map((e) => e.content),
    locale,
  );

  // Persiste no canteiro (cria se ainda não existe).
  await db.gardenBed.upsert({
    where: { userId_key: { userId: session.userId, key } },
    update: { reflection, reflectedAt: new Date() },
    create: { userId: session.userId, key, reflection, reflectedAt: new Date() },
  });

  return NextResponse.json({ reflection });
}
