// Envio de email transacional via Brevo (provider já autenticado no domínio
// alinhadasaoproposito.com — DKIM ok, sender contato@alinhadasaoproposito.com).
// Credencial via env BREVO_API_KEY (runtime secret, nunca hardcoded).

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "contato@alinhadasaoproposito.com";
const FROM_NAME = process.env.EMAIL_FROM_NAME ?? "Blooming";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("[email] BREVO_API_KEY ausente — email não enviado");
    return { ok: false, error: "email provider não configurado" };
  }

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: FROM_EMAIL, name: FROM_NAME },
      to: [{ email: opts.to }],
      subject: opts.subject,
      htmlContent: opts.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[email] Brevo ${res.status}: ${body}`);
    return { ok: false, error: `brevo ${res.status}` };
  }

  return { ok: true };
}
