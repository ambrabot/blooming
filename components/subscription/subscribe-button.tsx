"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SubscribeButton({
  label = "Assinar agora",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/subscribe", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
        alert(data.error ?? "Não foi possível iniciar a assinatura.");
      }
    } catch {
      setLoading(false);
      alert("Erro de conexão. Tente novamente.");
    }
  }

  return (
    <Button onClick={go} disabled={loading} className={className}>
      {loading ? "Abrindo checkout…" : label}
    </Button>
  );
}
