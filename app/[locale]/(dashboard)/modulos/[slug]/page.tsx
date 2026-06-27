import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, PlayCircle, MessageCircle, BookOpen, ArrowLeft, PartyPopper, X } from "lucide-react";
import ModuleCheckoutButton from "@/components/modules/checkout-button";
import { formatModulePrice } from "@/lib/i18n/pricing";
import { localizeModule, localizeLesson } from "@/lib/i18n/content";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function ModuloDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { success, cancelled } = await searchParams;
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Modules"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const [modRaw, purchase, progress] = await Promise.all([
    db.module.findUnique({
      where: { slug, isActive: true },
      include:
        locale !== "pt"
          ? {
              lessons: { orderBy: { order: "asc" }, include: { translations: { where: { locale } } } },
              translations: { where: { locale } },
            }
          : { lessons: { orderBy: { order: "asc" } } },
    }),
    db.modulePurchase.findFirst({
      where: { userId: session.userId, module: { slug }, status: "COMPLETED" },
    }),
    db.userProgress.findFirst({
      where: { userId: session.userId, module: { slug } },
      include: {
        lessonProgress: { select: { lessonId: true, completedAt: true } },
      },
    }),
  ]);

  if (!modRaw) notFound();

  // Aplica a tradução do locale ativo sobre o módulo e suas lições (fallback PT).
  const mod = {
    ...localizeModule(modRaw, locale),
    lessons: modRaw.lessons.map((l: typeof modRaw.lessons[number]) => localizeLesson(l, locale)),
  };

  const owned = !!purchase;
  const completedLessonIds = new Set(
    progress?.lessonProgress.filter((lp: typeof progress.lessonProgress[number]) => lp.completedAt).map((lp: typeof progress.lessonProgress[number]) => lp.lessonId) ?? [],
  );
  const pct = mod.lessons.length > 0
    ? Math.round((completedLessonIds.size / mod.lessons.length) * 100)
    : 0;

  const keyScriptures = (mod.keyScriptures as { ref: string; text: string }[] | null) ?? [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Purchase success banner */}
      {success === "1" && owned && (
        <div className="mb-6 bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
          <PartyPopper className="h-5 w-5 text-teal-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-teal-800">{t("purchaseSuccessTitle")}</p>
            <p className="text-sm text-teal-600 mt-0.5">
              {t("purchaseSuccessBody")}
            </p>
          </div>
        </div>
      )}

      {/* Cancelled banner */}
      {cancelled === "1" && (
        <div className="mb-6 bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <X className="h-4 w-4 text-stone-400 shrink-0" />
          <p className="text-sm text-stone-500">
            {t("checkoutCancelled")}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/modulos"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="flex items-start gap-6 mb-8">
        <span className="text-5xl">{mod.iconEmoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {mod.hebrewWord && (
              <span className="text-xs font-medium text-amber-700 uppercase tracking-widest">
                {mod.hebrewWord}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif text-stone-800">{mod.title}</h1>
          {mod.subtitle && (
            <p className="text-stone-500 mt-1">{mod.subtitle}</p>
          )}

          {owned && mod.lessons.length > 0 && (
            <div className="mt-4 max-w-xs">
              <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>{t("progress")}</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          )}
        </div>

        {!owned && (
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-stone-800">
              {formatModulePrice(mod.priceInCents, locale)}
            </p>
            <p className="text-xs text-stone-400 mb-3">{t("lifetimeAccess")}</p>
            <ModuleCheckoutButton
              moduleId={mod.id}
              moduleTitle={mod.title}
              priceInCents={mod.priceInCents}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <Card className="border-stone-100 bg-stone-50 mb-6">
        <CardContent className="p-5">
          <p className="text-stone-700 leading-relaxed">{mod.description}</p>
        </CardContent>
      </Card>

      {/* Key scriptures */}
      {keyScriptures.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
            {t("anchorScriptures")}
          </p>
          <div className="flex flex-wrap gap-2">
            {keyScriptures.map((s) => (
              <div key={s.ref} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-amber-800">{s.ref}</p>
                <p className="text-xs text-amber-600 italic mt-0.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session CTA */}
      {owned && (
        <Card className="border-amber-200 bg-amber-50 mb-6">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                {t("sessionContextTitle")}
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                {t("sessionContextBody", { title: mod.title })}
              </p>
            </div>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white shrink-0">
              <Link href={`/sessao/nova?moduleId=${mod.id}`}>{t("startSession")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lessons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-stone-800">
            {t("lessonsHeading", { count: mod.lessons.length })}
          </h2>
        </div>

        {mod.lessons.length === 0 ? (
          <Card className="border-dashed border-stone-200">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-8 w-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">{t("lessonsComing")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {mod.lessons.map((lesson: typeof mod.lessons[number], i: number) => {
              const completed = completedLessonIds.has(lesson.id);
              const accessible = owned;
              const typeLabel = t.has(`types.${lesson.type}`) ? t(`types.${lesson.type}`) : lesson.type;
              const durationLabel = lesson.durationMin ? t("duration", { count: lesson.durationMin }) : null;

              return (
                <div key={lesson.id}>
                  {accessible ? (
                    <Link href={`/modulos/${slug}/licoes/${lesson.slug}`}>
                      <LessonRow
                        lesson={lesson}
                        index={i}
                        completed={completed}
                        accessible={true}
                        typeLabel={typeLabel}
                        durationLabel={durationLabel}
                      />
                    </Link>
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      index={i}
                      completed={false}
                      accessible={false}
                      typeLabel={typeLabel}
                      durationLabel={durationLabel}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  index,
  completed,
  accessible,
  typeLabel,
  durationLabel,
}: {
  lesson: { title: string; type: string; durationMin: number | null; slug: string };
  index: number;
  completed: boolean;
  accessible: boolean;
  typeLabel: string;
  durationLabel: string | null;
}) {
  return (
    <Card className={`border-stone-200 transition-shadow ${accessible ? "hover:shadow-sm cursor-pointer" : "opacity-60"}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
          ) : accessible ? (
            <PlayCircle className="h-5 w-5 text-amber-600" />
          ) : (
            <Lock className="h-4 w-4 text-stone-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-800 text-sm truncate">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-xs py-0">
              {typeLabel}
            </Badge>
            {durationLabel && (
              <span className="text-xs text-stone-400">{durationLabel}</span>
            )}
          </div>
        </div>
        <span className="text-xs text-stone-300">{index + 1}</span>
      </CardContent>
    </Card>
  );
}
