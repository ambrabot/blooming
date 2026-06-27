"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Flame, Check, Loader2 } from "lucide-react";

export default function CompleteButton({
  doneToday,
  currentStreak,
}: {
  doneToday: boolean;
  currentStreak: number;
}) {
  const t = useTranslations("Devotional");
  const [done, setDone] = useState(doneToday);
  const [streak, setStreak] = useState(currentStreak);
  const [loading, setLoading] = useState(false);

  async function complete() {
    if (done || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/devocional/complete", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStreak(data.streak.current);
        setDone(true);
      }
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 rounded text-sm font-medium text-[#6e7b61] bg-[#6e7b61]/10 px-4 py-3">
        <Check className="h-4 w-4" />
        {t("doneToday")}
        <span className="inline-flex items-center gap-1 text-[#9c7a39] ml-1">
          <Flame className="h-4 w-4" />
          {t("dayCount", { count: streak })}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={complete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded text-sm font-medium text-white px-5 py-3 transition-opacity disabled:opacity-70"
      style={{ background: "#9c7a39" }}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {t("completeButton")}
    </button>
  );
}
