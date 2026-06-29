import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Heart, BookOpen } from "lucide-react";
import { dateLocale } from "@/lib/i18n/format";

const CYCLE_EMOJI: Record<string, string> = {
  MENSTRUAL: "🌑",
  FOLLICULAR: "🌱",
  OVULATORY: "🌸",
  LUTEAL: "🍂",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DiarioEntryPage({ params }: Props) {
  const { id } = await params;
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Journal"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const entry = await db.journalEntry.findUnique({
    where: { id, userId: session.userId },
  });

  if (!entry) notFound();

  const moodLabels = t.raw("moodLabels") as string[];
  const df = dateLocale(locale);

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/diario"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
      </div>

      {/* Date & meta */}
      <div className="mb-6">
        <p className="text-sm text-stone-400">
          {new Date(entry.createdAt).toLocaleDateString(df, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="text-2xl font-serif text-stone-800 mt-1">
          {entry.title ?? t("untitled")}
        </h1>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {entry.mood && (
            <Badge variant="outline" className="text-xs">
              {t("moodDetail", { label: moodLabels[entry.mood - 1], value: entry.mood })}
            </Badge>
          )}
          {entry.cyclePhase && (
            <Badge variant="outline" className="text-xs">
              {CYCLE_EMOJI[entry.cyclePhase]} {t(`cycle.${entry.cyclePhase}`)}
            </Badge>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white border border-stone-100 rounded-xl p-6 mb-5">
        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-[0.95rem]">
          {entry.content}
        </p>
      </div>

      {/* Gratitude */}
      {entry.gratitude && (
        <Card className="border-berry-wash bg-berry-wash mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-berry uppercase tracking-wide mb-1 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {t("gratitudeHeader")}
            </p>
            <p className="text-stone-700 text-sm">{entry.gratitude}</p>
          </CardContent>
        </Card>
      )}

      {/* Scripture */}
      {entry.scripture && (
        <Card className="border-berry-wash bg-berry-wash mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-berry uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {t("scriptureHeader")}
            </p>
            <p className="text-stone-700 text-sm italic">{entry.scripture}</p>
          </CardContent>
        </Card>
      )}

      {/* Insight */}
      {entry.insight && (
        <Card className="border-green-wash bg-green-wash mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-green-deep uppercase tracking-wide mb-1">
              {t("insightLabel")}
            </p>
            <p className="text-stone-700 text-sm">{entry.insight}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Reflection */}
      {entry.aiReflection && (
        <Card className="border-purple-100 bg-purple-50 mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              {t("rafaReflection")}
            </p>
            <p className="text-stone-700 text-sm leading-relaxed italic whitespace-pre-wrap">
              {entry.aiReflection}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/diario/novo">{t("newEntry")}</Link>
        </Button>
        <Button asChild size="sm" className="bg-berry hover:bg-berry-deep text-white">
          <Link href={`/sessao/nova`}>{t("talkWithRafa")}</Link>
        </Button>
      </div>
    </div>
  );
}
