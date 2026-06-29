import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sprout, Heart, Home, Crown, type LucideIcon } from "lucide-react";

const AUDIENCES: {
  id: string;
  Icon: LucideIcon;
  hebrew: string;
  cardBg: string;
  tagColor: string;
}[] = [
  {
    id: "woman",
    Icon: Sprout,
    hebrew: "Ishah",
    cardBg: "bg-[#F5E9EE] border-[#ECEAE8]",
    tagColor: "bg-white text-[#8E3B5A]",
  },
  {
    id: "couple",
    Icon: Heart,
    hebrew: "Brit",
    cardBg: "bg-[#E6F1EB] border-[#ECEAE8]",
    tagColor: "bg-white text-[#3C7A5E]",
  },
  {
    id: "family",
    Icon: Home,
    hebrew: "Mishpachah",
    cardBg: "bg-[#F5E9EE] border-[#ECEAE8]",
    tagColor: "bg-white text-[#8E3B5A]",
  },
  {
    id: "leader",
    Icon: Crown,
    hebrew: "Kavod",
    cardBg: "bg-[#E6F1EB] border-[#ECEAE8]",
    tagColor: "bg-white text-[#3C7A5E]",
  },
];

export default function ForWhomSection() {
  const t = useTranslations("Landing.forWhom");

  return (
    <section id="para-quem" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight text-balance">
            {t("title")}
          </h2>
          <p className="text-[#6E6A66] mt-4 max-w-xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AUDIENCES.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-8 ${a.cardBg} transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <a.Icon className="h-7 w-7 text-[#242120]" strokeWidth={1.5} />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.tagColor}`}>
                  {t(`audiences.${a.id}.tag`)}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-[#6E6A66] tracking-widest uppercase font-medium">
                  {a.hebrew}
                </p>
                <h3 className="font-serif text-2xl text-[#242120] mt-0.5">
                  {t(`audiences.${a.id}.role`)}
                </h3>
              </div>
              <p className="text-[#242120] leading-relaxed text-sm">
                {t(`audiences.${a.id}.description`)}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#6E6A66] mt-10">
          {t.rich("footer", {
            link: (chunks) => (
              <Link href="/register" className="text-[#8E3B5A] hover:underline font-medium">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
