"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Assessment questions — initial profile
const QUESTIONS = [
  {
    id: "q1",
    category: "identity",
    text: "Como você se sente em relação à sua identidade como mulher?",
    subtext: "Não existe resposta certa — só a sua verdade.",
    type: "scale" as const,
    scripture: "Provérbios 31:10 — 'Mulher virtuosa, quem a achará?'",
  },
  {
    id: "q2",
    category: "emotional",
    text: "Com que frequência você se sente sobrecarregada emocionalmente?",
    type: "choice" as const,
    options: ["Raramente", "Às vezes", "Com frequência", "Quase sempre"],
  },
  {
    id: "q3",
    category: "spiritual",
    text: "Como está sua conexão com Deus no momento?",
    type: "choice" as const,
    options: [
      "Próxima e viva",
      "Estável, mas distante",
      "Seca — estou no deserto",
      "Confusa — tenho perguntas",
    ],
  },
  {
    id: "q4",
    category: "relationships",
    text: "Onde você sente maior dificuldade nos relacionamentos?",
    type: "multiselect" as const,
    options: [
      "Com meu cônjuge / parceiro",
      "Com minha família de origem",
      "Com amigos ou comunidade",
      "Comigo mesma",
      "Com liderança / autoridade",
    ],
  },
  {
    id: "q5",
    category: "body",
    text: "Você percebe como seu humor e energia mudam ao longo do mês?",
    subtext: "Isso é sobre o ciclo menstrual e como ele afeta sua vida emocional e espiritual.",
    type: "scale" as const,
    scripture: "Salmos 139:14 — 'Sou maravilhosamente formada'",
  },
  {
    id: "q6",
    category: "beliefs",
    text: "Quais crenças limitantes você reconhece que carrega?",
    subtext: "Escreva livremente. Isso não sai daqui.",
    type: "text" as const,
  },
  {
    id: "q7",
    category: "marriage",
    text: "Se você é casada — como está o seu casamento?",
    type: "choice" as const,
    options: [
      "Sólido, mas com áreas a trabalhar",
      "Em um momento difícil",
      "Em crise",
      "Não sou casada / não se aplica",
    ],
  },
  {
    id: "q8",
    category: "purpose",
    text: "Qual é o maior 'não resolvido' na sua vida hoje?",
    subtext: "Pode ser uma dor, uma pergunta, uma situação. O que pede mais atenção?",
    type: "text" as const,
    scripture: "Eclesiastes 3:1 — 'Tudo tem o seu tempo determinado'",
  },
];

type Answer = string | number | string[];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    report: string;
    recommendations: { slug: string; priority: number; reason: string }[];
  } | null>(null);

  const current = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;
  const isLast = step === QUESTIONS.length - 1;

  function setAnswer(value: Answer) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function toggleMultiselect(option: string) {
    const prev = (answers[current.id] as string[]) ?? [];
    setAnswers({
      ...answers,
      [current.id]: prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option],
    });
  }

  function canAdvance() {
    const a = answers[current.id];
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

    // Convert answers to Record<questionId, string>
    const formatted: Record<string, string> = {};
    for (const q of QUESTIONS) {
      const a = answers[q.id];
      if (a === undefined) continue;
      formatted[q.id] = Array.isArray(a) ? a.join(", ") : String(a);
    }

    const res = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "INITIAL", answers: formatted }),
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
              Você chegou para ser cuidada
            </h1>
            <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
              E não para por aqui: você foi feita para algo — e tem permissão de ir.
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
                Módulos recomendados para você
              </p>
              <div className="space-y-2">
                {result.recommendations.slice(0, 3).map((r, i) => (
                  <Card key={r.slug} className="border-stone-200">
                    <CardContent className="p-4 flex items-start gap-3">
                      <Badge className="bg-amber-100 text-amber-800 border-0 shrink-0">
                        {i + 1}º
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-stone-800">{r.slug}</p>
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
            Ir para meu painel
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-stone-800 tracking-wide">BLOOMING</h1>
          <p className="text-stone-500 text-sm mt-1">חַיִל · Assessment inicial</p>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-stone-400 mb-2">
            <span>Pergunta {step + 1} de {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Question */}
        <Card className="border-stone-200 shadow-sm">
          <CardContent className="p-8">
            <p className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-3">
              {current.category}
            </p>
            <h2 className="text-lg font-medium text-stone-800 leading-snug mb-2">
              {current.text}
            </h2>
            {current.subtext && (
              <p className="text-sm text-stone-500 mb-4">{current.subtext}</p>
            )}
            {current.scripture && (
              <p className="text-xs text-amber-600 italic mb-6 border-l-2 border-amber-200 pl-3">
                {current.scripture}
              </p>
            )}

            {/* Scale */}
            {current.type === "scale" && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={(answers[current.id] as number) ?? 5}
                  onChange={(e) => setAnswer(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-xs text-stone-400">
                  <span>Muito difícil</span>
                  <span className="font-medium text-amber-700">
                    {answers[current.id] ?? 5}/10
                  </span>
                  <span>Muito bem</span>
                </div>
              </div>
            )}

            {/* Choice */}
            {current.type === "choice" && current.options && (
              <div className="space-y-2">
                {current.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAnswer(option)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg text-sm border transition-colors",
                      answers[current.id] === option
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
            {current.type === "multiselect" && current.options && (
              <div className="space-y-2">
                {current.options.map((option) => {
                  const selected = ((answers[current.id] as string[]) ?? []).includes(option);
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
            {current.type === "text" && (
              <Textarea
                value={(answers[current.id] as string) ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Escreva aqui..."
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
                  Analisando...
                </>
              ) : isLast ? (
                <>Ver meu perfil <Sparkles className="h-4 w-4 ml-2" /></>
              ) : (
                <>Próximo <ChevronRight className="h-4 w-4 ml-1" /></>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-4">
          Suas respostas são confidenciais e usadas apenas para personalizar sua experiência.
        </p>
      </div>
    </div>
  );
}
