import { getTranslations, getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import ProfileForm from "@/components/profile/profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { dateLocale } from "@/lib/i18n/format";
import { CheckCircle2, BookOpen, NotebookPen, MessageCircle } from "lucide-react";

export default async function PerfilPage() {
  const [session, t, locale] = await Promise.all([
    getSession(),
    getTranslations("Profile"),
    getLocale(),
  ]);
  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const [user, stats, milestones] = await Promise.all([
    db.user.findUnique({
      where: { id: session.userId },
      include: { profile: true },
    }),
    Promise.all([
      db.therapySession.count({ where: { userId: session.userId } }),
      db.journalEntry.count({ where: { userId: session.userId } }),
      db.modulePurchase.count({ where: { userId: session.userId, status: "COMPLETED" } }),
      db.assessment.count({ where: { userId: session.userId, completedAt: { not: null } } }),
    ]),
    db.milestone.findMany({
      where: { userId: session.userId },
      orderBy: { achievedAt: "desc" },
    }),
  ]);

  if (!user) {
    redirect({ href: "/login", locale });
    return null;
  }

  const [sessionCount, journalCount, moduleCount, assessmentCount] = stats;

  const MILESTONE_EMOJI: Record<string, string> = {
    MODULE_STARTED: "🚀",
    MODULE_COMPLETED: "✅",
    JOURNAL_STREAK: "🔥",
    SESSION_COUNT: "💬",
    ASSESSMENT_DONE: "✨",
    BREAKTHROUGH: "⚡",
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-stone-800">{t("title")}</h1>
        <p className="text-stone-500 text-sm mt-1">{t("subtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: t("statSessions"), value: sessionCount, icon: MessageCircle, color: "text-red-500" },
          { label: t("statJournal"), value: journalCount, icon: NotebookPen, color: "text-green" },
          { label: t("statModules"), value: moduleCount, icon: BookOpen, color: "text-berry" },
          { label: t("statAssessments"), value: assessmentCount, icon: CheckCircle2, color: "text-purple-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-stone-200">
            <CardContent className="p-4 flex flex-col items-center text-center gap-1">
              <Icon className={`h-5 w-5 ${color}`} />
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-xs text-stone-400">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile form */}
      <ProfileForm
        userId={user.id}
        initial={{
          name: user.name,
          role: user.role,
          bio: user.profile?.bio ?? "",
          currentSeason: user.profile?.currentSeason ?? "",
          churchBackground: user.profile?.churchBackground ?? "",
          hebrewRoots: user.profile?.hebrewRoots ?? false,
          cycleStartDate: user.profile?.cycleStartDate
            ? user.profile.cycleStartDate.toISOString().slice(0, 10)
            : "",
          cycleLengthDays: user.profile?.cycleLengthDays ?? 28,
        }}
      />

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">
            {t("milestonesTitle")}
          </h2>
          <div className="space-y-2">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-start gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3"
              >
                <span className="text-lg shrink-0">{MILESTONE_EMOJI[m.type] ?? "✦"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">{m.title}</p>
                  {m.description && (
                    <p className="text-xs text-stone-400 mt-0.5">{m.description}</p>
                  )}
                </div>
                <p className="text-xs text-stone-300 shrink-0">
                  {new Date(m.achievedAt).toLocaleDateString(dateLocale(locale), {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
