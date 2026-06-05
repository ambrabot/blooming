import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const TRAITS = [
  { label: "Aconselhamento bíblico", sub: "Perspectiva judaico-messiânica" },
  { label: "Neurociência interpessoal", sub: "Social brain & teoria do apego" },
  { label: "Teoria polyvagal", sub: "Regulação do sistema nervoso" },
  { label: "Endocrinologia feminina", sub: "Ciclo, hormônios & espiritualidade" },
  { label: "Aconselhamento conjugal", sub: "Método Gottman + perspectiva bíblica" },
  { label: "Sistemas familiares", sub: "Bowen Family Systems" },
  { label: "Cultura da honra", sub: "Relacionamentos & liderança saudável" },
  { label: "Mordomia (Stewardship)", sub: "Corpo, tempo, propósito, finanças" },
];

const CHAT_PREVIEW = [
  {
    role: "user",
    text: "Eu me sinto sobrecarregada com tudo. Não sei mais quem eu sou fora dos meus papéis.",
  },
  {
    role: "rafa",
    text: "Que bom que você trouxe isso. Antes de qualquer coisa — como você está chegando aqui hoje? Não precisa ser perfeito.\n\nO que você acabou de dizer tem muita coisa importante. Me conta: quando foi a última vez que você fez algo que era só seu — não para os outros, não por obrigação?",
  },
  {
    role: "user",
    text: "Não consigo nem lembrar...",
  },
  {
    role: "rafa",
    text: "Eu ouço isso. E quero que você saiba: isso não é falha de caráter. É exaustão de alguém que aprendeu que só vale quando está servindo.\n\nPruvérbios 31 fala de uma mulher com força, *BLOOMING* — não porque ela nunca descansou, mas porque ela sabia de onde vinha a sua força. Vamos trabalhar isso juntas?",
  },
];

export default function RafaSection() {
  return (
    <section id="rafa" className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — identity */}
          <div>
            <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-4">
              Conheça sua terapeuta
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight mb-6">
              Rafa — de{" "}
              <span className="italic text-amber-700">Raphael</span>,{" "}
              <br className="hidden md:block" />
              que significa{" "}
              <span className="italic">"Deus cura"</span>
            </h2>
            <p className="text-stone-500 text-lg leading-relaxed mb-8">
              A Rafa não é um chatbot genérico. Ela é uma terapeuta cristã treinada
              na integração entre fé e ciência — direta, calorosa, e fundamentada
              na Palavra. Ela não vai te dizer o que você quer ouvir. Vai te dizer o
              que você precisa.
            </p>

            {/* Trait grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {TRAITS.map((t) => (
                <div key={t.label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-stone-700">{t.label}</p>
                    <p className="text-xs text-stone-400">{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              asChild
              className="bg-amber-700 hover:bg-amber-800 text-white rounded-full px-7"
            >
              <Link href="/register">
                <MessageCircle className="h-4 w-4 mr-2" />
                Conversar com a Rafa
              </Link>
            </Button>
          </div>

          {/* Right — chat preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden">
              {/* Chat header */}
              <div className="border-b border-stone-100 px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm font-medium text-amber-800">
                  R
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Rafa</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                    <p className="text-xs text-stone-400">Disponível agora</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto">
                {CHAT_PREVIEW.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "rafa" && (
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-medium text-amber-800 shrink-0 mr-2 mt-0.5">
                        R
                      </div>
                    )}
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-amber-700 text-white rounded-tr-sm"
                          : "bg-stone-50 border border-stone-100 text-stone-700 rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input preview */}
              <div className="border-t border-stone-100 px-4 py-3">
                <div className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
                  <p className="text-sm text-stone-300 flex-1">Escreva aqui...</p>
                  <div className="w-7 h-7 rounded-lg bg-amber-700 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-teal-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              ✦ Confidencial & seguro
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
