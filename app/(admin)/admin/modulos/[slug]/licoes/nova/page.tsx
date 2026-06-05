import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LessonEditForm from "@/components/admin/lesson-edit-form";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NovaLicaoPage({ params }: Props) {
  const { slug } = await params;
  const mod = await db.module.findUnique({ where: { slug } });
  if (!mod) notFound();

  const lastLesson = await db.lesson.findFirst({
    where: { moduleId: mod.id },
    orderBy: { order: "desc" },
    select: { order: true },
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/admin/modulos/${slug}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif text-zinc-800">Nova lição</h1>
          <p className="text-zinc-500 text-sm">
            {mod.iconEmoji} {mod.title}
          </p>
        </div>
      </div>

      <LessonEditForm
        moduleSlug={slug}
        moduleId={mod.id}
        lesson={null}
        nextOrder={(lastLesson?.order ?? 0) + 1}
      />
    </div>
  );
}
