"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronRight, Sparkles, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Nome de cada idioma no próprio idioma (para o seletor do onboarding).
const LANGUAGE_NATIVE: Record<string, string> = {
  pt: "Português",
  en: "English",
  es: "Español",
};

// Question structure stays in code; all copy comes from messages (Auth.onboarding.questions).
const QUESTION_TYPES = [
  "scale",
  "choice",
  "choice",
  "multiselect",
  "scale",
  "text",
  "choice",
  "text",
] as const;

type QuestionContent = {
  category: string;
  text: string;
  subtext?: string;
  scripture?: string;
  options?: string[];
};

type Answer = string | number | string[];

export default function OnboardingPage() {
  const t = useTranslations("Auth.onboarding");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const questions = t.raw("questions") as QuestionContent[];
  const total = questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    report: string;
    recommendations: { slug: string; priority: number; reason: string; title?: string; emoji?: string }[];
  } | null>(null);

  const content = questions[step];
  const type = QUESTION_TYPES[step];
  const qid = `q${step + 1}`;
  const progress = (step / total) * 100;
  const isLast = step === total - 1;

  function setAnswer(value: Answer) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function toggleMultiselect(option: string) {
    const prev = (answers[qid] as string[]) ?? [];
    setAnswers({
      ...answers,
      [qid]: prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    });
  }

  function canAdvance() {
    const a = answers[qid];
    if (!a) return false;
    if (Array.isArray(a)) return a.length > 0;
    if (typeof a === "string") return a.trim().length > 0;
    return true;
  }

  async function advance() {
    if (!canAdvance()) return;

    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    // Submit assessment
    setLoading(true);

    const formatted: Record<string, string> = {};
    questions.forEach((_, i) => {
      const id = `q${i + 1}`;
      const a = answers[id];
      if (a === undefined) return;
      formatted[id] = Array.isArray(a) ? a.join(", ") : String(a);
    });

    const res = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "INITIAL", answers: formatted, locale }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResult(data);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Sparkles className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <h1 className="text-2xl font-serif text-stone-800">
              {t("result.title")}
            </h1>
            <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
              {t("result.subtitle")}
            </p>
          </div>
          <Card className="border-stone-200 shadow-sm mb-4">
            <CardContent className="p-6">
              <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">
                {result.report}
              </p>
            </CardContent>
          </Card>
          {result.recommendations.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
                {t("result.recommendedTitle")}
              </p>
              <div className="space-y-2">
                {result.recommendations.slice(0, 3).map((r, i) => (
                  <Card key={r.slug} className="border-stone-200">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Badge className="bg-amber-100 text-amber-800 border-0 shrink-0">
                        {i + 1}º
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-stone-800">
                          {r.emoji ? `${r.emoji} ` : ""}
                          {r.title ?? r.slug}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">{r.reason}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <Button
            className="w-full bg-amber-700 hover:bg-amber-800 text-white"
            onClick={() => router.push("/dashboard")}
          >
            {t("result.goToDashboard")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Idioma — define a língua de toda a conta: a plataforma E a Rafa. */}
        <div className="flex items-center justify-center gap-1 mb-6">
          <Globe className="h-3.5 w-3.5 text-stone-400 mr-1" />
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                if (l !== locale) router.replace(pathname, { locale: l });
              }}
              className={cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                l === locale
                  ? "border-amber-600 bg-amber-50 text-amber-800 font-medium"
                  : "border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50",
              )}
            >
              {LANGUAGE_NATIVE[l]}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-stone-800 tracking-wide">BLOOMING</h1>
          <p className="text-stone-500 text-sm mt-1">{t("brandTagline")}</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-stone-400 mb-2">
            <span>{t("progress", { current: step + 1, total })}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Question */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-8">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-3">
              {content.category}
            </p>
            <h2 className="text-lg font-medium text-stone-800 leading-snug mb-2">
              {content.text}
            </h2>
            {content.subtext && (
              <p className="text-sm text-stone-500 mb-4">{content.subtext}</p>
            )}
            {content.scripture && (
              <p className="text-xs text-amber-600 italic mb-6 border-l-2 border-amber-200 pl-3">
                {content.scripture}
              </p>
            )}

            {/* Scale */}
            {type === "scale" && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={(answers[qid] as number) ?? 5}
                  onChange={(e) => setAnswer(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400">
                  <span>{t("scaleLow")}</span>
                  <span className="font-medium text-amber-700">
                    {answers[qid] ?? 5}/10
                  </span>
                  <span>{t("scaleHigh")}</span>
                </div>
              </div>
            )}

            {/* Choice */}
            {type === "choice" && content.options && (
              <div className="space-y-2">
                {content.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswer(option)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors",
                      answers[qid] === option
                        ? "border-amber-600 bg-amber-50 text-amber-800 font-medium"
                        : "border-stone-200 text-stone-700 hover:border-stone-300 hover:bg-stone-50",
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Multiselect */}
            {type === "multiselect" && content.options && (
              <div className="space-y-2">
                {content.options.map((option) => {
                  const selected = ((answers[qid] as string[]) ?? []).includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => toggleMultiselect(option)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors",
                        selected
                          ? "border-amber-600 bg-amber-50 text-amber-800 font-medium"
                          : "border-stone-200 text-stone-700 hover:border-stone-300",
                      )}
                    >
                      {selected ? "✓ " : ""}{option}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Text */}
            {type === "text" && (
              <Textarea
                value={(answers[qid] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={t("textPlaceholder")}
                className="min-h-[120px] resize-none"
              />
            )}

            {/* Advance */}
            <Button
              className="mt-6 w-full bg-amber-700 hover:bg-amber-800 text-white"
              onClick={advance}
              disabled={!canAdvance() || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t("analyzing")}
                </>
              ) : isLast ? (
                <>{t("seeProfile")} <Sparkles className="h-4 w-4 ml-2" /></>
              ) : (
                <>{t("next")} <ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-4">
          {t("confidential")}
        </p>
      </div>
    </div>
  );
}
