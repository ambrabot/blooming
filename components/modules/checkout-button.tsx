"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, AlertCircle } from "lucide-react";
import { formatModulePrice } from "@/lib/i18n/pricing";

interface Props {
  moduleId: string;
  moduleTitle: string;
  priceInCents?: number;
  size?: "default" | "sm" | "lg";
}

export default function ModuleCheckoutButton({
  moduleId,
  moduleTitle,
  priceInCents,
  size = "default",
}: Props) {
  const t = useTranslations("Modules.checkout");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleCheckout() {
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Already purchased — just go to module
        if (res.status === 409) {
          window.location.reload();
          return;
        }
        throw new Error(data.error ?? t("error"));
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : t("unknownError"));
    }
  }

  const priceLabel = priceInCents
    ? formatModulePrice(priceInCents, locale)
    : t("acquire");

  return (
    <div className="space-y-2">
      <Button
        onClick={handleCheckout}
        disabled={state === "loading"}
        size={size}
        className="bg-amber-700 hover:bg-amber-800 text-white w-full"
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {t("opening")}
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {priceInCents ? t("acquireFor", { price: priceLabel }) : t("acquireModule")}
          </>
        )}
      </Button>

      {state === "error" && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {errorMsg}
        </p>
      )}

      <p className="text-xs text-stone-400 text-center">
        {t("footer")}
      </p>
    </div>
  );
}
