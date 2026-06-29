"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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

const ROLE_KEYS = ["WOMAN", "COUPLE", "FAMILY", "LEADER"] as const;

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
  const t = useTranslations("Profile");
  const seasons = t.raw("seasons") as string[];
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
            {t("identityTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>{t("nameLabel")}</Label>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>{t("roleLabel")}</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_KEYS.map((v) => (
                    <SelectItem key={v} value={v}>{t(`roles.${v}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("bioLabel")}</Label>
            <Textarea
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder={t("bioPlaceholder")}
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
            {t("spiritualTitle")}
          </h2>

          <div>
            <Label>{t("seasonLabel")}</Label>
            <Select
              value={form.currentSeason}
              onValueChange={(v) => set("currentSeason", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t("seasonPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {seasons.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-stone-400 mt-1">
              {t("seasonHelp")}
            </p>
          </div>

          <div>
            <Label>{t("churchLabel")}</Label>
            <Input
              value={form.churchBackground}
              onChange={(e) => set("churchBackground", e.target.value)}
              placeholder={t("churchPlaceholder")}
              className="mt-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hebrewRoots"
              checked={form.hebrewRoots}
              onChange={(e) => set("hebrewRoots", e.target.checked)}
              className="w-4 h-4 accent-berry"
            />
            <Label htmlFor="hebrewRoots" className="cursor-pointer">
              {t("hebrewRootsLabel")}
            </Label>
          </div>
          <p className="text-xs text-stone-400 -mt-2 ml-7">
            {t("hebrewRootsHelp")}
          </p>
        </CardContent>
      </Card>

      {/* Ciclo menstrual (visível para todos mas contexto feminino) */}
      {(form.role === "WOMAN" || form.role === "COUPLE") && (
        <Card className="border-berry-wash bg-berry-wash/30">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-sm font-medium text-berry uppercase tracking-wide">
                {t("cycleTitle")}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                {t("cycleHelp")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t("cycleStartLabel")}</Label>
                <Input
                  type="date"
                  value={form.cycleStartDate}
                  onChange={(e) => set("cycleStartDate", e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>{t("cycleLengthLabel")}</Label>
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
          className="bg-berry hover:bg-berry-deep text-white"
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />{t("saving")}</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />{t("save")}</>
          )}
        </Button>
        {saved && (
          <p className="text-sm text-green font-medium">✓ {t("saved")}</p>
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
  const t = useTranslations("Profile");
  const start = new Date(startDate);
  const today = new Date();
  const daysSince = Math.floor((today.getTime() - start.getTime()) / 86400000);
  const dayInCycle = ((daysSince % length) + length) % length + 1;

  let key: "menstrual" | "follicular" | "ovulatory" | "luteal";
  let color: string;

  if (dayInCycle <= 5) {
    key = "menstrual";
    color = "text-berry bg-berry-wash border-berry-wash";
  } else if (dayInCycle <= 13) {
    key = "follicular";
    color = "text-green-deep bg-green-wash border-green-wash";
  } else if (dayInCycle <= 17) {
    key = "ovulatory";
    color = "text-berry bg-berry-wash border-berry-wash";
  } else {
    key = "luteal";
    color = "text-purple-700 bg-purple-50 border-purple-200";
  }

  return (
    <div className={`border rounded-xl px-4 py-3 ${color}`}>
      <p className="text-xs font-medium uppercase tracking-wide mb-1">
        {t("cyclePhaseLabel", { day: dayInCycle })}
      </p>
      <p className="text-sm font-medium">{t(`phases.${key}.name`)}</p>
      <p className="text-xs mt-0.5 opacity-80">{t(`phases.${key}.desc`)}</p>
    </div>
  );
}
