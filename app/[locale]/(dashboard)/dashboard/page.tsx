import { getTranslations, getLocale } from "next-intl/server";
import { redirect, Link } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, NotebookPen, ArrowRight, Sprout } from "lucide-react";
import { CAMADAS, computeCurrentCamada } from "@/lib/journey";
import { getStreak } from "@/lib/presence";
import { getDailyDevotional } from "@/lib/devotionals";
import { dateLocale } from "@/lib/i18n/format";
import JourneyTrail from "@/components/journey/journey-trail";
import TodayRitual from "@/components/dashboard/today-ritual";

export default async function DashboardPage() {
  const [session, t, tJourney, locale] = await Promise.all([
    getSession(),
    getTranslations("Dashboard"),
    getTranslations("Journey"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const [user, recentSessions, recentJournal, assessment, recentCheckIn, userProgress, streak] =
    await Promise.all([
      db.user.findUnique({
        where: { id: session.userId },
        include: { profile: true },
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
      getStreak(session.userId),
    ]);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? t("greetingMorning") : hour < 18 ? t("greetingAfternoon") : t("greetingEvening");

  const hasAssessment = !!assessment;

  const touched = new Set<string>();
  for (const p of userProgress) {
    if (p.completedAt || p.lessonProgress.length > 0) touched.add(p.module.slug);
  }
  const currentCamada = computeCurrentCamada(touched, hasAssessment);
  const dev = getDailyDevotional(new Date());

  // Próximo passo da jornada: a camada atual e seu primeiro módulo (rota direta
  // para continuar/desbloquear — liga o ritual diário à transformação macro).
  const camadaText = tJourney.raw("camadas") as { name: string; desc: string }[];
  const camada = CAMADAS[currentCamada - 1] ?? CAMADAS[0];
  const camadaName = camadaText[currentCamada - 1]?.name ?? camada.name;
  const primarySlug = camada.modules[0] ?? "fundamentos";

  const lastCheckIn = recentCheckIn?.createdAt ?? null;
  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((Date.now() - lastCheckIn.getTime()) / 86400000)
    : 999;
  const showCheckInBanner = hasAssessment && daysSinceCheckIn >= 28;

  const df = dateLocale(locale);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-stone-800">
          {timeGreeting}, {session.name.split(" ")[0]}
        </h1>
        <p className="text-stone-500 mt-1">
          {user?.profile?.currentSeason
            ? t("seasonLabel", { season: user.profile.currentSeason })
            : t("seasonPrompt")}
        </p>
      </div>

      {/* Ritual de hoje — passo único do dia + presença inline + streak/graça */}
      <TodayRitual
        question={dev.pergunta}
        passageText={dev.passageText}
        passageRef={dev.passageRef}
        streak={streak}
      />

      {/* CTA: Assessment (só se ainda não fez) */}
      {!hasAssessment && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-900">{t("assessmentCtaTitle")}</p>
              <p className="text-sm text-amber-700 mt-1">{t("assessmentCtaBody")}</p>
            </div>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white shrink-0">
              <Link href="/onboarding">{t("assessmentCtaButton")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* CTA: Check-in mensal (quando vencido) */}
      {showCheckInBanner && (
        <Card className="mb-6 border-teal-200 bg-teal-50">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-teal-900">{t("checkInTitle")}</p>
              <p className="text-sm text-teal-700 mt-0.5">
                {daysSinceCheckIn === 999
                  ? t("checkInNever")
                  : t("checkInDays", { days: daysSinceCheckIn })}{" "}
                {t("checkInBody")}
              </p>
            </div>
            <Button asChild className="bg-teal-700 hover:bg-teal-800 text-white shrink-0">
              <Link href="/check-in">{t("checkInButton")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Próximo passo primário: continuar a jornada (1 ação clara, não um menu) */}
      {hasAssessment && (
        <Link href={`/modulos/${primarySlug}`} className="block mb-4">
          <div className="rounded-lg border-2 border-amber-300 bg-amber-50/60 p-6 flex items-center justify-between hover:border-amber-400 transition-colors">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-amber-700 font-semibold mb-1">
                {t("continueJourney")}
              </p>
              <p className="font-serif text-lg text-stone-800">
                {t("camadaProgress", { n: currentCamada, name: camadaName })}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-amber-700 shrink-0" />
          </div>
        </Link>
      )}

      {/* Ações secundárias — calmas, não competem com o passo do dia */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Link href="/sessao/nova">
          <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 hover:border-stone-300 transition-colors">
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-sm font-medium text-stone-700">{t("secondaryRafa")}</p>
          </div>
        </Link>
        <Link href="/diario/novo">
          <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 hover:border-stone-300 transition-colors">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
              <NotebookPen className="h-4 w-4 text-teal-600" />
            </div>
            <p className="text-sm font-medium text-stone-700">{t("secondaryJournal")}</p>
          </div>
        </Link>
      </div>

      {/* Jornada de florescimento */}
      <div className="mb-8 rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold">
            {t("journeyLabel", { current: currentCamada })}
          </p>
          {/* Eixo "raiz": fidelidade diária (streak) alimenta a jornada, não só a
              compra de módulo. Profundidade = camada; raiz = presença. */}
          <span
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] font-semibold shrink-0"
            style={{ color: "#6e7b61" }}
          >
            <Sprout className="h-3.5 w-3.5" />
            {t("rootLabel", { count: streak.current })}
          </span>
        </div>
        <JourneyTrail current={currentCamada} />
      </div>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
            {t("recentSessions")}
          </h2>
          <div className="space-y-2">
            {recentSessions.map((s: typeof recentSessions[number]) => (
              <Link key={s.id} href={`/sessao/${s.id}`}>
                <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-stone-800">
                        {s.title ?? t("sessionUntitled")}
                      </p>
                      <p className="text-xs text-stone-400">
                        {new Date(s.createdAt).toLocaleDateString(df, {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>
                    {s.mood && (
                      <Badge variant="outline" className="text-xs">
                        {t("mood", { value: s.mood })}
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
            {t("lastJournal")}
          </h2>
          <Link href={`/diario/${recentJournal[0].id}`}>
            <Card className="hover:shadow-sm transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-stone-800 mb-1">
                  {recentJournal[0].title ?? t("journalUntitled")}
                </p>
                <p className="text-sm text-stone-500 line-clamp-2">
                  {recentJournal[0].content}
                </p>
                <p className="text-xs text-stone-400 mt-2">
                  {new Date(recentJournal[0].createdAt).toLocaleDateString(df, {
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
