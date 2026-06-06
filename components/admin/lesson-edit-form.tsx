"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LESSON_TYPES = [
  { value: "TEACHING", label: "Ensino — conteúdo principal" },
  { value: "PRACTICE", label: "Prática — exercício/reflexão" },
  { value: "SCRIPTURE", label: "Escritura — estudo bíblico" },
  { value: "ENDOCRINOLOGY", label: "Endocrinologia — ciência + fé" },
  { value: "COUNSELING", label: "Aconselhamento — técnica específica" },
];

interface LessonData {
  id: string;
  slug: string;
  title: string;
  order: number;
  type: string;
  content: string;
  durationMin: number | null;
  scripture: string | null;
  prayer: string | null;
  exercise: string | null;
  audioUrl: string | null;
  videoUrl: string | null;
}

interface Props {
  moduleSlug: string;
  moduleId: string;
  lesson: LessonData | null;
  nextOrder: number;
}

export default function LessonEditForm({ moduleSlug, moduleId, lesson, nextOrder }: Props) {
  const router = useRouter();
  const isNew = !lesson;

  const [form, setForm] = useState({
    title: lesson?.title ?? "",
    slug: lesson?.slug ?? "",
    type: lesson?.type ?? "TEACHING",
    order: lesson?.order ?? nextOrder,
    content: lesson?.content ?? "",
    durationMin: lesson?.durationMin ?? "",
    scripture: lesson?.scripture ?? "",
    prayer: lesson?.prayer ?? "",
    exercise: lesson?.exercise ?? "",
    audioUrl: lesson?.audioUrl ?? "",
    videoUrl: lesson?.videoUrl ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function autoSlug(title: string) {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  async function handleSave() {
    if (!form.title.trim() || !form.content.trim()) {
      setError("Título e conteúdo são obrigatórios");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      ...form,
      moduleId,
      slug: form.slug || autoSlug(form.title),
      durationMin: form.durationMin ? Number(form.durationMin) : null,
    };

    const url = isNew
      ? "/api/admin/lessons"
      : `/api/admin/lessons/${lesson!.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar");
      return;
    }

    router.push(`/admin/modulos/${moduleSlug}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que quer deletar esta lição?")) return;

    await fetch(`/api/admin/lessons/${lesson!.id}`, { method: "DELETE" });
    router.push(`/admin/modulos/${moduleSlug}`);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-zinc-600 uppercase tracking-wide">
            Informações da lição
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (isNew) set("slug", autoSlug(e.target.value));
                }}
                placeholder="Título da lição"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                className="mt-1 font-mono text-sm"
                disabled={!isNew}
              />
            </div>
            <div>
              <Label>Duração (minutos)</Label>
              <Input
                type="number"
                value={form.durationMin}
                onChange={(e) => set("durationMin", e.target.value)}
                placeholder="Ex: 15"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardContent className="p-6">
          <Tabs defaultValue="content">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="scripture">Escritura & Oração</TabsTrigger>
              <TabsTrigger value="exercise">Exercício</TabsTrigger>
              <TabsTrigger value="media">Mídia</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <Label>Conteúdo principal (Markdown aceito)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="O corpo da lição. Use Markdown para formatação.

## Título da seção

Parágrafo de texto...

**Destaque importante**

> Citação ou reflexão

---"
                className="mt-1 min-h-[300px] resize-y font-mono text-sm"
              />
            </TabsContent>

            <TabsContent value="scripture" className="space-y-4">
              <div>
                <Label>Escritura âncora</Label>
                <Input
                  value={form.scripture}
                  onChange={(e) => set("scripture", e.target.value)}
                  placeholder="Ex: João 8:32 — A verdade vos libertará"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Oração guiada</Label>
                <Textarea
                  value={form.prayer}
                  onChange={(e) => set("prayer", e.target.value)}
                  placeholder="Texto de oração para o usuário usar ao final da lição..."
                  className="mt-1 min-h-[120px] resize-none"
                />
              </div>
            </TabsContent>

            <TabsContent value="exercise">
              <Label>Exercício prático</Label>
              <Textarea
                value={form.exercise}
                onChange={(e) => set("exercise", e.target.value)}
                placeholder="Instruções para o exercício ou reflexão prática desta lição..."
                className="mt-1 min-h-[160px] resize-none"
              />
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div>
                <Label>URL do áudio</Label>
                <Input
                  value={form.audioUrl}
                  onChange={(e) => set("audioUrl", e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>URL do vídeo</Label>
                <Input
                  value={form.videoUrl}
                  onChange={(e) => set("videoUrl", e.target.value)}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isNew ? "Criar lição" : "Salvar alterações"}
        </Button>

        {!isNew && (
          <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        )}
      </div>
    </div>
  );
}
