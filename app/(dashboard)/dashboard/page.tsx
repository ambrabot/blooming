import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, NotebookPen, BookOpen, Sparkles, Flame, ArrowRight } from "lucide-react";
import { computeCurrentCamada } from "@/lib/journey";
import { computeStreak } from "@/lib/streak";
import { getDailyDevotional } from "@/lib/devotionals";
import JourneyTrail from "@/components/journey/journey-trail";

const GREETINGS = [
  "Shalom",
  "Bem-vinda",
  "Que bom ter você aqui",
  "Hoje é um novo dia",
];

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user, recentSessions, recentJournal, assessment, moduleCount, recentCheckIn, userProgress, devotionalLogs] =
    await Promise.all([
      db.user.findUnique({
        where: { id: session.userId },
        include: { profile: true, milestones: { orderBy: { achievedAt: "desc" }, take: 3 } },
      }),
      db.therapySession.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      db.journalEntry.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 1,
      }),
      db.assessment.findFirst({
        where: { userId: session.userId, completedAt: { not: null } },
      }),
      db.modulePurchase.count({
        where: { userId: session.userId, status: "COMPLETED" },
      }),
      db.assessment.findFirst({
        where: { userId: session.userId, type: "PERIODIC", completedAt: { not: null } },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      db.userProgress.findMany({
        where: { userId: session.userId },
        select: {
          completedAt: true,
          module: { select: { slug: true } },
          lessonProgress: { where: { completedAt: { not: null } }, select: { id: true } },
        },
      }),
      db.devotionalLog.findMany({
        where: { userId: session.userId },
        select: { date: true },
      }),
    ]);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const hasAssessment = !!assessment;

  const touched = new Set<string>();
  for (const p of userProgress) {
    if (p.completedAt || p.lessonProgress.length > 0) touched.add(p.module.slug);
  }
  const currentCamada = computeCurrentCamada(touched, hasAssessment);
  const now = new Date();
  const streak = computeStreak(
    devotionalLogs.map((l) => l.date),
    now,
  );
  const dev = getDailyDevotional(now);

  const lastCheckIn = recentCheckIn?.createdAt ?? null;
  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((Date.now() - lastCheckIn.getTime()) / 86400000)
    : 999;
  const showCheckInBanner = hasAssessment && daysSinceCheckIn >= 28;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-stone-800">
          {timeGreeting}, {session.name.split(" ")[0]}
        </h1>
        <p className="text-stone-500 mt-1">
          {user?.profile?.currentSeason
            ? `Estação: ${user.profile.currentSeason}`
            : "Como você está chegando hoje?"}
        </p>
      </div>

      {/* Pergunta do dia */}
      <Link href="/devocional" className="block mb-6">
        <div className="rounded-lg bg-stone-800 text-stone-100 p-6 md:p-7 hover:bg-stone-900 transition-colors">
          <p
            className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-2"
            style={{ color: "#c9a86a" }}
          >
            Pergunta do dia
          </p>
          <p className="font-serif text-xl md:text-2xl leading-snug">{dev.pergunta}</p>
          <p className="text-[13px] text-stone-400 italic mt-3 pt-3 border-t border-white/10">
            “{dev.passageText}” — {dev.passageRef}
          </p>
          <span className="inline-flex items-center gap-2 text-[13px] mt-4" style={{ color: "#e7d9bf" }}>
            Abrir o devocional <ArrowRight className="h-3.5 w-3.5" />
            {streak.current > 0 && (
              <span className="inline-flex items-center gap-1 ml-2" style={{ color: "#c9a86a" }}>
                <Flame className="h-3.5 w-3.5" />
                {streak.current}
              </span>
            )}
          </span>
        </div>
      </Link>

      {/* CTA: Assessment */}
      {!hasAssessment && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-900">
                ✨ Comece com seu Assessment
              </p>
              <p className="text-sm text-amber-700 mt-1">
                15 minutos · Revela suas áreas de foco · Personaliza sua jornada
              </p>
            </div>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white shrink-0">
              <Link href="/onboarding">Fazer agora</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CTA: Check-in mensal */}
      {showCheckInBanner && (
        <Card className="mb-6 border-teal-200 bg-teal-50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-teal-900">
                📊 Hora do check-in mensal
              </p>
              <p className="text-sm text-teal-700 mt-0.5">
                {daysSinceCheckIn === 999
                  ? "Você ainda não fez nenhum check-in."
                  : `Faz ${daysSinceCheckIn} dias desde o último.`}{" "}
                3 minutos · Compare sua evolução com a Rafa.
              </p>
            </div>
            <Button asChild className="bg-teal-700 hover:bg-teal-800 text-white shrink-0">
              <Link href="/check-in">Fazer check-in</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Jornada de florescimento */}
      <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6">
        <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold mb-4">
          Sua jornada de florescimento · camada {currentCamada} de 7
        </p>
        <JourneyTrail current={currentCamada} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link href="/sessao/nova">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-stone-200">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="font-medium text-stone-800">Nova Sessão</p>
                <p className="text-xs text-stone-500 mt-0.5">Converse com Rafa</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/diario/novo">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-stone-200">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <NotebookPen className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium text-stone-800">Diário</p>
                <p className="text-xs text-stone-500 mt-0.5">Escrever hoje</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/modulos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-stone-200">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-stone-800">Módulos</p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {moduleCount} adquirido{moduleCount !== 1 ? "s" : ""}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
            Sessões recentes
          </h2>
          <div className="space-y-2">
            {recentSessions.map((s: typeof recentSessions[number]) => (
              <Link key={s.id} href={`/sessao/${s.id}`}>
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        {s.title ?? "Sessão sem título"}
                      </p>
                      <p className="text-xs text-stone-400">
                        {new Date(s.createdAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                    {s.mood && (
                      <Badge variant="outline" className="text-xs">
                        Humor {s.mood}/10
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Last Journal */}
      {recentJournal.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
            Último diário
          </h2>
          <Link href={`/diario/${recentJournal[0].id}`}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-stone-800 mb-1">
                  {recentJournal[0].title ?? "Entrada sem título"}
                </p>
                <p className="text-sm text-stone-500 line-clamp-2">
                  {recentJournal[0].content}
                </p>
                <p className="text-xs text-stone-400 mt-2">
                  {new Date(recentJournal[0].createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
