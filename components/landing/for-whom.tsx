import Link from "next/link";

const AUDIENCES = [
  {
    emoji: "🌸",
    role: "Mulher",
    hebrew: "Ishah",
    description:
      "Você carrega muito. Talvez tenha perdido o fio de quem é fora dos papéis que desempenha. Aqui você vai trabalhar identidade, ciclo hormonal, emoções e crenças limitantes — com a Palavra como âncora.",
    tag: "Individual",
    color: "bg-rose-50 border-rose-100",
    tagColor: "bg-rose-100 text-rose-700",
  },
  {
    emoji: "💍",
    role: "Casal",
    hebrew: "Brit",
    description:
      "O casamento não é contrato — é aliança. Se algo está fora do eixo, não é fraqueza pedir ajuda. Aqui vocês vão trabalhar dinâmicas, comunicação e como honrar um ao outro mesmo no conflito.",
    tag: "Casais",
    color: "bg-purple-50 border-purple-100",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    emoji: "🏡",
    role: "Família",
    hebrew: "Mishpachah",
    description:
      "Toda família carrega histórias — bênçãos e feridas que se transmitem. Aqui você vai entender os padrões do seu sistema familiar e como interromper o que não serve à próxima geração.",
    tag: "Famílias",
    color: "bg-orange-50 border-orange-100",
    tagColor: "bg-orange-100 text-orange-700",
  },
  {
    emoji: "👑",
    role: "Líder",
    hebrew: "Kavod",
    description:
      "Liderança saudável nasce de identidade segura. Se você lidera — na igreja, no trabalho, em casa — e sente o peso da solidão no topo, da performance ou da ausência de limites saudáveis, este espaço é seu.",
    tag: "Líderes",
    color: "bg-indigo-50 border-indigo-100",
    tagColor: "bg-indigo-100 text-indigo-700",
  },
];

export default function ForWhomSection() {
  return (
    <section id="para-quem" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            Para quem é o BLOOMING
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Cada jornada tem seu ponto de partida
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            Você não precisa ter tudo resolvido para começar. Precisa apenas de
            coragem para dar o primeiro passo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {AUDIENCES.map((a) => (
            <div
              key={a.role}
              className={`rounded-2xl border p-8 ${a.color} transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{a.emoji}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${a.tagColor}`}>
                  {a.tag}
                </span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-stone-400 tracking-widest uppercase font-medium">
                  {a.hebrew}
                </p>
                <h3 className="font-serif text-2xl text-stone-800 mt-0.5">{a.role}</h3>
              </div>
              <p className="text-stone-600 leading-relaxed text-sm">{a.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-stone-400 mt-10">
          Não sabe por onde começar?{" "}
          <Link href="/register" className="text-amber-700 hover:underline font-medium">
            Faça o assessment gratuito
          </Link>{" "}
          e a Rafa te mostra o caminho.
        </p>
      </div>
    </section>
  );
}
