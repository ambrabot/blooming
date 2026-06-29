import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-16">
      {/* Subtle wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F6] via-white to-white" />
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-[#E6F1EB]/40 to-transparent" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Badge — único, sem ruído */}
        <div className="inline-flex items-center bg-[#F5E9EE] rounded-full px-4 py-1.5 text-xs text-[#8E3B5A] font-medium tracking-wide mb-8">
          {t("badge")}
        </div>

        {/* Headline — text-balance garante 2 linhas limpas, sem órfã */}
        <h1 className="font-serif text-balance text-4xl sm:text-5xl md:text-6xl text-[#242120] leading-[1.08] tracking-tight mb-5 max-w-3xl mx-auto">
          {t.rich("headline", {
            em: (chunks) => <span className="italic text-[#8E3B5A]">{chunks}</span>,
            br: () => <br />,
          })}
        </h1>

        {/* Subheadline — o wedge, em 1 linha no desktop */}
        <p className="text-base md:text-lg text-[#6E6A66] max-w-3xl mx-auto leading-relaxed mb-9">
          {t("subheadline")}
        </p>

        {/* CTAs — uma ação primária clara */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[#8E3B5A] hover:bg-[#6E2A45] text-white h-12 px-8 text-base rounded-full"
          >
            <Link href="/register">
              {t("ctaPrimary")}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 text-base rounded-full border-[#ECEAE8] text-[#242120] hover:bg-[#F7F7F6]"
          >
            <a href="#como-funciona">{t("ctaSecondary")}</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator — discreto */}
      <a
        href="#para-quem"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6E6A66] hover:text-[#242120] transition-colors"
        aria-label={t("scroll")}
      >
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
