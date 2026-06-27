import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, NotebookPen, Flame } from "lucide-react";
import { dateLocale } from "@/lib/i18n/format";

const CYCLE_EMOJI: Record<string, string> = {
  MENSTRUAL: "🌑",
  FOLLICULAR: "🌱",
  OVULATORY: "🌸",
  LUTEAL: "🍂",
};

const MOOD_EMOJI: Record<number, string> = {
  1: "😔", 2: "😞", 3: "😐", 4: "😕", 5: "😶",
  6: "🙂", 7: "😊", 8: "🌿", 9: "✨", 10: "☀️",
};

export default async function DiarioPage() {
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Journal"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const entries = await db.journalEntry.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      mood: true,
      createdAt: true,
      cyclePhase: true,
      insight: true,
      scripture: true,
      gratitude: true,
      aiReflection: true,
    },
  });

  const df = dateLocale(locale);

  // Compute streak (consecutive days with at least one entry)
  const streak = computeStreak(entries.map((e: typeof entries[number]) => e.createdAt));

  // Group by month
  const grouped = entries.reduce<Record<string, typeof entries>>((acc: Record<string, typeof entries>, e: typeof entries[number]) => {
    const key = new Date(e.createdAt).toLocaleDateString(df, {
      month: "long",
      year: "numeric",
    });
    acc[key] = acc[key] ?? [];
    acc[key].push(e);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-stone-800">{t("title")}</h1>
          <p className="text-stone-500 text-sm mt-1">
            {t("entriesCount", { count: entries.length })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
              <Flame className="h-4 w-4" />
              <span className="font-medium">{t("streakDays", { count: streak })}</span>
            </div>
          )}
          <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
            <Link href="/diario/novo">
              <Plus className="h-4 w-4 mr-2" />
              {t("newEntry")}
            </Link>
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="border-dashed border-stone-200">
          <CardContent className="p-12 text-center">
            <NotebookPen className="h-10 w-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">{t("emptyTitle")}</p>
            <p className="text-stone-400 text-sm mt-1 mb-4">
              {t("emptyBody")}
            </p>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/diario/novo">{t("firstEntry")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {(Object.entries(grouped) as [string, typeof entries][]).map(([month, monthEntries]) => (
            <div key={month}>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-widest mb-3">
                {month}
              </p>
              <div className="space-y-3">
                {monthEntries.map((entry) => (
                  <Link key={entry.id} href={`/diario/${entry.id}`}>
                    <Card className="border-stone-200 hover:shadow-sm transition-shadow cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-stone-800 truncate">
                                {entry.title ?? t("untitled")}
                              </p>
                              {entry.mood && (
                                <span className="text-base" title={t("moodTitle", { mood: entry.mood })}>
                                  {MOOD_EMOJI[entry.mood]}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                              {entry.content}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          <span className="text-xs text-stone-400">
                            {new Date(entry.createdAt).toLocaleDateString(df, {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          {entry.cyclePhase && (
                            <Badge variant="outline" className="text-xs py-0">
                              {CYCLE_EMOJI[entry.cyclePhase]} {t(`cycle.${entry.cyclePhase}`)}
                            </Badge>
                          )}
                          {entry.scripture && (
                            <Badge variant="outline" className="text-xs py-0 text-amber-600 border-amber-200">
                              📖 {entry.scripture}
                            </Badge>
                          )}
                          {entry.aiReflection && (
                            <Badge variant="outline" className="text-xs py-0 text-purple-600 border-purple-200">
                              ✨ {t("rafaResponded")}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = [...new Set(
    dates.map((d) => new Date(d).toDateString()),
  )];

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (!uniqueDays.includes(today) && !uniqueDays.includes(yesterday)) return 0;

  let streak = 0;
  let check = uniqueDays.includes(today) ? new Date() : new Date(Date.now() - 86400000);

  while (uniqueDays.includes(check.toDateString())) {
    streak++;
    check = new Date(check.getTime() - 86400000);
  }

  return streak;
}
