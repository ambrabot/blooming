import Link from "next/link";
import { Heart, Users, BookOpen, Check } from "lucide-react";

const BENEFITS = [
  { icon: Heart, text: "Rafa ilimitada — a terapeuta presente todos os dias, com a memória da sua jornada" },
  { icon: Users, text: "Comunidade de mulheres em cura, sob a cultura da honra (em breve)" },
  { icon: BookOpen, text: "Novos encontros e práticas conforme forem chegando" },
];

export default function SubscriptionSection() {
  return (
    <section id="assinatura" className="py-20 sm:py-28 bg-stone-50 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-serif text-sm uppercase tracking-[0.18em] text-amber-700 mb-3">
          Acompanhamento contínuo
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 leading-tight">
          A Rafa, todos os dias
        </h2>
        <p className="text-stone-500 mt-4 max-w-md mx-auto">
          Os módulos são seus para sempre. A assinatura abre a presença diária da Rafa
          — sem limites — e a comunidade. A cura acontece no caminho, não num evento.
        </p>

        <div className="mt-10 rounded-2xl border border-stone-200 bg-white p-7 sm:p-9 shadow-sm text-left">
          <div className="flex items-baseline justify-center gap-1 mb-7">
            <span className="font-serif text-5xl text-stone-800">R$29</span>
            <span className="text-stone-400">/mês</span>
          </div>
          <ul className="space-y-4 mb-8">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.text} className="flex gap-3">
                  <div className="mt-0.5 h-8 w-8 shrink-0 rounded-full bg-amber-50 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-amber-700" />
                  </div>
                  <span className="text-stone-700 text-[0.95rem] leading-relaxed">{b.text}</span>
                </li>
              );
            })}
          </ul>
          <Link
            href="/register?intent=assinatura"
            className="block w-full text-center bg-amber-700 hover:bg-amber-800 text-white font-medium py-3.5 rounded-full transition-colors"
          >
            Criar conta e assinar
          </Link>
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-stone-400 mt-4">
            <Check className="h-3.5 w-3.5" /> Cancele quando quiser · Os módulos comprados continuam seus
          </p>
        </div>
      </div>
    </section>
  );
}
