/**
 * Adiciona o encontro "A dívida que você não deve" ao módulo Família Funcional.
 * Tema: a dívida emocional impagável à família de origem — "eles me deram a vida".
 * Verdade que liberta: os pais são canal, não fonte; você é de Deus primeiro;
 * ninguém é um erro; honra não é servidão. (Inspirado no princípio de "dívida
 * emocional" do Tiago Brunet + chave teológica da Julia. Reformulado na voz da Rafa.)
 *
 * Uso: npx tsx scripts/add-divida-encontro.ts
 */

import "dotenv/config";
import { PrismaClient, LessonType } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const LESSON = {
  slug: "a-divida-que-voce-nao-deve",
  title: "A dívida que você não deve",
  type: LessonType.COUNSELING,
  durationMin: 12,
  scripture:
    "1 Coríntios 6:19-20 — \"Não sois de vós mesmos... fostes comprados por bom preço.\" / Atos 17:25 — \"Ele mesmo é quem a todos dá vida, e respiração, e todas as coisas.\"",
  exercise:
    "Esta é uma conversa delicada. Vá com carinho por você.\n\n1. Complete sem pensar muito: \"Eu sinto que devo aos meus pais...\" Escreva o que vier.\n\n2. Essa dívida tem um valor que pode ser pago e quitado, ou é uma conta que nunca fecha? Se nunca fecha, ela não é dívida — é prisão.\n\n3. Por causa dessa sensação de dívida, o que você faz (ou não faz)? Onde você se cala, adia, se anula, ou vive para compensar?\n\n4. Releia em voz alta: \"Meus pais foram um canal por onde a vida passou. Mas a vida veio de Deus. Eu sou d'Ele primeiro.\" O que você sente ao dizer isso?\n\n5. Escreva uma forma de HONRAR seus pais nesta semana que venha de amor livre — não de dívida. (Honra e dívida não são a mesma coisa.)",
  prayer:
    "Pai, obrigada porque a minha vida não foi um acidente nem uma dívida — foi um desejo Teu. Hoje eu solto o peso de uma conta que eu nunca conseguiria pagar, porque eu nunca a devi. Eu escolho honrar meu pai e minha mãe, como o Senhor manda — mas de um lugar de filha livre, não de devedora. Lembra o meu coração, todas as vezes que ele esquecer, de que eu sou Tua primeiro. Em nome de Yeshua, amém.",
  content: `## Existe uma conta que nunca fecha

Tem um peso que muita mulher carrega a vida inteira sem nem saber o nome dele. Ele se disfarça de amor, de gratidão, de "ser uma boa filha". Mas por dentro é outra coisa: é uma dívida. Uma conta que nunca fecha.

Antes da gente continuar, respira. Aqui não tem acusação a ninguém — nem a você, nem aos seus pais. A gente só vai olhar com verdade para uma coisa que talvez nunca tenha sido olhada.

## "Eles me deram a vida"

A frase parece tão certa que ninguém questiona: "eu devo tudo aos meus pais, porque eles me deram a vida."

E daí nasce uma matemática silenciosa. Se eles te deram a vida — o maior presente possível — então qualquer coisa que você faça por eles ainda é pouco. A conta nunca zera. Você passa a viver pagando: se anulando, engolindo, adiando os próprios sonhos, sentindo culpa toda vez que escolhe a si mesma.

> Quando uma dívida não tem um valor que possa ser pago, ela deixa de ser dívida. Vira prisão.

E é exatamente aí que o inimigo trabalha. Ele não precisa te acorrentar com algo ruim. Basta distorcer algo bom — o amor pelos seus pais — até virar uma corrente.

## Os seus pais foram canal, não fonte

Aqui está a verdade que quebra a corrente, e ela não diminui ninguém.

Seus pais foram o canal por onde a vida passou. Honra imensa. Mas eles não foram a fonte da vida. A fonte é Deus.

"Ele mesmo é quem a todos dá vida, e respiração, e todas as coisas." Foi Deus quem te formou no ventre — "tu formaste o meu interior" (Salmos 139:13). Seus pais participaram de um milagre; eles não fabricaram um.

**Você não deve a sua existência a duas pessoas. Você deve a Deus. E para com Deus a conta foi paga na cruz — por Ele mesmo.**

## Você é de Deus primeiro

Essa é a frase que reorganiza tudo:

Antes de você ser filha de alguém, você é filha de Deus.

"Não sois de vós mesmos... fostes comprados por bom preço." Você pertence, em primeiro lugar, Àquele que te criou e te comprou de volta. Esse pertencimento vem antes de qualquer sobrenome, antes de qualquer história de família, antes de qualquer expectativa que colocaram em você.

Quando você sabe de quem você é primeiro, você para de mendigar permissão e de pagar dívidas que nunca foram suas.

## Honra não é servidão

E agora a parte que precisa de equilíbrio, porque é fácil ir para o outro extremo.

Soltar a dívida não é soltar a honra. "Honra teu pai e tua mãe" é mandamento, é justo, é lindo — e continua valendo. Mas honra e servidão emocional não são a mesma coisa.

Honrar é abençoar, respeitar, cuidar, falar bem. Servidão é viver preso, sem voz, sem limite, governado pela culpa.

O próprio Deus, que mandou honrar pai e mãe, também disse: "deixará o homem pai e mãe" (Gênesis 2:24). Existe um desligamento sadio que Ele mesmo ordenou. E Jesus, sem nunca desonrar Maria, reorganizou a família em torno da vontade do Pai — "quem é minha mãe? quem faz a vontade de Deus, esse é meu irmão, irmã e mãe" (Mateus 12:48-50).

> Você pode honrar profundamente os seus pais a partir de um lugar de filha livre. Aliás, só desse lugar a honra fica limpa — porque vira amor, e não pagamento.

## Ninguém é um erro

E se em algum lugar dessa história mora a sensação de que você foi um acidente, um peso, algo "não planejado" — escuta com cuidado:

O que pode ter sido não planejado pelos homens nunca foi não planejado por Deus. "Os teus olhos viram o meu corpo ainda informe; e no teu livro todas estas coisas foram escritas" (Salmos 139:16). "Antes que te formasses no ventre, eu te conheci" (Jeremias 1:5).

Você foi pensada, desejada e escrita no livro de Deus antes de qualquer pessoa ter opinião sobre você.

## Quem realmente te deu a vida

No fim, existe uma vida que nenhum pai consegue dar: a vida em abundância. Essa, quem deu foi Jesus. "Eu vim para que tenham vida, e a tenham com abundância" (João 10:10).

Então hoje você pode fazer uma troca santa: solta a dívida impagável que te prendia, e recebe de volta a única vida que vale a pena pagar — a que já foi paga por você.

Honra os seus pais. Ama os seus pais. Mas faz isso livre. Porque você é, antes de tudo, d'Ele.`,
};

async function main() {
  console.log("\n🕊️  Adicionando encontro a Família Funcional...\n");

  const mod = await db.module.findUnique({
    where: { slug: "familia-funcional" },
    include: { lessons: { orderBy: { order: "asc" }, select: { order: true, title: true } } },
  });
  if (!mod) {
    console.error("❌ Módulo familia-funcional não encontrado.");
    process.exit(1);
  }

  console.log("  Encontros atuais:");
  for (const l of mod.lessons) console.log(`    ${l.order}. ${l.title}`);

  const nextOrder = mod.lessons.length
    ? Math.max(...mod.lessons.map((l) => l.order)) + 1
    : 1;

  await db.lesson.upsert({
    where: { moduleId_slug: { moduleId: mod.id, slug: LESSON.slug } },
    update: {
      title: LESSON.title,
      type: LESSON.type,
      content: LESSON.content,
      scripture: LESSON.scripture,
      exercise: LESSON.exercise,
      prayer: LESSON.prayer,
      durationMin: LESSON.durationMin,
    },
    create: {
      moduleId: mod.id,
      slug: LESSON.slug,
      title: LESSON.title,
      order: nextOrder,
      type: LESSON.type,
      content: LESSON.content,
      scripture: LESSON.scripture,
      exercise: LESSON.exercise,
      prayer: LESSON.prayer,
      durationMin: LESSON.durationMin,
    },
  });

  console.log(`\n  ✓ Encontro inserido na posição ${nextOrder}: ${LESSON.title}`);
  console.log("\n✅ Pronto.\n");
  await db.$disconnect();
}

main().catch((err) => {
  console.error("❌ Erro:", err.message);
  process.exit(1);
});
