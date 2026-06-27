import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowDown } from "lucide-react";

const PROOF_EMOJI = ["🌿", "🌸", "💛"];

export default function HeroSection() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-stone-50 via-amber-50/60 to-rose-50/40 px-6 pt-16">
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Hebrew badge */}
        <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-200 rounded-full px-4 py-1.5 text-xs text-amber-800 font-medium mb-8">
          <span className="text-base">✦</span>
          {t("badge")}
          <span className="text-base">✦</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stone-800 leading-[1.1] tracking-tight mb-6">
          {t.rich("headline", {
            em: (chunks) => <span className="italic text-amber-700">{chunks}</span>,
            br: () => <br />,
          })}
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed mb-4">
          {t("subheadline")}
        </p>

        {/* Hebrew tagline */}
        <p className="text-sm text-amber-700 font-medium tracking-widest uppercase mb-10">
          {t("hebrewTagline")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Button
            asChild
            size="lg"
            className="bg-amber-700 hover:bg-amber-800 text-white h-12 px-8 text-base rounded-full"
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
            className="h-12 px-8 text-base rounded-full border-stone-300 text-stone-600"
          >
            <a href="#como-funciona">{t("ctaSecondary")}</a>
          </Button>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-stone-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {PROOF_EMOJI.map((e, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-stone-100 border-2 border-white flex items-center justify-center text-xs"
                >
                  {e}
                </div>
              ))}
            </div>
            <span>{t("proof1")}</span>
          </div>
          <span className="hidden sm:block text-stone-200">·</span>
          <span>{t("proof2")}</span>
          <span className="hidden sm:block text-stone-200">·</span>
          <span>{t("proof3")}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#para-quem"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-stone-300 hover:text-stone-500 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">{t("scroll")}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
