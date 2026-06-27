"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Flame, Check, Loader2, ArrowRight, Shield } from "lucide-react";

interface Streak {
  current: number;
  best: number;
  graceDays: number;
  doneToday: boolean;
}

// Ritual "Hoje": o passo único do dia, com a presença marcável INLINE (sem sair
// do dashboard). Devocional OU Rafa OU diário marcam presença; aqui o caminho é
// o devocional. O streak + graça vivem aqui — é a alavanca nº1 de retenção.
export default function TodayRitual({
  question,
  passageText,
  passageRef,
  streak: initial,
}: {
  question: string;
  passageText: string;
  passageRef: string;
  streak: Streak;
}) {
  const t = useTranslations("Dashboard");
  const [streak, setStreak] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [graceMsg, setGraceMsg] = useState(0);
  const [milestone, setMilestone] = useState<number | null>(null);

  async function mark() {
    if (streak.doneToday || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/devocional/complete", { method: "POST" });
      if (res.ok) {
        const { streak: s } = await res.json();
        setStreak({ current: s.current, best: s.best, graceDays: s.graceDays, doneToday: true });
        if (s.graceCovered > 0) setGraceMsg(s.graceCovered);
        if (s.milestone) setMilestone(s.milestone);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg bg-stone-800 text-stone-100 p-6 md:p-7 mb-6">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p
          className="text-[11px] uppercase tracking-[0.16em] font-semibold"
          style={{ color: "#c9a86a" }}
        >
          {t("todayStep")}
        </p>
        {streak.current > 0 && (
          <span
            className="inline-flex items-center gap-1.5 text-[13px] shrink-0"
            style={{ color: "#c9a86a" }}
          >
            <Flame className="h-4 w-4" />
            {t("streakLabel", { count: streak.current })}
          </span>
        )}
      </div>

      <p className="font-serif text-xl md:text-2xl leading-snug">{question}</p>
      <p className="text-[13px] text-stone-400 italic mt-3 pt-3 border-t border-white/10">
        “{passageText}” — {passageRef}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        {streak.doneToday ? (
          <span
            className="inline-flex items-center gap-2 rounded text-sm font-medium px-4 py-2.5"
            style={{ background: "rgba(110,123,97,0.22)", color: "#cdd6bf" }}
          >
            <Check className="h-4 w-4" />
            {t("presentToday")}
          </span>
        ) : (
          <button
            onClick={mark}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-stone-900 px-5 py-2.5 transition-opacity disabled:opacity-70"
            style={{ background: "#c9a86a" }}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
            {loading ? t("presenceMarking") : t("markPresence")}
          </button>
        )}

        <Link
          href="/devocional"
          className="inline-flex items-center gap-1.5 text-[13px]"
          style={{ color: "#e7d9bf" }}
        >
          {t("openFullDevotional")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>

        {streak.graceDays > 0 && (
          <span className="inline-flex items-center gap-1 text-[12px] text-stone-400 sm:ml-auto">
            <Shield className="h-3.5 w-3.5" />
            {t("graceBanked", { count: streak.graceDays })}
          </span>
        )}
      </div>

      {graceMsg > 0 && (
        <p className="mt-3 text-[13px]" style={{ color: "#c9a86a" }}>
          {t("graceCovered", { count: graceMsg })}
        </p>
      )}
      {milestone && (
        <p className="mt-3 text-[13px] font-medium" style={{ color: "#e7d9bf" }}>
          {t("milestoneReached", { count: milestone })}
        </p>
      )}
    </div>
  );
}
