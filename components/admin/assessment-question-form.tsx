"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit2, Loader2, Trash2 } from "lucide-react";

const ASSESSMENT_TYPES = [
  "INITIAL", "EMOTIONAL_HEALTH", "IDENTITY", "MARRIAGE",
  "FAMILY", "LEADERSHIP", "HORMONAL", "PERIODIC",
];

const INPUT_TYPES = ["SCALE", "MULTIPLE_CHOICE", "TEXT", "YES_NO"];

interface QuestionData {
  id: string;
  type: string;
  order: number;
  text: string;
  subtext: string | null;
  category: string;
  inputType: string;
  options: unknown;
  scriptureRef: string | null;
}

export default function AssessmentQuestionForm({ question }: { question: QuestionData | null }) {
  const router = useRouter();
  const isNew = !question;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: question?.type ?? "INITIAL",
    order: question?.order ?? 1,
    text: question?.text ?? "",
    subtext: question?.subtext ?? "",
    category: question?.category ?? "",
    inputType: question?.inputType ?? "SCALE",
    options: question?.options
      ? Array.isArray(question.options)
        ? (question.options as string[]).join("\n")
        : ""
      : "",
    scriptureRef: question?.scriptureRef ?? "",
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.text.trim()) {
      setError("Texto da pergunta é obrigatório");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      options: form.inputType === "MULTIPLE_CHOICE"
        ? form.options.split("\n").map((o) => o.trim()).filter(Boolean)
        : null,
    };

    const url = isNew ? "/api/admin/assessment-questions" : `/api/admin/assessment-questions/${question!.id}`;
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

    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Deletar esta pergunta?")) return;
    await fetch(`/api/admin/assessment-questions/${question!.id}`, { method: "DELETE" });
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isNew ? (
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova pergunta
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "Nova pergunta" : "Editar pergunta"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Tipo de assessment</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ASSESSMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ordem</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Texto da pergunta</Label>
            <Textarea
              value={form.text}
              onChange={(e) => set("text", e.target.value)}
              className="mt-1 resize-none"
              rows={2}
            />
          </div>

          <div>
            <Label>Subtexto (opcional)</Label>
            <Input
              value={form.subtext}
              onChange={(e) => set("subtext", e.target.value)}
              placeholder="Contexto adicional para a pergunta"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Categoria</Label>
              <Input
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                placeholder="identity, emotional, spiritual..."
                className="mt-1"
              />
            </div>
            <div>
              <Label>Tipo de input</Label>
              <Select value={form.inputType} onValueChange={(v) => set("inputType", v)}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INPUT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.inputType === "MULTIPLE_CHOICE" && (
            <div>
              <Label>Opções (uma por linha)</Label>
              <Textarea
                value={form.options}
                onChange={(e) => set("options", e.target.value)}
                placeholder={"Opção 1\nOpção 2\nOpção 3"}
                className="mt-1 resize-none font-mono text-sm"
                rows={4}
              />
            </div>
          )}

          <div>
            <Label>Referência bíblica (opcional)</Label>
            <Input
              value={form.scriptureRef}
              onChange={(e) => set("scriptureRef", e.target.value)}
              placeholder="Ex: Salmos 139:14"
              className="mt-1"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isNew ? "Criar" : "Salvar"}
            </Button>
            {!isNew && (
              <Button variant="outline" onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
