import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Clock } from "lucide-react";
import LessonCompleteButton from "@/components/modules/lesson-complete-button";
import { localizeModule, localizeLesson } from "@/lib/i18n/content";

interface Props {
  params: Promise<{ slug: string; lessonSlug: string }>;
}

export default async function LicaoPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Modules"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const modRaw = await db.module.findUnique({
    where: { slug, isActive: true },
    include:
      locale !== "pt"
        ? {
            lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, order: true } },
            translations: { where: { locale } },
          }
        : { lessons: { orderBy: { order: "asc" }, select: { id: true, slug: true, title: true, order: true } } },
  });
  if (!modRaw) notFound();
  const mod = localizeModule(modRaw, locale);

  const purchase = await db.modulePurchase.findFirst({
    where: { userId: session.userId, moduleId: mod.id, status: "COMPLETED" },
  });
  if (!purchase) {
    redirect({ href: `/modulos/${slug}`, locale });
    return null;
  }

  const lessonRaw = await db.lesson.findUnique({
    where: { moduleId_slug: { moduleId: mod.id, slug: lessonSlug } },
    ...(locale !== "pt" ? { include: { translations: { where: { locale } } } } : {}),
  });
  if (!lessonRaw) notFound();
  const lesson = localizeLesson(lessonRaw, locale);

  // Ensure UserProgress exists
  await db.userProgress.upsert({
    where: { userId_moduleId: { userId: session.userId, moduleId: mod.id } },
    create: { userId: session.userId, moduleId: mod.id },
    update: {},
  });

  const progress = await db.userProgress.findUnique({
    where: { userId_moduleId: { userId: session.userId, moduleId: mod.id } },
    include: { lessonProgress: { select: { lessonId: true, completedAt: true } } },
  });

  const lessonCompleted = progress?.lessonProgress.some(
    (lp: typeof progress.lessonProgress[number]) => lp.lessonId === lesson.id && lp.completedAt,
  ) ?? false;

  // Prev / Next navigation
  const currentIdx = mod.lessons.findIndex((l: typeof mod.lessons[number]) => l.slug === lessonSlug);
  const prevLesson = currentIdx > 0 ? mod.lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < mod.lessons.length - 1 ? mod.lessons[currentIdx + 1] : null;

  const typeLabel = t.has(`types.${lesson.type}`) ? t(`types.${lesson.type}`) : lesson.type;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-stone-400 mb-8">
        <Link href="/modulos" className="hover:text-stone-600">{t("breadcrumbModules")}</Link>
        <span>/</span>
        <Link href={`/modulos/${slug}`} className="hover:text-stone-600">{mod.title}</Link>
        <span>/</span>
        <span className="text-stone-600 truncate">{lesson.title}</span>
      </div>

      {/* Lesson header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">{typeLabel}</Badge>
            {lesson.durationMin && (
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t("duration", { count: lesson.durationMin })}
              </span>
            )}
            {lessonCompleted && (
              <span className="text-xs text-green flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {t("completed")}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-serif text-stone-800">{lesson.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-stone prose-sm max-w-none mb-8">
        <LessonContent content={lesson.content} />
      </div>

      {/* Scripture */}
      {lesson.scripture && (
        <Card className="border-berry-wash bg-berry-wash mb-6">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-berry uppercase tracking-wide mb-1">{t("anchorScripture")}</p>
            <p className="text-stone-700 italic">{lesson.scripture}</p>
          </CardContent>
        </Card>
      )}

      {/* Exercise */}
      {lesson.exercise && (
        <Card className="border-green-wash bg-green-wash mb-6">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-deep uppercase tracking-wide mb-2">{t("practicalExercise")}</p>
            <p className="text-stone-700 whitespace-pre-wrap text-sm leading-relaxed">{lesson.exercise}</p>
          </CardContent>
        </Card>
      )}

      {/* Prayer */}
      {lesson.prayer && (
        <Card className="border-berry-wash bg-berry-wash mb-6">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-berry uppercase tracking-wide mb-2">{t("prayer")}</p>
            <p className="text-stone-700 italic text-sm leading-relaxed whitespace-pre-wrap">{lesson.prayer}</p>
          </CardContent>
        </Card>
      )}

      {/* Session CTA */}
      <Card className="border-berry-wash bg-berry-wash mb-8">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-berry-deep">{t("deepenWithRafa")}</p>
            <p className="text-xs text-berry mt-0.5">{t("lessonContextBody")}</p>
          </div>
          <Button asChild size="sm" className="bg-berry hover:bg-berry-deep text-white shrink-0">
            <Link href={`/sessao/nova?moduleId=${mod.id}&lessonTitle=${encodeURIComponent(lesson.title)}`}>
              <MessageCircle className="h-4 w-4 mr-1" />
              {t("talk")}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="flex items-center justify-between">
        <div>
          {prevLesson ? (
            <Button asChild variant="outline" size="sm">
              <Link href={`/modulos/${slug}/licoes/${prevLesson.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("previous")}
              </Link>
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href={`/modulos/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("module")}
              </Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LessonCompleteButton
            lessonId={lesson.id}
            progressId={progress?.id}
            moduleId={mod.id}
            completed={lessonCompleted}
          />

          {nextLesson && (
            <Button asChild className="bg-berry hover:bg-berry-deep text-white" size="sm">
              <Link href={`/modulos/${slug}/licoes/${nextLesson.slug}`}>
                {t("next")}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple markdown-to-HTML renderer for lesson content
function LessonContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-serif text-stone-800 mt-8 mb-3">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-medium text-stone-700 mt-6 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-berry-wash pl-4 my-4 text-stone-600 italic text-sm">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line === "---") {
      elements.push(<hr key={i} className="my-6 border-stone-100" />);
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-stone-800 my-2">{line.slice(2, -2)}</p>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="my-2" />);
    } else {
      elements.push(<p key={i} className="text-stone-700 leading-relaxed my-2 text-[0.95rem]">{line}</p>);
    }
    i++;
  }

  return <div>{elements}</div>;
}
