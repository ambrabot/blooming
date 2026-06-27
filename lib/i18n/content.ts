// Localização do conteúdo de banco (módulos e lições).
//
// PT é a língua-base: os campos traduzíveis vivem no próprio registro
// (Module/Lesson). EN/ES têm, opcionalmente, uma linha em *Translation com os
// mesmos campos. O fluxo de leitura inclui `translations: { where: { locale } }`
// SOMENTE quando o locale não é pt — assim a experiência PT permanece idêntica
// byte a byte e não depende das tabelas de tradução existirem.

// Campos que podem ser traduzidos em cada modelo. A mesclagem só toca campos
// que de fato existem no registro recebido, então selects parciais (ex.: só
// `title`) também funcionam.
const MODULE_FIELDS = ["title", "subtitle", "description", "hebrewWord", "keyScriptures"] as const;
const LESSON_FIELDS = ["title", "content", "scripture", "prayer", "exercise"] as const;

// Mescla a tradução do locale ativo sobre o registro base (fallback PT).
// Generic sem constraint: aceita qualquer registro Prisma (com ou sem o include
// `translations`) sem disparar a regra de "weak type" do TS. Em pt, ou quando
// não há linha de tradução, retorna o registro intacto.
function localize<T>(rec: T, locale: string, fields: readonly string[]): T {
  if (locale === "pt") return rec;
  const withTr = rec as { translations?: Array<{ locale: string }> };
  const tr = withTr.translations?.find((t) => t.locale === locale) as unknown as
    | Record<string, unknown>
    | undefined;
  if (!tr) return rec;

  const base = rec as Record<string, unknown>;
  const out: Record<string, unknown> = { ...base };
  for (const f of fields) {
    const v = tr[f];
    if (f in base && v != null && v !== "") out[f] = v;
  }
  return out as T;
}

/** Mescla a tradução do locale ativo sobre um Module (fallback PT). */
export function localizeModule<T>(mod: T, locale: string): T {
  return localize(mod, locale, MODULE_FIELDS);
}

/** Mescla a tradução do locale ativo sobre uma Lesson (fallback PT). */
export function localizeLesson<T>(lesson: T, locale: string): T {
  return localize(lesson, locale, LESSON_FIELDS);
}
