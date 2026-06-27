import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

export default function AssessmentCtaSection() {
  const t = useTranslations("Landing.assessmentCta");
  const highlights = t.raw("highlights") as string[];

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-amber-900 via-stone-900 to-stone-950 text-white relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M40 40L0 0h80L40 40zm0 0L80 80H0L40 40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-4xl mx-auto text-center">
        <Sparkles className="h-8 w-8 text-amber-400 mx-auto mb-6" />

        <p className="text-xs font-medium text-amber-400 uppercase tracking-widest mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
          {t.rich("title", {
            br: () => <br className="hidden md:block" />,
            em: (chunks) => <span className="italic text-amber-300">{chunks}</span>,
          })}
        </h2>
        <p className="text-stone-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          {t("subtitle")}
        </p>

        {/* Areas covered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto mb-10">
          {highlights.map((a) => (
            <div
              key={a}
              className="bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-xs text-stone-300"
            >
              {a}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold h-12 px-9 text-base rounded-full"
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
            className="h-12 px-8 text-base rounded-full border-white/20 text-white hover:bg-white/10"
          >
            <Link href="/login">{t("ctaSecondary")}</Link>
          </Button>
        </div>

        <p className="text-stone-500 text-xs mt-6">{t("fineprint")}</p>
      </div>
    </section>
  );
}
