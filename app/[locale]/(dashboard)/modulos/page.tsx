import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import {
  CAMADAS,
  camadaForModule,
  computeCurrentCamada,
  statusFor,
} from "@/lib/journey";
import { formatModulePrice } from "@/lib/i18n/pricing";
import { localizeModule } from "@/lib/i18n/content";

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];

export default async function ModulosPage() {
  const [session, t, tj, locale] = await Promise.all([
    getSession(),
    getTranslations("Modules"),
    getTranslations("Journey"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const camadaText = tj.raw("camadas") as { name: string; desc: string }[];

  const [modulesRaw, purchases, userProgress, assessment] = await Promise.all([
    db.module.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      ...(locale !== "pt" ? { include: { translations: { where: { locale } } } } : {}),
    }),
    db.modulePurchase.findMany({
      where: { userId: session.userId, status: "COMPLETED" },
      select: { moduleId: true },
    }),
    db.userProgress.findMany({
      where: { userId: session.userId },
      select: {
        completedAt: true,
        module: { select: { slug: true } },
        lessonProgress: { where: { completedAt: { not: null } }, select: { id: true } },
      },
    }),
    db.assessment.findFirst({
      where: { userId: session.userId, type: "INITIAL", completedAt: { not: null } },
      select: { id: true },
    }),
  ]);

  const modules = modulesRaw.map((m) => localizeModule(m, locale));
  const purchasedIds = new Set(purchases.map((p) => p.moduleId));
  const touched = new Set<string>();
  for (const p of userProgress) {
    if (p.completedAt || p.lessonProgress.length > 0) touched.add(p.module.slug);
  }
  const currentCamada = computeCurrentCamada(touched, !!assessment);

  type Mod = (typeof modules)[number];
  const byCamada = new Map<number, Mod[]>();
  for (const m of modules) {
    const c = camadaForModule(m.slug) || 99;
    if (!byCamada.has(c)) byCamada.set(c, []);
    byCamada.get(c)!.push(m);
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <p className="text-[11px] uppercase tracking-[0.18em] text-stone-400 font-semibold">
        {t("eyebrow")}
      </p>
      <h1 className="font-serif text-3xl text-stone-800 mt-1">{t("title")}</h1>
      <p className="text-stone-500 mt-1.5 text-sm">
        {t("subtitle")}
      </p>

      <div className="mt-8 space-y-8">
        {CAMADAS.map((camada) => {
          const mods = byCamada.get(camada.n) ?? [];
          if (mods.length === 0) return null;
          const status = statusFor(camada.n, currentCamada);
          const ct = camadaText[camada.n - 1] ?? { name: camada.name, desc: camada.desc };

          return (
            <section key={camada.n}>
              <div className="flex items-center gap-3 border-b border-stone-200 pb-2 mb-1">
                <span
                  className="text-[13px] font-semibold tracking-[0.1em]"
                  style={{ color: status === "locked" ? "#a8a29e" : "#8e3b5a" }}
                >
                  {ROMAN[camada.n]}
                </span>
                <h2
                  className="font-serif text-xl"
                  style={{ color: status === "locked" ? "#a8a29e" : "#3d3833" }}
                >
                  {ct.name}
                </h2>
                {status === "current" && (
                  <span className="text-[10px] uppercase tracking-wider text-[#8e3b5a] border border-[#d8c39a] rounded-full px-2 py-0.5">
                    {tj("youAreHere")}
                  </span>
                )}
                {status === "done" && (
                  <CheckCircle2 className="h-4 w-4 text-[#3c7a5e]" />
                )}
              </div>
              <p className="text-[12.5px] text-stone-400 mb-3">{ct.desc}</p>

              <div className="divide-y divide-stone-100">
                {mods.map((mod) => {
                  const owned = purchasedIds.has(mod.id);
                  return (
                    <Link
                      key={mod.id}
                      href={`/modulos/${mod.slug}`}
                      className="flex items-center gap-4 py-3.5 group"
                    >
                      <span className="text-xl w-7 text-center shrink-0">{mod.iconEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[15px] text-stone-800">{mod.title}</p>
                        {mod.subtitle && (
                          <p className="text-xs text-stone-400 mt-0.5 truncate">
                            {mod.hebrewWord && `${mod.hebrewWord} · `}
                            {mod.subtitle}
                          </p>
                        )}
                      </div>
                      {owned ? (
                        <span className="inline-flex items-center gap-1 text-xs text-[#3c7a5e] font-medium shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t("access")}
                          <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-stone-400 shrink-0">
                          <Lock className="h-3 w-3" />
                          {formatModulePrice(mod.priceInCents, locale)}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
