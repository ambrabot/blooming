import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Heart, BookOpen } from "lucide-react";

const CYCLE_PHASE_LABEL: Record<string, string> = {
  MENSTRUAL: "🌑 Menstrual",
  FOLLICULAR: "🌱 Folicular",
  OVULATORY: "🌸 Ovulatória",
  LUTEAL: "🍂 Lútea",
};

const MOOD_LABEL: Record<number, string> = {
  1: "Muito difícil", 2: "Difícil", 3: "Pesado", 4: "Cansado", 5: "Neutro",
  6: "Bem", 7: "Leve", 8: "Grato", 9: "Esperançoso", 10: "Em paz",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DiarioEntryPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const entry = await db.journalEntry.findUnique({
    where: { id, userId: session.userId },
  });

  if (!entry) notFound();

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
          {new Date(entry.createdAt).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1 className="text-2xl font-serif text-stone-800 mt-1">
          {entry.title ?? "Entrada sem título"}
        </h1>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          {entry.mood && (
            <Badge variant="outline" className="text-xs">
              Humor: {MOOD_LABEL[entry.mood]} ({entry.mood}/10)
            </Badge>
          )}
          {entry.cyclePhase && (
            <Badge variant="outline" className="text-xs">
              {CYCLE_PHASE_LABEL[entry.cyclePhase]}
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
        <Card className="border-rose-100 bg-rose-50 mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-rose-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Gratidão
            </p>
            <p className="text-stone-700 text-sm">{entry.gratitude}</p>
          </CardContent>
        </Card>
      )}

      {/* Scripture */}
      {entry.scripture && (
        <Card className="border-amber-100 bg-amber-50 mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1 flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Versículo
            </p>
            <p className="text-stone-700 text-sm italic">{entry.scripture}</p>
          </CardContent>
        </Card>
      )}

      {/* Insight */}
      {entry.insight && (
        <Card className="border-teal-100 bg-teal-50 mb-4">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-teal-700 uppercase tracking-wide mb-1">
              O que Deus me mostrou
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
              Reflexão da Rafa
            </p>
            <p className="text-stone-700 text-sm leading-relaxed italic whitespace-pre-wrap">
              {entry.aiReflection}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 mt-6">
        <Button asChild variant="outline" size="sm">
          <Link href="/diario/novo">Nova entrada</Link>
        </Button>
        <Button asChild size="sm" className="bg-amber-700 hover:bg-amber-800 text-white">
          <Link href={`/sessao/nova`}>Conversar sobre isso com a Rafa</Link>
        </Button>
      </div>
    </div>
  );
}
