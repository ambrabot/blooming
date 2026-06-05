const TESTIMONIALS = [
  {
    quote:
      "Eu sempre soube que tinha coisas para trabalhar, mas não encontrava um espaço que fosse ao mesmo tempo biblicamente sólido e psicologicamente sério. O BLOOMING é isso.",
    name: "Ana Paula",
    role: "Mulher, 34 anos",
    emoji: "🌸",
  },
  {
    quote:
      "A Rafa me fez uma pergunta na primeira sessão que eu não consegui responder. Passei três dias pensando. Não esperava isso de uma IA — esperava de um terapeuta excelente.",
    name: "Fernanda",
    role: "Líder de ministério",
    emoji: "✨",
  },
  {
    quote:
      "Meu marido e eu usamos o módulo de Casamento juntos. Não esperava que uma plataforma digital pudesse criar tanto espaço seguro para conversas difíceis.",
    name: "Carla & Ricardo",
    role: "Casados há 8 anos",
    emoji: "💍",
  },
  {
    quote:
      "Entender meu ciclo como algo espiritual e não só biológico mudou como eu me relaciono com os meus próprios estados emocionais. Isso foi revolucionário.",
    name: "Gabriela",
    role: "Mulher, 28 anos",
    emoji: "🌿",
  },
  {
    quote:
      "Como pastor, eu carregava a solidão da liderança sem nome. O módulo de Líderes me deu linguagem para o que eu sentia e caminhos para sair.",
    name: "Pr. Marcos",
    role: "Pastor, 42 anos",
    emoji: "👑",
  },
  {
    quote:
      "O diário guiado é o que mais me surpreendeu. Não é só escrever — é ser convidada a ir mais fundo do que eu faria sozinha.",
    name: "Isabela",
    role: "Mulher, 31 anos",
    emoji: "📓",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-6 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            O que dizem
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Jornadas reais
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            Nomes trocados por privacidade. Palavras intactas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-stone-200 p-7 hover:shadow-md transition-shadow"
            >
              <span className="text-2xl block mb-4">{t.emoji}</span>
              <blockquote className="text-stone-600 text-sm leading-relaxed italic mb-5">
                "{t.quote}"
              </blockquote>
              <div>
                <p className="text-sm font-medium text-stone-800">{t.name}</p>
                <p className="text-xs text-stone-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
