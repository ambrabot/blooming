"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";

const MOOD_LABELS: Record<number, string> = {
  1: "Muito difícil",
  2: "Difícil",
  3: "Pesado",
  4: "Cansado",
  5: "Neutro",
  6: "Bem",
  7: "Leve",
  8: "Grato",
  9: "Esperançoso",
  10: "Em paz",
};

const DAILY_PROMPTS = [
  "O que está no meu coração hoje?",
  "O que Deus tem falado comigo esta semana?",
  "Onde estou sentindo resistência — e o que ela pode estar protegendo?",
  "Qual verdade bíblica eu preciso ancorar hoje?",
  "O que eu gostaria de deixar aqui e não carregar mais?",
];

export default function NovaDiarioPage() {
  const router = useRouter();
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
          body: JSON.stringify({ entryId: data.id, content: form.content }),
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
              <p className="text-sm font-medium text-amber-800">Rafa responde</p>
            </div>
            <p className="text-stone-700 leading-relaxed italic">{reflection}</p>
            <Button
              className="mt-6 bg-amber-700 hover:bg-amber-800 text-white"
              onClick={() => router.push("/diario")}
            >
              Ver meu diário
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-stone-800">Diário de hoje</h1>
        <p className="text-stone-500 text-sm mt-1">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Mood */}
      <div className="mb-6">
        <Label className="text-stone-600">Como você está? ({form.mood}/10)</Label>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-stone-400">Difícil</span>
          <input
            type="range"
            min={1}
            max={10}
            value={form.mood}
            onChange={(e) => setForm({ ...form, mood: Number(e.target.value) })}
            className="flex-1 accent-amber-600"
          />
          <span className="text-xs text-stone-400">Em paz</span>
        </div>
        <p className="text-sm text-amber-700 mt-1 font-medium">
          {MOOD_LABELS[form.mood]}
        </p>
      </div>

      {/* Prompt suggestions */}
      <div className="mb-4">
        <Label className="text-stone-600 mb-2 block">Sugestões de reflexão</Label>
        <div className="flex flex-wrap gap-2">
          {DAILY_PROMPTS.map((p) => (
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
          <Label htmlFor="title">Título (opcional)</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Um título para esse momento..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="content">O que está no seu coração</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Escreva livremente. Isso é só seu."
            className="mt-1 min-h-[180px] resize-none"
          />
        </div>

        <div>
          <Label htmlFor="gratitude">Gratidão de hoje</Label>
          <Input
            id="gratitude"
            value={form.gratitude}
            onChange={(e) => setForm({ ...form, gratitude: e.target.value })}
            placeholder="Pelo que você é grata hoje?"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="scripture">Versículo que me tocou</Label>
          <Input
            id="scripture"
            value={form.scripture}
            onChange={(e) => setForm({ ...form, scripture: e.target.value })}
            placeholder="Ex: Filipenses 4:7..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="insight">O que Deus me mostrou</Label>
          <Textarea
            id="insight"
            value={form.insight}
            onChange={(e) => setForm({ ...form, insight: e.target.value })}
            placeholder="Um insight, uma percepção, uma palavra..."
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
            {reflecting ? "Rafa está refletindo..." : "Salvando..."}
          </>
        ) : (
          "Salvar e receber reflexão"
        )}
      </Button>
    </div>
  );
}
