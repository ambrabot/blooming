const PILLARS = [
  {
    number: "01",
    title: "A Palavra como fundação",
    body: "Não chegamos à Escritura no final como um extra espiritual. Partimos dela. O que Deus diz é mais real do que o que você sente. A terapia trabalha a partir dessa certeza.",
    accent: "text-amber-700",
    border: "border-amber-200",
    bg: "bg-amber-50",
  },
  {
    number: "02",
    title: "Perspectiva judaico-messiânica",
    body: "O Shabat como ritmo de descanso. As festas como calendário de cura. Shalom como inteireza, não apenas paz. BLOOMING como valor de caráter. A fé tem raízes hebraicas profundas — e isso importa.",
    accent: "text-rose-700",
    border: "border-rose-200",
    bg: "bg-rose-50",
  },
  {
    number: "03",
    title: "Ciência como revelação",
    body: "Neurociência, endocrinologia e psicologia não contradizem a fé — revelam como Deus nos criou. Entender seu sistema nervoso, seu ciclo hormonal e seus padrões de apego é conhecer melhor a obra de Deus em você.",
    accent: "text-teal-700",
    border: "border-teal-200",
    bg: "bg-teal-50",
  },
  {
    number: "04",
    title: "Cultura da honra",
    body: "A cura não acontece em ambiente de vergonha. A cultura da honra chama você para a identidade mais alta — não expõe, não diminui, não acusa. Você é chamada para ser quem Deus diz que você é.",
    accent: "text-purple-700",
    border: "border-purple-200",
    bg: "bg-purple-50",
  },
  {
    number: "05",
    title: "Regulação emocional real",
    body: "Fomos criados para o relacionamento — e é no relacionamento que nos regulamos. A teoria polyvagal revela como nosso sistema nervoso busca segurança, e como o louvor, o lamento e a presença são práticas de regulação tanto quanto espirituais.",
    accent: "text-blue-700",
    border: "border-blue-200",
    bg: "bg-blue-50",
  },
  {
    number: "06",
    title: "Stewardship como estilo de vida",
    body: "Corpo, mente, tempo, relacionamentos, talentos e finanças — tudo é mordomia. Cuidar de si não é egoísmo, é responsabilidade diante de Deus. O corpo é templo. As emoções são dados, não inimigos.",
    accent: "text-stone-700",
    border: "border-stone-200",
    bg: "bg-stone-50",
  },
];

export default function PillarsSection() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-widest mb-3">
            Os pilares da abordagem
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-800 leading-tight">
            Não é só terapia.{" "}
            <span className="italic">É integração.</span>
          </h2>
          <p className="text-stone-400 mt-4 max-w-xl mx-auto text-lg">
            Cada sessão, cada módulo, cada entrada no diário é construída sobre
            esses seis princípios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((p) => (
            <div
              key={p.number}
              className={`rounded-2xl border p-7 ${p.bg} ${p.border} hover:shadow-md transition-shadow`}
            >
              <p className={`text-4xl font-serif font-light ${p.accent} mb-4 leading-none`}>
                {p.number}
              </p>
              <h3 className="font-medium text-stone-800 text-lg mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
