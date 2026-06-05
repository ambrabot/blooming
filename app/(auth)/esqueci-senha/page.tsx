"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSent(true);
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao enviar email");
    }
  }

  if (sent) {
    return (
      <Card className="border-stone-200 shadow-sm">
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-teal-500 mx-auto mb-4" />
          <h2 className="font-serif text-xl text-stone-800 mb-2">Email enviado</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Se este email estiver cadastrado, você receberá um link para redefinir sua senha em
            alguns minutos. Verifique também a pasta de spam.
          </p>
          <Link
            href="/login"
            className="block mt-6 text-sm text-amber-700 hover:underline"
          >
            Voltar ao login
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-stone-800">Esqueci minha senha</CardTitle>
        <CardDescription>
          Enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
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
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Enviar link de redefinição
          </Button>
        </form>
        <p className="text-center text-sm text-stone-400 mt-4">
          <Link href="/login" className="text-amber-700 hover:underline">
            Voltar ao login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
