import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localePath } from "@/lib/i18n/format";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Áreas atrás de auth (route groups (dashboard) e (admin) não adicionam segmento
// de URL → estes são os caminhos reais). Mantido em sincronia com app/[locale]/.
const AUTHED_PATHS = [
  "/dashboard",
  "/modulos",
  "/sessao",
  "/diario",
  "/check-in",
  "/comunidade",
  "/devocional",
  "/assinatura",
  "/perfil",
  "/admin",
];

export default function robots(): MetadataRoute.Robots {
  // Bloqueia a API e a área logada em cada prefixo de locale (pt sem prefixo).
  const disallow = ["/api/"];
  for (const l of routing.locales) {
    for (const p of AUTHED_PATHS) disallow.push(localePath(l, p));
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
