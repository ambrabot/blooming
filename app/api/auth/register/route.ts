import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { setSessionCookie } from "@/lib/auth/jwt";
import { UserRole } from "@/lib/generated/prisma";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { routing } from "@/i18n/routing";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimit(`register:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  const { name, email, password, role, language } = await req.json();

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
  const lang = (routing.locales as readonly string[]).includes(language) ? language : "pt";

  const user = await db.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: userRole,
      language: lang,
      profile: { create: {} },
    },
  });

  await setSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role });

  const res = NextResponse.json({ ok: true, locale: lang });
  res.cookies.set("NEXT_LOCALE", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
