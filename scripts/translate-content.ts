/**
 * Popula as tabelas de tradução (ModuleTranslation / LessonTranslation) a partir
 * do conteúdo-base em português, usando Claude (Haiku) para traduzir PT → EN/ES.
 *
 * ⚠️  Custa dinheiro (chamadas pagas à API Anthropic) e ESCREVE no banco.
 *     Requer ANTHROPIC_API_KEY e DATABASE_URL no ambiente (.env).
 *
 * Uso:
 *   npx tsx scripts/translate-content.ts --dry --module fundamentos      # testa 1 módulo, sem gravar
 *   npx tsx scripts/translate-content.ts --module fundamentos            # grava só 1 módulo (en+es)
 *   npx tsx scripts/translate-content.ts --locale en                     # só inglês, todos os módulos
 *   npx tsx scripts/translate-content.ts                                 # tudo (en+es), pula o que já existe
 *   npx tsx scripts/translate-content.ts --force                         # re-traduz mesmo o que já existe
 *
 * Flags:
 *   --dry             não grava no banco; imprime a tradução para conferência
 *   --module <slug>   limita a um módulo (e suas lições)
 *   --locale <en|es>  limita a um idioma (default: en e es)
 *   --only <modules|lessons>  traduz só módulos ou só lições
 *   --force           sobrescreve traduções já existentes (default: pula)
 *
 * Boa prática: rode primeiro com `--dry --module <slug>` (escopo mínimo),
 * confira a saída, depois libere o resto.
 */

import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = "claude-haiku-4-5-20251001";

const LANG_NAME: Record<string, string> = {
  en: "English (US)",
  es: "Spanish (Latin American, neutral)",
};

// ── args ──────────────────────────────────────────────────────────────────────
function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

const DRY = flag("dry");
const FORCE = flag("force");
const ONLY = arg("only"); // "modules" | "lessons" | undefined
const MODULE_SLUG = arg("module");
const LOCALES = arg("locale") ? [arg("locale")!] : ["en", "es"];

// Resumo final: uma falha isolada (1 lição/locale) não derruba o lote inteiro.
const failures: string[] = [];
let okCount = 0;

// ── tradução via Claude ─────────────────────────────────────────────────────────
const SYSTEM = (lang: string) =>
  `You are a professional translator for BLOOMING, a Christian therapeutic platform rooted in messianic Jewish culture, polyvagal theory and endocrinology.
Translate from Brazilian Portuguese to ${lang}.

Rules:
- Preserve the warm, pastoral, direct tone of the original.
- Keep theological and clinical terminology accurate.
- Keep all Markdown formatting (##, ###, >, **bold**, ---, line breaks) byte-for-byte.
- Bible references (e.g. "Provérbios 31:10") are given in a "ref" field — translate the BOOK NAME to the target language's conventional name, keep chapter:verse numbers unchanged.
- A "text" field next to a "ref" is the quoted verse — translate it faithfully.
- Do NOT translate proper Hebrew transliterations or names.
- You receive a JSON object. Return ONLY a JSON object with the SAME keys, each value translated. No prose, no code fences.`;

function extractJson(raw: string): unknown {
  let s = raw.trim();
  // remove cercas ```json ... ```
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  // pega do primeiro { ao último }
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

async function translateFields(
  fields: Record<string, unknown>,
  lang: string,
): Promise<Record<string, unknown>> {
  // remove campos vazios — não há o que traduzir, e cai em fallback PT na leitura.
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v != null && v !== "") payload[k] = v;
  }
  if (Object.keys(payload).length === 0) return {};

  // stream: lições longas + max_tokens alto podem passar do limite de ~10 min de
  // requisições não-streamed; o SDK recomenda streaming nesse caso.
  const res = await anthropic.messages
    .stream({
      model: MODEL,
      max_tokens: 16000,
      temperature: 0.2,
      system: SYSTEM(lang),
      messages: [{ role: "user", content: JSON.stringify(payload, null, 2) }],
    })
    .finalMessage();

  // resposta truncada → JSON cortado → corromperia o registro. Falha alto, não grava.
  if (res.stop_reason === "max_tokens") {
    throw new Error("resposta truncada (max_tokens): conteúdo grande demais p/ 16000 tokens");
  }

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return extractJson(text) as Record<string, unknown>;
}

// ── módulos ─────────────────────────────────────────────────────────────────────
async function translateModules() {
  const modules = await db.module.findMany({
    where: MODULE_SLUG ? { slug: MODULE_SLUG } : undefined,
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  for (const m of modules) {
    for (const locale of LOCALES) {
      const exists = m.translations.some((t) => t.locale === locale);
      if (exists && !FORCE) {
        console.log(`· módulo ${m.slug} [${locale}] já existe — pulando`);
        continue;
      }

      try {
        // hebrewWord é transliteração hebraica → não traduz (cai em fallback PT).
        const out = await translateFields(
          {
            title: m.title,
            subtitle: m.subtitle,
            description: m.description,
            keyScriptures: m.keyScriptures,
          },
          LANG_NAME[locale],
        );

        if (DRY) {
          console.log(`\n── módulo ${m.slug} [${locale}] ──`);
          console.log(JSON.stringify(out, null, 2));
          continue;
        }

        await db.moduleTranslation.upsert({
          where: { moduleId_locale: { moduleId: m.id, locale } },
          create: {
            moduleId: m.id,
            locale,
            title: (out.title as string) ?? null,
            subtitle: (out.subtitle as string) ?? null,
            description: (out.description as string) ?? null,
            keyScriptures: (out.keyScriptures as object) ?? undefined,
          },
          update: {
            title: (out.title as string) ?? null,
            subtitle: (out.subtitle as string) ?? null,
            description: (out.description as string) ?? null,
            keyScriptures: (out.keyScriptures as object) ?? undefined,
          },
        });
        okCount++;
        console.log(`✓ módulo ${m.slug} [${locale}]`);
      } catch (e) {
        failures.push(`módulo ${m.slug} [${locale}]`);
        console.error(`✗ módulo ${m.slug} [${locale}]: ${(e as Error).message}`);
      }
    }
  }
}

// ── lições ──────────────────────────────────────────────────────────────────────
async function translateLessons() {
  const lessons = await db.lesson.findMany({
    where: MODULE_SLUG ? { module: { slug: MODULE_SLUG } } : undefined,
    orderBy: [{ moduleId: "asc" }, { order: "asc" }],
    include: { translations: true, module: { select: { slug: true } } },
  });

  for (const l of lessons) {
    for (const locale of LOCALES) {
      const exists = l.translations.some((t) => t.locale === locale);
      if (exists && !FORCE) {
        console.log(`· lição ${l.module.slug}/${l.slug} [${locale}] já existe — pulando`);
        continue;
      }

      try {
        const out = await translateFields(
          {
            title: l.title,
            content: l.content,
            scripture: l.scripture,
            prayer: l.prayer,
            exercise: l.exercise,
          },
          LANG_NAME[locale],
        );

        if (DRY) {
          console.log(`\n── lição ${l.module.slug}/${l.slug} [${locale}] ──`);
          console.log(JSON.stringify(out, null, 2));
          continue;
        }

        await db.lessonTranslation.upsert({
          where: { lessonId_locale: { lessonId: l.id, locale } },
          create: {
            lessonId: l.id,
            locale,
            title: (out.title as string) ?? null,
            content: (out.content as string) ?? null,
            scripture: (out.scripture as string) ?? null,
            prayer: (out.prayer as string) ?? null,
            exercise: (out.exercise as string) ?? null,
          },
          update: {
            title: (out.title as string) ?? null,
            content: (out.content as string) ?? null,
            scripture: (out.scripture as string) ?? null,
            prayer: (out.prayer as string) ?? null,
            exercise: (out.exercise as string) ?? null,
          },
        });
        okCount++;
        console.log(`✓ lição ${l.module.slug}/${l.slug} [${locale}]`);
      } catch (e) {
        failures.push(`lição ${l.module.slug}/${l.slug} [${locale}]`);
        console.error(`✗ lição ${l.module.slug}/${l.slug} [${locale}]: ${(e as Error).message}`);
      }
    }
  }
}

async function main() {
  console.log(
    `translate-content: locales=[${LOCALES.join(", ")}]${MODULE_SLUG ? ` module=${MODULE_SLUG}` : ""}${ONLY ? ` only=${ONLY}` : ""}${DRY ? " (DRY)" : ""}${FORCE ? " (FORCE)" : ""}`,
  );
  if (ONLY !== "lessons") await translateModules();
  if (ONLY !== "modules") await translateLessons();
  await db.$disconnect();

  if (failures.length) {
    console.log(`\n⚠️  ${okCount} ok · ${failures.length} falha(s):`);
    for (const f of failures) console.log(`   - ${f}`);
    console.log(`\nNada gravado para as falhas. Rode de novo (sem --force) p/ retentar só o que faltou.`);
    process.exitCode = 1;
  } else {
    console.log(`\n✓ done — ${okCount} tradução(ões) gravada(s).`);
  }
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
