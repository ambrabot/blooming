"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function NovaSenhaForm() {
  const t = useTranslations("Auth.reset");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError(t("mismatch")); return; }
    if (password.length < 8) { setError(t("tooShort")); return; }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/login?reset=1");
    } else {
      const data = await res.json();
      setError(data.error ?? t("error"));
    }
  }

  if (!token) {
    return (
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-stone-500">{t("invalidLink")}</p>
          <Link href="/esqueci-senha" className="block mt-4 text-amber-700 text-sm hover:underline">
            {t("requestNew")}
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-stone-800">{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{t("password")}</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              minLength={8}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label>{t("confirm")}</Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t("confirmPlaceholder")}
              required
              className="mt-1"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-700 hover:bg-amber-800 text-white"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {t("submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function ResetFallback() {
  const t = useTranslations("Auth.reset");
  return <div className="text-center text-stone-400 text-sm">{t("loading")}</div>;
}

export default function NovaSenhaPage() {
  return (
    <Suspense fallback={<ResetFallback />}>
      <NovaSenhaForm />
    </Suspense>
  );
}
