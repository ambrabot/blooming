import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { HREFLANG, localePath } from "@/lib/i18n/format";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Rotas públicas (indexáveis). O dashboard é atrás de auth → fora do sitemap.
const PUBLIC_PATHS = ["/", "/login", "/register"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PUBLIC_PATHS) {
    // hreflang alternates: cada rota aponta para suas versões pt/en/es.
    const languages: Record<string, string> = {};
    for (const l of routing.locales) {
      languages[HREFLANG[l]] = `${BASE_URL}${localePath(l, path)}`;
    }
    // x-default → versão no locale padrão (pt, sem prefixo): fallback p/ idiomas não listados.
    languages["x-default"] = `${BASE_URL}${localePath(routing.defaultLocale, path)}`;

    for (const l of routing.locales) {
      entries.push({
        url: `${BASE_URL}${localePath(l, path)}`,
        changeFrequency: path === "/" ? "weekly" : "monthly",
        priority: path === "/" ? 1 : 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
