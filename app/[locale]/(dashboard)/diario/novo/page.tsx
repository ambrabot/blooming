"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import { dateLocale } from "@/lib/i18n/format";

export default function NovaDiarioPage() {
  const t = useTranslations("Journal");
  const locale = useLocale();
  const router = useRouter();

  const moodLabels = t.raw("moodLabels") as string[];
  const prompts = t.raw("prompts") as string[];

  const [form, setForm] = useState({
    title: "",
    content: "",
    gratitude: "",
    scripture: "",
    insight: "",
    mood: 5,
  });
  const [saving, setSaving] = useState(false);
  const [reflecting, setReflecting] = useState(false);
  const [reflection, setReflection] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);

    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      // Get AI reflection
      if (form.content.length > 50) {
        setReflecting(true);
        const reflectRes = await fetch("/api/ai/reflect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ entryId: data.id, content: form.content, locale }),
        });
        const reflectData = await reflectRes.json();
        setReflecting(false);
        setReflection(reflectData.reflection);
      } else {
        router.push("/diario");
      }
    }
  }

  function usePrompt(prompt: string) {
    setSelectedPrompt(prompt);
    setForm((f) => ({
      ...f,
      content: f.content ? f.content + "\n\n" + prompt + "\n" : prompt + "\n",
    }));
  }

  if (reflection) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-medium text-amber-800">{t("rafaRespondsTitle")}</p>
            </div>
            <p className="text-stone-700 leading-relaxed italic">{reflection}</p>
            <Button
              className="mt-6 bg-amber-700 hover:bg-amber-800 text-white"
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
            onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
            className="flex-1 accent-amber-600"
          />
          <span className="text-xs text-stone-400">{t("moodHigh")}</span>
        </div>
        <p className="text-sm text-amber-700 mt-1 font-medium">
          {moodLabels[form.mood - 1]}
        </p>
      </div>

      {/* Prompt suggestions */}
      <div className="mb-4">
        <Label className="text-stone-600 mb-2 block">{t("promptsLabel")}</Label>
        <div className="flex flex-wrap gap-2">
          {prompts.map((p) => (
            <Badge
              key={p}
              variant={selectedPrompt === p ? "default" : "outline"}
              className="cursor-pointer text-xs py-1"
              onClick={() => usePrompt(p)}
            >
              {p.slice(0, 35)}...
            </Badge>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">{t("titleLabel")}</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder={t("titlePlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="content">{t("contentLabel")}</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder={t("contentPlaceholder")}
            className="mt-1 min-h-[180px] resize-none"
          />
        </div>

        <div>
          <Label htmlFor="gratitude">{t("gratitudeLabel")}</Label>
          <Input
            id="gratitude"
            value={form.gratitude}
            onChange={(e) => setForm({ ...form, gratitude: e.target.value })}
            placeholder={t("gratitudePlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="scripture">{t("scriptureLabel")}</Label>
          <Input
            id="scripture"
            value={form.scripture}
            onChange={(e) => setForm({ ...form, scripture: e.target.value })}
            placeholder={t("scripturePlaceholder")}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="insight">{t("insightLabel")}</Label>
          <Textarea
            id="insight"
            value={form.insight}
            onChange={(e) => setForm({ ...form, insight: e.target.value })}
            placeholder={t("insightPlaceholder")}
            className="mt-1 resize-none"
            rows={2}
          />
        </div>
      </div>

      <Button
        onClick={handleSave}
        disabled={!form.content.trim() || saving || reflecting}
        className="mt-6 bg-amber-700 hover:bg-amber-800 text-white"
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
