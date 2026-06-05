import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { setSessionCookie } from "@/lib/auth/jwt";
import { UserRole } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Dados obrigatórios ausentes" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Senha deve ter no mínimo 8 caracteres" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return NextResponse.json({ error: "Este email já está cadastrado" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const SELF_SIGNUP_ROLES: UserRole[] = [
    UserRole.WOMAN,
    UserRole.COUPLE,
    UserRole.FAMILY,
    UserRole.LEADER,
  ];
  const userRole = SELF_SIGNUP_ROLES.includes(role) ? (role as UserRole) : UserRole.WOMAN;

  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: userRole,
      profile: { create: {} },
    },
  });

  await setSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role });

  return NextResponse.json({ ok: true });
}
