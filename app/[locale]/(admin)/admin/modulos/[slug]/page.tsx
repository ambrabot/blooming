import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModuleEditForm from "@/components/admin/module-edit-form";
import { Plus, ArrowLeft, GripVertical } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AdminModuloDetailPage({ params }: Props) {
  const { slug } = await params;

  const isNew = slug === "novo";

  const mod = isNew
    ? null
    : await db.module.findUnique({
        where: { slug },
        include: {
          lessons: { orderBy: { order: "asc" } },
          _count: { select: { purchases: true } },
        },
      });

  if (!isNew && !mod) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/modulos">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif text-zinc-800">
            {isNew ? "Novo módulo" : `${mod!.iconEmoji} ${mod!.title}`}
          </h1>
          {!isNew && (
            <p className="text-zinc-500 text-sm">
              {mod!._count.purchases} compras · slug: {mod!.slug}
            </p>
          )}
        </div>
      </div>

      {/* Edit form */}
      <ModuleEditForm module={mod} />

      {/* Lessons section (only for existing modules) */}
      {!isNew && mod && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-800">
              Lições ({mod.lessons.length})
            </h2>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href={`/admin/modulos/${slug}/licoes/nova`}>
                <Plus className="h-4 w-4 mr-1" />
                Nova lição
              </Link>
            </Button>
          </div>

          {mod.lessons.length === 0 ? (
            <div className="bg-zinc-50 rounded-xl border border-dashed border-zinc-200 p-8 text-center">
              <p className="text-zinc-400 text-sm">
                Nenhuma lição ainda. Crie a primeira.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-100 bg-zinc-50">
                  <tr>
                    <th className="w-8 px-4 py-3" />
                    <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Lição</th>
                    <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs text-zinc-500 font-medium">Duração</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {mod.lessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-zinc-300">
                        <GripVertical className="h-4 w-4" />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-zinc-800">{lesson.title}</p>
                        <p className="text-xs text-zinc-400">{lesson.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {lesson.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">
                        {lesson.durationMin ? `${lesson.durationMin} min` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/admin/modulos/${slug}/licoes/${lesson.slug}`}>
                            Editar
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
