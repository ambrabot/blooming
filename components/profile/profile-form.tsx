"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";

const SEASONS = [
  "Gênesis — Novos começos",
  "Êxodo — Saindo de lugares conhecidos",
  "Deserto — Processo e formação",
  "Promessa — Aguardando em fé",
  "Posse — Vivendo o que foi prometido",
  "Consolidação — Estabelecendo o que foi conquistado",
  "Transmissão — Passando adiante",
];

const ROLE_LABELS: Record<string, string> = {
  WOMAN: "Mulher — jornada individual",
  COUPLE: "Casal — aconselhamento conjugal",
  FAMILY: "Família — família funcional",
  LEADER: "Líder / Pastor — cultura da honra",
};

interface ProfileData {
  name: string;
  role: string;
  bio: string;
  currentSeason: string;
  churchBackground: string;
  hebrewRoots: boolean;
  cycleStartDate: string;
  cycleLengthDays: number;
}

export default function ProfileForm({
  userId,
  initial,
}: {
  userId: string;
  initial: ProfileData;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: unknown) => {
    setForm((f) => ({ ...f, [k]: v }));
    setSaved(false);
  };

  async function handleSave() {
    setSaving(true);

    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      {/* Identidade */}
      <Card className="border-stone-200">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
            Identidade
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Como prefere ser chamada</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Perfil</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Bio (opcional)</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Um pouco sobre você e sua jornada..."
              className="mt-1 resize-none"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contexto espiritual */}
      <Card className="border-stone-200">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
            Contexto espiritual
          </h2>

          <div>
            <Label>Estação atual de vida</Label>
            <Select
              value={form.currentSeason}
              onValueChange={(v) => set("currentSeason", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione sua estação..." />
              </SelectTrigger>
              <SelectContent>
                {SEASONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-400 mt-1">
              A Rafa vai considerar sua estação ao acompanhar você.
            </p>
          </div>

          <div>
            <Label>Contexto de igreja / comunidade</Label>
            <Input
              value={form.churchBackground}
              onChange={(e) => set("churchBackground", e.target.value)}
              placeholder="Ex: Batista, Presbiteriana, Messiânica, sem vínculo..."
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hebrewRoots"
              checked={form.hebrewRoots}
              onChange={(e) => set("hebrewRoots", e.target.checked)}
              className="w-4 h-4 accent-amber-600"
            />
            <Label htmlFor="hebrewRoots" className="cursor-pointer">
              Tenho interesse / conexão com raízes hebraicas
            </Label>
          </div>
          <p className="text-xs text-stone-400 -mt-2 ml-7">
            A Rafa vai usar mais perspectiva judaico-messiânica nas sessões.
          </p>
        </CardContent>
      </Card>

      {/* Ciclo menstrual (visível para todos mas contexto feminino) */}
      {(form.role === "WOMAN" || form.role === "COUPLE") && (
        <Card className="border-rose-100 bg-rose-50/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-medium text-rose-700 uppercase tracking-wide">
                Ciclo Menstrual
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                A Rafa considera sua fase do ciclo para contextualizar emoções e sugerir abordagens.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data de início do último ciclo</Label>
                <Input
                  type="date"
                  value={form.cycleStartDate}
                  onChange={(e) => set("cycleStartDate", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duração média do ciclo (dias)</Label>
                <Input
                  type="number"
                  min={21}
                  max={35}
                  value={form.cycleLengthDays}
                  onChange={(e) => set("cycleLengthDays", Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Current phase indicator */}
            {form.cycleStartDate && (
              <CyclePhaseIndicator
                startDate={form.cycleStartDate}
                length={form.cycleLengthDays}
              />
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-amber-700 hover:bg-amber-800 text-white"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Salvando...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />Salvar perfil</>
          )}
        </Button>
        {saved && (
          <p className="text-sm text-teal-600 font-medium">✓ Salvo</p>
        )}
      </div>
    </div>
  );
}

function CyclePhaseIndicator({
  startDate,
  length,
}: {
  startDate: string;
  length: number;
}) {
  const start = new Date(startDate);
  const today = new Date();
  const daysSince = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const dayInCycle = ((daysSince % length) + length) % length + 1;

  let phase: string;
  let description: string;
  let color: string;

  if (dayInCycle <= 5) {
    phase = "Menstrual (dias 1–5)";
    description = "Tempo de repouso, introspecção e reflexão. Como o Shabat.";
    color = "text-rose-700 bg-rose-50 border-rose-200";
  } else if (dayInCycle <= 13) {
    phase = "Folicular (dias 6–13)";
    description = "Energia em ascensão, clareza mental. Novos começos.";
    color = "text-teal-700 bg-teal-50 border-teal-200";
  } else if (dayInCycle <= 17) {
    phase = "Ovulatória (dias 14–17)";
    description = "Pico de expressão, conexão e confiança. Ótimo para comunicação.";
    color = "text-amber-700 bg-amber-50 border-amber-200";
  } else {
    phase = "Lútea (dias 18–28)";
    description = "Introspecção e discernimento. Não tome decisões impulsivas.";
    color = "text-purple-700 bg-purple-50 border-purple-200";
  }

  return (
    <div className={`border rounded-xl px-4 py-3 ${color}`}>
      <p className="text-xs font-medium uppercase tracking-wide mb-1">
        Fase atual · Dia {dayInCycle} do ciclo
      </p>
      <p className="text-sm font-medium">{phase}</p>
      <p className="text-xs mt-0.5 opacity-80">{description}</p>
    </div>
  );
}
