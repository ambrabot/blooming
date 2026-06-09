// Banco curado de devocionais diários (a "Pergunta Poderosa do Dia" + Palavra +
// reflexão). Seleção determinística por dia, então toda mulher vê o mesmo
// devocional no mesmo dia. Voz da Rafa: madura, acolhedora, fundada na Palavra.
// Fase 2 (assinatura): personalização por IA via Haiku.

export interface Devotional {
  passageRef: string;
  passageText: string;
  reflexao: string;
  pergunta: string;
}

export const DEVOTIONALS: Devotional[] = [
  {
    passageRef: "Salmos 139:13",
    passageText: "Tu formaste o meu interior; tu me teceste no ventre de minha mãe.",
    reflexao:
      "Você não foi um acaso. Antes de qualquer mão te moldar — ou te ferir —, as mãos de Deus já te teciam com intenção e cuidado.",
    pergunta: "O que muda no seu dia se você crer que foi desejada, e não apenas tolerada?",
  },
  {
    passageRef: "Mateus 11:28",
    passageText: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reflexao:
      "Existe um cansaço que dormir não cura — o de carregar o que nunca foi seu para carregar. Jesus não pede que você aguente mais. Ele pede que você entregue.",
    pergunta: "O que você está carregando hoje que Deus nunca te pediu para carregar?",
  },
  {
    passageRef: "Gálatas 5:1",
    passageText: "Para a liberdade foi que Cristo nos libertou.",
    reflexao:
      "A sua permissão para existir, ocupar e florescer já foi assinada — não pelos que te feriram, mas na cruz. Você não está esperando autorização. Você já é livre.",
    pergunta: "Onde você tem pedido permissão a alguém que Deus já te deu?",
  },
  {
    passageRef: "Romanos 12:2",
    passageText: "Transformai-vos pela renovação da vossa mente.",
    reflexao:
      "Você não muda a vida apertando os dentes. Muda quando troca a lente — quando a verdade de Deus vira a forma como você enxerga a si mesma.",
    pergunta: "Que verdade sobre você Deus já declarou, mas o seu coração ainda não acredita?",
  },
  {
    passageRef: "João 15:2",
    passageText: "Todo ramo que dá fruto, ele o limpa, para que produza mais fruto.",
    reflexao:
      "A poda não é castigo — é cuidado. O Agricultor só corta o que rouba a força do que está vivo. O que dói perder, muitas vezes, é o que estava te esgotando.",
    pergunta: "O que precisa ser podado para que algo novo floresça em você?",
  },
  {
    passageRef: "2 Timóteo 1:7",
    passageText: "Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.",
    reflexao:
      "O medo é ótimo em dar opinião e péssimo em decidir. Você pode ouvir o aviso dele sem entregar a ele o volante da sua vida.",
    pergunta: "Se o medo não estivesse decidindo por você, qual seria o seu próximo passo?",
  },
  {
    passageRef: "Provérbios 4:23",
    passageText: "Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.",
    reflexao:
      "Guardar o coração não é fechá-lo. É saber quem tem a chave de qual cômodo. Nem todo mundo deveria ter a mesma voz dentro de você.",
    pergunta: "Quem está ocupando um lugar no seu coração que não cuida bem dele?",
  },
  {
    passageRef: "Isaías 43:1",
    passageText: "Não temas, porque eu te remi; chamei-te pelo teu nome, tu és meu.",
    reflexao:
      "Antes de você ser de qualquer pessoa, você é d'Ele. Esse pertencimento vem antes do sobrenome, da história, da expectativa que colocaram sobre você.",
    pergunta: "De quem você tem se sentido, quando esquece que é primeiro de Deus?",
  },
  {
    passageRef: "Eclesiastes 3:1",
    passageText: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.",
    reflexao:
      "Nem todo deserto é castigo; alguns são preparação. Honrar o tempo de Deus é confiar que o que parece atraso pode ser cuidado.",
    pergunta: "Que estação você está vivendo agora — e o que ela está tentando te ensinar?",
  },
  {
    passageRef: "Salmos 46:10",
    passageText: "Aquietai-vos e sabei que eu sou Deus.",
    reflexao:
      "Você não precisa resolver tudo hoje. Existe um descanso que é resistência: parar é declarar que o mundo não depende de você, porque depende d'Ele.",
    pergunta: "O que aconteceria se, por hoje, você confiasse em vez de controlar?",
  },
  {
    passageRef: "Ester 4:14",
    passageText: "Quem sabe se para tempo como este chegaste ao reino?",
    reflexao:
      "Você chegou a este tempo com a sua história e as suas cicatrizes. Talvez seja exatamente para isto. O que parecia desvantagem pode ser o seu chamado.",
    pergunta: "E se o lugar onde você está hoje não fosse acaso, mas missão?",
  },
  {
    passageRef: "João 10:10",
    passageText: "Eu vim para que tenham vida, e a tenham com abundância.",
    reflexao:
      "O ladrão rouba pelos cantos: o potencial adiado, o sonho calado, o talento enterrado. A vida que Jesus dá não é só sobreviver — é florescer.",
    pergunta: "Onde o inimigo tem roubado a vida abundante que é sua por direito?",
  },
  {
    passageRef: "Sofonias 3:17",
    passageText: "O Senhor se alegrará em ti com regozijo; renovar-te-á no seu amor.",
    reflexao:
      "Deus não te suporta — Ele se alegra em você. Há um Pai que canta sobre a sua vida, mesmo nos dias em que você só consegue chorar.",
    pergunta: "Você consegue receber hoje que Deus se alegra em você, do jeito que você está?",
  },
  {
    passageRef: "Gênesis 1:11",
    passageText: "Produza a terra erva que dê semente, árvore frutífera cuja semente está nela.",
    reflexao:
      "Florescer não é o fim. O fruto carrega semente — o que você curou pode alimentar e plantar vida em outra mulher. A sua cura tem geração nela.",
    pergunta: "Quem precisa exatamente daquilo que você já atravessou?",
  },
];

export interface ReadingPlan {
  slug: string;
  title: string;
  subtitle: string;
  days: number;
}

export const READING_PLANS: ReadingPlan[] = [
  { slug: "mulheres-da-biblia", title: "Mulheres da Bíblia em 40 dias", subtitle: "Coragem, fé e identidade", days: 40 },
  { slug: "salmos-alma-cansada", title: "Salmos para a alma cansada", subtitle: "Descanso e burnout", days: 21 },
  { slug: "quatro-estacoes", title: "As quatro estações da mulher", subtitle: "Os tempos da vida", days: 28 },
];

export const THEMATIC_STUDIES: string[] = [
  "Identidade",
  "Ansiedade & descanso",
  "Casamento",
  "Maternidade",
  "Perdão",
  "Propósito",
];

/** Devocional determinístico do dia (mesmo para todas, baseado no dia do ano). */
export function getDailyDevotional(date: Date): Devotional {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return DEVOTIONALS[dayOfYear % DEVOTIONALS.length];
}
