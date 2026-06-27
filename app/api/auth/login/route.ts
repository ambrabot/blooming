import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { setSessionCookie } from "@/lib/auth/jwt";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (rateLimit(`login:${ip}`, 8, 5 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }

  await setSessionCookie({ userId: user.id, email: user.email, name: user.name, role: user.role });

  // Reidrata o idioma da conta: cookie p/ a detecção do next-intl + locale no
  // corpo p/ o cliente redirecionar já no prefixo certo (/en, /es; pt sem prefixo).
  const lang = user.language ?? "pt";
  const res = NextResponse.json({ ok: true, locale: lang });
  res.cookies.set("NEXT_LOCALE", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}
