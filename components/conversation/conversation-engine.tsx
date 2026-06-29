"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { GARDENS } from "@/lib/garden";
import {
  MessagesSquare,
  Loader2,
  Sparkles,
  ArrowRight,
  ArrowDown,
  Minus,
  ChevronRight,
} from "lucide-react";

export interface Convo {
  id: string;
  withWhom: string | null;
  topic: string | null;
  gardenKey: string | null;
  preserve: string | null;
  fear: string | null;
  otherPreserve: string | null;
  howTruth: string | null;
  status: string;
  learnedSelf: string | null;
  learnedOther: string | null;
  closeness: string | null;
  reflection: string | null;
}

const PREP = ["preserve", "fear", "otherPreserve", "howTruth"] as const;
const empty = { withWhom: "", topic: "", gardenKey: "", preserve: "", fear: "", otherPreserve: "", howTruth: "" };

export default function ConversationEngine({ initial }: { initial: Convo[] }) {
  const t = useTranslations("Conversation");
  const tg = useTranslations("Garden");
  const locale = useLocale();
  const [convos, setConvos] = useState<Convo[]>(initial);
  const [prep, setPrep] = useState({ ...empty });
  const [savingPrep, setSavingPrep] = useState(false);

  // debrief inline
  const [debriefId, setDebriefId] = useState<string | null>(null);
  const [deb, setDeb] = useState({ learnedSelf: "", learnedOther: "", closeness: "" });
  const [savingDeb, setSavingDeb] = useState(false);

  const setP = (k: keyof typeof prep, v: string) => setPrep((f) => ({ ...f, [k]: v }));
  const prepHasContent = PREP.some((k) => prep[k].trim().length > 0);

  async function savePrep() {
    if (!prepHasContent || savingPrep) return;
    setSavingPrep(true);
    try {
      const res = await fetch("/api/conversa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prep),
      });
      if (res.ok) {
        const { id } = await res.json();
        setConvos((prev) => [
          { id, status: "PREPARED", reflection: null, learnedSelf: null, learnedOther: null, closeness: null, ...prep, gardenKey: prep.gardenKey || null, withWhom: prep.withWhom || null, topic: prep.topic || null, preserve: prep.preserve || null, fear: prep.fear || null, otherPreserve: prep.otherPreserve || null, howTruth: prep.howTruth || null },
          ...prev,
        ]);
        setPrep({ ...empty });
      }
    } finally {
      setSavingPrep(false);
    }
  }

  function openDebrief(id: string) {
    setDebriefId(id);
    setDeb({ learnedSelf: "", learnedOther: "", closeness: "" });
  }

  async function saveDebrief(id: string) {
    if (savingDeb) return;
    setSavingDeb(true);
    try {
      const res = await fetch("/api/conversa", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...deb, locale }),
      });
      if (res.ok) {
        const { reflection } = await res.json();
        setConvos((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, status: "DONE", reflection, learnedSelf: deb.learnedSelf || null, learnedOther: deb.learnedOther || null, closeness: deb.closeness || null }
              : c,
          ),
        );
        setDebriefId(null);
      }
    } finally {
      setSavingDeb(false);
    }
  }

  const CLOSE_ICON: Record<string, React.ReactNode> = {
    closer: <ArrowRight className="h-3.5 w-3.5" style={{ color: "#3c7a5e" }} />,
    distant: <ArrowDown className="h-3.5 w-3.5 text-red-500" />,
    same: <Minus className="h-3.5 w-3.5 text-stone-400" />,
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-2.5">
        <MessagesSquare className="h-6 w-6" style={{ color: "#8e3b5a" }} />
        <div>
          <h1 className="text-2xl font-serif text-stone-800">{t("title")}</h1>
          <p className="text-stone-500 text-sm">{t("intro")}</p>
        </div>
      </div>

      {/* Preparar (antes) */}
      <div className="rounded-xl border border-stone-200 bg-white p-5 mb-8">
        <p className="text-[11px] uppercase tracking-[0.16em] font-semibold mb-3" style={{ color: "#8e3b5a" }}>
          {t("prepareTitle")}
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <input
            value={prep.withWhom}
            onChange={(e) => setP("withWhom", e.target.value)}
            placeholder={t("withWhomPlaceholder")}
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-300"
          />
          <input
            value={prep.topic}
            onChange={(e) => setP("topic", e.target.value)}
            placeholder={t("topicPlaceholder")}
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:border-stone-300"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {GARDENS.map((g) => {
            const active = prep.gardenKey === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setP("gardenKey", active ? "" : g.key)}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors"
                style={
                  active
                    ? { background: "#3c7a5e", color: "#fff", borderColor: "#3c7a5e" }
                    : { background: "#fff", color: "#6b6256", borderColor: "#e7e1d6" }
                }
              >
                {tg(`beds.${g.key}`)}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {PREP.map((k, i) => (
            <div key={k} className={i === 3 ? "rounded-lg border-l-2 border-berry pl-4" : ""}>
              <label className={i === 3 ? "text-sm font-medium text-berry-deep" : "text-sm font-medium text-stone-700"}>
                {t(`prep_${k}`)}
              </label>
              <textarea
                value={prep[k]}
                onChange={(e) => setP(k, e.target.value)}
                placeholder={t(`prep_${k}_ph`)}
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm resize-none min-h-[64px] focus:outline-none focus:border-stone-300"
              />
            </div>
          ))}
        </div>

        <button
          onClick={savePrep}
          disabled={!prepHasContent || savingPrep}
          className="mt-4 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-stone-900 px-4 py-2 disabled:opacity-60"
          style={{ background: "#8e3b5a" }}
        >
          {savingPrep && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("prepareSave")}
        </button>
      </div>

      {/* Lista */}
      {convos.length === 0 ? (
        <p className="text-center text-sm text-stone-400 py-8">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {convos.map((c) => (
            <div key={c.id} className="rounded-xl border border-stone-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-stone-800 truncate">
                    {c.withWhom || t("someone")}
                    {c.topic ? <span className="text-stone-400 font-normal"> · {c.topic}</span> : null}
                  </p>
                  {c.gardenKey && (
                    <p className="text-[11px] mt-0.5" style={{ color: "#3c7a5e" }}>
                      {tg(`beds.${c.gardenKey}`)}
                    </p>
                  )}
                </div>
                <span
                  className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-full shrink-0"
                  style={
                    c.status === "DONE"
                      ? { background: "rgba(60,122,94,0.15)", color: "#2e5e48" }
                      : { background: "#f6efe0", color: "#a98641" }
                  }
                >
                  {c.status === "DONE" ? t("doneBadge") : t("preparedBadge")}
                </span>
              </div>

              {/* Reflexão (depois) */}
              {c.status === "DONE" && c.reflection && (
                <div className="mt-3 pt-3 border-t border-stone-100 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#8e3b5a" }} />
                  <div>
                    {c.closeness && (
                      <p className="inline-flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                        {CLOSE_ICON[c.closeness]} {t(`close_${c.closeness}`)}
                      </p>
                    )}
                    <p className="text-sm text-stone-600 leading-relaxed italic">{c.reflection}</p>
                  </div>
                </div>
              )}

              {/* CTA debrief / form inline */}
              {c.status === "PREPARED" && debriefId !== c.id && (
                <button
                  onClick={() => openDebrief(c.id)}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
                  style={{ color: "#8e3b5a" }}
                >
                  {t("debriefCta")} <ChevronRight className="h-4 w-4" />
                </button>
              )}

              {c.status === "PREPARED" && debriefId === c.id && (
                <div className="mt-3 pt-3 border-t border-stone-100 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-stone-700">{t("debrief_self")}</label>
                    <textarea
                      value={deb.learnedSelf}
                      onChange={(e) => setDeb((d) => ({ ...d, learnedSelf: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm resize-none min-h-[56px] focus:outline-none focus:border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">{t("debrief_other")}</label>
                    <textarea
                      value={deb.learnedOther}
                      onChange={(e) => setDeb((d) => ({ ...d, learnedOther: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm resize-none min-h-[56px] focus:outline-none focus:border-stone-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 block mb-1.5">{t("closenessLabel")}</label>
                    <div className="flex gap-2">
                      {(["closer", "same", "distant"] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setDeb((d) => ({ ...d, closeness: opt }))}
                          className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                          style={
                            deb.closeness === opt
                              ? { background: "#2f2a24", color: "#fff", borderColor: "#2f2a24" }
                              : { background: "#fff", color: "#6b6256", borderColor: "#e7e1d6" }
                          }
                        >
                          {CLOSE_ICON[opt]} {t(`close_${opt}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => saveDebrief(c.id)}
                    disabled={savingDeb}
                    className="inline-flex items-center gap-2 rounded-lg text-sm font-medium text-stone-900 px-4 py-2 disabled:opacity-60"
                    style={{ background: "#8e3b5a" }}
                  >
                    {savingDeb ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {savingDeb ? t("reflecting") : t("debriefSave")}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
