"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { dateLocale } from "@/lib/i18n/format";
import { GARDENS } from "@/lib/garden";

// Diário guiado — método Blooming das 4 perspectivas (não existe página em branco):
// evento → emoção → empatia → dinâmica. A 4ª (o que aconteceu com o RELACIONAMENTO)
// é a inovação, em destaque. Link opcional a um canteiro do Jardim (journaling →
// cultivo). Compõe o `content` a partir das perspectivas (mantém lista/detalhe ok).

const PERSPECTIVES = [
  { key: "pEvent", n: 1 },
  { key: "pEmotion", n: 2 },
  { key: "pEmpathy", n: 3 },
  { key: "pDynamic", n: 4 }, // a chave — destacada
] as const;

type PKey = (typeof PERSPECTIVES)[number]["key"];

export default function NovaDiarioPage() {
  const t = useTranslations("Journal");
  const tg = useTranslations("Garden");
  const locale = useLocale();
  const router = useRouter();

  const moodLabels = t.raw("moodLabels") as string[];

  const [form, setForm] = useState({
    title: "",
    mood: 5,
    pEvent: "",
    pEmotion: "",
    pEmpathy: "",
    pDynamic: "",
    gratitude: "",
    scripture: "",
    gardenKey: "" as string,
  });
  const [saving, setSaving] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [reflection, setReflection] = useState("");

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  function compose(): string {
    const parts: string[] = [];
    for (const p of PERSPECTIVES) {
      const v = form[p.key as PKey].trim();
      if (v) parts.push(`${t(`p${p.n}Label`)}\n${v}`);
    }
    return parts.join("\n\n");
  }

  const hasPerspective = PERSPECTIVES.some((p) => form[p.key as PKey].trim().length > 0);

  async function handleSave() {
    if (!hasPerspective || saving) return;
    setSaving(true);
    const content = compose();

    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        content,
        mood: form.mood,
        gratitude: form.gratitude,
        scripture: form.scripture,
        pEvent: form.pEvent,
        pEmotion: form.pEmotion,
        pEmpathy: form.pEmpathy,
        pDynamic: form.pDynamic,
        gardenKey: form.gardenKey || null,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      if (content.length > 50) {
        setReflecting(true);
        const reflectRes = await fetch("/api/ai/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: data.id, content, locale }),
        });
        const reflectData = await reflectRes.json();
        setReflecting(false);
        setReflection(reflectData.reflection);
      } else {
        router.push("/diario");
      }
    }
  }

  if (reflection) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-berry-wash bg-berry-wash">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-berry" />
              <p className="text-sm font-medium text-berry-deep">{t("rafaRespondsTitle")}</p>
            </div>
            <p className="text-stone-700 leading-relaxed italic">{reflection}</p>
            <Button
              className="mt-6 bg-berry hover:bg-berry-deep text-white"
              onClick={() => router.push("/diario")}
            >
              {t("seeMyJournal")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-stone-800">{t("todayTitle")}</h1>
        <p className="text-stone-500 text-sm mt-1">
          {new Date().toLocaleDateString(dateLocale(locale), {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Mood */}
      <div className="mb-6">
        <Label className="text-stone-600">{t("moodQuestion", { mood: form.mood })}</Label>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-stone-400">{t("moodLow")}</span>
          <input
            type="range"
            min={1}
            max={10}
            value={form.mood}
            onChange={(e) => set("mood", Number(e.target.value))}
            className="flex-1 accent-berry"
          />
          <span className="text-xs text-stone-400">{t("moodHigh")}</span>
        </div>
        <p className="text-sm text-berry mt-1 font-medium">{moodLabels[form.mood - 1]}</p>
      </div>

      {/* Link opcional a um canteiro do Jardim */}
      <div className="mb-6">
        <Label className="text-stone-600 mb-2 block">{t("gardenLinkLabel")}</Label>
        <div className="flex flex-wrap gap-2">
          {GARDENS.map((g) => {
            const active = form.gardenKey === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => set("gardenKey", active ? "" : g.key)}
                className="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
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
      </div>

      {/* As 4 perspectivas — o coração do método */}
      <div className="space-y-5">
        {PERSPECTIVES.map((p) => {
          const isKey = p.n === 4;
          return (
            <div
              key={p.key}
              className={isKey ? "rounded-lg border-l-2 border-berry pl-4 -ml-px" : ""}
            >
              <Label className={isKey ? "text-berry-deep font-medium" : "text-stone-700"}>
                {p.n}. {t(`p${p.n}Label`)}
              </Label>
              <p className="text-xs text-stone-400 mt-0.5 mb-1.5">{t(`p${p.n}Hint`)}</p>
              <Textarea
                value={form[p.key as PKey]}
                onChange={(e) => set(p.key as keyof typeof form, e.target.value)}
                placeholder={t(`p${p.n}Placeholder`)}
                className="resize-none min-h-[80px]"
              />
            </div>
          );
        })}
      </div>

      {/* Opcionais: gratidão + escritura */}
      <div className="space-y-4 mt-6 pt-5 border-t border-stone-100">
        <div>
          <Label htmlFor="gratitude" className="text-stone-600">{t("gratitudeLabel")}</Label>
          <Input
            id="gratitude"
            value={form.gratitude}
            onChange={(e) => set("gratitude", e.target.value)}
            placeholder={t("gratitudePlaceholder")}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="scripture" className="text-stone-600">{t("scriptureLabel")}</Label>
          <Input
            id="scripture"
            value={form.scripture}
            onChange={(e) => set("scripture", e.target.value)}
            placeholder={t("scripturePlaceholder")}
            className="mt-1"
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!hasPerspective || saving || reflecting}
        className="mt-6 bg-berry hover:bg-berry-deep text-white"
      >
        {saving || reflecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {reflecting ? t("reflecting") : t("saving")}
          </>
        ) : (
          t("save")
        )}
      </Button>
    </div>
  );
}
