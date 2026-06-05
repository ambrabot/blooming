import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, NotebookPen, Flame } from "lucide-react";

const CYCLE_PHASE_LABEL: Record<string, string> = {
  MENSTRUAL: "🌑 Menstrual",
  FOLLICULAR: "🌱 Folicular",
  OVULATORY: "🌸 Ovulatória",
  LUTEAL: "🍂 Lútea",
};

const MOOD_EMOJI: Record<number, string> = {
  1: "😔", 2: "😞", 3: "😐", 4: "😕", 5: "😶",
  6: "🙂", 7: "😊", 8: "🌿", 9: "✨", 10: "☀️",
};

export default async function DiarioPage() {
  const session = await getSession();
  if (!session) redirect("/login");

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

  // Compute streak (consecutive days with at least one entry)
  const streak = computeStreak(entries.map((e: typeof entries[number]) => e.createdAt));

  // Group by month
  const grouped = entries.reduce<Record<string, typeof entries>>((acc: Record<string, typeof entries>, e: typeof entries[number]) => {
    const key = new Date(e.createdAt).toLocaleDateString("pt-BR", {
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
          <h1 className="text-2xl font-serif text-stone-800">Diário</h1>
          <p className="text-stone-500 text-sm mt-1">
            {entries.length} {entries.length === 1 ? "entrada" : "entradas"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
              <Flame className="h-4 w-4" />
              <span className="font-medium">{streak}</span>
              <span className="text-amber-600">dias seguidos</span>
            </div>
          )}
          <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
            <Link href="/diario/novo">
              <Plus className="h-4 w-4 mr-2" />
              Nova entrada
            </Link>
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <Card className="border-dashed border-stone-200">
          <CardContent className="p-12 text-center">
            <NotebookPen className="h-10 w-10 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-500 font-medium">Seu diário está vazio</p>
            <p className="text-stone-400 text-sm mt-1 mb-4">
              Comece escrevendo o que está no seu coração hoje.
            </p>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/diario/novo">Primeira entrada</Link>
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
                                {entry.title ?? "Entrada sem título"}
                              </p>
                              {entry.mood && (
                                <span className="text-base" title={`Humor ${entry.mood}/10`}>
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
                            {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          {entry.cyclePhase && (
                            <Badge variant="outline" className="text-xs py-0">
                              {CYCLE_PHASE_LABEL[entry.cyclePhase]}
                            </Badge>
                          )}
                          {entry.scripture && (
                            <Badge variant="outline" className="text-xs py-0 text-amber-600 border-amber-200">
                              📖 {entry.scripture}
                            </Badge>
                          )}
                          {entry.aiReflection && (
                            <Badge variant="outline" className="text-xs py-0 text-purple-600 border-purple-200">
                              ✨ Rafa respondeu
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
