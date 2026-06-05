import { NextRequest } from "next/server";

// Rate limiter em memória (janela deslizante). Suficiente para o app rodando
// como instância única no Coolify. Se um dia escalar para múltiplas réplicas,
// trocar por um store compartilhado (Upstash/Redis) — ver reference_saas_build_playbook.
type Hit = { count: number; resetAt: number };
const store = new Map<string, Hit>();

export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Retorna true se a requisição estourou o limite (deve ser bloqueada).
 * @param key identificador (ex: `login:${ip}`)
 * @param limit nº máximo de requisições na janela
 * @param windowMs tamanho da janela em ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hit = store.get(key);

  if (!hit || now > hit.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  hit.count++;
  if (hit.count > limit) return true;
  return false;
}
