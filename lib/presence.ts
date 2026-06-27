// Motor de "Presença" — o streak diário unificado do Blooming.
//
// Presença = um ato diário de estar com Deus, contado por QUALQUER um:
// devocional concluído, sessão com a Rafa, ou entrada no diário. Um por dia.
//
// Graça (dias de graça): cobrem uma falha sem zerar o streak — "as misericórdias
// se renovam a cada manhã" (Lm 3:23). Ganha-se 1 a cada 7 dias de presença (teto 3).
// É o fosso teológico: onde apps seculares punem a falha, aqui a graça restaura.

import { db } from "@/lib/db/client";
import { toDayNumber } from "@/lib/streak";

const GRACE_CAP = 3;
export const PRESENCE_MILESTONES = [3, 7, 21, 40, 100] as const;

export type PresenceSource = "DEVOTIONAL" | "RAFA" | "JOURNAL";

export interface PresenceResult {
  current: number;
  best: number;
  graceDays: number;
  doneToday: boolean;
  graceCovered: number; // dias que a graça cobriu nesta marcação (0 = nenhum)
  milestone: number | null; // marco atingido HOJE (3/7/21/40/100) ou null
}

function utcDateOnly(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

// Títulos com enquadramento bíblico (PT — mesmo padrão dos milestones existentes,
// que são literais. Localizar é refino futuro).
function milestoneText(streak: number): { title: string; description: string } {
  switch (streak) {
    case 3:
      return { title: "3 dias de presença", description: "Três dias seguidos diante Dele. O hábito está nascendo." };
    case 7:
      return { title: "7 dias — uma semana de presença", description: "Uma semana inteira de fidelidade. Deus honra o que se repete no secreto." };
    case 21:
      return { title: "21 dias de presença", description: "Três semanas. O que era esforço já está virando raiz." };
    case 40:
      return { title: "40 dias — uma estação no deserto", description: "Quarenta dias é tempo bíblico de transformação. Você atravessou." };
    case 100:
      return { title: "100 dias de presença", description: "Cem dias plantada na presença. Isto é uma vida sendo reescrita." };
    default:
      return { title: `${streak} dias de presença`, description: `${streak} dias de fidelidade.` };
  }
}

/**
 * Marca a presença do dia e atualiza o streak durável (idempotente por dia).
 * Chamado pelos 3 caminhos: devocional, Rafa, diário.
 */
export async function recordPresence(
  userId: string,
  now: Date = new Date(),
): Promise<PresenceResult> {
  const todayN = toDayNumber(now);

  const state = await db.streakState.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  // Já houve presença hoje → não conta de novo.
  if (state.lastActiveOn && toDayNumber(state.lastActiveOn) === todayN) {
    return {
      current: state.current,
      best: state.best,
      graceDays: state.graceDays,
      doneToday: true,
      graceCovered: 0,
      milestone: null,
    };
  }

  let current: number;
  let graceDays = state.graceDays;
  let graceCovered = 0;

  if (!state.lastActiveOn) {
    current = 1;
  } else {
    const missed = todayN - toDayNumber(state.lastActiveOn) - 1; // dias pulados
    if (missed <= 0) {
      current = state.current + 1; // consecutivo
    } else if (missed <= graceDays) {
      graceDays -= missed; // a graça cobre os dias perdidos
      graceCovered = missed;
      current = state.current + 1;
    } else {
      current = 1; // recomeço — best preservado ("toda manhã é recomeço")
    }
  }

  const best = Math.max(state.best, current);
  // Ganha 1 dia de graça a cada 7 dias de presença, até o teto.
  if (current % 7 === 0 && graceDays < GRACE_CAP) graceDays += 1;

  await db.streakState.update({
    where: { userId },
    data: { current, best, graceDays, lastActiveOn: utcDateOnly(now) },
  });

  const milestone = (PRESENCE_MILESTONES as readonly number[]).includes(current) ? current : null;
  if (milestone) {
    const { title, description } = milestoneText(milestone);
    await db.milestone
      .create({
        data: { userId, type: "JOURNAL_STREAK", title, description, metadata: { streak: milestone } },
      })
      .catch(() => {}); // marco é bônus — nunca derruba o fluxo principal
  }

  return { current, best, graceDays, doneToday: true, graceCovered, milestone };
}

/** Lê o streak atual (para exibição). Não altera nada. */
export async function getStreak(
  userId: string,
  now: Date = new Date(),
): Promise<{ current: number; best: number; graceDays: number; doneToday: boolean }> {
  const state = await db.streakState.findUnique({ where: { userId } });
  if (!state) return { current: 0, best: 0, graceDays: 0, doneToday: false };
  const doneToday = !!state.lastActiveOn && toDayNumber(state.lastActiveOn) === toDayNumber(now);
  return { current: state.current, best: state.best, graceDays: state.graceDays, doneToday };
}
