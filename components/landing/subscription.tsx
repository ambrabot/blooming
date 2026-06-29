import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Heart, Users, BookOpen, Check } from "lucide-react";

const BENEFIT_ICONS = [Heart, Users, BookOpen];

export default function SubscriptionSection() {
  const t = useTranslations("Landing.subscription");
  const benefits = t.raw("benefits") as string[];

  return (
    <section id="assinatura" className="py-20 sm:py-28 bg-[#F7F7F6] px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-serif text-sm uppercase tracking-[0.18em] text-[#8E3B5A] mb-3">
          {t("eyebrow")}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#242120] leading-tight">
          {t("title")}
        </h2>
        <p className="text-[#6E6A66] mt-4 max-w-md mx-auto">{t("subtitle")}</p>

        <div className="mt-10 rounded-2xl border border-[#ECEAE8] bg-white p-7 sm:p-9 shadow-sm text-left">
          <div className="flex items-baseline justify-center gap-1 mb-7">
            <span className="font-serif text-5xl text-[#242120]">{t("price")}</span>
            <span className="text-[#6E6A66]">{t("perMonth")}</span>
          </div>
          <ul className="space-y-4 mb-8">
            {benefits.map((text, i) => {
              const Icon = BENEFIT_ICONS[i] ?? Heart;
              return (
                <li key={i} className="flex gap-3">
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-[#E6F1EB] flex items-center justify-center">
                    <Icon className="h-4 w-4 text-[#3C7A5E]" />
                  </div>
                  <span className="text-[#242120] text-[0.95rem] leading-relaxed">{text}</span>
                </li>
              );
            })}
          </ul>
          <Link
            href="/register?intent=assinatura"
            className="block w-full text-center bg-[#8E3B5A] hover:bg-[#6E2A45] text-white font-medium py-3.5 rounded-full transition-colors"
          >
            {t("cta")}
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-[#6E6A66] mt-4">
            <Check className="h-3.5 w-3.5 text-[#3C7A5E]" /> {t("fineprint")}
          </p>
        </div>
      </div>
    </section>
  );
}
