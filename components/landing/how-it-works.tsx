import { useTranslations } from "next-intl";

const STEP_STYLE = [
  { number: "1", color: "bg-amber-100 text-amber-800" },
  { number: "2", color: "bg-teal-100 text-teal-800" },
  { number: "3", color: "bg-rose-100 text-rose-800" },
  { number: "4", color: "bg-purple-100 text-purple-800" },
];

const FEATURE_EMOJI = ["🗣️", "📓", "📊", "🔒"];

type Step = { title: string; body: string; detail: string };
type Feature = { label: string; sub: string };

export default function HowItWorksSection() {
  const t = useTranslations("Landing.howItWorks");
  const steps = t.raw("steps") as Step[];
  const features = t.raw("features") as Feature[];

  return (
    <section id="como-funciona" className="py-24 px-6 bg-white">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-5">
              <div
                className={`w-10 h-10 rounded-full ${STEP_STYLE[i]?.color} flex items-center justify-center text-sm font-bold shrink-0 mt-0.5`}
              >
                {STEP_STYLE[i]?.number}
              </div>
              <div>
                <h3 className="font-medium text-stone-800 text-lg mb-2">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-2">{s.body}</p>
                <p className="text-xs text-stone-400 font-medium">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {features.map((f, i) => (
            <div key={i} className="bg-stone-50 rounded-xl p-5 border border-stone-100">
              <span className="text-2xl block mb-2">{FEATURE_EMOJI[i]}</span>
              <p className="text-sm font-medium text-stone-700">{f.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
