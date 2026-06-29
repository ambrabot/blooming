import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Lock,
  Sprout,
  Flower2,
  Heart,
  Waves,
  Gem,
  Home,
  Crown,
  Hourglass,
  Bird,
  Wheat,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { formatModulePrice } from "@/lib/i18n/pricing";
import type { Locale } from "@/i18n/routing";

const MODULE_ICONS: Record<string, LucideIcon> = {
  fundamentos: Sprout,
  mulher: Flower2,
  "cura-interior": Heart,
  "regulacao-emocional": Waves,
  casamento: Gem,
  "familia-funcional": Home,
  lideranca: Crown,
  "tempo-de-deus": Hourglass,
  "permissao-destino": Bird,
  "provisao-dinheiro-emocional": Wheat,
};

interface ModuleData {
  slug: string;
  title: string;
  subtitle: string | null;
  iconEmoji: string;
  hebrewWord: string | null;
  priceInCents: number;
  description: string;
  audience: string[];
}

const AUDIENCE_KEYS = ["WOMAN", "COUPLE", "FAMILY", "LEADER"];

export default function ModulesSection({ modules }: { modules: ModuleData[] }) {
  const t = useTranslations("Landing.modules");
  const locale = useLocale() as Locale;

  return (
    <section id="modulos" className="py-24 px-6 bg-gradient-to-b from-[#F7F7F6] to-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow", { count: modules.length })}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#6E6A66] mt-4 max-w-xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map((mod) => {
            const Icon = MODULE_ICONS[mod.slug] ?? BookOpen;
            return (
            <div
              key={mod.slug}
              className="bg-white rounded-2xl border border-[#ECEAE8] p-6 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="h-10 w-10 rounded-full bg-[#F5E9EE] flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#8E3B5A]" strokeWidth={1.5} />
                </span>
                <div className="flex flex-wrap gap-1 justify-end">
                  {mod.audience.slice(0, 2).map((a) => (
                    <span
                      key={a}
                      className="text-xs bg-[#F7F7F6] text-[#6E6A66] px-2 py-0.5 rounded-full"
                    >
                      {AUDIENCE_KEYS.includes(a) ? t(`audience.${a}`) : a}
                    </span>
                  ))}
                </div>
              </div>

              {mod.hebrewWord && (
                <p className="text-xs text-[#8E3B5A] font-medium tracking-widest uppercase mb-1">
                  {mod.hebrewWord}
                </p>
              )}
              <h3 className="font-serif text-lg text-[#242120] mb-1">{mod.title}</h3>
              {mod.subtitle && (
                <p className="text-xs text-[#6E6A66] mb-3">{mod.subtitle}</p>
              )}
              <p className="text-sm text-[#6E6A66] leading-relaxed flex-1 line-clamp-3 mb-4">
                {mod.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-[#ECEAE8] mt-auto">
                <p className="text-sm font-semibold text-[#242120]">
                  {formatModulePrice(mod.priceInCents, locale)}
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="text-[#8E3B5A] border-[#ECEAE8] hover:bg-[#F5E9EE]"
                >
                  <Link href="/register">
                    <Lock className="h-3 w-3 mr-1" />
                    {t("access")}
                  </Link>
                </Button>
              </div>
            </div>
            );
          })}
        </div>

        {/* Note on assessment */}
        <div className="bg-[#F5E9EE] border border-[#ECEAE8] rounded-2xl p-8 text-center">
          <p className="text-sm font-medium text-[#6E2A45] mb-2">{t("noteTitle")}</p>
          <p className="text-[#242120] text-sm mb-4 max-w-lg mx-auto">{t("noteBody")}</p>
          <Button
            asChild
            className="bg-[#8E3B5A] hover:bg-[#6E2A45] text-white rounded-full"
          >
            <Link href="/register">{t("noteCta")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
