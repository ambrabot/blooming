// Banco curado de devocionais diários (a "Pergunta Poderosa do Dia" + Palavra +
// reflexão), localizado PT/EN/ES. Seleção determinística por dia, então toda
// mulher vê o mesmo devocional no mesmo dia, no idioma da conta.
// Voz da Rafa: madura, acolhedora, fundada na Palavra.

export interface Devotional {
  passageRef: string;
  passageText: string;
  reflexao: string;
  pergunta: string;
}

type Loc = "pt" | "en" | "es";
const norm = (l: string): Loc => (l === "en" ? "en" : l === "es" ? "es" : "pt");

const PT: Devotional[] = [
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

const EN: Devotional[] = [
  {
    passageRef: "Psalm 139:13",
    passageText: "You formed my inward parts; You knitted me together in my mother's womb.",
    reflexao:
      "You were not an accident. Before any hand shaped you — or wounded you — God's hands were already weaving you with intention and care.",
    pergunta: "What changes in your day if you believe you were wanted, not merely tolerated?",
  },
  {
    passageRef: "Matthew 11:28",
    passageText: "Come to me, all who are weary and burdened, and I will give you rest.",
    reflexao:
      "There is a tiredness that sleep doesn't cure — the tiredness of carrying what was never yours to carry. Jesus doesn't ask you to endure more. He asks you to hand it over.",
    pergunta: "What are you carrying today that God never asked you to carry?",
  },
  {
    passageRef: "Galatians 5:1",
    passageText: "It is for freedom that Christ has set us free.",
    reflexao:
      "Your permission to exist, to take up space and to flourish has already been signed — not by those who hurt you, but at the cross. You are not waiting for authorization. You are already free.",
    pergunta: "Where have you been asking permission of someone, when God has already given it?",
  },
  {
    passageRef: "Romans 12:2",
    passageText: "Be transformed by the renewing of your mind.",
    reflexao:
      "You don't change your life by gritting your teeth. You change when you swap the lens — when God's truth becomes the way you see yourself.",
    pergunta: "What truth about you has God already declared that your heart still doesn't believe?",
  },
  {
    passageRef: "John 15:2",
    passageText: "Every branch that bears fruit He prunes, so that it may bear more fruit.",
    reflexao:
      "Pruning is not punishment — it is care. The Gardener only cuts what steals strength from what is alive. What hurts to lose is often what was draining you.",
    pergunta: "What needs to be pruned so that something new can flourish in you?",
  },
  {
    passageRef: "2 Timothy 1:7",
    passageText: "God gave us a spirit not of fear, but of power, love and self-control.",
    reflexao:
      "Fear is great at giving an opinion and terrible at making decisions. You can hear its warning without handing it the wheel of your life.",
    pergunta: "If fear weren't deciding for you, what would your next step be?",
  },
  {
    passageRef: "Proverbs 4:23",
    passageText: "Above all else, guard your heart, for everything you do flows from it.",
    reflexao:
      "Guarding your heart is not closing it. It's knowing who holds the key to which room. Not everyone should have the same voice inside you.",
    pergunta: "Who is occupying a place in your heart that doesn't take good care of it?",
  },
  {
    passageRef: "Isaiah 43:1",
    passageText: "Do not fear, for I have redeemed you; I have called you by name, you are mine.",
    reflexao:
      "Before you belong to anyone, you are His. That belonging comes before the last name, the history, the expectation placed on you.",
    pergunta: "Whose have you been feeling, when you forget that you are first God's?",
  },
  {
    passageRef: "Ecclesiastes 3:1",
    passageText: "There is a time for everything, and a season for every purpose under heaven.",
    reflexao:
      "Not every desert is punishment; some are preparation. To honor God's timing is to trust that what looks like delay may be care.",
    pergunta: "What season are you living right now — and what is it trying to teach you?",
  },
  {
    passageRef: "Psalm 46:10",
    passageText: "Be still, and know that I am God.",
    reflexao:
      "You don't have to solve everything today. There is a rest that is resistance: to stop is to declare that the world doesn't depend on you, because it depends on Him.",
    pergunta: "What would happen if, just for today, you trusted instead of controlled?",
  },
  {
    passageRef: "Esther 4:14",
    passageText: "Who knows but that you have come to the kingdom for such a time as this?",
    reflexao:
      "You arrived at this time with your history and your scars. Maybe it's for exactly this. What looked like a disadvantage may be your calling.",
    pergunta: "What if the place where you are today were not chance, but mission?",
  },
  {
    passageRef: "John 10:10",
    passageText: "I have come that they may have life, and have it abundantly.",
    reflexao:
      "The thief steals in the corners: the postponed potential, the silenced dream, the buried talent. The life Jesus gives is not just surviving — it is flourishing.",
    pergunta: "Where has the enemy been stealing the abundant life that is yours by right?",
  },
  {
    passageRef: "Zephaniah 3:17",
    passageText: "The Lord will take great delight in you; He will renew you in His love.",
    reflexao:
      "God doesn't put up with you — He delights in you. There is a Father who sings over your life, even on the days when all you can do is cry.",
    pergunta: "Can you receive today that God delights in you, just as you are?",
  },
  {
    passageRef: "Genesis 1:11",
    passageText: "Let the land produce seed-bearing plants and trees whose fruit has seed in it.",
    reflexao:
      "Flourishing is not the end. Fruit carries seed — what you healed can feed and plant life in another woman. Your healing has a generation in it.",
    pergunta: "Who needs exactly what you have already walked through?",
  },
];

const ES: Devotional[] = [
  {
    passageRef: "Salmos 139:13",
    passageText: "Tú formaste mis entrañas; me tejiste en el vientre de mi madre.",
    reflexao:
      "No fuiste un accidente. Antes de que cualquier mano te moldeara — o te hiriera —, las manos de Dios ya te tejían con intención y cuidado.",
    pergunta: "¿Qué cambia en tu día si crees que fuiste deseada, y no solo tolerada?",
  },
  {
    passageRef: "Mateo 11:28",
    passageText: "Venid a mí todos los que estáis cansados y cargados, y yo os haré descansar.",
    reflexao:
      "Hay un cansancio que el sueño no cura — el de cargar lo que nunca fue tuyo para cargar. Jesús no te pide que aguantes más. Te pide que entregues.",
    pergunta: "¿Qué estás cargando hoy que Dios nunca te pidió que cargaras?",
  },
  {
    passageRef: "Gálatas 5:1",
    passageText: "Para libertad Cristo nos hizo libres.",
    reflexao:
      "Tu permiso para existir, ocupar y florecer ya fue firmado — no por quienes te hirieron, sino en la cruz. No estás esperando autorización. Ya eres libre.",
    pergunta: "¿Dónde has estado pidiendo permiso a alguien que Dios ya te dio?",
  },
  {
    passageRef: "Romanos 12:2",
    passageText: "Transformaos por la renovación de vuestro entendimiento.",
    reflexao:
      "No cambias la vida apretando los dientes. Cambias cuando cambias el lente — cuando la verdad de Dios se vuelve la forma en que te ves a ti misma.",
    pergunta: "¿Qué verdad sobre ti ya declaró Dios, que tu corazón aún no cree?",
  },
  {
    passageRef: "Juan 15:2",
    passageText: "Todo pámpano que lleva fruto, lo limpia, para que lleve más fruto.",
    reflexao:
      "La poda no es castigo — es cuidado. El Agricultor solo corta lo que roba fuerza a lo que está vivo. Lo que duele perder, muchas veces, es lo que te estaba agotando.",
    pergunta: "¿Qué necesita ser podado para que algo nuevo florezca en ti?",
  },
  {
    passageRef: "2 Timoteo 1:7",
    passageText: "Dios no nos dio espíritu de cobardía, sino de poder, de amor y de dominio propio.",
    reflexao:
      "El miedo es óptimo dando opinión y pésimo decidiendo. Puedes oír su aviso sin entregarle el volante de tu vida.",
    pergunta: "Si el miedo no estuviera decidiendo por ti, ¿cuál sería tu próximo paso?",
  },
  {
    passageRef: "Proverbios 4:23",
    passageText: "Sobre toda cosa guardada, guarda tu corazón, porque de él mana la vida.",
    reflexao:
      "Guardar el corazón no es cerrarlo. Es saber quién tiene la llave de cada cuarto. No todos deberían tener la misma voz dentro de ti.",
    pergunta: "¿Quién está ocupando un lugar en tu corazón que no lo cuida bien?",
  },
  {
    passageRef: "Isaías 43:1",
    passageText: "No temas, porque yo te redimí; te puse nombre, mía eres tú.",
    reflexao:
      "Antes de ser de cualquier persona, eres de Él. Esa pertenencia viene antes del apellido, de la historia, de la expectativa que pusieron sobre ti.",
    pergunta: "¿De quién te has sentido, cuando olvidas que eres primero de Dios?",
  },
  {
    passageRef: "Eclesiastés 3:1",
    passageText: "Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.",
    reflexao:
      "No todo desierto es castigo; algunos son preparación. Honrar el tiempo de Dios es confiar en que lo que parece atraso puede ser cuidado.",
    pergunta: "¿Qué estación estás viviendo ahora — y qué está intentando enseñarte?",
  },
  {
    passageRef: "Salmos 46:10",
    passageText: "Estad quietos, y conoced que yo soy Dios.",
    reflexao:
      "No tienes que resolver todo hoy. Hay un descanso que es resistencia: parar es declarar que el mundo no depende de ti, porque depende de Él.",
    pergunta: "¿Qué pasaría si, por hoy, confiaras en vez de controlar?",
  },
  {
    passageRef: "Ester 4:14",
    passageText: "¿Quién sabe si para esta hora has llegado al reino?",
    reflexao:
      "Llegaste a este tiempo con tu historia y tus cicatrices. Quizás sea exactamente para esto. Lo que parecía desventaja puede ser tu llamado.",
    pergunta: "¿Y si el lugar donde estás hoy no fuera casualidad, sino misión?",
  },
  {
    passageRef: "Juan 10:10",
    passageText: "Yo he venido para que tengan vida, y para que la tengan en abundancia.",
    reflexao:
      "El ladrón roba por los rincones: el potencial aplazado, el sueño callado, el talento enterrado. La vida que Jesús da no es solo sobrevivir — es florecer.",
    pergunta: "¿Dónde ha estado el enemigo robando la vida abundante que es tuya por derecho?",
  },
  {
    passageRef: "Sofonías 3:17",
    passageText: "El Señor se gozará en ti con alegría; te renovará en su amor.",
    reflexao:
      "Dios no te soporta — se goza en ti. Hay un Padre que canta sobre tu vida, incluso en los días en que solo logras llorar.",
    pergunta: "¿Puedes recibir hoy que Dios se goza en ti, tal como estás?",
  },
  {
    passageRef: "Génesis 1:11",
    passageText: "Produzca la tierra hierba que dé semilla, árbol de fruto cuya semilla esté en él.",
    reflexao:
      "Florecer no es el fin. El fruto lleva semilla — lo que sanaste puede alimentar y plantar vida en otra mujer. Tu sanidad tiene una generación dentro.",
    pergunta: "¿Quién necesita exactamente aquello que tú ya atravesaste?",
  },
];

const DEVOTIONALS: Record<Loc, Devotional[]> = { pt: PT, en: EN, es: ES };

export interface ReadingPlan {
  slug: string;
  title: string;
  subtitle: string;
  days: number;
}

const READING_PLANS_BY_LOC: Record<Loc, ReadingPlan[]> = {
  pt: [
    { slug: "mulheres-da-biblia", title: "Mulheres da Bíblia em 40 dias", subtitle: "Coragem, fé e identidade", days: 40 },
    { slug: "salmos-alma-cansada", title: "Salmos para a alma cansada", subtitle: "Descanso e burnout", days: 21 },
    { slug: "quatro-estacoes", title: "As quatro estações da mulher", subtitle: "Os tempos da vida", days: 28 },
  ],
  en: [
    { slug: "mulheres-da-biblia", title: "Women of the Bible in 40 days", subtitle: "Courage, faith and identity", days: 40 },
    { slug: "salmos-alma-cansada", title: "Psalms for a weary soul", subtitle: "Rest and burnout", days: 21 },
    { slug: "quatro-estacoes", title: "The four seasons of a woman", subtitle: "The times of life", days: 28 },
  ],
  es: [
    { slug: "mulheres-da-biblia", title: "Mujeres de la Biblia en 40 días", subtitle: "Coraje, fe e identidad", days: 40 },
    { slug: "salmos-alma-cansada", title: "Salmos para el alma cansada", subtitle: "Descanso y burnout", days: 21 },
    { slug: "quatro-estacoes", title: "Las cuatro estaciones de la mujer", subtitle: "Los tiempos de la vida", days: 28 },
  ],
};

const THEMATIC_STUDIES_BY_LOC: Record<Loc, string[]> = {
  pt: ["Identidade", "Ansiedade & descanso", "Casamento", "Maternidade", "Perdão", "Propósito"],
  en: ["Identity", "Anxiety & rest", "Marriage", "Motherhood", "Forgiveness", "Purpose"],
  es: ["Identidad", "Ansiedad y descanso", "Matrimonio", "Maternidad", "Perdón", "Propósito"],
};

/** Devocional determinístico do dia (mesmo para todas no mesmo dia), no idioma da conta. */
export function getDailyDevotional(date: Date, locale: string = "pt"): Devotional {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start;
  const dayOfYear = Math.floor(diff / 86400000);
  const arr = DEVOTIONALS[norm(locale)];
  return arr[dayOfYear % arr.length];
}

export function getReadingPlans(locale: string = "pt"): ReadingPlan[] {
  return READING_PLANS_BY_LOC[norm(locale)];
}

export function getThematicStudies(locale: string = "pt"): string[] {
  return THEMATIC_STUDIES_BY_LOC[norm(locale)];
}
