import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    number: "1",
    title: "Assessment gratuito",
    body: "Responda 8 perguntas sobre onde você está — espiritualmente, emocionalmente, nos relacionamentos. A Rafa analisa e gera um relatório personalizado com seu perfil e os módulos certos para você.",
    detail: "15 minutos · Gratuito · Confidencial",
    color: "bg-amber-100 text-amber-800",
  },
  {
    number: "2",
    title: "Escolha seus módulos",
    body: "Adquira os módulos recomendados individualmente. Acesso vitalício — você volta quando quiser. Cada módulo tem conteúdo de ensino, exercícios práticos, escrituras âncora e sessões com a Rafa.",
    detail: "A partir de R$ 97 · Acesso vitalício",
    color: "bg-teal-100 text-teal-800",
  },
  {
    number: "3",
    title: "Sessões com a Rafa",
    body: "Converse com a Rafa sempre que precisar — em sessão geral ou dentro do contexto de um módulo específico. Ela lembra o que você já trabalhou e continua de onde parou.",
    detail: "Ilimitado · Disponível 24h · Contextual",
    color: "bg-rose-100 text-rose-800",
  },
  {
    number: "4",
    title: "Diário & check-in",
    body: "Registre seus insights, gratidões e as coisas que Deus tem falado. A Rafa responde com uma reflexão gentil. Todo mês, faça o check-in e veja como você evoluiu em cada área.",
    detail: "Prompts guiados · Reflexão da IA · Tendências mensais",
    color: "bg-purple-100 text-purple-800",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            Como funciona
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Sua jornada em 4 passos
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            Simples de começar. Profundo de viver.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {STEPS.map((s, i) => (
            <div key={s.number} className="flex gap-5">
              <div
                className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center text-sm font-bold shrink-0 mt-0.5`}
              >
                {s.number}
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
          {[
            { icon: "🗣️", label: "Chat terapêutico", sub: "Streaming em tempo real" },
            { icon: "📓", label: "Diário guiado", sub: "Prompts + reflexão da IA" },
            { icon: "📊", label: "Check-in mensal", sub: "Tendências & evolução" },
            { icon: "🔒", label: "Confidencial", sub: "Seus dados são seus" },
          ].map((f) => (
            <div key={f.label} className="bg-stone-50 rounded-xl p-5 border border-stone-100">
              <span className="text-2xl block mb-2">{f.icon}</span>
              <p className="text-sm font-medium text-stone-700">{f.label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
