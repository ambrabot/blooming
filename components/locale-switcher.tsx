"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const LABELS: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
};

/**
 * Controle segmentado PT · EN · ES. Troca o idioma preservando a rota atual.
 * next-intl grava o cookie NEXT_LOCALE e prefixa as rotas en/es (pt fica sem prefixo).
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-stone-300/70 bg-white/60 p-0.5 text-[11px] font-semibold tracking-wide",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label="Idioma / Language / Idioma"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={active}
            disabled={isPending}
            className={cn(
              "rounded-full px-2 py-0.5 transition-colors",
              active
                ? "bg-stone-800 text-stone-50"
                : "text-stone-500 hover:text-stone-800",
            )}
          >
            {LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
