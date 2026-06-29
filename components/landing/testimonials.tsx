import { useTranslations } from "next-intl";
import {
  Flower2,
  Sparkles,
  Gem,
  Sprout,
  Crown,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";

const TESTIMONIAL_ICONS: LucideIcon[] = [Flower2, Sparkles, Gem, Sprout, Crown, NotebookPen];

type Testimonial = { quote: string; name: string; role: string };

export default function TestimonialsSection() {
  const t = useTranslations("Landing.testimonials");
  const items = t.raw("items") as Testimonial[];

  return (
    <section className="py-24 bg-[#F7F7F6] overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight text-balance">
            {t("title")}
          </h2>
          <p className="text-[#6E6A66] mt-4 max-w-xl mx-auto text-lg text-pretty">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Carrossel — deslizável (scroll-snap), 3 visíveis no desktop / 1+ no mobile */}
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-6 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item, i) => {
            const Icon = TESTIMONIAL_ICONS[i % TESTIMONIAL_ICONS.length] ?? Flower2;
            return (
              <article
                key={i}
                className="snap-start shrink-0 w-[82%] sm:w-[340px] bg-white rounded-2xl border border-[#ECEAE8] p-7 flex flex-col"
              >
                <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F5E9EE]">
                  <Icon className="h-4 w-4 text-[#8E3B5A]" strokeWidth={1.5} />
                </span>
                <blockquote className="text-[#242120] text-[15px] leading-relaxed italic text-balance mb-5 grow">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div>
                  <p className="text-sm font-medium text-[#242120]">{item.name}</p>
                  <p className="text-xs text-[#6E6A66]">{item.role}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
