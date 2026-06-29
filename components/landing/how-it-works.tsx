import { useTranslations } from "next-intl";
import {
  MessagesSquare,
  NotebookPen,
  BarChart3,
  Lock,
  type LucideIcon,
} from "lucide-react";

const STEP_STYLE = [
  { number: "1", color: "bg-[#F5E9EE] text-[#8E3B5A]" },
  { number: "2", color: "bg-[#E6F1EB] text-[#3C7A5E]" },
  { number: "3", color: "bg-[#F5E9EE] text-[#8E3B5A]" },
  { number: "4", color: "bg-[#E6F1EB] text-[#3C7A5E]" },
];

const FEATURE_ICONS: LucideIcon[] = [MessagesSquare, NotebookPen, BarChart3, Lock];

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
          <p className="text-xs font-medium text-[#8E3B5A] uppercase tracking-widest mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#242120] leading-tight">
            {t("title")}
          </h2>
          <p className="text-[#6E6A66] mt-4 max-w-xl mx-auto text-lg">
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
                <h3 className="font-medium text-[#242120] text-lg mb-2">{s.title}</h3>
                <p className="text-[#6E6A66] text-sm leading-relaxed mb-2">{s.body}</p>
                <p className="text-xs text-[#6E6A66] font-medium">{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {features.map((f, i) => {
            const Icon = FEATURE_ICONS[i] ?? Lock;
            return (
            <div key={i} className="bg-[#F7F7F6] rounded-xl p-5 border border-[#ECEAE8]">
              <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Icon className="h-5 w-5 text-[#8E3B5A]" strokeWidth={1.5} />
              </span>
              <p className="text-sm font-medium text-[#242120]">{f.label}</p>
              <p className="text-xs text-[#6E6A66] mt-0.5">{f.sub}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
