import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowDown, Sprout, Sparkles, Heart } from "lucide-react";

const PROOF_ICONS = [Sprout, Sparkles, Heart];

export default function HeroSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-16">
      {/* Subtle wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F7F7F6] via-white to-white" />
      <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-[#E6F1EB]/40 to-transparent" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Hebrew badge */}
        <div className="inline-flex items-center gap-2 bg-[#F5E9EE] border border-[#ECEAE8] rounded-full px-4 py-1.5 text-xs text-[#8E3B5A] font-medium mb-8">
          <Sparkles className="h-3.5 w-3.5" />
          {t("badge")}
          <Sparkles className="h-3.5 w-3.5" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#242120] leading-[1.1] tracking-tight mb-6">
          {t.rich("headline", {
            em: (chunks) => <span className="italic text-[#8E3B5A]">{chunks}</span>,
            br: () => <br />,
          })}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#6E6A66] max-w-2xl mx-auto leading-relaxed mb-4">
          {t("subheadline")}
        </p>

        {/* Hebrew tagline */}
        <p className="text-sm text-[#8E3B5A] font-medium tracking-widest uppercase mb-10">
          {t("hebrewTagline")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
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

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-[#6E6A66]">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {PROOF_ICONS.map((Icon, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-[#F7F7F6] border-2 border-white flex items-center justify-center"
                >
                  <Icon className="h-3.5 w-3.5 text-[#8E3B5A]" />
                </div>
              ))}
            </div>
            <span>{t("proof1")}</span>
          </div>
          <span className="hidden sm:block text-[#ECEAE8]">·</span>
          <span>{t("proof2")}</span>
          <span className="hidden sm:block text-[#ECEAE8]">·</span>
          <span>{t("proof3")}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#para-quem"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[#6E6A66] hover:text-[#242120] transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
