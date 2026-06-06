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

interface ModuleData {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  iconEmoji: string;
  priceInCents: number;
  order: number;
  isActive: boolean;
  hebrewWord: string | null;
  systemPromptAddition: string | null;
}

export default function ModuleEditForm({ module }: { module: ModuleData | null }) {
  const router = useRouter();
  const isNew = !module;

  const [form, setForm] = useState({
    slug: module?.slug ?? "",
    title: module?.title ?? "",
    subtitle: module?.subtitle ?? "",
    description: module?.description ?? "",
    iconEmoji: module?.iconEmoji ?? "📖",
    priceInCents: module?.priceInCents ?? 9700,
    order: module?.order ?? 99,
    isActive: module?.isActive ?? true,
    hebrewWord: module?.hebrewWord ?? "",
    systemPromptAddition: module?.systemPromptAddition ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    setSaving(true);
    setError("");

    const url = isNew ? "/api/admin/modules" : `/api/admin/modules/${module!.slug}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar");
      return;
    }

    const data = await res.json();
    router.push(`/admin/modulos/${data.slug}`);
    router.refresh();
  }

  async function handleToggleActive() {
    await fetch(`/api/admin/modules/${module!.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !form.isActive }),
    });
    set("isActive", !form.isActive);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-zinc-600 uppercase tracking-wide">
            Informações básicas
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Emoji do ícone</Label>
              <Input
                value={form.iconEmoji}
                onChange={(e) => set("iconEmoji", e.target.value)}
                className="mt-1 text-2xl"
                maxLength={2}
              />
            </div>
            <div>
              <Label>Palavra hebraica</Label>
              <Input
                value={form.hebrewWord}
                onChange={(e) => set("hebrewWord", e.target.value)}
                placeholder="ex: BLOOMING, Shalom..."
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Nome do módulo"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Subtítulo</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => set("subtitle", e.target.value)}
              placeholder="Tagline curta"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Slug (URL)</Label>
            <Input
              value={form.slug}
              onChange={(e) =>
                set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              placeholder="slug-do-modulo"
              className="mt-1 font-mono text-sm"
              disabled={!isNew}
            />
            {!isNew && (
              <p className="text-xs text-zinc-400 mt-1">
                O slug não pode ser alterado após criação.
              </p>
            )}
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Descrição completa do módulo (exibida na página de vendas)"
              className="mt-1 min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Preço (centavos)</Label>
              <Input
                type="number"
                value={form.priceInCents}
                onChange={(e) => set("priceInCents", Number(e.target.value))}
                className="mt-1"
              />
              <p className="text-xs text-zinc-400 mt-1">
                {(form.priceInCents / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
            <div>
              <Label>Ordem de exibição</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-200">
        <CardContent className="p-6">
          <h2 className="text-sm font-medium text-zinc-600 uppercase tracking-wide mb-4">
            Contexto da IA (Rafa)
          </h2>
          <Label>Instrução adicional para a terapeuta neste módulo</Label>
          <Textarea
            value={form.systemPromptAddition}
            onChange={(e) => set("systemPromptAddition", e.target.value)}
            placeholder="O que a Rafa deve saber e priorizar neste módulo? Técnicas específicas, temas centrais, abordagem..."
            className="mt-1 min-h-[160px] resize-none font-mono text-sm"
          />
          <p className="text-xs text-zinc-400 mt-2">
            Este texto é adicionado ao system prompt base da Rafa quando o usuário inicia uma sessão dentro deste módulo.
          </p>
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
          {isNew ? "Criar módulo" : "Salvar alterações"}
        </Button>

        {!isNew && (
          <Button
            variant="outline"
            onClick={handleToggleActive}
            className="text-zinc-600"
          >
            {form.isActive ? (
              <>
                <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                Desativar
              </>
            ) : (
              "Ativar módulo"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
