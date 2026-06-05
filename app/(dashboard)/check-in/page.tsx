"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronRight, Sparkles, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// Monthly check-in — 6 fast questions focused on trend vs initial assessment
const CHECK_IN_QUESTIONS = [
  {
    id: "mood_general",
    category: "emocional",
    text: "Como está seu humor geral esta semana?",
    type: "scale" as const,
  },
  {
    id: "spiritual_connection",
    category: "espiritual",
    text: "Como está sua intimidade com Deus?",
    type: "scale" as const,
  },
  {
    id: "body_energy",
    category: "corpo",
    text: "Como está sua energia e disposição física?",
    type: "scale" as const,
  },
  {
    id: "relationship_quality",
    category: "relacionamentos",
    text: "Como estão seus relacionamentos principais?",
    type: "scale" as const,
  },
  {
    id: "biggest_win",
    category: "avanço",
    text: "Qual foi o maior avanço ou insight do último mês?",
    type: "text" as const,
  },
  {
    id: "prayer_request",
    category: "oração",
    text: "O que você está levando a Deus neste mês?",
    type: "text" as const,
  },
];

const SCALE_LABELS: Record<number, string> = {
  1: "Muito difícil", 2: "Difícil", 3: "Pesado", 4: "Cansado", 5: "Neutro",
  6: "Bem", 7: "Leve", 8: "Grato", 9: "Esperançoso", 10: "Em paz",
};

type Answer = string | number;

interface PreviousData {
  lastCheckIn: string | null;
  scores: Record<string, number> | null;
}

export default function CheckInPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(false);
  const [prevData, setPrevData] = useState<PreviousData | null>(null);
  const [result, setResult] = useState<{ report: string; trends: Record<string, number> } | null>(null);

  useEffect(() => {
    fetch("/api/check-in/previous").then((r) => r.json()).then(setPrevData);
  }, []);

  const current = CHECK_IN_QUESTIONS[step];
  const progress = (step / CHECK_IN_QUESTIONS.length) * 100;
  const isLast = step === CHECK_IN_QUESTIONS.length - 1;

  function canAdvance() {
    const a = answers[current.id];
    if (current.type === "text") return typeof a === "string" && a.trim().length > 0;
    return a !== undefined;
  }

  async function advance() {
    if (!canAdvance()) return;
    if (!isLast) { setStep((s) => s + 1); return; }

    setLoading(true);

    const formatted: Record<string, string> = {};
    for (const q of CHECK_IN_QUESTIONS) {
      if (answers[q.id] !== undefined) formatted[q.id] = String(answers[q.id]);
    }

    const res = await fetch("/api/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: formatted }),
    });

    const data = await res.json();
    setLoading(false);
    if (res.ok) setResult(data);
  }

  if (result) {
    const trendEntries = Object.entries(result.trends ?? {});

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <Sparkles className="h-7 w-7 text-amber-600 mx-auto mb-2" />
          <h1 className="text-2xl font-serif text-stone-800">Check-in do mês</h1>
        </div>

        <Card className="border-amber-200 bg-amber-50 mb-6">
          <CardContent className="p-6">
            <p className="text-stone-700 leading-relaxed whitespace-pre-wrap">{result.report}</p>
          </CardContent>
        </Card>

        {trendEntries.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
              Tendências vs mês anterior
            </p>
            <div className="grid grid-cols-2 gap-3">
              {trendEntries.map(([key, delta]) => (
                <Card key={key} className="border-stone-200">
                  <CardContent className="p-3 flex items-center gap-2">
                    {delta > 0 ? (
                      <TrendingUp className="h-4 w-4 text-teal-600 shrink-0" />
                    ) : delta < 0 ? (
                      <TrendingDown className="h-4 w-4 text-rose-500 shrink-0" />
                    ) : (
                      <Minus className="h-4 w-4 text-zinc-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-stone-500">{key}</p>
                      <p className={cn("text-sm font-medium",
                        delta > 0 ? "text-teal-700" : delta < 0 ? "text-rose-600" : "text-zinc-500"
                      )}>
                        {delta > 0 ? `+${delta}` : delta} pts
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            className="bg-amber-700 hover:bg-amber-800 text-white"
            onClick={() => router.push("/sessao/nova")}
          >
            Conversar com a Rafa
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Ir ao painel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-serif text-stone-800">Check-in mensal</h1>
          {prevData?.lastCheckIn && (
            <Badge variant="outline" className="text-xs">
              Último: {new Date(prevData.lastCheckIn).toLocaleDateString("pt-BR", { day: "numeric", month: "short" })}
            </Badge>
          )}
        </div>
        <p className="text-stone-500 text-sm">6 perguntas · ~3 minutos</p>
        <div className="mt-3">
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-7">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-3">
            {current.category} · {step + 1}/{CHECK_IN_QUESTIONS.length}
          </p>
          <h2 className="text-lg font-medium text-stone-800 leading-snug mb-6">
            {current.text}
          </h2>

          {current.type === "scale" && (
            <div className="space-y-3">
              <input
                type="range"
                min={1}
                max={10}
                value={(answers[current.id] as number) ?? 5}
                onChange={(e) => setAnswers({ ...answers, [current.id]: Number(e.target.value) })}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>Difícil</span>
                <span className="font-medium text-amber-700 text-sm">
                  {answers[current.id] ?? 5}/10 — {SCALE_LABELS[(answers[current.id] as number) ?? 5]}
                </span>
                <span>Em paz</span>
              </div>

              {/* Show trend vs previous if available */}
              {prevData?.scores?.[current.id] && answers[current.id] !== undefined && (
                <div className="flex items-center gap-1 text-xs mt-2">
                  {(() => {
                    const prev = prevData.scores![current.id];
                    const curr = answers[current.id] as number;
                    const delta = curr - prev;
                    return delta > 0 ? (
                      <span className="text-teal-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" /> +{delta} vs mês passado ({prev})
                      </span>
                    ) : delta < 0 ? (
                      <span className="text-rose-500 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" /> {delta} vs mês passado ({prev})
                      </span>
                    ) : (
                      <span className="text-zinc-400">Igual ao mês passado</span>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {current.type === "text" && (
            <Textarea
              value={(answers[current.id] as string) ?? ""}
              onChange={(e) => setAnswers({ ...answers, [current.id]: e.target.value })}
              placeholder="Escreva livremente..."
              className="min-h-[110px] resize-none"
            />
          )}

          <Button
            onClick={advance}
            disabled={!canAdvance() || loading}
            className="mt-6 w-full bg-amber-700 hover:bg-amber-800 text-white"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-2" />Analisando...</>
            ) : isLast ? (
              <><Sparkles className="h-4 w-4 mr-2" />Ver meu relatório</>
            ) : (
              <>Próximo <ChevronRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
