import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import crypto from "crypto";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
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

  // Log in dev; in prod you'd send via SES/SendGrid/Resend
  if (process.env.NODE_ENV === "development") {
    console.log(`[Password Reset] ${user.email} → ${resetUrl}`);
  }

  // TODO: send email via your preferred provider
  // await sendEmail({
  //   to: user.email,
  //   subject: "Redefinição de senha — BLOOMING",
  //   html: `<p>Clique <a href="${resetUrl}">aqui</a> para redefinir sua senha. O link expira em 1 hora.</p>`,
  // });

  return NextResponse.json({ ok: true });
}
