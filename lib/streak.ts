// Cálculo de sequência (streak) do devocional a partir dos dias concluídos.

export function toDayNumber(d: Date): number {
  return Math.floor(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000,
  );
}

export interface StreakInfo {
  current: number;
  best: number;
  doneToday: boolean;
}

export function computeStreak(logDates: Date[], today: Date): StreakInfo {
  const days = Array.from(new Set(logDates.map(toDayNumber))).sort((a, b) => a - b);
  if (days.length === 0) return { current: 0, best: 0, doneToday: false };

  const set = new Set(days);
  const todayN = toDayNumber(today);
  const doneToday = set.has(todayN);

  // Sequência atual: conta para trás a partir de hoje (ou ontem, se hoje ainda
  // não foi feito) enquanto os dias forem consecutivos.
  let current = 0;
  let cursor = doneToday ? todayN : todayN - 1;
  while (set.has(cursor)) {
    current++;
    cursor--;
  }

  // Melhor sequência histórica.
  let best = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    run = days[i] === days[i - 1] + 1 ? run + 1 : 1;
    if (run > best) best = run;
  }
  best = Math.max(best, current);

  return { current, best, doneToday };
}
