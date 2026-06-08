/**
 * Cria/atualiza o módulo "Permissão & Destino" (slug: permissao-destino)
 * com seus 6 encontros, e libera acesso para os usuários ADMIN.
 *
 * Conteúdo: conceitos de Elton Euller (teoria da permissão, PDA, utilidade da
 * culpa, desmentir o medo) e Tiago Brunet (identidade/destino) REFORMULADOS na
 * voz cristã da Rafa. Nenhum protocolo/formulário proprietário é replicado.
 *
 * Uso: npx tsx scripts/add-permissao-module.ts
 */

import "dotenv/config";
import { PrismaClient, UserRole, LessonType } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const MODULE = {
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
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "nao-sei-nao-quero-nao-me-deixam",
    order: 1,
    type: LessonType.TEACHING,
    title: "Não sei, não quero, ou não me deixam?",
    durationMin: 13,
    scripture:
      "Gálatas 5:1 — \"Para a liberdade foi que Cristo nos libertou; permanecei, pois, firmes e não vos submetais de novo a jugo de escravidão.\"",
    exercise:
      "Pegue um papel, ou abra uma sessão comigo.\n\n1. Escreva UM passo que você sabe que precisa dar e ainda não deu.\n\n2. Pergunte, com honestidade de filha: o que me falta aqui?\n   - Capacidade — \"não sei como\" (isso se aprende)\n   - Disposição — \"no fundo não quero\" (e tudo bem reconhecer)\n   - Permissão — \"não me sinto autorizada\"\n\n3. Se for permissão: de quem você está esperando essa autorização? Escreva o nome.\n\n4. Existe um voto seu por trás disso? Complete a frase com o que vier primeiro: \"Eu nunca vou...\" / \"Eu nunca mais vou...\". Escreva sem filtrar.\n\n5. Olhe para o que escreveu e responda: esse voto ainda está te protegendo, ou já virou a sua prisão?",
    prayer:
      "Pai, obrigada porque eu não preciso mendigar autorização para ser quem o Senhor me criou para ser. Hoje eu reconheço as vozes que me ensinaram a pedir licença para existir — e reconheço também os votos que eu mesma fiz, num dia de dor, achando que estava me protegendo. Eu trago cada um deles para a Tua presença. Me ajuda a enxergar onde estou travada por permissão, e me dá coragem de crer que, em Cristo, a minha liberdade já foi assinada. Em nome de Yeshua, amém.",
    content: `## Antes de tudo: respira

Antes de você ler qualquer coisa aqui, faça uma coisa por mim. Respira fundo uma vez. Solta devagar. Pronto. Agora a gente conversa.

Existe uma pergunta que eu preciso te fazer, e ela pode mudar muita coisa.

Você já reparou que existem coisas que você diz que quer, que você até sabe como fazer — e mesmo assim não faz?

Não é preguiça. Não é falta de fé. Quase sempre é outra coisa. Uma coisa que quase ninguém te ensinou a enxergar.

## Três motivos para alguém travar

Quando uma mulher para diante de um passo — sair de um relacionamento que a diminui, começar o projeto que ela sonha, falar uma verdade difícil, descansar sem se sentir culpada — quase sempre o que trava é um de três motivos. Só três.

### "Eu não sei" — falta capacidade

Às vezes você realmente não sabe como. Falta informação, falta ferramenta, falta aprender. Isso tem solução simples: se busca, se aprende, se pergunta. Esse quase nunca é o problema de verdade.

### "Eu não quero" — falta disposição

Às vezes, no fundo, você não quer mesmo. E tudo bem reconhecer isso. Nem todo passo que os outros acham que você deveria dar é um passo que Deus está pedindo. Honestidade aqui já liberta.

### "Eu não posso" — falta permissão

E aqui mora o ponto cego.

**A maioria das mulheres não trava por não saber, nem por não querer. Trava porque, lá no fundo, não se sente autorizada.**

Você sabe como. Você quer. Mas alguma voz antiga sussurra: "isso não é pra você", "quem você pensa que é?", "não é seu lugar", "vai dar errado e a culpa vai ser sua".

Isso não é falta de capacidade. É falta de permissão.

## De quem você está esperando autorização?

Essa voz da permissão muitas vezes é herdada. Ela tem o tom de alguém — um pai, uma mãe, uma igreja, um ex, uma professora, uma cultura inteira que ensinou a mulher a pedir licença para existir.

Você cresceu esperando alguém assinar embaixo. E enquanto essa assinatura não vem, você espera. Adia. Se encolhe. Chama de "ainda não é o tempo" o que na verdade é "ainda não me deram permissão".

> Quem não tem permissão não diz "não quero". Diz "não posso". E vive uma vida inteira presa numa autorização que nunca vai chegar da pessoa errada.

## Às vezes a voz é a sua

Mas existe um tipo de permissão negada que é ainda mais difícil de enxergar — porque a voz não vem de fora. Vem de dentro. É a sua própria voz.

Em algum momento, quase sempre diante de uma dor grande, você fez um juramento silencioso. Ninguém ouviu. Talvez nem você lembre. Mas ele ficou gravado:

> "Eu nunca vou deixar ninguém me machucar de novo."

> "Eu nunca vou depender de ninguém."

> "Eu nunca vou ser como a minha mãe."

> "Eu nunca mais vou confiar."

> "Eu nunca vou pedir ajuda."

No dia em que você jurou, aquilo te protegeu. Foi até sábio, para uma menina que precisava sobreviver ao que estava vivendo. Mas o que protegeu a menina, hoje aprisiona a mulher.

**O mesmo "eu nunca" que te blindou da dor também te blindou do amor, do risco e do chamado.**

O voto que você fez para não ser ferida virou, sem você perceber, a permissão que você tirou de si mesma para viver.

> Nem toda corrente foi alguém que te prendeu. Algumas você forjou com as próprias mãos, num dia em que se prender parecia a única forma de sobreviver.

## A permissão já foi assinada

Aqui é onde eu preciso te dizer uma coisa com toda a clareza do mundo.

Em Cristo, a sua permissão para existir, ocupar, florescer e ir já foi assinada. E não foi assinada por um sistema, por um passado ou por quem te feriu. Foi assinada na cruz, com sangue, pelo próprio Deus que te chamou de filha.

"Para a liberdade foi que Cristo nos libertou." Não para a permissão dos outros. Não para os votos que você fez na dor. Para a liberdade.

Você não está esperando autorização. Você já é autorizada. O que falta não é a permissão — é você descobrir que ela já é sua, e renunciar tudo aquilo que disse o contrário.

## O primeiro passo

Hoje a gente não vai resolver tudo. A gente só vai começar a enxergar.

Da próxima vez que você travar diante de um passo, antes de se chamar de fraca ou sem fé, faz uma pergunta: isso é "não sei", "não quero" ou "não me deixam"?

E se for "não me deixam" — pergunta ainda: quem está negando? É uma voz de fora, ou é um voto que eu mesma fiz e nunca revoguei?

Só de nomear, o nó já começa a soltar.`,
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "a-culpa-nao-esta-no-que-aconteceu",
    order: 2,
    type: LessonType.COUNSELING,
    title: "A culpa não está no que aconteceu",
    durationMin: 12,
    scripture:
      "Isaías 1:18 — \"Ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve.\"",
    exercise:
      "Escolha uma culpa que você carrega — uma que pesa de verdade.\n\n1. Separe os dois tempos:\n   - O QUE ACONTECEU (o fato, no passado, que não muda)\n   - O QUE AINDA ESTÁ ACONTECENDO por causa dela (hoje)\n\n2. Olhe para o presente e pergunte: por causa dessa culpa, eu me PRIVO de quê? Ou eu me OBRIGO a quê? (Ex.: me privo de descansar, me obrigo a agradar todo mundo.)\n\n3. Essa culpa é legítima (eu realmente errei) ou herdada/transferida (estou carregando o que não é meu)?\n   - Se for legítima: qual é o passo de retratação possível? (reconhecer, pedir perdão, reparar o que for proporcional e material — nunca uma dívida impagável)\n   - Se não for sua: a quem você pode devolver esse peso hoje?\n\n4. Escreva uma frase começando com: \"O que aconteceu foi real. Mas ele não tem mais permissão de...\"",
    prayer:
      "Senhor, eu trago a Ti essa culpa que eu venho carregando como se fosse uma sentença. Me ajuda a separar o que aconteceu do que ainda pode acontecer. Onde eu errei de verdade, me dá a coragem da retratação e a humildade da reparação — sem me afogar numa dívida que só a cruz podia pagar, e que Yeshua já pagou. E onde eu estou carregando um peso que nunca foi meu, me ajuda a soltar. Eu não quero que o meu passado continue escrevendo o meu futuro. Em nome de Jesus, amém.",
    content: `## Vamos com calma aqui

Culpa é um dos pesos mais silenciosos que uma mulher carrega. Ela não grita. Ela se instala. E vai, devagar, decidindo o que você pode e o que você não pode na vida — sem nunca pedir licença.

Antes de seguir, quero que você saiba: aqui não tem julgamento. A gente vai olhar para isso juntas, com cuidado.

## A culpa não mora no fato

Existe uma ideia que liberta muita gente quando finalmente entende:

**A culpa não está no que aconteceu. Está na utilidade que alguém — às vezes você mesma — dá para o que aconteceu.**

Repara: o fato já passou. Ele é fixo, terminou, não muda mais. Então por que ele ainda dói tanto hoje?

Porque ele está sendo usado. O passado ganhou uma função no presente. E é essa função que machuca, não o acontecimento em si.

## Privação ou obrigação

A culpa quase sempre serve a uma de duas coisas:

**Privação** — ela te impede de ter, de receber, de descansar, de ser feliz. "Eu não mereço isso, depois do que eu fiz."

**Obrigação** — ela te obriga a fazer, a pagar, a se desdobrar, a agradar para sempre. "Eu tenho que compensar pelo resto da vida."

Em um caso você se priva. No outro você se sobrecarrega. Nos dois, o passado virou um carcereiro que cobra um aluguel que nunca acaba.

> Quem vive refém do passado não está preso ao que aconteceu — está preso ao que aquilo está sendo usado para fazer ele não viver hoje.

## Separe os dois tempos

A cura começa quando você separa duas coisas que a culpa mistura de propósito:

O que aconteceu — e o que ainda pode acontecer.

O que aconteceu é real. Não dá para apagar, e você nem precisa apagar. Mas o que ainda pode acontecer não pertence ao seu erro. Pertence a Deus, e pertence a você.

## Culpa legítima e culpa que não é sua

Tem culpa que é legítima: você realmente fez ou deixou de fazer algo que feriu. Para essa, existe um caminho lindo e digno, que se chama retratação. Reconhecer. Dizer a verdade. Reparar o que for justo e proporcional — material, nunca uma dívida emocional impossível de pagar.

E tem a culpa que nem é sua: te colocaram nas costas, você herdou, alguém transferiu para você o peso da própria escolha. Essa, você não precisa reparar. Você precisa devolver.

A sabedoria está em saber qual é qual.

## O que a cruz já resolveu

Aqui está o centro de tudo.

Existe um tipo de dívida que nenhuma reparação humana alcança. A dívida da alma. E é exatamente essa que Jesus pagou na cruz — não a prazo, não pela metade, mas inteira.

**Quando você tenta pagar com culpa eterna o que Cristo já pagou com sangue, você está recusando o presente mais caro que já te ofereceram.**

A retratação é sua. A reparação material justa é sua. Mas a condenação? Essa não é mais sua. Foi pregada na cruz.

"Ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve."

Não para você esquecer. Para você seguir.`,
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "o-medo-e-pessimo-conselheiro",
    order: 3,
    type: LessonType.PRACTICE,
    title: "O medo é péssimo conselheiro",
    durationMin: 11,
    scripture:
      "2 Timóteo 1:7 — \"Porque Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação.\"",
    exercise:
      "Pegue um medo específico — não \"medo da vida\", mas um concreto. Ex.: \"tenho medo de começar e fracassar na frente de todo mundo\".\n\nResponda com calma:\n\n1. O que esse medo está te fazendo fazer — ou deixar de fazer?\n\n2. Qual é o pensamento exato por trás dele? Escreva como uma frase.\n\n3. De 0 a 10, quanto desse pensamento é VERDADE, de fato, com prova? (Não quanto parece. Quanto é.)\n\n4. Você conhece alguém que NÃO tem esse medo e vive bem? No que ela acredita que é diferente do que você acredita?\n\n5. Que informação está FALTANDO no seu pensamento para ele parecer tão verdadeiro? (Muitas vezes a verdade de Deus é justamente o dado que falta.)\n\n6. Agora escreva a versão oposta do medo — mesmo que você ainda não acredite nela. Só para ver como fica.\n\nNo fim, escolha: acreditar no medo e não fazer nada / confrontar e arriscar dar errado / confrontar e arriscar dar certo.",
    prayer:
      "Pai, o Teu Espírito não é de covardia — é de poder, de amor e de domínio próprio. Quando o medo gritar mais alto que a Tua voz, me ajuda a parar e perguntar quanto daquilo é verdade. Me dá olhos para enxergar a informação que falta: a Tua presença, a Tua promessa, o Teu cuidado. Eu não quero mais deixar o medo tomar decisões que pertencem a uma filha Tua. Em nome de Yeshua, amém.",
    content: `## O medo vai falar. Ele sempre fala.

Eu não vou te prometer uma vida sem medo. Isso não existe, e quem promete está vendendo alguma coisa.

O que eu vou te dizer é outra coisa, e é libertador:

**Sucesso e obediência não vêm da ausência do medo. Vêm da forma como você lida com ele.**

O medo não é o problema. O problema é quem você deixa decidir.

## Medo é bom para uma coisa só

Repara nisso, porque muda tudo:

> O medo é ótimo em dar opiniões. E é péssimo em tomar decisões.

O medo tem uma função boa: ele te avisa. Ele aponta um risco, levanta a mão, diz "cuidado". Ótimo. Anotado.

O erro é deixar o conselheiro virar o chefe. É deixar quem só sabe apontar perigo decidir o rumo da sua vida. Aí você não anda. Você só se protege. E uma vida inteira só de proteção não é vida — é uma sala de espera.

## Como desarmar um medo

O medo se sustenta numa coisa frágil: um pensamento que parece 100% verdade, mas quase nunca é. Então a gente investiga, como quem acende a luz num quarto escuro.

### Quanto disso é verdade, de fato?

Pega o pensamento por trás do medo e dá uma nota de 0 a 10 — não de quanto parece real, mas de quanto é comprovadamente verdade. Quase sempre a nota honesta é bem menor do que o medo te fez sentir.

### Quem não tem esse medo?

Pensa em alguém que vive bem exatamente onde você trava. Essa pessoa não é mais especial que você. Ela só acredita em algo diferente. O quê?

### O que está faltando?

Todo medo se alimenta de uma informação que falta. Um pedaço da história que você não está enxergando. E, muitas vezes, o dado que falta é Deus: a presença d'Ele, a promessa d'Ele, o fato de que você não está sozinha nisso.

## A verdade que o medo esconde

"Deus não nos deu espírito de covardia, mas de poder, de amor e de moderação."

Olha que interessante: o oposto do medo, aqui, não é coragem cega. É poder, amor e domínio próprio. É a capacidade de não ser governada pelo susto.

Quando o medo gritar, você não precisa fingir que ele não existe. Você só precisa olhar para ele e dizer: "obrigada pela opinião. Mas quem decide aqui não é você."

## Escolha o seu próximo passo

Diante de qualquer medo, no fundo existem só três caminhos:

**Acreditar no medo e não fazer nada.** Seguro hoje, mas é assim que sonhos morrem de causa natural.

**Confrontar, sabendo que pode dar errado.** Corajoso, e maduro: você se prepara, reduz riscos, mas vai.

**Confrontar, apostando que pode dar certo.** A vida que você diz que quer mora desse lado.

Você não precisa escolher para sempre. Só para o próximo passo.`,
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "quem-mora-no-seu-nucleo",
    order: 4,
    type: LessonType.COUNSELING,
    title: "Quem mora no seu núcleo",
    durationMin: 12,
    scripture:
      "Provérbios 4:23 — \"Sobre tudo o que se deve guardar, guarda o teu coração, porque dele procedem as fontes da vida.\"",
    exercise:
      "Desenhe três círculos, um dentro do outro. No centro, escreva \"eu\".\n\n1. Coloque as pessoas da sua vida nos círculos pelo TAMANHO da interferência que elas têm nas suas emoções e decisões:\n   - Círculo 1 (centro): interferem muito — uma palavra delas muda o seu dia\n   - Círculo 2 (meio): interferem um pouco\n   - Círculo 3 (fora): quase não interferem\n\n2. Olhe para quem está no centro. Pergunte de cada uma: essa pessoa MERECE esse lugar, ou só ocupou?\n\n3. Existe alguém no centro que te diminui, te controla ou te esvazia? O que mudaria se ela fosse para o círculo de fora?\n\n4. E ao contrário: você está no centro emocional de alguém de um jeito que não é saudável — carregando o que é dela, decidindo por ela, sendo responsável demais?\n\n5. Escreva um limite pequeno e concreto que você pode honrar esta semana.",
    prayer:
      "Senhor, me ensina a guardar o meu coração sem fechá-lo. Me dá discernimento para enxergar quem realmente deveria ter voz na minha vida e quem só ocupou um lugar que não lhe pertence. Me dá coragem para colocar limites sem perder a honra, e amor para honrar sem me perder. Que o Teu lugar no meu coração seja o maior de todos. Em nome de Jesus, amém.",
    content: `## Nem todo mundo deveria ter a mesma voz

Você já reparou que tem gente cuja opinião muda completamente o seu dia? Uma frase, um olhar, um silêncio — e pronto, você desregula.

E tem gente que poderia dizer qualquer coisa e você seguiria em paz.

A diferença não está só na pessoa. Está no lugar que ela ocupa dentro de você. No quanto você deu a ela acesso ao seu núcleo.

## O seu núcleo emocional

Imagine o seu coração como uma casa com vários cômodos. Algumas pessoas você recebe na sala. Outras, na cozinha. E pouquíssimas deveriam ter a chave do quarto.

O problema é que, para muitas mulheres, qualquer um entrou. Quem feriu ganhou a chave. Quem controla mora na cozinha. E a voz que mais decide lá dentro às vezes é justamente a de quem menos cuida.

**Guardar o coração não é fechá-lo. É saber quem tem acesso a qual cômodo.**

## Quem está no centro?

Pensa nas pessoas que mais interferem nas suas emoções e nas suas decisões. As que, quando aparecem, mexem com tudo.

Agora a pergunta difícil: elas mereceram esse lugar, ou só ocuparam?

Tem gente no centro do seu coração que chegou ali não por amor, mas por medo. Não porque cuida, mas porque cobra. E enquanto essa pessoa decidir de dentro de você, você nunca vai estar livre de verdade — porque toda decisão sua vai passar primeiro pela aprovação dela.

## Honra com limite — não é contradição

Aqui é onde a cultura do Reino é mais profunda do que parece.

Você pode honrar alguém e, ao mesmo tempo, colocar um limite. Honrar a mãe não é obedecer a tudo que ela diz aos quarenta anos. Honrar o pai não é viver tentando curar a ferida que ele deixou. Honra não é não ter limites.

> Limite não é falta de amor. Muitas vezes é a forma mais madura de amor — porque protege o relacionamento da destruição que a invasão causaria.

Neemias reconstruiu o muro de Jerusalém antes de qualquer outra coisa. Não porque odiava o lado de fora — mas porque uma cidade sem muros não consegue proteger nada do que há de precioso dentro.

Seus limites são os muros que protegem o que Deus colocou em você.

## O outro lado: você invade?

Vale o espelho também. Às vezes não é alguém invadindo você — é você morando no centro emocional de alguém de um jeito que não ajuda. Carregando o que é do outro. Resolvendo o que não é sua responsabilidade resolver. Decidindo a vida de quem deveria decidir sozinho.

Soltar também é honra. Devolver a responsabilidade para quem ela pertence é confiar que Deus cuida daquela pessoa melhor do que você.

## O lugar que só é d'Ele

No fim, existe um lugar no seu coração que nenhuma pessoa deveria ocupar — porque foi feito sob medida para Deus.

Quando esse lugar está com o dono certo, todos os outros cômodos se reorganizam. Você para de mendigar dos outros uma aprovação que só o Pai pode dar. E aí você consegue, enfim, amar as pessoas pelo que elas são — sem precisar que elas sejam o seu deus.`,
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "percepcao-decisao-acao",
    order: 5,
    type: LessonType.PRACTICE,
    title: "Percepção, Decisão, Ação",
    durationMin: 11,
    scripture:
      "Tiago 1:8 — \"O homem de coração dividido é inconstante em todos os seus caminhos.\" / Josué 24:15 — \"Escolhei hoje a quem sirvais.\"",
    exercise:
      "Pegue uma decisão que você vem adiando.\n\n1. PERCEPÇÃO — Escreva como você enxerga essa situação hoje. Qual é a história que você conta a si mesma sobre ela?\n\n2. A VERDADE QUE FALTA — O que Deus diz sobre você e sobre isso que muda essa percepção? Escreva a nova percepção a partir d'Ele.\n\n3. DECISÃO — A partir da percepção nova, qual é a decisão? Escreva no presente, sem \"talvez\": \"Eu decido...\"\n\n4. AÇÃO — Qual é o MENOR passo possível que prova essa decisão, e que você consegue dar em até 48 horas? Marque dia e hora.\n\nRegra de ouro: uma decisão sem um passo com data ainda é só uma intenção.",
    prayer:
      "Pai, eu não quero mais viver na indecisão, dividida, adiando a vida que o Senhor me deu. Renova a minha percepção com a Tua verdade — porque é a forma como eu enxergo que decide como eu ando. Me dá coragem de decidir e de dar o passo, mesmo pequeno, mesmo tremendo. Eu escolho hoje confiar e agir. Em nome de Yeshua, amém.",
    content: `## A vida muda no momento da decisão

Tem uma coisa que precisa ser dita sem rodeios: a maior parte do sofrimento que se arrasta não vem da dor em si. Vem da indecisão.

Ficar no meio do caminho cansa mais do que andar. O coração dividido, como diz Tiago, fica inconstante em tudo. Você gasta uma energia enorme só para permanecer parada.

E quase sempre, o que mantém você parada não é falta de opção. É medo de decidir.

## Como uma decisão acontece de verdade

Toda ação que você toma — ou deixa de tomar — nasce de uma sequência. Quando você entende essa sequência, você para de ser empurrada por ela e começa a conduzi-la.

### 1. Percepção

É como você enxerga a situação. A história que você conta a si mesma. E aqui está o segredo: você não age sobre a realidade. Você age sobre a sua percepção dela.

Duas mulheres na mesma situação tomam decisões opostas — porque enxergam coisas diferentes. A percepção é o volante.

### 2. Decisão

A partir do que você percebe, você decide. Se a percepção é de ameaça, você decide se proteger. Se é de possibilidade, você decide avançar. A decisão é filha da percepção.

### 3. Ação

E a ação é só a decisão ganhando corpo. O passo que torna real o que antes era só pensamento.

## Por que isso liberta

Porque significa que você não precisa esperar o sentimento mudar para a vida mudar.

**Você não muda a sua vida mudando primeiro o que sente. Você muda mudando o que percebe — e a verdade de Deus é a percepção nova mais poderosa que existe.**

Quando o medo te dá uma percepção ("você vai fracassar, vai ser rejeitada, não é capaz"), você não precisa obedecer a ela. Você pode trocar a lente. Não por otimismo vazio, mas pela verdade: "Posso todas as coisas naquele que me fortalece." "Se Deus é por mim, quem será contra mim?"

Percepção nova gera decisão nova. Decisão nova gera passo novo. E é assim que uma vida vira.

## Saia da indecisão entrando em decisão

Repara: a indecisão não acaba pensando mais. Ela acaba decidindo. Você não sai dela por dentro — você sai dela dando um passo.

"Escolhei hoje a quem sirvais." Hoje. Josué não disse "esperem ter certeza". Ele disse: decidam.

A fé, no fundo, é uma decisão antes de ser um sentimento. É escolher confiar e andar, mesmo com a perna tremendo.

## Termine com um passo

Uma decisão sem um passo com data ainda é só uma boa intenção. E o cemitério das boas intenções é o lugar mais lotado do mundo.

Então toda vez que você decidir algo de verdade, pergunte na mesma hora: qual é o menor passo possível, e quando eu vou dá-lo?

Pequeno está ótimo. Pequeno com data muda história.`,
  },
  // ─────────────────────────────────────────────────────────────────────────
  {
    slug: "curada-para-ser-enviada",
    order: 6,
    type: LessonType.TEACHING,
    title: "Curada para ser enviada",
    durationMin: 13,
    scripture:
      "Ester 4:14 — \"Quem sabe se para tempo como este chegaste ao reino?\" / Jeremias 1:5 — \"Antes que te formasses no ventre, eu te conheci, e antes que saísses da madre, te santifiquei; às nações te dei por profeta.\"",
    exercise:
      "Esta é a última parada do módulo. Vá devagar.\n\n1. Olhe para trás: cite uma ferida que Deus já curou (ou está curando) em você ao longo desta caminhada.\n\n2. Pergunte: para QUE Ele me curou disso? O que se tornou possível agora que antes não era?\n\n3. Quem é a mulher que precisa exatamente do que você passou? (Sua dor curada costuma ser o mapa do seu chamado.)\n\n4. Complete: \"Eu não fui curada só para mim. Eu fui curada para...\"\n\n5. Qual é o primeiro passo de envio — pequeno, concreto, nesta semana — que diz ao mundo (e a você) que você tem permissão de ir?",
    prayer:
      "Pai, obrigada porque o Senhor nunca desperdiça uma dor. O que o inimigo quis usar para me parar, o Senhor está usando para me enviar. Eu creio que fui curada não apenas para descansar, mas para ir — para tempo como este. Tira de mim o medo de ocupar o lugar que o Senhor me deu. Me envia. Aqui estou eu. Em nome de Yeshua, amém.",
    content: `## Você chegou até aqui

Para na honra desse momento por um segundo. Você atravessou a permissão, a culpa, o medo, os limites, a decisão. Não foi pouco. Não foi raso.

E agora a gente chega na pergunta que dá sentido a tudo: para quê?

## A cura não é o destino. É a preparação dele.

Existe uma mentira gentil que muitas mulheres cristãs acreditam: a de que o objetivo da jornada é parar de doer. Sarar, descansar, ficar bem — e ponto.

Mas Deus quase nunca cura alguém só para que a pessoa fique confortável. Ele cura para enviar.

**A ferida fechada não é a linha de chegada. É a preparação para o chamado.**

Quando Jesus curava, raramente terminava no "está curada". Quase sempre vinha um "vai". Vai e conta. Vai e anda. Vai e faz. A cura abria a porta; o envio era o propósito.

## A sua dor curada é o mapa do seu chamado

Olha que coisa linda: o lugar exato onde você mais sangrou costuma ser o lugar onde Deus mais vai te usar.

A mulher que foi curada da rejeição enxerga a rejeitada do outro lado da sala como ninguém. Quem atravessou o vale da ansiedade fala a língua de quem ainda está nele. A sua história não é só o que você superou — é a credencial do que você vai oferecer.

> Deus não desperdiça nada. Nem a sua dor. Especialmente a sua dor.

O inimigo quis usar aquela ferida para te tirar do jogo. Deus virou a mesa e fez dela a sua mensagem.

## "Para tempo como este"

Ester era uma jovem com um passado de perda, colocada num lugar que ela não escolheu, diante de um risco enorme. E quando o medo dizia "fica quieta, te protege", veio a frase que ecoa até hoje:

"Quem sabe se para tempo como este chegaste ao reino?"

Ela tinha todas as razões para não se sentir autorizada. Órfã, mulher, estrangeira, num sistema que não a favorecia. E mesmo assim havia um chamado com o nome dela, num tempo específico, que só ela podia cumprir.

Você também chegou a um tempo. Esse. Com a sua história, as suas cicatrizes, o seu lugar. E talvez seja exatamente para isto.

## Você foi conhecida antes de ser ferida

E se o medo ainda sussurrar "mas quem sou eu?", escuta a resposta que Deus deu a Jeremias quando ele disse a mesma coisa:

"Antes que te formasses no ventre, eu te conheci."

Antes da ferida, antes do erro, antes da voz que te disse que você não era suficiente — antes de tudo isso, Ele já te conhecia e já tinha um propósito. A sua identidade não começa no que te aconteceu. Começa n'Ele. E o seu destino também.

## Você tem permissão de ir

Então aqui estamos, no fim e no começo.

Você não está esperando autorização. Ela já foi assinada na cruz. Os votos que te prendiam podem ser renunciados. A culpa foi paga. O medo é só um conselheiro, não o chefe. E a sua dor virou mapa.

Só falta uma coisa: ir.

**Você foi cuidada. Você foi curada. E agora você foi enviada.**

Aqui estou eu, Senhor. Envia-me.`,
  },
];

async function main() {
  console.log("\n🕊️  Criando módulo Permissão & Destino...\n");

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

  // Liberar acesso para todos os admins
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
