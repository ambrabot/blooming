import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { UserRole } from "@/lib/generated/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    name,
    role,
    bio,
    currentSeason,
    churchBackground,
    hebrewRoots,
    cycleStartDate,
    cycleLengthDays,
  } = await req.json();

  const userRole = role && Object.values(UserRole).includes(role as UserRole)
    ? (role as UserRole)
    : undefined;

  await db.user.update({
    where: { id: session.userId },
    data: {
      ...(name?.trim() && { name: name.trim() }),
      ...(userRole && { role: userRole }),
    },
  });

  await db.profile.upsert({
    where: { userId: session.userId },
    create: {
      userId: session.userId,
      bio: bio || null,
      currentSeason: currentSeason || null,
      churchBackground: churchBackground || null,
      hebrewRoots: hebrewRoots ?? false,
      cycleStartDate: cycleStartDate ? new Date(cycleStartDate) : null,
      cycleLengthDays: cycleLengthDays ? Number(cycleLengthDays) : 28,
    },
    update: {
      bio: bio || null,
      currentSeason: currentSeason || null,
      churchBackground: churchBackground || null,
      hebrewRoots: hebrewRoots ?? false,
      cycleStartDate: cycleStartDate ? new Date(cycleStartDate) : null,
      cycleLengthDays: cycleLengthDays ? Number(cycleLengthDays) : 28,
    },
  });

  return NextResponse.json({ ok: true });
}
