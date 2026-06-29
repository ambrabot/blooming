"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Faq = { q: string; a: string };

export default function FaqSection() {
  const t = useTranslations("Landing.faq");
  const items = t.raw("items") as Faq[];
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight">
            {t("title")}
          </h2>
        </div>

        <div className="divide-y divide-[#ECEAE8]">
          {items.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-5 flex items-start justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-[#242120] text-base leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-[#6E6A66] shrink-0 transition-transform mt-0.5",
                    open === i && "rotate-180",
                  )}
                />
              </button>
              {open === i && (
                <p className="pb-5 text-[#6E6A66] text-sm leading-relaxed -mt-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
