import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import crypto from "crypto";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  // Limite por IP (anti-abuso geral) + por email (anti-spam de reset).
  if (rateLimit(`forgot-ip:${ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Muitas solicitações. Aguarde." }, { status: 429 });
  }

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
  }

  if (rateLimit(`forgot-email:${email.toLowerCase()}`, 3, 60 * 60 * 1000)) {
    // Mesma resposta de sucesso para não vazar que o email existe.
    return NextResponse.json({ ok: true });
  }

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await db.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetUrl = `${BASE_URL}/nova-senha?token=${token}`;

  await sendEmail({
    to: user.email,
    subject: "Redefinição de senha — Blooming",
    html: `
      <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#2d2a26">
        <h2 style="color:#7a6a55">Redefinição de senha</h2>
        <p>Olá${user.name ? `, ${user.name}` : ""}. Recebemos um pedido para redefinir sua senha no Blooming.</p>
        <p style="margin:28px 0">
          <a href="${resetUrl}" style="background:#7a6a55;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Redefinir minha senha</a>
        </p>
        <p style="color:#8a8276;font-size:14px">O link expira em 1 hora. Se você não pediu isso, ignore este email — sua senha continua a mesma.</p>
      </div>`,
  });

  return NextResponse.json({ ok: true });
}
