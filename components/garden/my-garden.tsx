"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  User,
  Heart,
  Users,
  Handshake,
  Home,
  Briefcase,
  Sparkles,
  Globe,
  Loader2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale } from "next-intl";
import { GARDENS, bedState, type GardenKey } from "@/lib/garden";

// O Jardim — a Home assinatura (Opção B): hero no topo do dashboard. Cada canteiro
// é uma área da vida; a cor = florescimento (auto-cultivado). Tocar um canteiro
// abre o cultivo inline (1-5 + uma linha) — sem placar, sem culpa (Constituição).

const ICONS: Record<string, LucideIcon> = {
  User, Heart, Users, Handshake, Home, Briefcase, Sparkles, Globe,
};

// tier 0..5 → cor de fundo do canteiro (seco→verde) + cor do ponto de estado.
const BG: Record<number, string> = {
  0: "#f1ebe1", 1: "#f3ebdf", 2: "#f3efe4", 3: "#eef0e6", 4: "#e6ebdc", 5: "#dfe7d2",
};
const DOT: Record<number, string> = {
  0: "#d6cbb8", 1: "#d9b98e", 2: "#d8c79a", 3: "#b9bf9b", 4: "#8a9a78", 5: "#6e7b61",
};

export interface BedData {
  flourishing: number | null;
  note: string | null;
  lastTendedAt: string | null;
  reflection: string | null;
}

export default function MyGarden({ initial }: { initial: Record<string, BedData> }) {
  const t = useTranslations("Garden");
  const locale = useLocale();
  const [beds, setBeds] = useState<Record<string, BedData>>(initial);
  const [active, setActive] = useState<GardenKey | null>(null);
  const [score, setScore] = useState(3);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [reflecting, setReflecting] = useState(false);

  async function reflect() {
    if (!active || reflecting) return;
    setReflecting(true);
    try {
      const res = await fetch("/api/garden/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: active, gardenName: t(`beds.${active}`), locale }),
      });
      if (res.ok) {
        const { reflection } = await res.json();
        setBeds((prev) => ({ ...prev, [active]: { ...prev[active], reflection } }));
      }
    } finally {
      setReflecting(false);
    }
  }

  function open(key: GardenKey) {
    const b = beds[key];
    setActive(key);
    setScore(b?.flourishing ?? 3);
    setNote(b?.note ?? "");
  }

  async function save() {
    if (!active || saving) return;
    setSaving(true);
    try {
      const res = await fetch("/api/garden/tend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: active, flourishing: score, note }),
      });
      if (res.ok) {
        const { bed } = await res.json();
        setBeds((prev) => ({
          ...prev,
          [active]: {
            ...prev[active],
            flourishing: bed.flourishing,
            note: bed.note,
            lastTendedAt: bed.lastTendedAt,
          },
        }));
        setActive(null);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-6">
      <p className="text-[11px] uppercase tracking-[0.16em] text-stone-400 font-semibold mb-1">
        {t("title")}
      </p>
      <p className="font-serif text-lg text-stone-700 mb-3">{t("prompt")}</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {GARDENS.map((g) => {
          const b = beds[g.key] ?? { flourishing: null, note: null, lastTendedAt: null };
          const st = bedState(b);
          const Icon = ICONS[g.icon] ?? Sparkles;
          return (
            <button
              key={g.key}
              onClick={() => open(g.key)}
              className="relative text-left rounded-xl p-2.5 min-h-[78px] flex flex-col justify-between border border-black/5 transition-transform hover:-translate-y-0.5"
              style={{ background: BG[st.tier] }}
            >
              <span
                className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                style={{ background: DOT[st.tier] }}
              />
              <Icon className="h-[15px] w-[15px]" style={{ color: "#5b6b4e", opacity: 0.75 }} />
              <span>
                <span className="block text-[12px] font-semibold text-stone-700 leading-tight">
                  {t(`beds.${g.key}`)}
                </span>
                <span className="block text-[9.5px] text-stone-500 mt-0.5">
                  {st.stale ? t("needsWater") : t(`states.${st.label}`)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Cultivo inline — abre ao tocar um canteiro */}
      {active && (
        <div className="mt-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <p className="font-serif text-base text-stone-800">{t(`beds.${active}`)}</p>
            <button onClick={() => setActive(null)} className="text-stone-400 hover:text-stone-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-stone-500 mb-3">
            {t("tendQuestion")} · <span className="italic">{verseFor(active)}</span>
          </p>

          <div className="flex items-center gap-2 mb-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setScore(n)}
                aria-label={String(n)}
                className="h-8 w-8 rounded-full text-sm font-medium transition-colors"
                style={
                  score === n
                    ? { background: DOT[n], color: "#fff" }
                    : { background: BG[n], color: "#7a7263" }
                }
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-stone-400 mb-3 px-0.5">
            <span>{t("scaleLow")}</span>
            <span>{t("scaleHigh")}</span>
          </div>

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("notePlaceholder")}
            maxLength={280}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-300 mb-3"
          />

          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-stone-900 px-4 py-2 disabled:opacity-70"
            style={{ background: "#c9a86a" }}
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("tendSave")}
          </button>

          {/* Motor de Evolução — a observação de cultivo da Rafa sobre esta área */}
          <div className="mt-4 pt-3 border-t border-stone-100">
            {beds[active]?.reflection && (
              <div className="flex gap-2 mb-2">
                <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#c9a86a" }} />
                <p className="text-sm text-stone-600 leading-relaxed italic">
                  {beds[active].reflection}
                </p>
              </div>
            )}
            <button
              onClick={reflect}
              disabled={reflecting}
              className="inline-flex items-center gap-1.5 text-xs font-medium disabled:opacity-60"
              style={{ color: "#6d4a5a" }}
            >
              {reflecting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {reflecting
                ? t("reflecting")
                : beds[active]?.reflection
                  ? t("reflectAgain")
                  : t("reflectCta")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function verseFor(key: GardenKey): string {
  return GARDENS.find((g) => g.key === key)?.verse ?? "";
}
