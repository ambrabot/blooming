import "dotenv/config";
import { PrismaClient, UserRole } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const MODULES = [
  {
    slug: "fundamentos",
    title: "Fundamentos",
    subtitle: "Identidade & Cultura da Honra",
    hebrewWord: "Yesod",
    iconEmoji: "🌿",
    colorClass: "text-emerald-700",
    order: 1,
    priceInCents: 9700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Quem você é antes de ser qualquer outra coisa? Este módulo retorna à fundação — sua identidade como filha de Deus, criada à imagem do Criador. Aqui você vai deconstruir camadas de performance religiosa e construir sobre a rocha da Palavra. Cultura da honra como estilo de vida, não apenas conceito.",
    systemPromptAddition:
      "Neste módulo, o foco é identidade fundamental e cultura da honra. A usuária está trabalhando quem ela é antes de qualquer papel ou função. Explore perguntas como: O que ela acredita sobre si mesma? O que Deus diz que é diferente? Onde há performance religiosa substituindo intimidade real? Cultura da honra: como ela fala sobre si mesma, sobre os outros, sobre Deus.",
    keyScriptures: [
      { ref: "Gênesis 1:27", text: "E criou Deus o homem à sua imagem" },
      { ref: "Efésios 1:4-5", text: "Em amor nos predestinou para filhos adotivos" },
      { ref: "1 Pedro 2:9", text: "Geração eleita, sacerdócio real" },
    ],
  },
  {
    slug: "mulher",
    title: "Mulher",
    subtitle: "Endocrinologia, Ciclo & Identidade Feminina",
    hebrewWord: "Ishah",
    iconEmoji: "🌸",
    colorClass: "text-rose-700",
    order: 2,
    priceInCents: 9700,
    audience: [UserRole.WOMAN],
    description:
      "O corpo feminino é um sistema teológico. Seu ciclo menstrual não é inconveniência — é um ritmo de cura, revelação e descanso. Aqui você vai entender progesterona, estrogênio e cortisol não como inimigos, mas como mensageiros. E vai descobrir o que significa ser ezer — a força que ajuda — conforme Gênesis 2.",
    systemPromptAddition:
      "Neste módulo, integre endocrinologia com espiritualidade. A mulher está aprendendo a ler seu próprio corpo como um texto sagrado. Explore o ciclo menstrual como mapa espiritual. Quando ela mencionar emoções, considere a fase do ciclo. Ensine sobre como o estrogênio suporta serotonina (humor), como a progesterona cai no pré-menstrual criando vulnerabilidade, como o cortisol crônico afeta tireóide e tiroxina. Fundamente tudo em Salmos 139.",
    keyScriptures: [
      { ref: "Salmos 139:14", text: "Sou maravilhosamente formada" },
      { ref: "Gênesis 2:18", text: "Farei para ele uma ajudadora que lhe seja idônea (ezer)" },
      { ref: "Provérbios 31:25", text: "Força e honra são o seu vestido" },
    ],
  },
  {
    slug: "cura-interior",
    title: "Cura Interior",
    subtitle: "Crenças, Disfunções & Liberdade",
    hebrewWord: "Raphah",
    iconEmoji: "💛",
    colorClass: "text-yellow-700",
    order: 3,
    priceInCents: 12700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Toda disfunção tem uma raiz, e toda raiz tem um nome. Neste módulo você vai identificar as narrativas que guiam sua vida inconscientemente — como mulher, pessoa, cônjuge, profissional. Com gentileza e a Palavra como bisturi, vamos quebrar crenças limitantes e plantar a verdade no lugar onde a mentira morava.",
    systemPromptAddition:
      "Neste módulo, foco em crenças limitantes e disfunções de caráter. Técnicas como IFS (Internal Family Systems) são válidas aqui — explore 'partes' da pessoa que desenvolveram mecanismos de defesa. Perguntas úteis: 'Quando você aprendeu isso sobre si mesma? Que versão de você desenvolveu esse padrão para se proteger? O que essa parte precisa ouvir de Deus?' Fundamente a cura na Palavra — não apenas psicologia. Cura não é apenas cessação de sintoma, é restauração da identidade.",
    keyScriptures: [
      { ref: "João 8:32", text: "A verdade vos libertará" },
      { ref: "Romanos 12:2", text: "Transformados pela renovação do vosso entendimento" },
      { ref: "2 Coríntios 10:5", text: "Levando todo pensamento cativo à obediência de Cristo" },
    ],
  },
  {
    slug: "regulacao-emocional",
    title: "Regulação Emocional",
    subtitle: "Social Brain, Polyvagal & Paz Que Excede",
    hebrewWord: "Shalom",
    iconEmoji: "🌊",
    colorClass: "text-blue-700",
    order: 4,
    priceInCents: 9700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Fomos criados para o relacionamento — e é no relacionamento que nos regulamos. A teoria polyvagal, a janela de tolerância e o conceito de social brain revelam como Deus nos fiou para precisar uns dos outros. Este módulo integra neurociência com práticas bíblicas de regulação: lamento, louvor, gratidão, oração corporificada.",
    systemPromptAddition:
      "Neste módulo, integre teoria polyvagal com espiritualidade. Quando a usuária estiver em hiper-ativação (ansiedade, raiva, pânico), primeiro co-regule — presença antes de conteúdo. Ensine a janela de tolerância: zona ventral vagal = segurança e conexão (onde encontros com Deus acontecem). Fora da janela = difícil processar Palavra. Use exercícios de regulação: respiração 4-7-8, orientação para ambiente, som humming (Salmos como regulação). O louvor e o lamento são ferramentas polyvagais além de espirituais.",
    keyScriptures: [
      { ref: "Filipenses 4:7", text: "A paz de Deus que excede todo o entendimento" },
      { ref: "Salmos 46:10", text: "Aquietai-vos e sabei que eu sou Deus" },
      { ref: "Romanos 8:26", text: "O Espírito intercede por nós com gemidos inexprimíveis" },
    ],
  },
  {
    slug: "casamento",
    title: "Casamento",
    subtitle: "Dinâmica, Honra & Aliança",
    hebrewWord: "Brit",
    iconEmoji: "💍",
    colorClass: "text-purple-700",
    order: 5,
    priceInCents: 14700,
    audience: [UserRole.COUPLE, UserRole.WOMAN],
    description:
      "O casamento não é contrato — é aliança. Brit. Aqui você vai entender as dinâmicas que criam disfunção conjugal: estilos de apego, comunicação reativa, o perseguidor-evitador, a crítica e o fechamento. E vai descobrir como honrar o cônjuge não como sentimento, mas como decisão fundamentada no amor de Deus.",
    systemPromptAddition:
      "Neste módulo, foco em dinâmicas conjugais. Use Gottman como referência técnica (os 4 cavaleiros: crítica, desprezo, defensividade, fechamento). Integre com a perspectiva bíblica de aliança (brit). Quando a usuária falar do cônjuge, mantenha neutralidade — não aligne com ela contra ele. A cultura da honra inclui honrar o cônjuge no contexto terapêutico. Explore padrões de apego ansiosos e evitativos. O objetivo não é que ela tenha razão — é que o casal tenha restauração.",
    keyScriptures: [
      { ref: "Efésios 5:21", text: "Sujeitando-vos uns aos outros no temor de Cristo" },
      { ref: "1 Coríntios 13:4-8", text: "O amor é paciente, é benigno..." },
      { ref: "Malaquias 2:16", text: "Deus odeia o divórcio" },
    ],
  },
  {
    slug: "familia-funcional",
    title: "Família Funcional",
    subtitle: "Gerações, Parentalidade & Cura do Sistema",
    hebrewWord: "Mishpachah",
    iconEmoji: "🏡",
    colorClass: "text-orange-700",
    order: 6,
    priceInCents: 12700,
    audience: [UserRole.FAMILY, UserRole.COUPLE, UserRole.WOMAN],
    description:
      "Toda família carrega histórias — bênçãos e feridas que se transmitem de geração em geração. Este módulo trabalha com sistemas familiares: papéis disfuncionais, codependência, triangulação, parentificação e vergonha geracional. E revela como a Palavra fala de bênçãos e maldições geracionais — e como podem ser interrompidas.",
    systemPromptAddition:
      "Neste módulo, use Bowen Family Systems Theory integrado com perspectiva bíblica de gerações. Explore como a usuária aprendeu seus papéis na família de origem. Identifique padrões como: bode expiatório, filho/filha dourado, filho invisível, filho parentificado. A cura do sistema familiar passa por diferenciação (não distância) — ser você mesma dentro do sistema sem ser sugada por ele. Bênção geracional: Deuteronômio 30. Interrupção de maldição: Gálatas 3:13.",
    keyScriptures: [
      { ref: "Deuteronômio 30:19", text: "Escolhe a vida, para que vivas tu e a tua descendência" },
      { ref: "Malaquias 4:6", text: "Tornará o coração dos pais aos filhos" },
      { ref: "Efésios 6:1-4", text: "Filhos, obedecei / Pais, não provoqueis" },
    ],
  },
  {
    slug: "lideranca",
    title: "Liderança & Relacionamentos",
    subtitle: "Cultura da Honra, Autoridade & Influência",
    hebrewWord: "Kavod",
    iconEmoji: "👑",
    colorClass: "text-indigo-700",
    order: 7,
    priceInCents: 14700,
    audience: [UserRole.LEADER, UserRole.WOMAN],
    description:
      "Liderança saudável nasce de identidade segura, não de performance. Aqui você vai entender como a cultura da honra muda a dinâmica de toda estrutura relacional — na igreja, no trabalho, na família. Kavod — peso, glória — é o que você carrega e deposita nos outros quando vive de dentro para fora.",
    systemPromptAddition:
      "Neste módulo, líderes e pastores trabalham saúde relacional e cultura da honra. Explore feridas de liderança (traição, abuso de autoridade, solidão no topo). Diferença entre liderança baseada em medo vs amor. Como dar honra genuína, não bajulação. Como receber correção sem colapsar. A liderança serva de Jesus não é fraqueza — é força orientada. Explore também a fadiga compassiva e o self-care como mordomia, não egoísmo.",
    keyScriptures: [
      { ref: "Marcos 10:43-44", text: "Quem quiser ser grande... seja servo" },
      { ref: "Romanos 12:10", text: "Amando-vos uns aos outros... preferindo-vos em honra" },
      { ref: "1 Pedro 5:2-3", text: "Apascentai o rebanho... não por força, mas de boa vontade" },
    ],
  },
  {
    slug: "tempo-de-deus",
    title: "Tempo de Deus",
    subtitle: "Stewardship, Propósito & Estações",
    hebrewWord: "Kairos",
    iconEmoji: "⌛",
    colorClass: "text-stone-700",
    order: 8,
    priceInCents: 9700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Há tempo determinado para cada propósito debaixo do sol. Kairos vs Chronos. Este módulo trabalha mordomia de vida — tempo, talentos, finanças, corpo e relacionamentos como recursos confiados, não possuídos. E aprofunda o que significa confiar no timing de Deus quando o coração apressado exige respostas agora.",
    systemPromptAddition:
      "Neste módulo, trabalhe o tema de stewardship (mordomia bíblica) e o kairos de Deus. Explore ansiedade sobre futuro, impaciência com processos, comparação de jornada. A mordomia não é só financeira — é de todo recurso: tempo, energia, atenção, relacionamentos. O deserto precede a terra prometida — mas o deserto tem comida diária (maná). Valide a estação difícil sem promessas vazias. Eclesiastes 3 e Habacuque 2:3 como âncoras.",
    keyScriptures: [
      { ref: "Eclesiastes 3:1", text: "Tudo tem o seu tempo determinado" },
      { ref: "Habacuque 2:3", text: "A visão ainda está para o tempo determinado" },
      { ref: "Mateus 25:21", text: "Fostes fiel no pouco, entrarei no muito" },
    ],
  },
  {
    slug: "permissao-destino",
    title: "Permissão & Destino",
    subtitle: "Da Ferida ao Envio",
    hebrewWord: "Shlichut",
    iconEmoji: "🕊️",
    colorClass: "text-violet-700",
    order: 9,
    priceInCents: 12700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Você foi cuidada. Mas a cura não termina na ferida fechada — ela aponta para o chamado. Muitas mulheres não estão paradas por não saber nem por não querer, mas por não se sentirem autorizadas. Neste módulo você vai descobrir a permissão que já foi assinada na cruz, desfazer os votos internos que te prenderam, desarmar o medo e a culpa, e dar o passo: da ferida ao envio. Deus cura para enviar.",
    systemPromptAddition:
      "Neste módulo, o foco é permissão e destino. A mulher está descobrindo que muitas vezes o que a trava não é capacidade ('não sei') nem disposição ('não quero'), mas permissão ('não me é permitido') — uma trava herdada ou um voto interno que ela mesma fez numa dor antiga ('eu nunca...'). Ajude-a a: (1) discernir qual das três travas está em jogo; (2) reconhecer e renunciar votos internos, substituindo-os pela verdade de Deus; (3) entender que a culpa vive na utilidade que se dá ao passado (privação/obrigação), não no fato; (4) desmentir o medo (quanto disso é verdade? quem não tem esse medo? que informação falta?); (5) sair da indecisão entrando em decisão (percepção→decisão→ação); (6) enxergar a cura como envio para o chamado. Ancore tudo em Gálatas 5:1, 2 Timóteo 1:7, Ester 4:14 e Jeremias 1:5. A presença e o acolhimento (social brain) vêm primeiro; a provocação para o destino vem depois.",
    keyScriptures: [
      { ref: "Gálatas 5:1", text: "Para a liberdade foi que Cristo nos libertou" },
      { ref: "2 Timóteo 1:7", text: "Deus não nos deu espírito de covardia, mas de poder, amor e moderação" },
      { ref: "Ester 4:14", text: "Quem sabe se para tempo como este chegaste ao reino?" },
      { ref: "Jeremias 1:5", text: "Antes que te formasses no ventre eu te conheci... e te constituí" },
    ],
  },
  {
    slug: "provisao-dinheiro-emocional",
    title: "Provisão & Dinheiro Emocional",
    subtitle: "A Mordomia da Alma",
    hebrewWord: "Parnassah",
    iconEmoji: "🌾",
    colorClass: "text-amber-800",
    order: 10,
    priceInCents: 12700,
    audience: [UserRole.WOMAN, UserRole.COUPLE, UserRole.FAMILY, UserRole.LEADER],
    description:
      "Dinheiro raramente é só sobre dinheiro. O que você não resolve na emoção, você paga em todas as áreas — inclusive na sua relação com a provisão. Neste módulo você vai descobrir o modelo de dinheiro que herdou sem perceber, as frustrações que governam as suas escolhas, e a diferença entre servir a Mamom e ser servida por ela. Da carência à mordomia, da ansiedade à confiança no Pai que provê: Jeová-Jiré.",
    systemPromptAddition:
      "Neste módulo o foco é a relação emocional com dinheiro e provisão. O princípio: o que não se resolve na emoção se paga no material. Ajude a mulher a reconhecer o modelo de dinheiro herdado, ver como frustrações governam o gastar/guardar, curar a carência que vira cobiça, crescer no contentamento (Fp 4), desfrutar com mordomia, discernir a quem serve (Deus ou Mamom, Mt 6:24) e confiar no Pai que provê (Jeová-Jiré). Trate a raiz emocional, não o sintoma financeiro. Sem teologia da prosperidade; sem aconselhamento financeiro técnico (encaminhe para profissional em dívida/planejamento concreto).",
    keyScriptures: [
      { ref: "Mateus 6:24", text: "Não podeis servir a Deus e a Mamom" },
      { ref: "Filipenses 4:11-13", text: "Aprendi a viver contente em toda e qualquer situação" },
      { ref: "Mateus 6:21", text: "Onde estiver o teu tesouro, aí estará também o teu coração" },
      { ref: "Gênesis 22:14", text: "O Senhor proverá (Jeová-Jiré)" },
    ],
  },
];

async function main() {
  console.log("Seeding modules...");

  for (const mod of MODULES) {
    await prisma.module.upsert({
      where: { slug: mod.slug },
      update: {
        title: mod.title,
        subtitle: mod.subtitle,
        description: mod.description,
        systemPromptAddition: mod.systemPromptAddition,
        keyScriptures: mod.keyScriptures,
        hebrewWord: mod.hebrewWord,
        iconEmoji: mod.iconEmoji,
        colorClass: mod.colorClass,
        order: mod.order,
        priceInCents: mod.priceInCents,
        audience: mod.audience,
      },
      create: {
        slug: mod.slug,
        title: mod.title,
        subtitle: mod.subtitle,
        description: mod.description,
        systemPromptAddition: mod.systemPromptAddition,
        keyScriptures: mod.keyScriptures,
        hebrewWord: mod.hebrewWord,
        iconEmoji: mod.iconEmoji,
        colorClass: mod.colorClass,
        order: mod.order,
        priceInCents: mod.priceInCents,
        audience: mod.audience,
      },
    });
    console.log(`  ✓ ${mod.title}`);
  }

  // Seed initial assessment questions
  console.log("\nSeeding assessment questions...");

  const assessmentQuestions = [
    {
      type: "INITIAL" as const,
      order: 1,
      text: "Como você se sente em relação à sua identidade como mulher?",
      category: "identity",
      inputType: "SCALE" as const,
      scriptureRef: "Provérbios 31:10",
    },
    {
      type: "INITIAL" as const,
      order: 2,
      text: "Com que frequência você se sente sobrecarregada emocionalmente?",
      category: "emotional",
      inputType: "MULTIPLE_CHOICE" as const,
      options: ["Raramente", "Às vezes", "Com frequência", "Quase sempre"],
    },
    {
      type: "INITIAL" as const,
      order: 3,
      text: "Como está sua conexão com Deus no momento?",
      category: "spiritual",
      inputType: "MULTIPLE_CHOICE" as const,
      options: [
        "Próxima e viva",
        "Estável, mas distante",
        "Seca — estou no deserto",
        "Confusa — tenho perguntas",
      ],
    },
    {
      type: "INITIAL" as const,
      order: 4,
      text: "Onde você sente maior dificuldade nos relacionamentos?",
      category: "relationships",
      inputType: "MULTIPLE_CHOICE" as const,
      options: [
        "Com meu cônjuge / parceiro",
        "Com minha família de origem",
        "Com amigos ou comunidade",
        "Comigo mesma",
        "Com liderança / autoridade",
      ],
    },
    {
      type: "INITIAL" as const,
      order: 5,
      text: "Você percebe como seu humor e energia mudam ao longo do mês?",
      category: "body",
      inputType: "SCALE" as const,
      scriptureRef: "Salmos 139:14",
    },
    {
      type: "INITIAL" as const,
      order: 6,
      text: "Quais crenças limitantes você reconhece que carrega?",
      category: "beliefs",
      inputType: "TEXT" as const,
    },
    {
      type: "INITIAL" as const,
      order: 7,
      text: "Se você é casada — como está o seu casamento?",
      category: "marriage",
      inputType: "MULTIPLE_CHOICE" as const,
      options: [
        "Sólido, mas com áreas a trabalhar",
        "Em um momento difícil",
        "Em crise",
        "Não sou casada / não se aplica",
      ],
    },
    {
      type: "INITIAL" as const,
      order: 8,
      text: "Qual é o maior 'não resolvido' na sua vida hoje?",
      category: "purpose",
      inputType: "TEXT" as const,
      scriptureRef: "Eclesiastes 3:1",
    },
  ];

  for (const q of assessmentQuestions) {
    await prisma.assessmentQuestion.upsert({
      where: {
        id: `q-initial-${q.order}`,
      },
      update: q,
      create: { id: `q-initial-${q.order}`, ...q },
    });
    console.log(`  ✓ Q${q.order}: ${q.text.slice(0, 50)}...`);
  }

  console.log("\nSeed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
