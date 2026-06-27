"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function SubscribeButton({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  const t = useTranslations("Subscription.button");
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
        alert(data.error ?? t("errorStart"));
      }
    } catch {
      setLoading(false);
      alert(t("errorConnection"));
    }
  }

  return (
    <Button onClick={go} disabled={loading} className={className}>
      {loading ? t("opening") : (label ?? t("defaultLabel"))}
    </Button>
  );
}
