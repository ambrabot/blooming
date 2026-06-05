"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "O BLOOMING substitui a terapia presencial?",
    a: "Não — e não pretende. O BLOOMING é um espaço de crescimento espiritual-terapêutico contínuo, disponível a qualquer hora. Para situações de crise aguda, transtornos clínicos ou questões que exigem diagnóstico, sempre recomendamos profissionais presenciais. Mas para a maioria das pessoas, o BLOOMING oferece uma profundidade de trabalho que complementa qualquer processo terapêutico.",
  },
  {
    q: "A Rafa é uma inteligência artificial. Como posso confiar?",
    a: "A Rafa é alimentada por um dos modelos de linguagem mais avançados do mundo, treinado com um sistema de instruções profundamente fundamentado — bíblico, neurocientífico, clínico. Ela não improvisa. Ela opera dentro de princípios cuidadosamente construídos. Dito isso, toda resposta gerada é seu ponto de partida para reflexão, não a palavra final. Você discerne com o Espírito.",
  },
  {
    q: "Minhas conversas e dados são confidenciais?",
    a: "Sim. Suas sessões, entradas de diário e respostas de assessment são armazenadas de forma segura e nunca compartilhadas com terceiros. Você é a única pessoa com acesso ao seu histórico.",
  },
  {
    q: "O que é o assessment inicial e por que ele é gratuito?",
    a: "O assessment é uma avaliação de 8 perguntas que cobre identidade, saúde emocional, espiritualidade, relacionamentos, corpo, crenças, casamento e propósito. A Rafa analisa suas respostas e gera um relatório personalizado. É gratuito porque acreditamos que toda pessoa merece conhecer o ponto de partida da sua jornada antes de investir.",
  },
  {
    q: "Posso usar o BLOOMING mesmo sem ser cristã praticante?",
    a: "O BLOOMING é construído sobre fundamentos cristãos e bíblicos. Se você está em um processo de fé, tem dúvidas ou está voltando, é bem-vinda. Se não tem nenhuma abertura para a fé como parte do processo, nossa abordagem pode não ser a mais adequada — e tudo bem. Somos honestos sobre isso.",
  },
  {
    q: "Os módulos têm prazo de uso?",
    a: "Não. Ao adquirir um módulo, você tem acesso vitalício. Isso inclui todas as atualizações de conteúdo que forem feitas no futuro. Você avança no seu ritmo — pode começar hoje, pausar por dois meses e voltar quando quiser.",
  },
  {
    q: "O que é a perspectiva judaico-messiânica?",
    a: "É a compreensão de que nossa fé tem raízes hebraicas profundas. O Shabat como ritmo de descanso, não apenas regra. As festas judaicas como calendário de cura e revelação. O conceito de shalom como inteireza total — não apenas ausência de conflito. O nome e o caráter de Jesus (Yeshua) no contexto de sua cultura original. Isso enriquece a fé sem substituir nada — só aprofunda.",
  },
  {
    q: "Como funciona o check-in mensal?",
    a: "Uma vez por mês, a plataforma te convida para 6 perguntas rápidas (cerca de 3 minutos). A Rafa compara suas respostas com o mês anterior, identifica tendências e gera uma reflexão personalizada sobre o que está evoluindo e onde ainda há trabalho a fazer.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            Perguntas frequentes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Dúvidas comuns
          </h2>
        </div>

        <div className="divide-y divide-stone-100">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full text-left py-5 flex items-start justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-stone-800 text-base leading-snug">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 text-stone-400 shrink-0 transition-transform mt-0.5",
                    open === i && "rotate-180",
                  )}
                />
              </button>
              {open === i && (
                <p className="pb-5 text-stone-500 text-sm leading-relaxed -mt-1">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
