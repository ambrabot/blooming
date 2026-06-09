/**
 * Cria/atualiza o módulo "Provisão & Dinheiro Emocional" (slug:
 * provisao-dinheiro-emocional) com 6 encontros, e libera acesso para admins.
 *
 * Conteúdo: o princípio do "dinheiro emocional" (Tiago Brunet) — o que não se
 * resolve na emoção se paga no material — REFORMULADO na voz cristã da Rafa,
 * integrado à mordomia bíblica. Mapeado à camada Flor (provisão/abundância).
 *
 * Uso: npx tsx scripts/add-provisao-module.ts
 */

import "dotenv/config";
import { PrismaClient, UserRole, LessonType } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const MODULE = {
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
    "Neste módulo o foco é a relação emocional com dinheiro e provisão. O princípio: o que não se resolve na emoção se paga no material. Ajude a mulher a: (1) reconhecer o modelo de dinheiro herdado (de casa/pais) que ela repete sem perceber; (2) ver como frustrações e feridas não resolvidas governam gastar, guardar, fugir ou se obrigar; (3) curar a carência que vira cobiça (não desejar o que não é dela) e crescer no contentamento (Fp 4:11-13); (4) desfrutar o que já é dela com gratidão e mordomia (não adiar a vida nem idolatrar a poupança); (5) discernir a quem serve — Deus ou Mamom (Mt 6:24) — e onde está o tesouro, lá está o coração; (6) confiar no Pai que provê (Jeová-Jiré) e decidir com Ele. Trate a raiz emocional, não o sintoma financeiro. Sem teologia da prosperidade que transforma Deus em caixa eletrônico; provisão é cuidado do Pai e mordomia fiel. Sem aconselhamento financeiro técnico — encaminhe para profissional quando for dívida/planejamento concreto.",
  keyScriptures: [
    { ref: "Mateus 6:24", text: "Não podeis servir a Deus e a Mamom" },
    { ref: "Filipenses 4:11-13", text: "Aprendi a viver contente em toda e qualquer situação" },
    { ref: "Mateus 6:21", text: "Onde estiver o teu tesouro, aí estará também o teu coração" },
    { ref: "Gênesis 22:14", text: "O Senhor proverá (Jeová-Jiré)" },
  ],
};

const LESSONS: Array<{
  slug: string;
  order: number;
  type: LessonType;
  title: string;
  durationMin: number;
  content: string;
  scripture: string;
  exercise: string;
  prayer: string;
}> = [
  {
    slug: "o-modelo-que-voce-herdou",
    order: 1,
    type: LessonType.TEACHING,
    title: "O modelo que você herdou",
    durationMin: 12,
    scripture:
      "Provérbios 22:6 — \"Ensina a criança no caminho em que deve andar, e até quando envelhecer não se desviará dele.\"",
    exercise:
      "Volte um pouco na sua história:\n\n1. Em casa, quando criança, dinheiro era o quê? Escolha as palavras que vierem: escassez, briga, segredo, vergonha, status, controle, ausência, fartura, medo.\n\n2. O que seu pai te ensinou sobre dinheiro — pelo que dizia E pelo que fazia? E sua mãe?\n\n3. Qual frase sobre dinheiro você ouviu tanto que virou verdade? (\"dinheiro não dá em árvore\", \"rico não entra no céu\", \"a gente não merece\", \"guarde tudo\", \"gaste enquanto pode\"...)\n\n4. Onde você se pega repetindo esse modelo hoje — mesmo sem querer?\n\n5. Esse modelo é da sua casa, ou é do Reino? O que Deus diria diferente?",
    prayer:
      "Pai, obrigada porque eu não preciso ficar presa ao modelo que herdei sem escolher. Me mostra o que eu aprendi sobre dinheiro que não veio de Ti — os medos, as vergonhas, as frases que viraram corrente. Eu te entrego a história da minha casa e te peço uma mente renovada, que enxergue a provisão pelos Teus olhos. Em nome de Yeshua, amém.",
    content: `## Dinheiro quase nunca é só dinheiro

Antes da gente falar de números, respira. Porque o que a gente vai olhar aqui não é a sua conta bancária — é o seu coração.

Existe uma verdade que liberta muita mulher: a sua relação com dinheiro foi, em grande parte, **ensinada** antes de você ter idade para escolher. Você herdou um modelo. E está repetindo ele agora, muitas vezes sem perceber.

## O que você viu, você aprendeu

Uma menina não aprende sobre dinheiro numa aula. Ela aprende na mesa de casa. No tom de voz quando a conta chegava. No silêncio sobre o assunto, ou na briga por causa dele. No "a gente não pode" dito com vergonha, ou no gasto impulsivo que mascarava uma dor.

> Você não herdou só o dinheiro (ou a falta dele) da sua família. Você herdou a **emoção** que eles tinham em relação a ele.

E essa emoção virou um modelo. Um jeito automático de sentir e agir diante da provisão.

## Os modelos mais comuns

Veja se você se reconhece em algum:

**A que vive na escassez.** Mesmo quando tem, sente que não tem. Guarda por medo, não por sabedoria. O dinheiro é uma ameaça constante.

**A que foge.** Não olha a conta, não planeja, "dá um jeito". O dinheiro é uma fonte de ansiedade que ela prefere não encarar.

**A que se vale pelo que tem.** Worth e net worth viraram a mesma coisa. Sem o ter, ela se sente nada.

**A que repete a vergonha.** Cresceu ouvindo que dinheiro é sujo, que querer é pecado, que ela não merece — e hoje sabota qualquer prosperidade.

Nenhuma dessas nasceu com você. Todas foram aprendidas. E o que foi aprendido pode ser desaprendido.

## O modelo da sua casa não é o modelo do Reino

Aqui está a boa notícia. Você tem outro Pai, com outra mesa, com outro modelo.

No Reino, dinheiro não é senhor nem deus — é **ferramenta** e **mordomia**. Não é vergonha nem identidade — é recurso confiado. O medo da escassez é respondido por um Pai que se chama **Jeová-Jiré**: o Senhor que provê.

Romanos 12:2 vale aqui também: você pode renovar a sua mente — inclusive a parte dela que foi formada sobre dinheiro. Não para amar o dinheiro, mas para parar de ser governada por uma emoção que nem é sua.

## O primeiro passo

Hoje a gente só vai enxergar. Olhe para o seu jeito automático com dinheiro e pergunte: *de quem eu aprendi isso?*

Nomear o modelo herdado é o começo de escolher um novo.`,
  },
  {
    slug: "a-frustracao-que-mexe-na-sua-carteira",
    order: 2,
    type: LessonType.COUNSELING,
    title: "A frustração que mexe na sua carteira",
    durationMin: 12,
    scripture:
      "Lucas 12:15 — \"Acautelai-vos e guardai-vos de toda a avareza, porque a vida de um homem não consiste na abundância dos bens que possui.\"",
    exercise:
      "Pense no seu último gasto que, no fundo, você sabe que não foi sobre a coisa que comprou.\n\n1. O que você comprou (ou quis comprar)?\n\n2. Como você estava se sentindo antes? (cansada, invisível, rejeitada, ansiosa, entediada, triste, sem controle?)\n\n3. O que você estava buscando de VERDADE ali — conforto, status, controle, alívio, pertencimento, uma recompensa por aguentar tanto?\n\n4. Aquilo entregou o que você buscava? Por quanto tempo?\n\n5. Qual é a necessidade real por trás — e quem pode supri-la de verdade?",
    prayer:
      "Senhor, me ajuda a enxergar o que eu venho tentando comprar com dinheiro e que só o Senhor pode me dar: o valor, o descanso, a segurança, o pertencimento. Eu não quero mais tratar com a carteira o que é ferida do coração. Cura a raiz, e me ensina a levar a Ti a necessidade antes de levar à loja. Em nome de Jesus, amém.",
    content: `## O sintoma e a raiz

Existe uma frase que organiza este módulo inteiro:

**O que você não resolve na emoção, você paga em todas as outras áreas — inclusive no dinheiro.**

O dinheiro é, muitas vezes, só o lugar onde a dor aparece. O sintoma. A raiz está mais embaixo.

## A compra que não era sobre a compra

Você já comprou algo e, dias depois, percebeu que nem era aquilo que você queria? Não era o sapato, o curso, a comida, o presente. Era outra coisa.

A frustração não resolvida tem um jeito silencioso de mexer na sua carteira:

> O cansaço pede recompensa. A invisibilidade pede status. A ansiedade pede controle. O vazio pede preenchimento. E tudo isso, na hora, parece que cabe num cartão.

O problema é que a coisa material nunca paga a conta emocional. Ela alivia por uma hora — e a frustração volta, agora acompanhada de mais uma dívida.

## Privação ou compulsão

A frustração também trabalha pelo avesso. Algumas mulheres não gastam demais — elas se **privam** demais. Não conseguem receber, desfrutar, comprar algo bom para si. Porque lá no fundo uma voz diz "você não merece".

Gastar para anestesiar e privar-se para se punir são duas faces da mesma moeda: uma emoção não resolvida governando o dinheiro. Em ambas, quem decide não é você — é a ferida.

## Levar a fome certa ao lugar certo

A cura não é controlar mais o cartão. É descobrir a fome de verdade e levá-la a quem pode saciar.

"A vida não consiste na abundância dos bens." A sua alma não tem fome de coisas — tem fome de valor, de descanso, de segurança, de pertencimento. E essas, nenhuma loja vende.

Quando você leva a necessidade real para o Pai antes de levar para a vitrine, o dinheiro volta a ser só dinheiro. E você volta a ser quem decide.

## Um exercício de consciência

Da próxima vez que vier a vontade de gastar (ou o impulso de se privar), faça uma pausa de um minuto e pergunte: *o que eu estou sentindo agora, e o que eu estou realmente buscando?*

Só isso já tira a frustração do volante.`,
  },
  {
    slug: "nao-deseje-o-que-nao-e-seu",
    order: 3,
    type: LessonType.COUNSELING,
    title: "Não deseje o que não é seu",
    durationMin: 11,
    scripture:
      "Filipenses 4:11-12 — \"Aprendi a viver contente... sei estar humilhado, e sei também ter abundância.\"",
    exercise:
      "1. Abra a rede social que você mais usa. Quem são as pessoas cuja vida te deixa com um aperto, uma inveja, um \"por que ela e não eu\"?\n\n2. O que exatamente você inveja? (a casa, o corpo, o casamento, a viagem, a liberdade financeira, o reconhecimento?)\n\n3. Por trás do que você inveja, qual é a carência? O que você sente que te falta de verdade?\n\n4. Escreva 5 coisas que JÁ são suas — incluindo as que não se compram (uma pessoa, uma capacidade, uma misericórdia recebida).\n\n5. Releia e pergunte: e se eu administrasse bem o que é meu, em vez de cobiçar o que é da outra?",
    prayer:
      "Pai, a comparação tem roubado a minha paz e a minha gratidão. Me ajuda a tirar os olhos da vida da outra e a enxergar o que o Senhor já colocou nas minhas mãos. Cura a carência que vira cobiça, e me ensina o contentamento que Paulo aprendeu — não como resignação, mas como confiança de que, contigo, eu já tenho o suficiente. Em nome de Yeshua, amém.",
    content: `## A raiz da cobiça é a carência

Tem um mandamento que parece estranho à primeira vista: "não cobiçarás". Por que Deus se importaria com o que eu apenas desejo, lá dentro?

Porque Ele sabe de onde a cobiça nasce. Ela não nasce de fartura — nasce de **falta**. De uma carência antiga que olha para a vida do outro e diz: "se eu tivesse aquilo, eu estaria inteira".

## A comparação é uma ladra

Você abre o celular para descansar e sai de lá mais pobre — não de dinheiro, de paz. Porque viu a casa, o corpo, a viagem, o casamento, o sucesso da outra. E a sua vida, que há cinco minutos estava boa, de repente parece pequena.

> A comparação não rouba o que você tem. Rouba a sua capacidade de **enxergar** o que você tem.

E o pior: você nunca está comparando a sua vida inteira com a vida inteira dela. Está comparando os seus bastidores com o palco editado dela.

## Desejar o que não é seu adoece o que é seu

Quando você vive desejando a vida da outra, duas coisas morrem: a **gratidão** pelo que é seu e a **mordomia** do que Deus te confiou. Você fica tão ocupada querendo o jardim do vizinho que deixa o seu sem regar.

E há algo ainda mais sério: muitas vezes o que parece falta de dinheiro é, na verdade, falta de contentamento. A conta nunca fecha porque o buraco não é financeiro — é da alma.

## O segredo que Paulo aprendeu

Paulo disse uma frase poderosa, e repara que ele a chamou de algo **aprendido**: "aprendi a viver contente". Contentamento não é temperamento. É treino. É uma decisão repetida de confiar.

E ele não estava falando de pouco: "sei ter abundância e sei passar necessidade". O segredo dele não dependia da circunstância — dependia de Quem estava com ele em qualquer circunstância.

Contentamento não é parar de sonhar. É parar de mendigar da vida do outro a paz que só o Pai te dá. É administrar com alegria o que é seu, enquanto confia no tempo d'Ele para o resto.`,
  },
  {
    slug: "desfrutar-o-que-ja-e-seu",
    order: 4,
    type: LessonType.PRACTICE,
    title: "Desfrutar o que já é seu",
    durationMin: 11,
    scripture:
      "Eclesiastes 5:19 — \"Quanto ao homem a quem Deus deu riquezas e o poder de delas comer... isto é dom de Deus.\"",
    exercise:
      "Um exercício de desfrute consciente, para esta semana:\n\n1. Escolha UMA coisa boa que já é sua e que você vinha adiando desfrutar (uma roupa guardada \"para uma ocasião\", um tempo de descanso, um prato que você ama, um lugar perto que você nunca foi).\n\n2. Desfrute dela esta semana — de propósito, com presença, sem culpa.\n\n3. Enquanto desfruta, agradeça em voz alta: \"obrigada, Pai, por isto.\"\n\n4. Anote o que você sentiu. Foi fácil receber, ou veio culpa? De onde vem a culpa?\n\n5. Pergunte: o que eu venho guardando para um \"depois\" que talvez nunca chegue — e por quê?",
    prayer:
      "Senhor, obrigada porque desfrutar do que o Senhor me deu não é desperdício nem pecado — é dom Teu, é gratidão em forma de vida. Me liberta da culpa que me faz adiar a alegria e da ansiedade que me faz guardar tudo para um amanhã que talvez não venha. Me ensina a viver o presente que o Senhor me deu, com mãos abertas e coração grato. Em nome de Jesus, amém.",
    content: `## Tem gente que tem e não usufrui

Existe uma pobreza que não aparece na conta bancária: a de quem tem e não consegue desfrutar.

A mulher que guarda a roupa boa para uma ocasião que nunca vem. Que não descansa porque descanso parece desperdício. Que tem o suficiente, mas vive como quem não tem — não por fé, por medo.

Salomão, o homem mais rico de sua época, olhou para isso e chamou de um mal debaixo do sol: ter, e não ter o poder de desfrutar.

## Desfrutar é mordomia, não desperdício

A gente costuma achar que ser boa mordoma é só guardar e cortar. Mas a Bíblia diz outra coisa:

> "A cada homem a quem Deus deu riquezas e o poder de delas desfrutar... isto é dom de Deus." (Eclesiastes 5:19)

Desfrutar com gratidão é parte da mordomia. Deus não te deu boas coisas para você as olhar de longe com culpa. Ele se alegra quando uma filha recebe e agradece.

Claro que não é gastança nem irresponsabilidade. É o oposto da compra ansiosa do encontro passado — aqui não tem fuga de emoção, tem presença e gratidão. A diferença entre consumir por dor e desfrutar com gratidão está no coração, não no preço.

## A culpa que rouba a alegria

Para muitas mulheres, receber e desfrutar vem com culpa. "Eu não deveria", "tem gente passando necessidade", "e se faltar depois". Parte dessa culpa é a velha vergonha herdada. Parte é a ansiedade do amanhã que Jesus mandou a gente não carregar.

Mas escuta: a sua privação não alimenta ninguém. O seu descanso não é egoísmo. A sua alegria com o que é seu não ofende a Deus — ela O honra, porque reconhece a mão d'Ele.

## Viva o presente que Ele te deu

A vida não acontece num "depois" que você está sempre adiando. Ela acontece hoje, no presente que o Pai te deu — literalmente, um presente.

Desfrutar com gratidão é uma forma de adoração. É dizer com a vida: "obrigada, Pai. Eu vejo o que o Senhor me deu, e eu recebo."`,
  },
  {
    slug: "a-quem-voce-serve",
    order: 5,
    type: LessonType.SCRIPTURE,
    title: "A quem você serve",
    durationMin: 12,
    scripture:
      "Mateus 6:24 — \"Ninguém pode servir a dois senhores... Não podeis servir a Deus e a Mamom.\"",
    exercise:
      "Perguntas de coração, com honestidade:\n\n1. Quando você pensa no futuro, o que te dá mais segurança: o tamanho da sua reserva, ou o cuidado do seu Pai? (Resposta sincera, não a \"certa\".)\n\n2. Onde está o seu tesouro — onde vão a sua maior energia, preocupação e pensamento?\n\n3. O dinheiro hoje é seu servo (uma ferramenta que você usa) ou seu senhor (algo que decide o seu humor, o seu valor, o seu sono)?\n\n4. Que decisão você tomaria diferente se confiasse de verdade que Deus é o seu provedor?\n\n5. Escreva uma frase entregando o trono ao dono certo: \"Dinheiro, você é meu servo. Deus, o Senhor é o meu provedor.\"",
    prayer:
      "Pai, eu reconheço onde o dinheiro tentou sentar num trono que é só Teu. Onde ele virou a minha segurança, o meu valor, o meu medo — eu te devolvo esse lugar. O Senhor é o meu provedor, não a minha conta. Que o meu coração siga o tesouro certo, e que o dinheiro volte a ser servo na minha casa, nunca senhor. Em nome de Yeshua, amém.",
    content: `## Jesus falou mais de dinheiro do que de céu

Isso surpreende muita gente. Por que o Mestre falaria tanto de dinheiro? Porque Ele sabia que poucas coisas disputam o coração com a força que o dinheiro disputa.

E Ele foi direto, sem suavizar: "Não podeis servir a Deus e a Mamom." Mamom não é só dinheiro — é o dinheiro virado deus, virado senhor, virado fonte de segurança e identidade.

## A pergunta não é se você tem — é quem serve a quem

Repara na precisão de Jesus. Ele não disse "não podeis TER dinheiro e servir a Deus". Ele disse não podeis **servir** aos dois.

> O problema nunca foi o dinheiro na sua mão. O problema é o dinheiro no seu trono.

Dinheiro é um servo maravilhoso e um senhor terrível. Como servo, ele paga contas, abençoa, sustenta, financia o Reino. Como senhor, ele rouba o seu sono, define o seu valor, decide o seu humor e nunca, nunca diz "agora chega, você está segura".

## Onde está o seu tesouro

Jesus deu o teste mais simples para descobrir a quem você serve: "onde estiver o teu tesouro, aí estará também o teu coração."

Não é o contrário. Não é que o coração vai onde está o tesouro por acaso — é que o seu coração **segue** aquilo onde você investe. Para onde vão a sua maior energia, preocupação e pensamento? Ali está o seu deus prático.

Faça o teste com honestidade. Quando o futuro assusta, o que te acalma: o tamanho da reserva ou o cuidado do Pai? A resposta sincera te mostra quem está no trono.

## Destronar sem demonizar

Cuidado com o outro extremo. Servir a Deus não é desprezar o dinheiro nem viver na pobreza por culpa. Isso é só Mamom pelo avesso — ainda governando, agora pela rejeição.

A liberdade é colocar cada coisa no seu lugar: Deus no trono, dinheiro na mão. Quando o dono certo está no comando, você administra com paz, dá com alegria, recebe sem culpa e dorme em paz — porque a sua segurança não está na conta. Está n'Ele.`,
  },
  {
    slug: "a-provisao-do-pai",
    order: 6,
    type: LessonType.TEACHING,
    title: "A provisão do Pai",
    durationMin: 13,
    scripture:
      "Filipenses 4:19 — \"O meu Deus, segundo a sua riqueza, suprirá todas as vossas necessidades em glória, por Cristo Jesus.\"",
    exercise:
      "Esta é a última parada. Vá com fé:\n\n1. Olhe para trás e escreva UMA vez em que faltou — e Deus proveu (de um jeito que você talvez nem tenha reparado na hora).\n\n2. Que necessidade real está te assustando hoje?\n\n3. Reescreva o medo como entrega: \"Pai, eu te entrego a provisão de ___. O Senhor é Jeová-Jiré.\"\n\n4. Mordomia tem uma parte ativa: qual é UM passo sábio e concreto que você pode dar esta semana (um corte, um plano, uma conversa difícil, um pedido de ajuda profissional se a dívida pede)?\n\n5. E uma parte de fé: solte o resultado nas mãos do Pai. Faça a sua parte, confie a d'Ele.",
    prayer:
      "Pai, Jeová-Jiré, o Senhor que provê. Obrigada porque a minha segurança não está no que eu tenho, mas em Quem o Senhor é. Eu te entrego os meus medos sobre a provisão, e escolho fazer a minha parte com sabedoria e confiar a Tua parte com fé. Supre as minhas necessidades segundo as Tuas riquezas em glória — e faz de mim um canal de provisão para outras. Em nome de Yeshua, amém.",
    content: `## O nome que Deus se deu numa montanha

Lá em Gênesis, num dos momentos mais tensos da Bíblia, Abraão sobe um monte sem saber como tudo vai terminar. E quando Deus provê, Abraão dá àquele lugar um nome que ecoa até hoje: **Jeová-Jiré** — "o Senhor proverá".

Repara: o nome não é "o Senhor proveu" só no passado. É proverá. É uma característica permanente de quem Ele é. Provedor não é algo que Deus faz de vez em quando. É algo que Ele **é**.

## Da carência à confiança

A gente atravessou um caminho neste módulo. Vimos o modelo herdado, as frustrações que governam, a cobiça que nasce da carência, o desfrutar com gratidão, e a quem você serve.

Tudo isso desemboca aqui: numa decisão de confiar no Pai que provê.

> Você não precisa carregar sozinha o peso de garantir o seu futuro. Esse peso nunca foi seu para carregar. Você tem um Pai.

Jesus apontou para os lírios e os pássaros e disse: se o Pai cuida deles, quanto mais de você? A ansiedade com o amanhã não acrescenta um dia à sua vida — só rouba a paz do seu hoje.

## Fé não é passividade

Mas atenção, porque a provisão do Pai não é desculpa para imprudência. Confiar em Jeová-Jiré não significa não planejar, não trabalhar, não cuidar. A mulher de Provérbios 31 confia em Deus E administra, planeja, trabalha, investe.

Mordomia tem duas mãos: uma ativa e uma de fé. A mão ativa faz a parte dela com sabedoria — corta o que precisa, planeja, busca ajuda quando a dívida pede, trabalha. A mão de fé solta o resultado, porque sabe que o crescimento vem d'Ele.

Faça a sua parte como se dependesse de você. Confie a parte d'Ele como o que ela é: d'Ele.

## Curada para também prover

E aqui, o último giro. A provisão do Pai nunca para em você. Quem foi suprida se torna canal de suprimento.

A cura da sua relação com dinheiro não é só para você ter paz — é para você se tornar uma mulher que abençoa, que dá com alegria, que financia o Reino, que ensina outra a sair da escassez. O fruto carrega semente.

Você foi cuidada por um Pai que provê. Agora você pode descansar nele — e, das suas mãos abertas, deixar a provisão d'Ele alcançar mais gente.`,
  },
];

async function main() {
  console.log("\n🌾 Criando módulo Provisão & Dinheiro Emocional...\n");

  const mod = await db.module.upsert({
    where: { slug: MODULE.slug },
    update: {
      title: MODULE.title,
      subtitle: MODULE.subtitle,
      description: MODULE.description,
      systemPromptAddition: MODULE.systemPromptAddition,
      keyScriptures: MODULE.keyScriptures,
      hebrewWord: MODULE.hebrewWord,
      iconEmoji: MODULE.iconEmoji,
      colorClass: MODULE.colorClass,
      order: MODULE.order,
      priceInCents: MODULE.priceInCents,
      audience: MODULE.audience,
      isActive: true,
    },
    create: {
      slug: MODULE.slug,
      title: MODULE.title,
      subtitle: MODULE.subtitle,
      description: MODULE.description,
      systemPromptAddition: MODULE.systemPromptAddition,
      keyScriptures: MODULE.keyScriptures,
      hebrewWord: MODULE.hebrewWord,
      iconEmoji: MODULE.iconEmoji,
      colorClass: MODULE.colorClass,
      order: MODULE.order,
      priceInCents: MODULE.priceInCents,
      audience: MODULE.audience,
    },
  });
  console.log(`  ✓ Módulo: ${mod.title} (${mod.slug})`);

  for (const lesson of LESSONS) {
    await db.lesson.upsert({
      where: { moduleId_slug: { moduleId: mod.id, slug: lesson.slug } },
      update: {
        title: lesson.title,
        order: lesson.order,
        type: lesson.type,
        content: lesson.content,
        scripture: lesson.scripture,
        exercise: lesson.exercise,
        prayer: lesson.prayer,
        durationMin: lesson.durationMin,
      },
      create: {
        moduleId: mod.id,
        slug: lesson.slug,
        title: lesson.title,
        order: lesson.order,
        type: lesson.type,
        content: lesson.content,
        scripture: lesson.scripture,
        exercise: lesson.exercise,
        prayer: lesson.prayer,
        durationMin: lesson.durationMin,
      },
    });
    console.log(`  ✓ Encontro ${lesson.order}: ${lesson.title}`);
  }

  const admins = await db.user.findMany({ where: { role: "ADMIN" } });
  for (const admin of admins) {
    await db.modulePurchase.upsert({
      where: { userId_moduleId: { userId: admin.id, moduleId: mod.id } },
      update: { status: "COMPLETED", purchasedAt: new Date() },
      create: {
        userId: admin.id,
        moduleId: mod.id,
        amountPaid: 0,
        currency: "BRL",
        status: "COMPLETED",
        purchasedAt: new Date(),
      },
    });
    console.log(`  ✓ Acesso liberado para admin: ${admin.email}`);
  }

  console.log(`\n✅ Pronto. ${LESSONS.length} encontros, ${admins.length} admin(s) com acesso.\n`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
