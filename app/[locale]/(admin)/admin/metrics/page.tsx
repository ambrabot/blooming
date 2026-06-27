import { db } from "@/lib/db/client";
import { toDayNumber } from "@/lib/streak";

// Métricas de ativação + retenção computadas dos dados que já existem (sem
// tracking novo). Gate ADMIN herdado do layout. Interno → PT, sem i18n.
export const dynamic = "force-dynamic";

const DAY = 86_400_000;
const pct = (n: number, d: number) => (d ? Math.round((100 * n) / d) : 0);

export default async function MetricsPage() {
  const now = new Date();
  const todayN = toDayNumber(now);

  const [users, streaks] = await Promise.all([
    db.user.findMany({
      where: { role: { not: "ADMIN" } },
      select: {
        id: true,
        createdAt: true,
        sessions: { select: { createdAt: true }, orderBy: { createdAt: "asc" }, take: 1 },
        assessments: { where: { completedAt: { not: null } }, select: { id: true }, take: 1 },
        purchases: { where: { status: "COMPLETED" }, select: { id: true }, take: 1 },
      },
    }),
    db.streakState.findMany({ select: { userId: true, current: true, best: true, lastActiveOn: true } }),
  ]);

  const total = users.length;
  const assessed = users.filter((u) => u.assessments.length > 0).length;
  const withRafa = users.filter((u) => u.sessions.length > 0).length;
  const day1Rafa = users.filter(
    (u) => u.sessions[0] && u.sessions[0].createdAt.getTime() - u.createdAt.getTime() <= DAY,
  ).length;
  const buyers = users.filter((u) => u.purchases.length > 0).length;

  const streakByUser = new Map(streaks.map((s) => [s.userId, s]));
  const activeStreak = streaks.filter((s) => s.current > 0).length;
  const presentToday = streaks.filter(
    (s) => s.lastActiveOn && toDayNumber(s.lastActiveOn) === todayN,
  ).length;
  const currents = streaks.filter((s) => s.current > 0).map((s) => s.current);
  const avgStreak = currents.length
    ? Math.round((currents.reduce((a, b) => a + b, 0) / currents.length) * 10) / 10
    : 0;
  const maxBest = streaks.reduce((m, s) => Math.max(m, s.best), 0);

  // D7 (proxy): de quem entrou há 7–30 dias, quantos têm presença nos últimos 7 dias.
  const cohort = users.filter((u) => {
    const age = now.getTime() - u.createdAt.getTime();
    return age >= 7 * DAY && age <= 30 * DAY;
  });
  const retained = cohort.filter((u) => {
    const s = streakByUser.get(u.id);
    return s?.lastActiveOn && todayN - toDayNumber(s.lastActiveOn) <= 7;
  }).length;

  const cards: { label: string; value: string; sub?: string }[] = [
    { label: "Usuárias", value: String(total), sub: "total (exceto admin)" },
    { label: "Fizeram o assessment", value: `${pct(assessed, total)}%`, sub: `${assessed}/${total}` },
    {
      label: "Ativação — conversaram com a Rafa",
      value: `${pct(withRafa, total)}%`,
      sub: `${withRafa}/${total} já tiveram ≥1 sessão`,
    },
    {
      label: "Ativação dia-1 (Rafa em 24h)",
      value: `${pct(day1Rafa, total)}%`,
      sub: `${day1Rafa}/${total} — o momento mágico`,
    },
    { label: "Compraram módulo", value: `${pct(buyers, total)}%`, sub: `${buyers}/${total}` },
    {
      label: "Streak ativo",
      value: `${pct(activeStreak, total)}%`,
      sub: `${activeStreak}/${total} com streak > 0`,
    },
    { label: "Presentes hoje", value: String(presentToday), sub: "marcaram presença hoje" },
    { label: "Streak médio", value: String(avgStreak), sub: `recorde geral: ${maxBest} dias` },
    {
      label: "Retenção D7 (proxy)",
      value: `${pct(retained, cohort.length)}%`,
      sub: `${retained}/${cohort.length} da coorte 7–30d ativos nos últimos 7d`,
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-800">Métricas — ativação & retenção</h1>
      <p className="text-sm text-zinc-500 mt-1">
        Computadas dos dados reais (sem tracking externo). O gargalo do mentor: ativação (Rafa
        no dia 1) → retenção (streak). Instrumente antes de escalar tráfego.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-500 leading-snug">{c.label}</p>
            <p className="text-3xl font-semibold text-zinc-900 mt-2">{c.value}</p>
            {c.sub && <p className="text-xs text-zinc-400 mt-1">{c.sub}</p>}
          </div>
        ))}
      </div>

      {total === 0 && (
        <p className="text-sm text-zinc-400 mt-8">
          Ainda sem usuárias reais — os números ganham vida quando o tráfego começar.
        </p>
      )}
    </div>
  );
}
