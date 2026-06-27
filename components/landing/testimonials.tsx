import { useTranslations } from "next-intl";

const TESTIMONIAL_EMOJI = ["🌸", "✨", "💍", "🌿", "👑", "📓"];

type Testimonial = { quote: string; name: string; role: string };

export default function TestimonialsSection() {
  const t = useTranslations("Landing.testimonials");
  const items = t.raw("items") as Testimonial[];

  return (
    <section className="py-24 px-6 bg-stone-50">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200 p-7 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl block mb-4">{TESTIMONIAL_EMOJI[i]}</span>
              <blockquote className="text-stone-600 text-sm leading-relaxed italic mb-5">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div>
                <p className="text-sm font-medium text-stone-800">{item.name}</p>
                <p className="text-xs text-stone-400">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
