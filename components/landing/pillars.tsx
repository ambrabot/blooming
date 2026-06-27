import { useTranslations } from "next-intl";

const PILLAR_STYLE = [
  { number: "01", accent: "text-amber-700", border: "border-amber-200", bg: "bg-amber-50" },
  { number: "02", accent: "text-rose-700", border: "border-rose-200", bg: "bg-rose-50" },
  { number: "03", accent: "text-teal-700", border: "border-teal-200", bg: "bg-teal-50" },
  { number: "04", accent: "text-purple-700", border: "border-purple-200", bg: "bg-purple-50" },
  { number: "05", accent: "text-blue-700", border: "border-blue-200", bg: "bg-blue-50" },
  { number: "06", accent: "text-stone-700", border: "border-stone-200", bg: "bg-stone-50" },
];

type PillarText = { title: string; body: string };

export default function PillarsSection() {
  const t = useTranslations("Landing.pillars");
  const items = t.raw("items") as PillarText[];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            {t.rich("title", {
              em: (chunks) => <span className="italic">{chunks}</span>,
            })}
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLAR_STYLE.map((p, i) => (
            <div
              key={p.number}
              className={`rounded-2xl border p-7 ${p.bg} ${p.border} hover:shadow-md transition-shadow`}
            >
              <p className={`text-4xl font-serif font-light ${p.accent} mb-4 leading-none`}>
                {p.number}
              </p>
              <h3 className="font-medium text-stone-800 text-lg mb-3 leading-snug">
                {items[i]?.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{items[i]?.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
