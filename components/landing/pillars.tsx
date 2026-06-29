import { useTranslations } from "next-intl";

const PILLAR_STYLE = [
  { number: "01", accent: "text-[#8E3B5A]", border: "border-[#ECEAE8]", bg: "bg-[#F5E9EE]" },
  { number: "02", accent: "text-[#3C7A5E]", border: "border-[#ECEAE8]", bg: "bg-[#E6F1EB]" },
  { number: "03", accent: "text-[#8E3B5A]", border: "border-[#ECEAE8]", bg: "bg-[#F5E9EE]" },
  { number: "04", accent: "text-[#3C7A5E]", border: "border-[#ECEAE8]", bg: "bg-[#E6F1EB]" },
  { number: "05", accent: "text-[#8E3B5A]", border: "border-[#ECEAE8]", bg: "bg-[#F5E9EE]" },
  { number: "06", accent: "text-[#3C7A5E]", border: "border-[#ECEAE8]", bg: "bg-[#E6F1EB]" },
];

type PillarText = { title: string; body: string };

export default function PillarsSection() {
  const t = useTranslations("Landing.pillars");
  const items = t.raw("items") as PillarText[];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight">
            {t.rich("title", {
              em: (chunks) => <span className="italic">{chunks}</span>,
            })}
          </h2>
          <p className="text-[#6E6A66] mt-4 max-w-xl mx-auto text-lg">
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
              <h3 className="font-medium text-[#242120] text-lg mb-3 leading-snug">
                {items[i]?.title}
              </h3>
              <p className="text-[#6E6A66] text-sm leading-relaxed">{items[i]?.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
