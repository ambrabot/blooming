import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/jwt";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, PlayCircle, MessageCircle, BookOpen, ArrowLeft, PartyPopper, X } from "lucide-react";
import ModuleCheckoutButton from "@/components/modules/checkout-button";

const TYPE_LABEL: Record<string, string> = {
  TEACHING: "Ensino",
  PRACTICE: "Prática",
  SCRIPTURE: "Escritura",
  ENDOCRINOLOGY: "Ciência + Fé",
  COUNSELING: "Aconselhamento",
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string; cancelled?: string }>;
}

export default async function ModuloDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { success, cancelled } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");

  const [mod, purchase, progress] = await Promise.all([
    db.module.findUnique({
      where: { slug, isActive: true },
      include: { lessons: { orderBy: { order: "asc" } } },
    }),
    db.modulePurchase.findFirst({
      where: { userId: session.userId, module: { slug }, status: "COMPLETED" },
    }),
    db.userProgress.findFirst({
      where: { userId: session.userId, module: { slug } },
      include: {
        lessonProgress: { select: { lessonId: true, completedAt: true } },
      },
    }),
  ]);

  if (!mod) notFound();

  const owned = !!purchase;
  const completedLessonIds = new Set(
    progress?.lessonProgress.filter((lp: typeof progress.lessonProgress[number]) => lp.completedAt).map((lp: typeof progress.lessonProgress[number]) => lp.lessonId) ?? [],
  );
  const pct = mod.lessons.length > 0
    ? Math.round((completedLessonIds.size / mod.lessons.length) * 100)
    : 0;

  const keyScriptures = (mod.keyScriptures as { ref: string; text: string }[] | null) ?? [];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Purchase success banner */}
      {success === "1" && owned && (
        <div className="mb-6 bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
          <PartyPopper className="h-5 w-5 text-teal-600 shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-teal-800">Módulo adquirido com sucesso!</p>
            <p className="text-sm text-teal-600 mt-0.5">
              Bem-vinda à jornada. Comece pela primeira lição ou inicie uma sessão com a Rafa.
            </p>
          </div>
        </div>
      )}

      {/* Cancelled banner */}
      {cancelled === "1" && (
        <div className="mb-6 bg-stone-50 border border-stone-200 rounded-xl p-4 flex items-center gap-3">
          <X className="h-4 w-4 text-stone-400 shrink-0" />
          <p className="text-sm text-stone-500">
            Checkout cancelado. Quando estiver pronta, é só clicar em adquirir novamente.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/modulos"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
      </div>

      <div className="flex items-start gap-6 mb-8">
        <span className="text-5xl">{mod.iconEmoji}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {mod.hebrewWord && (
              <span className="text-xs font-medium text-amber-700 uppercase tracking-widest">
                {mod.hebrewWord}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif text-stone-800">{mod.title}</h1>
          {mod.subtitle && (
            <p className="text-stone-500 mt-1">{mod.subtitle}</p>
          )}

          {owned && mod.lessons.length > 0 && (
            <div className="mt-4 max-w-xs">
              <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>Progresso</span>
                <span>{pct}%</span>
              </div>
              <Progress value={pct} className="h-2" />
            </div>
          )}
        </div>

        {!owned && (
          <div className="shrink-0 text-right">
            <p className="text-2xl font-bold text-stone-800">
              {(mod.priceInCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
            <p className="text-xs text-stone-400 mb-3">acesso vitalício</p>
            <ModuleCheckoutButton
              moduleId={mod.id}
              moduleTitle={mod.title}
              priceInCents={mod.priceInCents}
            />
          </div>
        )}
      </div>

      {/* Description */}
      <Card className="border-stone-100 bg-stone-50 mb-6">
        <CardContent className="p-5">
          <p className="text-stone-700 leading-relaxed">{mod.description}</p>
        </CardContent>
      </Card>

      {/* Key scriptures */}
      {keyScriptures.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
            Escrituras âncora
          </p>
          <div className="flex flex-wrap gap-2">
            {keyScriptures.map((s) => (
              <div key={s.ref} className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                <p className="text-xs font-medium text-amber-800">{s.ref}</p>
                <p className="text-xs text-amber-600 italic mt-0.5">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session CTA */}
      {owned && (
        <Card className="border-amber-200 bg-amber-50 mb-6">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Sessão com contexto do módulo
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                A Rafa vai trabalhar com você dentro do tema de {mod.title}
              </p>
            </div>
            <Button asChild className="bg-amber-700 hover:bg-amber-800 text-white shrink-0">
              <Link href={`/sessao/nova?moduleId=${mod.id}`}>Iniciar sessão</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lessons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-stone-800">
            Lições ({mod.lessons.length})
          </h2>
        </div>

        {mod.lessons.length === 0 ? (
          <Card className="border-dashed border-stone-200">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-8 w-8 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-400 text-sm">Lições em preparação.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {mod.lessons.map((lesson: typeof mod.lessons[number], i: number) => {
              const completed = completedLessonIds.has(lesson.id);
              const accessible = owned;

              return (
                <div key={lesson.id}>
                  {accessible ? (
                    <Link href={`/modulos/${slug}/licoes/${lesson.slug}`}>
                      <LessonRow
                        lesson={lesson}
                        index={i}
                        completed={completed}
                        accessible={true}
                      />
                    </Link>
                  ) : (
                    <LessonRow
                      lesson={lesson}
                      index={i}
                      completed={false}
                      accessible={false}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  index,
  completed,
  accessible,
}: {
  lesson: { title: string; type: string; durationMin: number | null; slug: string };
  index: number;
  completed: boolean;
  accessible: boolean;
}) {
  return (
    <Card className={`border-stone-200 transition-shadow ${accessible ? "hover:shadow-sm cursor-pointer" : "opacity-60"}`}>
      <CardContent className="p-4 flex items-center gap-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
          {completed ? (
            <CheckCircle2 className="h-5 w-5 text-teal-600" />
          ) : accessible ? (
            <PlayCircle className="h-5 w-5 text-amber-600" />
          ) : (
            <Lock className="h-4 w-4 text-stone-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-stone-800 text-sm truncate">{lesson.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge variant="outline" className="text-xs py-0">
              {TYPE_LABEL[lesson.type] ?? lesson.type}
            </Badge>
            {lesson.durationMin && (
              <span className="text-xs text-stone-400">{lesson.durationMin} min</span>
            )}
          </div>
        </div>
        <span className="text-xs text-stone-300">{index + 1}</span>
      </CardContent>
    </Card>
  );
}
