import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const AUDIENCES = [
  {
    id: "woman",
    emoji: "🌸",
    hebrew: "Ishah",
    color: "bg-rose-50 border-rose-100",
    tagColor: "bg-rose-100 text-rose-700",
  },
  {
    id: "couple",
    emoji: "💍",
    hebrew: "Brit",
    color: "bg-purple-50 border-purple-100",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    id: "family",
    emoji: "🏡",
    hebrew: "Mishpachah",
    color: "bg-orange-50 border-orange-100",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    id: "leader",
    emoji: "👑",
    hebrew: "Kavod",
    color: "bg-indigo-50 border-indigo-100",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
] as const;

export default function ForWhomSection() {
  const t = useTranslations("Landing.forWhom");

  return (
    <section id="para-quem" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            {t("title")}
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AUDIENCES.map((a) => (
            <div
              key={a.id}
              className={`rounded-2xl border p-8 ${a.color} transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{a.emoji}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.tagColor}`}>
                  {t(`audiences.${a.id}.tag`)}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">
                  {a.hebrew}
                </p>
                <h3 className="font-serif text-2xl text-stone-800 mt-0.5">
                  {t(`audiences.${a.id}.role`)}
                </h3>
              </div>
              <p className="text-stone-600 leading-relaxed text-sm">
                {t(`audiences.${a.id}.description`)}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-stone-400 mt-10">
          {t.rich("footer", {
            link: (chunks) => (
              <Link href="/register" className="text-amber-700 hover:underline font-medium">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </section>
  );
}
